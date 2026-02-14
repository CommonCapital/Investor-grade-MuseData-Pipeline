import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================================================
// MUTATIONS (Write Operations)
// ============================================================================

/**
 * Generate upload URL for startup documents (pitch deck, financial model, etc.)
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Submit a new startup funding application
 * Documents should be uploaded to storage first using generateUploadUrl
 */
export const submitStartupApplication = mutation({
  args: {
    // Founder Information
    founderName: v.string(),
    founderEmail: v.string(),
    founderPhone: v.optional(v.string()),
    founderLinkedin: v.optional(v.string()),
    coFounders: v.optional(v.string()),
    
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
    industry: v.string(),
    stage: v.union(
      v.literal("idea"),
      v.literal("prototype"),
      v.literal("mvp"),
      v.literal("early_revenue"),
      v.literal("growth")
    ),
    businessModel: v.string(),
    problemStatement: v.string(),
    solution: v.string(),
    uniqueValueProposition: v.string(),
    targetMarket: v.string(),
    marketSize: v.optional(v.string()),
    competitors: v.optional(v.string()),
    competitiveAdvantage: v.optional(v.string()),
    
    // Traction & Metrics
    currentRevenue: v.optional(v.string()),
    revenueGrowth: v.optional(v.string()),
    numberOfCustomers: v.optional(v.string()),
    userMetrics: v.optional(v.string()),
    keyMilestones: v.string(),
    
    // Funding
    fundingStage: v.union(
      v.literal("pre_seed"),
      v.literal("seed"),
      v.literal("series_a"),
      v.literal("series_b"),
      v.literal("series_c_plus")
    ),
    fundingAmount: v.string(),
    previousFunding: v.optional(v.string()),
    currentInvestors: v.optional(v.string()),
    useOfFunds: v.string(),
    valuation: v.optional(v.string()),
    
    // Team
    teamSize: v.string(),
    keyTeamMembers: v.string(),
    advisors: v.optional(v.string()),
    hiringPlans: v.optional(v.string()),
    
    // Product & Technology
    productDescription: v.string(),
    technologyStack: v.optional(v.string()),
    intellectualProperty: v.optional(v.string()),
    productRoadmap: v.optional(v.string()),
    
    // Go-to-Market
    customerAcquisition: v.string(),
    salesStrategy: v.string(),
    marketingStrategy: v.optional(v.string()),
    partnershipStrategy: v.optional(v.string()),
    
    // Financial Projections
    projectedRevenue: v.optional(v.string()),
    burnRate: v.optional(v.string()),
    runway: v.optional(v.string()),
    breakEvenTimeline: v.optional(v.string()),
    
    // Documents
    pitchDeckStorageId: v.id("_storage"),
    financialModelStorageId: v.optional(v.id("_storage")),
    businessPlanStorageId: v.optional(v.id("_storage")),
    productDemoStorageId: v.optional(v.id("_storage")),
    
    // Additional Information
    whyUs: v.string(),
    referralSource: v.optional(v.string()),
    exitStrategy: v.optional(v.string()),
    challenges: v.optional(v.string()),
    
    // Terms
    termsAccepted: v.boolean(),
  },
  returns: v.object({
    applicationId: v.id("startupApplications"),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    // Validate required fields
    if (!args.termsAccepted) {
      throw new Error("You must accept the terms and conditions");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.founderEmail)) {
      throw new Error("Invalid email address");
    }

    // Check for duplicate applications (same email within last 90 days)
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
    const existingApplication = await ctx.db
      .query("startupApplications")
      .withIndex("by_founder_email", (q) => q.eq("founderEmail", args.founderEmail))
      .filter((q) => 
        q.gt(q.field("submittedAt"), ninetyDaysAgo)
      )
      .first();

    if (existingApplication) {
      throw new Error(
        "You have already submitted an application in the last 90 days. Please contact us directly for updates."
      );
    }

    // Create the application record
    const now = Date.now();
    const applicationId = await ctx.db.insert("startupApplications", {
      founderName: args.founderName,
      founderEmail: args.founderEmail,
      founderPhone: args.founderPhone,
      founderLinkedin: args.founderLinkedin,
      coFounders: args.coFounders,
      companyName: args.companyName,
      companyWebsite: args.companyWebsite,
      companyLocation: args.companyLocation,
      incorporationStatus: args.incorporationStatus,
      incorporationCountry: args.incorporationCountry,
      foundedDate: args.foundedDate,
      industry: args.industry,
      stage: args.stage,
      businessModel: args.businessModel,
      problemStatement: args.problemStatement,
      solution: args.solution,
      uniqueValueProposition: args.uniqueValueProposition,
      targetMarket: args.targetMarket,
      marketSize: args.marketSize,
      competitors: args.competitors,
      competitiveAdvantage: args.competitiveAdvantage,
      currentRevenue: args.currentRevenue,
      revenueGrowth: args.revenueGrowth,
      numberOfCustomers: args.numberOfCustomers,
      userMetrics: args.userMetrics,
      keyMilestones: args.keyMilestones,
      fundingStage: args.fundingStage,
      fundingAmount: args.fundingAmount,
      previousFunding: args.previousFunding,
      currentInvestors: args.currentInvestors,
      useOfFunds: args.useOfFunds,
      valuation: args.valuation,
      teamSize: args.teamSize,
      keyTeamMembers: args.keyTeamMembers,
      advisors: args.advisors,
      hiringPlans: args.hiringPlans,
      productDescription: args.productDescription,
      technologyStack: args.technologyStack,
      intellectualProperty: args.intellectualProperty,
      productRoadmap: args.productRoadmap,
      customerAcquisition: args.customerAcquisition,
      salesStrategy: args.salesStrategy,
      marketingStrategy: args.marketingStrategy,
      partnershipStrategy: args.partnershipStrategy,
      projectedRevenue: args.projectedRevenue,
      burnRate: args.burnRate,
      runway: args.runway,
      breakEvenTimeline: args.breakEvenTimeline,
      pitchDeckStorageId: args.pitchDeckStorageId,
      financialModelStorageId: args.financialModelStorageId,
      businessPlanStorageId: args.businessPlanStorageId,
      productDemoStorageId: args.productDemoStorageId,
      whyUs: args.whyUs,
      referralSource: args.referralSource,
      exitStrategy: args.exitStrategy,
      challenges: args.challenges,
      status: "submitted",
      submittedAt: now,
      lastUpdatedAt: now,
      termsAccepted: args.termsAccepted,
    });

    // TODO: Send confirmation email
    // TODO: Notify investment team

    return {
      applicationId,
      message: "Application submitted successfully! Our investment team will review your submission and reach out within 2 weeks.",
    };
  },
});

