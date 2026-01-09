import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { investorDashboardSchema } from "@/lib/seo-schema";

// You'll need to create this file - it will have SHARD_CONFIGS array
// We'll provide it in the next step
// import { SHARD_CONFIGS } from "@/lib/shard-config";

// For now, we'll use a constant for the number of shards
const TOTAL_SHARDS = 7;

// ============================================================================
// JOB CREATION
// ============================================================================

export const createScrappingJob = mutation({
  args: {
    originalPrompt: v.string(),
    userId: v.optional(v.string()),
  },
  returns: v.id("scrapingJobs"),
  handler: async (ctx, args) => {
    if (!args.userId) {
      throw new Error("USER ID is required");
    }

    // Initialize shards for distributed architecture
    const shards = Array.from({ length: TOTAL_SHARDS }, (_, i) => ({
      shardName: `shard_${i + 1}`, // Will be replaced with actual names from config
      shardIndex: i + 1,
      geminiStatus: "pending" as const,
      geminiSnapshotId: undefined,
      geminiRawData: undefined,
      geminiCompletedAt: undefined,
      geminiError: undefined,
      llmStatus: "pending" as const,
      llmParsedData: undefined,
      llmStartedAt: undefined,
      llmCompletedAt: undefined,
      llmError: undefined,
    }));

    const jobId = await ctx.db.insert("scrapingJobs", {
      userId: args.userId,
      originalPrompt: args.originalPrompt,
      status: "pending",
      createdAt: Date.now(),
      // New distributed architecture fields
      totalShards: TOTAL_SHARDS,
      completedGeminis: 0,
      completedLLMs: 0,
      shards: shards,
    });

    return jobId;
  },
});

// ============================================================================
// GEMINI SCRAPING PHASE
// ============================================================================

export const startGeminiScraping = mutation({
  args: {
    jobId: v.id("scrapingJobs"),
    shardIndex: v.number(),
    snapshotId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job || !job.shards) {
      throw new Error("Job or shards not found");
    }

    const shards = [...job.shards];
    const shardIdx = shards.findIndex(s => s.shardIndex === args.shardIndex);
    
    if (shardIdx === -1) {
      throw new Error(`Shard ${args.shardIndex} not found`);
    }

    shards[shardIdx].geminiStatus = "scraping";
    shards[shardIdx].geminiSnapshotId = args.snapshotId;

    // If this is the first scraper starting, update job status
    const isFirstScraper = job.status === "pending";

    await ctx.db.patch(args.jobId, {
      shards,
      status: isFirstScraper ? "scraping" : job.status,
      
      // ✅ NEW: Save to legacy field for first shard
      snapshotId: isFirstScraper ? args.snapshotId : job.snapshotId,
    });

    return null;
  },
});
export const saveGeminiResult = internalMutation({
  args: {
    jobId: v.id("scrapingJobs"),
    shardIndex: v.number(),
    rawData: v.any(),
  },
  returns: v.object({
    allGeminisComplete: v.boolean(),
    completedCount: v.number(),
    totalCount: v.number(),
  }),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job || !job.shards) {
      throw new Error("Job or shards not found");
    }

    const shards = [...job.shards];
    const shardIdx = shards.findIndex(s => s.shardIndex === args.shardIndex);
    
    if (shardIdx === -1) {
      throw new Error(`Shard ${args.shardIndex} not found`);
    }

    // Update shard with Gemini result
    shards[shardIdx].geminiStatus = "completed";
    shards[shardIdx].geminiRawData = args.rawData;
    shards[shardIdx].geminiCompletedAt = Date.now();
    shards[shardIdx].geminiError = undefined;

    const completedGeminis = (job.completedGeminis || 0) + 1;
    const allGeminisComplete = completedGeminis === job.totalShards;

    // ✅ NEW: Aggregate all completed Gemini data into legacy results field
    const allResults = shards
      .filter(s => s.geminiStatus === "completed" && s.geminiRawData)
      .map(s => s.geminiRawData);

    await ctx.db.patch(args.jobId, {
      shards,
      completedGeminis,
      status: allGeminisComplete ? "scraped" : "scraping",
      
      // ✅ NEW: Save to legacy field
      results: allResults,
    });

    return {
      allGeminisComplete,
      completedCount: completedGeminis,
      totalCount: job.totalShards || 0,
    };
  },
});
export const failGeminiShard = mutation({
  args: {
    jobId: v.id("scrapingJobs"),
    shardIndex: v.number(),
    error: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job || !job.shards) {
      throw new Error("Job or shards not found");
    }

    const shards = [...job.shards];
    const shardIdx = shards.findIndex(s => s.shardIndex === args.shardIndex);
    
    if (shardIdx === -1) {
      throw new Error(`Shard ${args.shardIndex} not found`);
    }

    shards[shardIdx].geminiStatus = "failed";
    shards[shardIdx].geminiError = args.error;
    shards[shardIdx].geminiCompletedAt = Date.now();

    // Count how many Geminis have completed (success or failure)
    const completedCount = shards.filter(
      s => s.geminiStatus === "completed" || s.geminiStatus === "failed"
    ).length;

    const allGeminisProcessed = completedCount === job.totalShards;

    await ctx.db.patch(args.jobId, {
      shards,
      completedGeminis: completedCount,
      // If all Geminis are done (even with failures), move to scraped state
      status: allGeminisProcessed ? "scraped" : job.status,
    });

    return null;
  },
});

