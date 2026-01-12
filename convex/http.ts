import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api, internal } from './_generated/api';
import { Id } from "./_generated/dataModel";

const http = httpRouter();

export enum ApiPath {
  Webhook = '/api/webhook'
}
// convex/http.ts

http.route({
  path: "/api/webhooks/clerk",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const payload = await req.json();
    
    if (payload.type === 'subscription.updated') {
      const userId = payload.data.payer.user_id; // ✅ Get user_id from payer object
      const items = payload.data.items;
      
      // ✅ Find the active monthly plan in items array
      const monthlyPlan = items.find((item: any) => 
        item.plan?.slug === 'monthly' && item.status === 'active'
      );
      
      if (monthlyPlan) {
        await ctx.runMutation(api.subscriptions.addThirtyReports, {
          userId,
        });
        
        console.log(`✅ Added +30 reports to user ${userId}`);
      }
    }
    
    return new Response('OK', { status: 200 });
  }),
});
// Webhook endpoint after BrightData Gemini scraper completes
// In convex/http.ts - Update the webhook handler
http.route({
  path: ApiPath.Webhook,
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    type Job = {
      _id: Id<"scrapingJobs">;
      originalPrompt: string;
      status: string;
      shards?: any[];
      totalShards?: number;
    };

    let job: Job | null = null;

    try {
      const data = await req.json();
      console.log("Webhook received data:", data);

      const url = new URL(req.url);
      const jobId = url.searchParams.get("jobId");
      const shardIndexParam = url.searchParams.get("shardIndex");

      if (!jobId || !shardIndexParam) {
        return new Response("Missing jobId or shardIndex", { status: 400 });
      }

      job = await ctx.runQuery(api.scrapingJobs.getJobById, {
        jobId: jobId as Id<'scrapingJobs'>
      });

      if (!job) {
        return new Response("Job not found", { status: 404 });
      }

      if (!job.shards || !job.totalShards) {
        return new Response("Invalid job type", { status: 400 });
      }

      const shardIndex = parseInt(shardIndexParam, 10);

      if (isNaN(shardIndex) || shardIndex < 1 || shardIndex > 7) {
        return new Response("Invalid shard index", { status: 400 });
      }

      console.log(`📥 Webhook: Shard ${shardIndex} completed for job ${jobId}`);

      // ✅ Check if data is empty or invalid
      const isEmpty = !data || 
                      data.length === 0 || 
                      !data[0]?.answer_text ||
                      data[0].answer_text.trim() === '' ||
                      data[0].answer_text === '{}';

      if (isEmpty) {
        console.warn(`⚠️ Shard ${shardIndex} returned empty data - marking for retry`);
        
        await ctx.runMutation(api.scrapingJobs.markShardForRetry, {
          jobId: job._id,
          shardIndex: shardIndex,
          reason: "Empty response from Gemini"
        });

        return new Response(JSON.stringify({ 
          status: "retry_needed",
          shardIndex,
          message: "Empty data - will retry automatically"
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      // ✅ Extract and validate JSON structure
      let rawText = data[0].answer_text.trim();

      // Strip common malformed prefixes added by LLMs
      if (rawText.startsWith("JSON ")) {
        rawText = rawText.slice(5).trim();
      } else if (rawText.startsWith("JSON\n")) {
        rawText = rawText.slice(5).trim();
      } else if (rawText.startsWith("JSON\r\n")) {
        rawText = rawText.slice(6).trim();
      }

      // ✅ Extract only the JSON portion (handles trailing text like "Would you like me to...")
      let jsonStart = -1;
      let jsonEnd = -1;

      // Find start of JSON
      const firstCurly = rawText.indexOf('{');
      const firstBracket = rawText.indexOf('[');

      if (firstCurly !== -1 && (firstBracket === -1 || firstCurly < firstBracket)) {
        jsonStart = firstCurly;
        // Find matching closing brace
        let depth = 0;
        for (let i = firstCurly; i < rawText.length; i++) {
          if (rawText[i] === '{') depth++;
          if (rawText[i] === '}') {
            depth--;
            if (depth === 0) {
              jsonEnd = i + 1;
              break;
            }
          }
        }
      } else if (firstBracket !== -1) {
        jsonStart = firstBracket;
        // Find matching closing bracket
        let depth = 0;
        for (let i = firstBracket; i < rawText.length; i++) {
          if (rawText[i] === '[') depth++;
          if (rawText[i] === ']') {
            depth--;
            if (depth === 0) {
              jsonEnd = i + 1;
              break;
            }
          }
        }
      }

      if (jsonStart === -1 || jsonEnd === -1) {
        console.warn(`⚠️ Shard ${shardIndex} - no valid JSON structure found - marking for retry`);
        
        await ctx.runMutation(api.scrapingJobs.markShardForRetry, {
          jobId: job._id,
          shardIndex: shardIndex,
          reason: "No JSON structure found in response"
        });

        return new Response(JSON.stringify({ 
          status: "retry_needed",
          shardIndex,
          message: "No JSON structure - will retry automatically"
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      // Extract only the JSON portion (removes trailing text)
      rawText = rawText.substring(jsonStart, jsonEnd);

      // Try to parse the extracted JSON
      let parsedData;
      try {
        parsedData = JSON.parse(rawText);
      } catch (parseError) {
        console.warn(`⚠️ Shard ${shardIndex} returned invalid JSON after cleaning - marking for retry`);
        console.warn(`Extracted text (first 200 chars): ${rawText.substring(0, 200)}...`);
        
        await ctx.runMutation(api.scrapingJobs.markShardForRetry, {
          jobId: job._id,
          shardIndex: shardIndex,
          reason: "Invalid JSON response"
        });

        return new Response(JSON.stringify({ 
          status: "retry_needed",
          shardIndex,
          message: "Invalid JSON - will retry automatically"
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      // ✅ Basic validation - if critical fields missing, mark for retry
      const validationErrors: string[] = [];
      
      switch (shardIndex) {
        case 1:
          if (!parsedData.base_metrics) validationErrors.push("Missing base_metrics");
          if (!parsedData.valuation) validationErrors.push("Missing valuation");
          if (!parsedData.scenarios) validationErrors.push("Missing scenarios");
          break;
        case 2:
          if (!parsedData.risks) validationErrors.push("Missing risks object");
          break;
        case 3:
          if (!parsedData.executive_summary) validationErrors.push("Missing executive_summary");
          break;
        case 4:
          if (!parsedData.base_metrics) validationErrors.push("Missing base_metrics");
          break;
        case 5:
          if (!parsedData.time_series) validationErrors.push("Missing time_series");
          break;
        case 6:
          if (!parsedData.guidance_bridge) validationErrors.push("Missing guidance_bridge");
          break;
        case 7:
          if (!parsedData.events) validationErrors.push("Missing events array");
          break;
      }

      if (validationErrors.length > 0) {
        console.warn(`⚠️ Shard ${shardIndex} missing fields: ${validationErrors.join(', ')} - marking for retry`);
        
        await ctx.runMutation(api.scrapingJobs.markShardForRetry, {
          jobId: job._id,
          shardIndex: shardIndex,
          reason: `Incomplete data: ${validationErrors.join(', ')}`
        });

        return new Response(JSON.stringify({ 
          status: "retry_needed",
          shardIndex,
          message: "Incomplete data - will retry automatically",
          details: validationErrors
        }), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      // ✅ Data is valid - save it
      const result = await ctx.runMutation(internal.scrapingJobs.saveGeminiResult, {
        jobId: job._id,
        shardIndex: shardIndex,
        rawData: data,
      });

      console.log(`✅ Shard ${shardIndex} saved. Progress: ${result.completedCount}/${result.totalCount}`);

      // ✅ Check what to do next based on result
      if (result.allGeminisComplete) {
        console.log(`🎯 All ${result.totalCount} Gemini scrapers complete - starting LLM phase`);
        
        await ctx.scheduler.runAfter(0, api.analysis.processAllShards, {
          jobId: job._id,
        });

        console.log(`🚀 LLM orchestrator scheduled for job ${job._id}`);
      } else if (result.hasRetryNeeded) {
        // ✅ Some shards need retry - schedule retry check
        console.log(`🔄 Some shards need retry - scheduling retry in 30 seconds`);
        
        await ctx.scheduler.runAfter(30000, internal.scrapingJobs.retryNeededShards, {
          jobId: job._id,
        });
      } else {
        console.log(`⏳ Waiting for ${result.totalCount - result.completedCount} more Gemini scrapers...`);
      }

      return new Response("Success", { status: 200 });

    } catch (error) {
      console.error("❌ Webhook error:", error);
      
      // Even on error, try to mark for retry instead of failing
      if (job) {
        try {
          const url = new URL(req.url);
          const shardIndexParam = url.searchParams.get("shardIndex");
          
          if (shardIndexParam) {
            const shardIndex = parseInt(shardIndexParam, 10);
            
            if (!isNaN(shardIndex)) {
              await ctx.runMutation(api.scrapingJobs.markShardForRetry, {
                jobId: job._id,
                shardIndex: shardIndex,
                reason: error instanceof Error ? error.message : "Unknown webhook error"
              });
            }
          }
        } catch (retryError) {
          console.error("Failed to mark for retry:", retryError);
        }
      }

      return new Response("Internal Server Error", { status: 500 });
    }
  }),
});
export default http;