/**
 * Update startup application status (Partner/Admin only)
 */
export const updateStartupApplicationStatus = mutation({
  args: {
    applicationId: v.id("startupApplications"),
    status: v.union(
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("due_diligence"),
      v.literal("term_sheet"),
      v.literal("funded"),
      v.literal("rejected"),
      v.literal("on_hold")
    ),
    reviewedBy: v.optional(v.string()),
    reviewNotes: v.optional(v.string()),
    internalRating: v.optional(v.number()),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    // TODO: Add authentication check for partner/admin users

    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    await ctx.db.patch(args.applicationId, {
      status: args.status,
      lastUpdatedAt: Date.now(),
      reviewedBy: args.reviewedBy,
      reviewNotes: args.reviewNotes,
      internalRating: args.internalRating,
    });

    // TODO: Send status update email to founder

    return {
      success: true,
      message: `Application status updated to ${args.status}`,
    };
  },
});

// ============================================================================
// QUERIES (Read Operations)
// ============================================================================

/**
 * Get a single startup application by ID
 */
export const getStartupApplicationById = query({
  args: {
    applicationId: v.id("startupApplications"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.applicationId);
  },
});

/**
 * Get startup applications by founder email
 */
export const getStartupApplicationsByEmail = query({
  args: {
    founderEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("startupApplications")
      .withIndex("by_founder_email", (q) => q.eq("founderEmail", args.founderEmail))
      .collect();

    // Return limited info for privacy
    return applications.map((app) => ({
      _id: app._id,
      _creationTime: app._creationTime,
      companyName: app.companyName,
      industry: app.industry,
      stage: app.stage,
      fundingStage: app.fundingStage,
      status: app.status,
      submittedAt: app.submittedAt,
      lastUpdatedAt: app.lastUpdatedAt,
    }));
  },
});

