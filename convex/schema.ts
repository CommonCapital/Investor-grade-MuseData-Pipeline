import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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
      v.literal("failed"),
      v.literal("retrying") // ✅ NEW: Added retrying status
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
        v.literal("failed"),
        v.literal("retry_needed") // ✅ NEW: Not failed, just needs retry
      ),
      geminiSnapshotId: v.optional(v.string()),
      geminiRawData: v.optional(v.any()),
      geminiCompletedAt: v.optional(v.number()),
      geminiError: v.optional(v.string()),
      // ✅ NEW: Retry tracking fields
      retryCount: v.optional(v.number()),
      lastRetryAt: v.optional(v.number()),
      retryReason: v.optional(v.string()),
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
    .index("by_user_and_created_at", ['userId', 'createdAt'])
    .index("by_user_and_status", ['userId', 'status']),

  user_report_limits: defineTable({
    userId: v.string(),
    totalLimit: v.number(),
    lastPaymentDate: v.number(),
  }).index("by_user", ["userId"]),

  gemini_job_queue: defineTable({
    job_id: v.id("scrapingJobs"),
    entity: v.string(),
    user_id: v.string(),
    status: v.string(),
    created_at: v.number(),
  }).index("by_status_created", ["status", "created_at"]),
  
     // ✅ NEW: Job Applications Table
  jobApplications: defineTable({
    // Personal Information
    fullName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    location: v.string(),
    
    // Professional Background
    currentRole: v.string(),
    experience: v.string(),
    linkedin: v.optional(v.string()),
    portfolio: v.optional(v.string()),
    
    // Application Details
    position: v.string(),
    motivation: v.string(),
    skills: v.string(),
    
    // Document Storage IDs (references to Convex file storage)
    resumeStorageId: v.id("_storage"),
    coverLetterStorageId: v.optional(v.id("_storage")),
    
    // Metadata
    status: v.union(
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("interviewing"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
    submittedAt: v.number(),
    lastUpdatedAt: v.number(),
    reviewedBy: v.optional(v.string()), // Admin user ID who reviewed
    reviewNotes: v.optional(v.string()),
    
    // Terms acceptance
    termsAccepted: v.boolean(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_submitted_at", ["submittedAt"])
    .index("by_position", ["position"])
    .index("by_status_and_position", ["status", "position"])
    .searchIndex("search_name_email", {
      searchField: "fullName",
      filterFields: ["email", "status"]
    }),

  // ✅ NEW: Startup Applications Table (VC Funding Applications)
  startupApplications: defineTable({
    // Founder Information
    founderName: v.string(),
    founderEmail: v.string(),
    founderPhone: v.optional(v.string()),
    founderLinkedin: v.optional(v.string()),
    coFounders: v.optional(v.string()), // Names and roles of co-founders
    
    // Company Information
    companyName: v.string(),
    companyWebsite: v.optional(v.string()),
    companyLocation: v.string(),
    incorporationStatus: v.union(
      v.literal("incorporated"),
      v.literal("in_progress"),
      v.literal("not_yet")
    ),
    incorporationCountry: v.optional(v.string()),
    foundedDate: v.optional(v.string()),
    
    // Business Details
    industry: v.string(), // e.g., "FinTech", "HealthTech", "SaaS", "E-commerce"
    stage: v.union(
      v.literal("idea"),
      v.literal("prototype"),
      v.literal("mvp"),
      v.literal("early_revenue"),
      v.literal("growth")
    ),
    businessModel: v.string(), // How they make money
    problemStatement: v.string(), // What problem are they solving?
    solution: v.string(), // Their solution
    uniqueValueProposition: v.string(), // What makes them different
    targetMarket: v.string(), // Who are their customers
    marketSize: v.optional(v.string()), // TAM, SAM, SOM
    competitors: v.optional(v.string()), // Competitive landscape
    competitiveAdvantage: v.optional(v.string()), // Moat/defensibility
    
    // Traction & Metrics
    currentRevenue: v.optional(v.string()), // MRR/ARR
    revenueGrowth: v.optional(v.string()), // Month-over-month or YoY
    numberOfCustomers: v.optional(v.string()),
    userMetrics: v.optional(v.string()), // MAU, DAU, engagement metrics
    keyMilestones: v.string(), // Achievements to date
    
    // Funding
    fundingStage: v.union(
      v.literal("pre_seed"),
      v.literal("seed"),
      v.literal("series_a"),
      v.literal("series_b"),
      v.literal("series_c_plus")
    ),
    fundingAmount: v.string(), // Amount seeking
    previousFunding: v.optional(v.string()), // Previous rounds raised
    currentInvestors: v.optional(v.string()), // Existing investors
    useOfFunds: v.string(), // How they'll use the investment
    valuation: v.optional(v.string()), // Current or target valuation
    
    // Team
    teamSize: v.string(),
    keyTeamMembers: v.string(), // Background of key team members
    advisors: v.optional(v.string()), // Advisory board
    hiringPlans: v.optional(v.string()), // Key hires planned
    
    // Product & Technology
    productDescription: v.string(),
    technologyStack: v.optional(v.string()),
    intellectualProperty: v.optional(v.string()), // Patents, proprietary tech
    productRoadmap: v.optional(v.string()), // Future plans
    
    // Go-to-Market
    customerAcquisition: v.string(), // How they acquire customers
    salesStrategy: v.string(),
    marketingStrategy: v.optional(v.string()),
    partnershipStrategy: v.optional(v.string()),
    
    // Financial Projections
    projectedRevenue: v.optional(v.string()), // Next 3 years
    burnRate: v.optional(v.string()), // Monthly burn
    runway: v.optional(v.string()), // Months of runway
    breakEvenTimeline: v.optional(v.string()),
    
    // Documents (Storage IDs)
    pitchDeckStorageId: v.id("_storage"), // Required
    financialModelStorageId: v.optional(v.id("_storage")),
    businessPlanStorageId: v.optional(v.id("_storage")),
    productDemoStorageId: v.optional(v.id("_storage")), // Video or screenshots
    
    // Additional Information
    whyUs: v.string(), // Why they want this VC specifically
    referralSource: v.optional(v.string()), // How they heard about us
    exitStrategy: v.optional(v.string()), // Long-term vision
    challenges: v.optional(v.string()), // Current challenges/risks
    
    // Metadata
    status: v.union(
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("due_diligence"),
      v.literal("term_sheet"),
      v.literal("funded"),
      v.literal("rejected"),
      v.literal("on_hold")
    ),
    submittedAt: v.number(),
    lastUpdatedAt: v.number(),
    reviewedBy: v.optional(v.string()), // Partner who reviewed
    reviewNotes: v.optional(v.string()),
    internalRating: v.optional(v.number()), // 1-10 rating
    
    // Terms acceptance
    termsAccepted: v.boolean(),
  })
    .index("by_founder_email", ["founderEmail"])
    .index("by_status", ["status"])
    .index("by_submitted_at", ["submittedAt"])
    .index("by_industry", ["industry"])
    .index("by_stage", ["stage"])
    .index("by_funding_stage", ["fundingStage"])
    .index("by_status_and_stage", ["status", "stage"])
    .index("by_status_and_industry", ["status", "industry"])
    .searchIndex("search_company_founder", {
      searchField: "companyName",
      filterFields: ["founderEmail", "status", "industry"]
    }),

});