import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

const ADMIN_EMAILS = ["partners@musedata.ai", "collin@musedata.ai", "nursan2007@gmail.com"];

async function requireAdmin(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized: Must be logged in");
  const email = identity.email?.toLowerCase();
  if (!email || !ADMIN_EMAILS.includes(email)) throw new Error("Unauthorized: Admin access only");
  return identity;
}

// ── File Upload ───────────────────────────────────────────────────────────────

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

// ── Job Applications ──────────────────────────────────────────────────────────

export const listJobApplications = query({
  args: {
    status: v.optional(v.union(
      v.literal("submitted"), v.literal("under_review"), v.literal("interviewing"),
      v.literal("accepted"), v.literal("rejected")
    )),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    if (args.status) {
      return await ctx.db.query("jobApplications")
        .withIndex("by_status", (q: any) => q.eq("status", args.status!))
        .order("desc").collect();
    }
    return await ctx.db.query("jobApplications")
      .withIndex("by_submitted_at").order("desc").collect();
  },
});

export const getJobApplication = query({
  args: { applicationId: v.id("jobApplications") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.applicationId);
  },
});

export const createJobApplication = mutation({
  args: {
    fullName: v.string(), email: v.string(),
    phone: v.optional(v.string()), location: v.string(),
    currentRole: v.string(), experience: v.string(),
    linkedin: v.optional(v.string()), portfolio: v.optional(v.string()),
    position: v.string(), motivation: v.string(), skills: v.string(),
    status: v.union(
      v.literal("submitted"), v.literal("under_review"), v.literal("interviewing"),
      v.literal("accepted"), v.literal("rejected")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    const now = Date.now();
    const id = await ctx.db.insert("jobApplications", {
      ...args, submittedAt: now, lastUpdatedAt: now,
      termsAccepted: true, manuallyAdded: true, addedBy: identity.email ?? "admin",
    });
    return { id };
  },
});

export const updateJobStatus = mutation({
  args: {
    applicationId: v.id("jobApplications"),
    status: v.union(
      v.literal("submitted"), v.literal("under_review"), v.literal("interviewing"),
      v.literal("accepted"), v.literal("rejected")
    ),
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    await ctx.db.patch(args.applicationId, {
      status: args.status, lastUpdatedAt: Date.now(),
      reviewedBy: identity.email ?? "admin", reviewNotes: args.reviewNotes,
    });
    return { success: true };
  },
});

export const updateJobApplication = mutation({
  args: {
    applicationId: v.id("jobApplications"),
    fullName: v.optional(v.string()), email: v.optional(v.string()),
    phone: v.optional(v.string()), location: v.optional(v.string()),
    currentRole: v.optional(v.string()), experience: v.optional(v.string()),
    linkedin: v.optional(v.string()), portfolio: v.optional(v.string()),
    position: v.optional(v.string()), motivation: v.optional(v.string()),
    skills: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("submitted"), v.literal("under_review"), v.literal("interviewing"),
      v.literal("accepted"), v.literal("rejected")
    )),
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    const { applicationId, ...fields } = args;
    await ctx.db.patch(applicationId, { ...fields, lastUpdatedAt: Date.now(), reviewedBy: identity.email ?? "admin" });
    return { success: true };
  },
});

export const deleteJobApplication = mutation({
  args: { applicationId: v.id("jobApplications") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.applicationId);
    return { success: true };
  },
});

// ── Startup Applications ──────────────────────────────────────────────────────

export const listStartupApplications = query({
  args: {
    status: v.optional(v.union(
      v.literal("submitted"), v.literal("under_review"), v.literal("due_diligence"),
      v.literal("term_sheet"), v.literal("funded"), v.literal("rejected"), v.literal("on_hold")
    )),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    if (args.status) {
      return await ctx.db.query("startupApplications")
        .withIndex("by_status", (q: any) => q.eq("status", args.status!))
        .order("desc").collect();
    }
    return await ctx.db.query("startupApplications")
      .withIndex("by_submitted_at").order("desc").collect();
  },
});

export const getStartupApplication = query({
  args: { applicationId: v.id("startupApplications") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.applicationId);
  },
});