/**
 * List all startup applications (Partner/Admin only)
 */
export const listStartupApplications = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("submitted"),
        v.literal("under_review"),
        v.literal("due_diligence"),
        v.literal("term_sheet"),
        v.literal("funded"),
        v.literal("rejected"),
        v.literal("on_hold")
      )
    ),
    industry: v.optional(v.string()),
    stage: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // TODO: Add authentication check for partner/admin users

    const limit = args.limit ?? 50;

    let applications;

    // Filter by status if provided
    if (args.status) {
      applications = await ctx.db
        .query("startupApplications")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(limit);
    } else {
      applications = await ctx.db
        .query("startupApplications")
        .withIndex("by_submitted_at")
        .order("desc")
        .take(limit);
    }

    // Client-side filtering
    if (args.industry) {
      applications = applications.filter((app) => app.industry === args.industry);
    }
    if (args.stage) {
      applications = applications.filter((app) => app.stage === args.stage);
    }

    return {
      applications: applications.map((app) => ({
        _id: app._id,
        _creationTime: app._creationTime,
        founderName: app.founderName,
        founderEmail: app.founderEmail,
        companyName: app.companyName,
        companyLocation: app.companyLocation,
        industry: app.industry,
        stage: app.stage,
        fundingStage: app.fundingStage,
        fundingAmount: app.fundingAmount,
        status: app.status,
        submittedAt: app.submittedAt,
        lastUpdatedAt: app.lastUpdatedAt,
        internalRating: app.internalRating,
      })),
      total: applications.length,
    };
  },
});

/**
 * Get startup application statistics (Partner dashboard)
 */
export const getStartupApplicationStats = query({
  args: {},
  handler: async (ctx) => {
    // TODO: Add authentication check

    const allApplications = await ctx.db.query("startupApplications").collect();

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentApplications = allApplications.filter(
      (app) => app.submittedAt > thirtyDaysAgo
    ).length;

    // Count by status
    const byStatus = {
      submitted: 0,
      under_review: 0,
      due_diligence: 0,
      term_sheet: 0,
      funded: 0,
      rejected: 0,
      on_hold: 0,
    };

    allApplications.forEach((app) => {
      byStatus[app.status]++;
    });

    // Count by industry
    const industryCounts: Record<string, number> = {};
    allApplications.forEach((app) => {
      industryCounts[app.industry] = (industryCounts[app.industry] || 0) + 1;
    });

    const byIndustry = Object.entries(industryCounts).map(
      ([industry, count]) => ({ industry, count })
    );

    // Count by stage
    const stageCounts: Record<string, number> = {};
    allApplications.forEach((app) => {
      stageCounts[app.stage] = (stageCounts[app.stage] || 0) + 1;
    });

    const byStage = Object.entries(stageCounts).map(([stage, count]) => ({
      stage,
      count,
    }));

    // Count by funding stage
    const fundingStageCounts: Record<string, number> = {};
    allApplications.forEach((app) => {
      fundingStageCounts[app.fundingStage] =
        (fundingStageCounts[app.fundingStage] || 0) + 1;
    });

    const byFundingStage = Object.entries(fundingStageCounts).map(
      ([fundingStage, count]) => ({ fundingStage, count })
    );

    return {
      total: allApplications.length,
      byStatus,
      byIndustry,
      byStage,
      byFundingStage,
      recentApplications,
    };
  },
});

/**
 * Get download URL for startup documents
 */
export const getFileUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    // TODO: Add authentication check
    return await ctx.storage.getUrl(args.storageId);
  },
});