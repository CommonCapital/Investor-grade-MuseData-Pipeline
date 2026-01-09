import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// The schema is entirely optional.
// You can delete this file (schema.ts) and the
// app will continue to work.
// The schema provides more precise TypeScript types.
export default defineSchema({
  scrapingJobs: defineTable({
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
    error: v.optional(v.string()),
    messages: v.optional(v.array(v.any())),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    totalShards: v.optional(v.number()),
    completedGeminis: v.optional(v.number()),
    completedLLMs: v.optional(v.number()),
    shards: v.optional(v.array(v.object({
      shardName: v.string(),
      shardIndex: v.number(),
      geminiStatus: v.union(
        v.literal("pending"),
        v.literal("scraping"),
        v.literal("completed"),
        v.literal("failed")
      ),
      geminiSnapshotId: v.optional(v.string()),
      geminiRawData: v.optional(v.any()),
      geminiCompletedAt: v.optional(v.number()),
      geminiError: v.optional(v.string()),
      llmStatus: v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("completed"),
        v.literal("failed")
      ),
      llmParsedData: v.optional(v.any()),
      llmStartedAt: v.optional(v.number()),
      llmCompletedAt: v.optional(v.number()),
      llmError: v.optional(v.string()),
    }))),
  })
    .index("by_status", ['status'])
    .index("by_created_at", ['createdAt'])
    .index("by_user", ['userId'])
    .index("by_user_and_created_at", ['userId', 'createdAt']),

  // ✅ ADD THIS NEW TABLE HERE
  gemini_job_queue: defineTable({
    job_id: v.id("scrapingJobs"),
    entity: v.string(),
    user_id: v.string(),
    status: v.string(), // "queued" | "processing" | "completed" | "failed"
    created_at: v.number(),
  }).index("by_status_created", ["status", "created_at"]),
});