// ============================================================================
// LLM ANALYSIS PHASE
// ============================================================================

export const startLLMProcessing = internalMutation({
  args: {
    jobId: v.id("scrapingJobs"),
    shardIndex: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job || !job.shards) {
      throw new Error("Job or shards not found");
    }

    const shards = [...job.shards];
    const shardIdx = shards.findIndex(s => s.shardIndex === args.shardIndex);
    
    if (shardIdx === -1) {
      throw new Error(`Shard ${args.shardIndex} not found`);
    }

    shards[shardIdx].llmStatus = "processing";
    shards[shardIdx].llmStartedAt = Date.now();

    // If this is the first LLM starting, update job status
    const isFirstLLM = job.status === "scraped";

    await ctx.db.patch(args.jobId, {
      shards,
      status: isFirstLLM ? "analyzing" : job.status,
    });

    return null;
  },
});

export const saveLLMResult = internalMutation({
  args: {
    jobId: v.id("scrapingJobs"),
    shardIndex: v.number(),
    parsedData: v.any(),
  },
  returns: v.object({
    allLLMsComplete: v.boolean(),
    completedCount: v.number(),
    totalCount: v.number(),
  }),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job || !job.shards) {
      throw new Error("Job or shards not found");
    }

    const shards = [...job.shards];
    const shardIdx = shards.findIndex(s => s.shardIndex === args.shardIndex);
    
    if (shardIdx === -1) {
      throw new Error(`Shard ${args.shardIndex} not found`);
    }

    // Update shard with LLM result
    shards[shardIdx].llmStatus = "completed";
    shards[shardIdx].llmParsedData = args.parsedData;
    shards[shardIdx].llmCompletedAt = Date.now();
    shards[shardIdx].llmError = undefined;

    const completedLLMs = (job.completedLLMs || 0) + 1;
    const allLLMsComplete = completedLLMs === job.totalShards;

    await ctx.db.patch(args.jobId, {
      shards,
      completedLLMs,
      status: allLLMsComplete ? "merging" : "analyzing",
    });

    return {
      allLLMsComplete,
      completedCount: completedLLMs,
      totalCount: job.totalShards || 0,
    };
  },
});

export const failLLMShard = internalMutation({
  args: {
    jobId: v.id("scrapingJobs"),
    shardIndex: v.number(),
    error: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job || !job.shards) {
      throw new Error("Job or shards not found");
    }

    const shards = [...job.shards];
    const shardIdx = shards.findIndex(s => s.shardIndex === args.shardIndex);
    
    if (shardIdx === -1) {
      throw new Error(`Shard ${args.shardIndex} not found`);
    }

    shards[shardIdx].llmStatus = "failed";
    shards[shardIdx].llmError = args.error;
    shards[shardIdx].llmCompletedAt = Date.now();

    // Count how many LLMs have completed (success or failure)
    const completedCount = shards.filter(
      s => s.llmStatus === "completed" || s.llmStatus === "failed"
    ).length;

    const allLLMsProcessed = completedCount === job.totalShards;

    await ctx.db.patch(args.jobId, {
      shards,
      completedLLMs: completedCount,
      status: allLLMsProcessed ? "merging" : job.status,
    });

    return null;
  },
});
/**
 * Reset job and all shards for LLM retry
 * Keeps Gemini data but resets LLM status
 */
