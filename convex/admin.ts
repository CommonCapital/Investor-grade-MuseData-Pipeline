import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ============================================================================
// ADMIN WHITELIST — only these emails can access admin queries
// ============================================================================
const ADMIN_EMAILS = ["collin@musedata.ai", "nursan2007@gmail.com"];

async function requireAdmin(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthorized: Must be logged in");
  }
  const email = identity.email?.toLowerCase();
  if (!email || !ADMIN_EMAILS.includes(email)) {
    throw new Error("Unauthorized: Admin access only");
  }
  return identity;
}

// ============================================================================
// QUERIES
// ============================================================================

/** All job applications — full data */
export const listJobApplications = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("submitted"),
        v.literal("under_review"),
        v.literal("interviewing"),
        v.literal("accepted"),
        v.literal("rejected")
      )
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    let apps;
    if (args.status) {
      apps = await ctx.db
        .query("jobApplications")
        .withIndex("by_status", (q: any) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    } else {
      apps = await ctx.db
        .query("jobApplications")
        .withIndex("by_submitted_at")
        .order("desc")
        .collect();
    }

    return apps;
  },
});

/** Single job application — full data */
export const getJobApplication = query({
  args: { applicationId: v.id("jobApplications") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.applicationId);
  },
});

/** All startup applications — full data */
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
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    let apps;
    if (args.status) {
      apps = await ctx.db
        .query("startupApplications")
        .withIndex("by_status", (q: any) => q.eq("status", args.status!))
        .order("desc")
        .collect();
    } else {
      apps = await ctx.db
        .query("startupApplications")
        .withIndex("by_submitted_at")
        .order("desc")
        .collect();
    }

    return apps;
  },
});

/** Single startup application — full data */
export const getStartupApplication = query({
  args: { applicationId: v.id("startupApplications") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.get(args.applicationId);
  },
});

/** Resolve any storage ID to a download URL */
export const getFileUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.storage.getUrl(args.storageId);
  },
});

/** Dashboard counts */
export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const [jobApps, startupApps] = await Promise.all([
      ctx.db.query("jobApplications").collect(),
      ctx.db.query("startupApplications").collect(),
    ]);

    const jobByStatus = { submitted: 0, under_review: 0, interviewing: 0, accepted: 0, rejected: 0 };
    jobApps.forEach((a: any) => { jobByStatus[a.status as keyof typeof jobByStatus]++ });

    const startupByStatus = { submitted: 0, under_review: 0, due_diligence: 0, term_sheet: 0, funded: 0, rejected: 0, on_hold: 0 };
    startupApps.forEach((a: any) => { startupByStatus[a.status as keyof typeof startupByStatus]++ });

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

    return {
      jobs: {
        total: jobApps.length,
        recent: jobApps.filter((a: any) => a.submittedAt > sevenDaysAgo).length,
        byStatus: jobByStatus,
      },
      startups: {
        total: startupApps.length,
        recent: startupApps.filter((a: any) => a.submittedAt > sevenDaysAgo).length,
        byStatus: startupByStatus,
      },
    };
  },
});

// ============================================================================
// MUTATIONS
// ============================================================================

/** Update job application status */
export const updateJobStatus = mutation({
  args: {
    applicationId: v.id("jobApplications"),
    status: v.union(
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("interviewing"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
    reviewNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    await ctx.db.patch(args.applicationId, {
      status: args.status,
      lastUpdatedAt: Date.now(),
      reviewedBy: identity.email ?? "admin",
      reviewNotes: args.reviewNotes,
    });
    return { success: true };
  },
});

/** Update startup application status */
export const updateStartupStatus = mutation({
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
    reviewNotes: v.optional(v.string()),
    internalRating: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await requireAdmin(ctx);
    await ctx.db.patch(args.applicationId, {
      status: args.status,
      lastUpdatedAt: Date.now(),
      reviewedBy: identity.email ?? "admin",
      reviewNotes: args.reviewNotes,
      internalRating: args.internalRating,
    });
    return { success: true };
  },
});