export const createStartupApplication = mutation({
  args: {
    founderName: v.string(), founderEmail: v.string(),
    founderPhone: v.optional(v.string()), founderLinkedin: v.optional(v.string()),
    coFounders: v.optional(v.string()),
    companyName: v.string(), companyWebsite: v.optional(v.string()),
    companyLocation: v.string(),
    incorporationStatus: v.union(v.literal("incorporated"), v.literal("in_progress"), v.literal("not_yet")),
    industry: v.string(),
    stage: v.union(v.literal("idea"), v.literal("prototype"), v.literal("mvp"), v.literal("early_revenue"), v.literal("growth")),
    businessModel: v.string(), problemStatement: v.string(),
    solution: v.string(), uniqueValueProposition: v.string(),
    targetMarket: v.string(), marketSize: v.optional(v.string()),
    competitors: v.optional(v.string()), competitiveAdvantage: v.optional(v.string()),
    currentRevenue: v.optional(v.string()), revenueGrowth: v.optional(v.string()),
    numberOfCustomers: v.optional(v.string()),
    keyMilestones: v.string(),
    fundingStage: v.union(v.literal("pre_seed"), v.literal("seed"), v.literal("series_a"), v.literal("series_b"), v.literal("series_c_plus")),
    fundingAmount: v.string(), previousFunding: v.optional(v.string()),
    currentInvestors: v.optional(v.string()), useOfFunds: v.string(),
    valuation: v.optional(v.string()), teamSize: v.string(),
    keyTeamMembers: v.string(), advisors: v.optional(v.string()),
    productDescription: v.string(), technologyStack: v.optional(v.string()),
    customerAcquisition: v.string(), salesStrategy: v.string(),
    marketingStrategy: v.optional(v.string()),
    burnRate: v.optional(v.string()), runway: v.optional(v.string()),
    whyUs: v.string(), referralSource: v.optional(v.string()),
    exitStrategy: v.optional(v.string()), challenges: v.optional(v.string()),
    status: v.union(
      v.literal("submitted"), v.literal("under_review"), v.literal("due_diligence"),
      v.literal("term_sheet"), v.literal("funded"), v.literal("rejected"), v.literal("on_hold")
    ),
    internalRating: v.optional(v.number()),
    pitchDeckStorageId: v.optional(v.id("_storage")),
    financialModelStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    const now = Date.now();
    const id = await ctx.db.insert("startupApplications", {
      ...args, submittedAt: now, lastUpdatedAt: now,
      termsAccepted: true, manuallyAdded: true, addedBy: identity.email ?? "admin",
    });
    return { id };
  },
});

export const updateStartupStatus = mutation({
  args: {
    applicationId: v.id("startupApplications"),
    status: v.union(
      v.literal("submitted"), v.literal("under_review"), v.literal("due_diligence"),
      v.literal("term_sheet"), v.literal("funded"), v.literal("rejected"), v.literal("on_hold")
    ),
    reviewNotes: v.optional(v.string()), internalRating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    await ctx.db.patch(args.applicationId, {
      status: args.status, lastUpdatedAt: Date.now(),
      reviewedBy: identity.email ?? "admin",
      reviewNotes: args.reviewNotes, internalRating: args.internalRating,
    });
    return { success: true };
  },
});

export const deleteStartupApplication = mutation({
  args: { applicationId: v.id("startupApplications") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.applicationId);
    return { success: true };
  },
});

// ── Limited Partners ──────────────────────────────────────────────────────────

export const listLimitedPartners = query({
  args: {
    status: v.optional(v.union(
      v.literal("prospect"), v.literal("contacted"), v.literal("interested"),
      v.literal("soft_committed"), v.literal("committed"), v.literal("closed"), v.literal("declined")
    )),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    if (args.status) {
      return await ctx.db.query("limitedPartners")
        .withIndex("by_status", (q: any) => q.eq("status", args.status!))
        .order("desc").collect();
    }
    return await ctx.db.query("limitedPartners")
      .withIndex("by_added_at").order("desc").collect();
  },
});

export const getLimitedPartner = query({
  args: { lpId: v.id("limitedPartners") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.lpId);
  },
});