export const resetForLLMRetry = mutation({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    
    if (!job) {
      throw new Error("Job not found");
    }

    if (!job.shards) {
      throw new Error("Not a distributed job");
    }

    console.log(`🔄 Resetting job ${args.jobId} for LLM retry`);

    // Reset each shard's LLM status but keep Gemini data
    const resetShards = job.shards.map(shard => ({
      ...shard,
      llmStatus: "pending" as const,
      llmParsedData: undefined,
      llmStartedAt: undefined,
      llmCompletedAt: undefined,
      llmError: undefined,
    }));

    // Reset job counters and status
    await ctx.db.patch(args.jobId, {
      shards: resetShards,
      completedLLMs: 0,
      status: "scraped", // Back to scraped (Gemini complete, LLM pending)
      error: undefined,
      seoReport: undefined, // Clear old report
    });

    console.log(`✅ Job ${args.jobId} reset - ready for LLM retry`);

    return null;
  },
});
// ============================================================================
// MERGE & FINALIZATION
// ============================================================================
export const mergeAndFinalize = internalMutation({
  args: {
    jobId: v.id("scrapingJobs"),
    mergedData: v.any(),
  },
  returns: v.object({
    success: v.boolean(),
    errors: v.optional(v.array(v.string())),
  }),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job || !job.shards) {
      return { success: false, errors: ["Job or shards not found"] };
    }

    // Track which shards failed
    const failedShards = job.shards
      .filter(s => s.llmStatus === "failed" || s.geminiStatus === "failed")
      .map(s => `${s.shardName} (${s.llmError || s.geminiError})`);

    // Validate merged data
    const validation = investorDashboardSchema.safeParse(args.mergedData);

    if (validation.success) {
      await ctx.db.patch(args.jobId, {
        seoReport: validation.data,
        status: "completed",
        completedAt: Date.now(),
        error: failedShards.length > 0 
          ? `Partial completion. Failed shards: ${failedShards.join(", ")}` 
          : undefined,
      });

      return { 
        success: true, 
        errors: failedShards.length > 0 ? failedShards : undefined 
      };
    } else {
      // FIX: Changed .errors to .issues (correct Zod API)
      const validationErrors = validation.error.issues.map(issue => 
        `${issue.path.join('.')}: ${issue.message}`
      );

      const allErrors = [...validationErrors, ...failedShards];

      await ctx.db.patch(args.jobId, {
        status: "failed",
        error: `Schema validation failed: ${allErrors.join("; ")}`,
        completedAt: Date.now(),
      });

      return { success: false, errors: allErrors };
    }
  },
});
// ============================================================================
// LEGACY COMMANDS (Backward Compatibility)
// ============================================================================

export const saveRawScrapingData = internalMutation({
  args: {
    jobId: v.id("scrapingJobs"),
    rawData: v.array(v.any()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    
    // If job has shards, this is using new architecture - ignore
    if (job?.shards) {
      console.warn("saveRawScrapingData called on distributed job - ignoring");
      return null;
    }

    // Legacy single-scraper flow
    await ctx.db.patch(args.jobId, {
      results: args.rawData,
      status: "analyzing",
      error: undefined,
    });
    return null;
  },
});

export const saveSeoReport = internalMutation({
  args: {
    jobId: v.id("scrapingJobs"),
    seoReport: v.any(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const parsed = investorDashboardSchema.safeParse(args.seoReport);
    await ctx.db.patch(args.jobId, {
      seoReport: parsed.data,
    });
    return null;
  },
});

export const setjobToAnalyzing = mutation({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "analyzing",
      error: undefined,
    });
    return null;
  },
});

export const saveOriginalPrompt = internalMutation({
  args: {
    jobId: v.id("scrapingJobs"),
    prompt: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      analysisPrompt: args.prompt,
    });
    return null;
  },
});

export const sendMessage = mutation({
  args: {
    jobId: v.id("scrapingJobs"),
    messages: v.any(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      messages: args.messages,
    });
    return null;
  },
});

export const updateJobWithSnapshotId = mutation({
  args: {
    jobId: v.id("scrapingJobs"),
    snapshotId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      snapshotId: args.snapshotId,
      status: "running",
      error: undefined,
    });
    return null;
  },
});

// ============================================================================
// QUERIES
// ============================================================================

