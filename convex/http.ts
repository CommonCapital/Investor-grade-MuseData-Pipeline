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
http.route({
  path: ApiPath.Webhook,
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    // ✅ FIX: Make shards optional in type definition
    type Job = {
      _id: Id<"scrapingJobs">;
      originalPrompt: string;
      status: string;
      shards?: any[]; // Optional - might not exist for old jobs
      totalShards?: number; // Optional - might not exist for old jobs
    };

    let job: Job | null = null;

    try {
      const data = await req.json();
      console.log("Webhook received data:", data);

      // Parse jobId and shardIndex from URL
      const url = new URL(req.url);
      const jobId = url.searchParams.get("jobId");
      const shardIndexParam = url.searchParams.get("shardIndex");

      if (!jobId) {
        console.error("No job ID found in webhook URL");
        return new Response("No job ID found", { status: 400 });
      }

      if (!shardIndexParam) {
        console.error("No shard index found in webhook URL");
        return new Response("No shard index found", { status: 400 });
      }

      // Fetch job
      job = await ctx.runQuery(api.scrapingJobs.getJobById, {
        jobId: jobId as Id<'scrapingJobs'>
      });

      if (!job) {
        console.error(`No job found for job ID: ${jobId}`);
        return new Response("Job not found", { status: 404 });
      }

      // ✅ Verify this is a distributed job (has shards)
      if (!job.shards || !job.totalShards) {
        console.error(`Job ${jobId} is not a distributed job - missing shards or totalShards`);
        return new Response("Invalid job type - expected distributed job with shards", { status: 400 });
      }

      // Parse and validate shard index
      const shardIndex = parseInt(shardIndexParam, 10);

      if (isNaN(shardIndex) || shardIndex < 1 || shardIndex > 7) {
        console.error(`Invalid shard index: ${shardIndexParam} (must be 1-7)`);
        return new Response("Invalid shard index (must be 1-7)", { status: 400 });
      }

      console.log(`📥 Webhook: Shard ${shardIndex} completed for job ${jobId}`);

      // Save this shard's Gemini result
      const result = await ctx.runMutation(internal.scrapingJobs.saveGeminiResult, {
        jobId: job._id,
        shardIndex: shardIndex,
        rawData: data,
      });

      console.log(`✅ Shard ${shardIndex} saved. Progress: ${result.completedCount}/${result.totalCount}`);

      // If all Gemini scrapers are complete, trigger LLM phase
      if (result.allGeminisComplete) {
        console.log(`🎯 All ${result.totalCount} Gemini scrapers complete - starting LLM phase`);
        
        await ctx.scheduler.runAfter(0, api.analysis.processAllShards, {
          jobId: job._id,
        });

        console.log(`🚀 LLM orchestrator scheduled for job ${job._id}`);
      } else {
        console.log(`⏳ Waiting for ${result.totalCount - result.completedCount} more Gemini scrapers...`);
      }

      return new Response("Success", { status: 200 });

    } catch (error) {
      console.error("❌ Webhook error:", error);

      // Try to mark shard as failed
      if (job) {
        try {
          const url = new URL(req.url);
          const shardIndexParam = url.searchParams.get("shardIndex");
          
          if (shardIndexParam) {
            const shardIndex = parseInt(shardIndexParam, 10);
            
            if (!isNaN(shardIndex)) {
              await ctx.runMutation(api.scrapingJobs.failGeminiShard, {
                jobId: job._id,
                shardIndex: shardIndex,
                error: error instanceof Error ? error.message : "Unknown webhook error",
              });

              console.log(`Shard ${shardIndex} marked as failed for job ${job._id}`);
            }
          } else {
            // No shard index - fail entire job
            await ctx.runMutation(api.scrapingJobs.failJob, {
              jobId: job._id,
              error: error instanceof Error ? error.message : "Unknown webhook error",
            });

            console.log(`Job ${job._id} marked as failed`);
          }
        } catch (failError) {
          console.error("Failed to update job status:", failError);
        }
      }

      if (error instanceof Error && error.message.includes("schema")) {
        console.error("Schema validation failed");
        console.error("Error details:", error.message);
      }

      return new Response("Internal Server Error", { status: 500 });
    }
  }),
});

export default http;