export const createLimitedPartner = mutation({
  args: {
    fullName: v.string(), organization: v.optional(v.string()),
    title: v.optional(v.string()), email: v.string(),
    phone: v.optional(v.string()), location: v.optional(v.string()),
    linkedin: v.optional(v.string()), website: v.optional(v.string()),
    investorType: v.union(
      v.literal("hnwi"), v.literal("family_office"), v.literal("endowment"),
      v.literal("pension_fund"), v.literal("corporate"), v.literal("fund_of_funds"),
      v.literal("sovereign_wealth"), v.literal("other")
    ),
    commitmentAmount: v.optional(v.string()), checkSizeRange: v.optional(v.string()),
    totalAUM: v.optional(v.string()), geographicFocus: v.optional(v.string()),
    sectorPreferences: v.optional(v.string()),
    status: v.union(
      v.literal("prospect"), v.literal("contacted"), v.literal("interested"),
      v.literal("soft_committed"), v.literal("committed"), v.literal("closed"), v.literal("declined")
    ),
    lastContactDate: v.optional(v.number()), nextFollowUpDate: v.optional(v.number()),
    meetingCount: v.optional(v.number()), source: v.optional(v.string()),
    referredBy: v.optional(v.string()), internalRating: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    const now = Date.now();
    const id = await ctx.db.insert("limitedPartners", {
      ...args, addedBy: identity.email ?? "admin", addedAt: now, lastUpdatedAt: now,
    });
    return { id };
  },
});

export const updateLimitedPartner = mutation({
  args: {
    lpId: v.id("limitedPartners"),
    fullName: v.optional(v.string()), organization: v.optional(v.string()),
    title: v.optional(v.string()), email: v.optional(v.string()),
    phone: v.optional(v.string()), location: v.optional(v.string()),
    linkedin: v.optional(v.string()), website: v.optional(v.string()),
    investorType: v.optional(v.union(
      v.literal("hnwi"), v.literal("family_office"), v.literal("endowment"),
      v.literal("pension_fund"), v.literal("corporate"), v.literal("fund_of_funds"),
      v.literal("sovereign_wealth"), v.literal("other")
    )),
    commitmentAmount: v.optional(v.string()), checkSizeRange: v.optional(v.string()),
    totalAUM: v.optional(v.string()), geographicFocus: v.optional(v.string()),
    sectorPreferences: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("prospect"), v.literal("contacted"), v.literal("interested"),
      v.literal("soft_committed"), v.literal("committed"), v.literal("closed"), v.literal("declined")
    )),
    lastContactDate: v.optional(v.number()), nextFollowUpDate: v.optional(v.number()),
    meetingCount: v.optional(v.number()), source: v.optional(v.string()),
    referredBy: v.optional(v.string()), internalRating: v.optional(v.number()),
    notes: v.optional(v.string()), reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const { lpId, ...fields } = args;
    await ctx.db.patch(lpId, { ...fields, lastUpdatedAt: Date.now() });
    return { success: true };
  },
});

export const deleteLimitedPartner = mutation({
  args: { lpId: v.id("limitedPartners") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.lpId);
    return { success: true };
  },
});

// ── File URL ──────────────────────────────────────────────────────────────────

export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.storage.getUrl(args.storageId);
  },
});

// ── Dashboard Stats ───────────────────────────────────────────────────────────

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const [jobApps, startupApps, lps] = await Promise.all([
      ctx.db.query("jobApplications").collect(),
      ctx.db.query("startupApplications").collect(),
      ctx.db.query("limitedPartners").collect(),
    ]);
    const jobByStatus = { submitted: 0, under_review: 0, interviewing: 0, accepted: 0, rejected: 0 };
    jobApps.forEach((a: any) => { jobByStatus[a.status as keyof typeof jobByStatus]++; });
    const startupByStatus = { submitted: 0, under_review: 0, due_diligence: 0, term_sheet: 0, funded: 0, rejected: 0, on_hold: 0 };
    startupApps.forEach((a: any) => { startupByStatus[a.status as keyof typeof startupByStatus]++; });
    const lpByStatus = { prospect: 0, contacted: 0, interested: 0, soft_committed: 0, committed: 0, closed: 0, declined: 0 };
    lps.forEach((a: any) => { lpByStatus[a.status as keyof typeof lpByStatus]++; });
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return {
      jobs: { total: jobApps.length, recent: jobApps.filter((a: any) => a.submittedAt > sevenDaysAgo).length, byStatus: jobByStatus },
      startups: { total: startupApps.length, recent: startupApps.filter((a: any) => a.submittedAt > sevenDaysAgo).length, byStatus: startupByStatus },
      lps: { total: lps.length, recent: lps.filter((a: any) => a.addedAt > sevenDaysAgo).length, byStatus: lpByStatus, committed: lps.filter((a: any) => ["soft_committed","committed","closed"].includes(a.status)).length },
    };
  },
});