export const getJobById = query({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  returns: v.union(
    v.object({
      _id: v.id("scrapingJobs"),
      _creationTime: v.number(),
      userId: v.string(),
      originalPrompt: v.string(),
      analysisPrompt: v.optional(v.string()),
      snapshotId: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("scraping"),
        v.literal("scraped"),
        v.literal("running"),
        v.literal("analyzing"),
        v.literal("merging"),
        v.literal("completed"),
        v.literal("failed")
      ),
      // Legacy fields
      results: v.optional(v.array(v.any())),
      seoReport: v.optional(v.any()),
      messages: v.optional(v.array(v.any())),
      // New distributed fields
      totalShards: v.optional(v.number()),
      completedGeminis: v.optional(v.number()),
      completedLLMs: v.optional(v.number()),
      shards: v.optional(v.array(v.object({
        shardName: v.string(),
        shardIndex: v.number(),
        geminiStatus: v.string(),
        geminiSnapshotId: v.optional(v.string()),
        geminiRawData: v.optional(v.any()),
        geminiCompletedAt: v.optional(v.number()),
        geminiError: v.optional(v.string()),
        llmStatus: v.string(),
        llmParsedData: v.optional(v.any()),
        llmStartedAt: v.optional(v.number()),
        llmCompletedAt: v.optional(v.number()),
        llmError: v.optional(v.string()),
      }))),
      error: v.optional(v.string()),
      createdAt: v.number(),
      completedAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (job && job.seoReport !== undefined) {
      const result = investorDashboardSchema.safeParse(job.seoReport);
      if (!result.success) {
        throw new Error("Stored seoReport failed validation");
      }
    }
    return job;
  },
});

export const getJobBySnapshotId = query({
  args: {
    snapshotId: v.string(),
    userId: v.string(),
  },
  returns: v.union(
    v.object({
      _id: v.id("scrapingJobs"),
      _creationTime: v.number(),
      userId: v.string(),
      originalPrompt: v.string(),
      analysisPrompt: v.optional(v.string()),
      snapshotId: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("scraping"),
        v.literal("scraped"),
        v.literal("running"),
        v.literal("analyzing"),
        v.literal("merging"),
        v.literal("completed"),
        v.literal("failed")
      ),
      results: v.optional(v.array(v.any())),
      seoReport: v.optional(v.any()),
      messages: v.optional(v.array(v.any())),
      totalShards: v.optional(v.number()),
      completedGeminis: v.optional(v.number()),
      completedLLMs: v.optional(v.number()),
      shards: v.optional(v.array(v.object({
        shardName: v.string(),
        shardIndex: v.number(),
        geminiStatus: v.string(),
        geminiSnapshotId: v.optional(v.string()),
        geminiRawData: v.optional(v.any()),
        geminiCompletedAt: v.optional(v.number()),
        geminiError: v.optional(v.string()),
        llmStatus: v.string(),
        llmParsedData: v.optional(v.any()),
        llmStartedAt: v.optional(v.number()),
        llmCompletedAt: v.optional(v.number()),
        llmError: v.optional(v.string()),
      }))),
      error: v.optional(v.string()),
      createdAt: v.number(),
      completedAt: v.optional(v.number()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const job = await ctx.db
      .query("scrapingJobs")
      .filter(q =>
        q.and(
          q.eq(q.field("snapshotId"), args.snapshotId),
          q.eq(q.field("userId"), args.userId)
        )
      )
      .first();

    if (job && job.seoReport !== undefined) {
      const result = investorDashboardSchema.safeParse(job.seoReport);
      if (!result.success) {
        throw new Error("Stored seoReport failed validation");
      }
    }

    return job;
  },
});

export const getUserJobs = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("scrapingJobs"),
      _creationTime: v.number(),
      userId: v.string(),
      originalPrompt: v.string(),
      analysisPrompt: v.optional(v.string()),
      snapshotId: v.optional(v.string()),
      status: v.union(
        v.literal("pending"),
        v.literal("scraping"),
        v.literal("scraped"),
        v.literal("running"),
        v.literal("analyzing"),
        v.literal("merging"),
        v.literal("completed"),
        v.literal("failed")
      ),
      results: v.optional(v.array(v.any())),
      seoReport: v.optional(v.any()),
      messages: v.optional(v.array(v.any())),
      totalShards: v.optional(v.number()),
      completedGeminis: v.optional(v.number()),
      completedLLMs: v.optional(v.number()),
      shards: v.optional(v.array(v.object({
        shardName: v.string(),
        shardIndex: v.number(),
        geminiStatus: v.string(),
        geminiSnapshotId: v.optional(v.string()),
        geminiRawData: v.optional(v.any()),
        geminiCompletedAt: v.optional(v.number()),
        geminiError: v.optional(v.string()),
        llmStatus: v.string(),
        llmParsedData: v.optional(v.any()),
        llmStartedAt: v.optional(v.number()),
        llmCompletedAt: v.optional(v.number()),
        llmError: v.optional(v.string()),
      }))),
      error: v.optional(v.string()),
      createdAt: v.number(),
      completedAt: v.optional(v.number()),
    })
  ),
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    const jobs = await ctx.db
      .query("scrapingJobs")
      .withIndex("by_user_and_created_at", q => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    for (const job of jobs) {
      if (job.seoReport !== undefined) {
        const result = investorDashboardSchema.safeParse(job.seoReport);
        if (!result.success) {
          throw new Error("Stored seoReport failed validation");
        }
      }
    }

    return jobs;
  },
});

