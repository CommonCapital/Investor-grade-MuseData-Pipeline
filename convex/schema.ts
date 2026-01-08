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
      v.literal("scraping"),      // NEW: Gemini scrapers running
      v.literal("scraped"),        // NEW: All Gemini scrapers complete
      v.literal("running"),        // LEGACY: keep for old jobs
      v.literal("analyzing"),      // LLM processing
      v.literal("merging"),        // NEW: LLMs done, merging schemas
      v.literal("completed"),
      v.literal("failed")
    ),
    
    // LEGACY FIELDS (backward compatibility)
    results: v.optional(v.array(v.any())),
    seoReport: v.optional(v.any()),
    error: v.optional(v.string()),
    messages: v.optional(v.array(v.any())),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
    
    // NEW DISTRIBUTED ARCHITECTURE FIELDS
    totalShards: v.optional(v.number()),           // Total number of shards (7)
    completedGeminis: v.optional(v.number()),      // Counter: how many Gemini scrapers completed
    completedLLMs: v.optional(v.number()),         // Counter: how many LLMs completed
    
    shards: v.optional(v.array(v.object({
      shardName: v.string(),                       // e.g., "financial_metrics"
      shardIndex: v.number(),                      // 1-7
      
      // Gemini scraping phase
      geminiStatus: v.union(
        v.literal("pending"),
        v.literal("scraping"),
        v.literal("completed"),
        v.literal("failed")
      ),
      geminiSnapshotId: v.optional(v.string()),    // BrightData snapshot ID
      geminiRawData: v.optional(v.any()),          // Raw Gemini output
      geminiCompletedAt: v.optional(v.number()),
      geminiError: v.optional(v.string()),
      
      // LLM parsing phase
      llmStatus: v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("completed"),
        v.literal("failed")
      ),
      llmParsedData: v.optional(v.any()),          // Parsed schema fragment
      llmStartedAt: v.optional(v.number()),
      llmCompletedAt: v.optional(v.number()),
      llmError: v.optional(v.string()),
    }))),
    
  })
  .index("by_status", ['status'])
  .index("by_created_at", ['createdAt'])
  .index("by_user", ['userId'])
  .index("by_user_and_created_at", ['userId', 'createdAt']),
});
