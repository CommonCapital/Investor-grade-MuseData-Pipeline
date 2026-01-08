'use server';
import { api, internal } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { ConvexHttpClient } from "convex/browser";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("NEXT_PUBLIC_CONVEX_URL isn't set");
}

/**
 * Retry a failed distributed job
 * This will re-trigger the LLM phase for all shards
 */
export const retryJob = async (jobId: string) => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  try {
    console.log("🔄 Retrying job:", jobId);

    // Get job details
    const job = await convex.query(api.scrapingJobs.getJobById, {
      jobId: jobId as Id<"scrapingJobs">,
    });

    if (!job) {
      throw new Error("Job not found");
    }

    // Check if this is a distributed job
    if (!job.shards || !job.totalShards) {
      throw new Error("Not a distributed job - cannot retry");
    }

    // Check if Gemini data exists
    const hasGeminiData = job.shards.every(
      (shard: any) => shard.geminiStatus === "completed" && shard.geminiRawData
    );

    if (!hasGeminiData) {
      throw new Error(
        "Gemini data incomplete - cannot retry LLM phase. Please start a new job."
      );
    }

    console.log("✅ Gemini data verified - retriggering LLM phase");

    // Reset job status to allow LLM reprocessing
    await convex.mutation(api.scrapingJobs.resetForLLMRetry, {
      jobId: jobId as Id<"scrapingJobs">,
    });

    // Trigger LLM phase
    await convex.action(api.analysis.processAllShards, {
      jobId: jobId as Id<"scrapingJobs">,
    });

    console.log("🚀 LLM phase retriggered successfully");

    return {
      ok: true,
      message: "Job retry started successfully - reprocessing with LLMs",
    };
  } catch (error) {
    console.error("❌ Failed to retry job:", error);

    return {
      ok: false,
      error: error instanceof Error ? error.message : "Failed to retry job",
    };
  }
};

export default retryJob;