// ============================================================================
// JOB MANAGEMENT
// ============================================================================

export const completeJob = internalMutation({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "completed",
      completedAt: Date.now(),
      error: undefined,
    });
    return null;
  },
});

export const failJob = mutation({
  args: {
    jobId: v.id("scrapingJobs"),
    error: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "failed",
      error: args.error,
      completedAt: Date.now(),
    });
    return null;
  },
});

export const retryJob = mutation({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    
    // If distributed architecture job, reset all shards
    if (job?.shards) {
      const resetShards = job.shards.map(shard => ({
        ...shard,
        geminiStatus: "pending" as const,
        geminiSnapshotId: undefined,
        geminiRawData: undefined,
        geminiCompletedAt: undefined,
        geminiError: undefined,
        llmStatus: "pending" as const,
        llmParsedData: undefined,
        llmStartedAt: undefined,
        llmCompletedAt: undefined,
        llmError: undefined,
      }));

      await ctx.db.patch(args.jobId, {
        status: "pending",
        error: undefined,
        completedAt: undefined,
        seoReport: undefined,
        completedGeminis: 0,
        completedLLMs: 0,
        shards: resetShards,
      });
    } else {
      // Legacy single-scraper retry
      await ctx.db.patch(args.jobId, {
        status: "pending",
        error: undefined,
        completedAt: undefined,
        results: undefined,
        seoReport: undefined,
        snapshotId: undefined,
      });
    }
  },
});

export const canUseSmartRetry = query({
  args: {
    jobId: v.id("scrapingJobs"),
    userId: v.string(),
  },
  returns: v.object({
    canRetryAnalysisOnly: v.boolean(),
    canRetryLLMsOnly: v.boolean(),
    canRetryFailedGeminisOnly: v.boolean(),
    hasScrapingData: v.boolean(),
    hasAnalysisPrompt: v.boolean(),
    failedGeminiShards: v.optional(v.array(v.number())),
    failedLLMShards: v.optional(v.array(v.number())),
  }),
  handler: async (ctx, args) => {
    const job = await ctx.db.get(args.jobId);
    if (!job || job.userId !== args.userId) {
      return {
        canRetryAnalysisOnly: false,
        canRetryLLMsOnly: false,
        canRetryFailedGeminisOnly: false,
        hasScrapingData: false,
        hasAnalysisPrompt: false,
      };
    }

    // Distributed architecture retry logic
    if (job.shards) {
      const failedGeminis = job.shards
        .filter(s => s.geminiStatus === "failed")
        .map(s => s.shardIndex);
      
      const failedLLMs = job.shards
        .filter(s => s.llmStatus === "failed")
        .map(s => s.shardIndex);

      const allGeminisSucceeded = 
        job.completedGeminis === job.totalShards && failedGeminis.length === 0;
      const someGeminisSucceeded = (job.completedGeminis || 0) > 0;

      return {
        canRetryAnalysisOnly: false,
        canRetryLLMsOnly: allGeminisSucceeded && failedLLMs.length > 0,
        canRetryFailedGeminisOnly: failedGeminis.length > 0 && someGeminisSucceeded,
        hasScrapingData: someGeminisSucceeded,
        hasAnalysisPrompt: true,
        failedGeminiShards: failedGeminis.length > 0 ? failedGeminis : undefined,
        failedLLMShards: failedLLMs.length > 0 ? failedLLMs : undefined,
      };
    }

    // Legacy single-scraper retry logic
    const hasScrapingData = !!(job.results && job.results.length > 0);
    const hasAnalysisPrompt = !!job.analysisPrompt;
    const canRetryAnalysisOnly = hasScrapingData && hasAnalysisPrompt;
    
    return {
      canRetryAnalysisOnly,
      canRetryLLMsOnly: false,
      canRetryFailedGeminisOnly: false,
      hasScrapingData,
      hasAnalysisPrompt,
    };
  },
});

export const resetJobForAnalysisRetry = internalMutation({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      status: "analyzing",
      error: undefined,
      completedAt: undefined,
      seoReport: undefined,
    });
    return null;
  },
});

export const deleteJob = mutation({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.delete(args.jobId);
    return null;
  },
});
