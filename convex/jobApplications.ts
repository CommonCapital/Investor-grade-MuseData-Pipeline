import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ============================================================================
// MUTATIONS (Write Operations)
// ============================================================================

/**
 * Generate upload URL for resume/cover letter
 * Call this first before submitting the application
 */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

/**
 * Submit a new job application
 * Files should be uploaded to storage first using generateUploadUrl
 */
export const submitApplication = mutation({
  args: {
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
    
    // Document Storage IDs (files uploaded separately)
    resumeStorageId: v.id("_storage"),
    coverLetterStorageId: v.optional(v.id("_storage")),
    
    // Terms
    termsAccepted: v.boolean(),
  },
  returns: v.object({
    applicationId: v.id("jobApplications"),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    // Validate required fields
    if (!args.termsAccepted) {
      throw new Error("You must accept the terms and conditions");
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(args.email)) {
      throw new Error("Invalid email address");
    }

    // Check for duplicate applications (same email and position within last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const existingApplication = await ctx.db
      .query("jobApplications")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) => 
        q.and(
          q.eq(q.field("position"), args.position),
          q.gt(q.field("submittedAt"), thirtyDaysAgo)
        )
      )
      .first();

    if (existingApplication) {
      throw new Error(
        "You have already submitted an application for this position in the last 30 days"
      );
    }

    // Create the application record
    const now = Date.now();
    const applicationId = await ctx.db.insert("jobApplications", {
      fullName: args.fullName,
      email: args.email,
      phone: args.phone,
      location: args.location,
      currentRole: args.currentRole,
      experience: args.experience,
      linkedin: args.linkedin,
      portfolio: args.portfolio,
      position: args.position,
      motivation: args.motivation,
      skills: args.skills,
      resumeStorageId: args.resumeStorageId,
      coverLetterStorageId: args.coverLetterStorageId,
      status: "submitted",
      submittedAt: now,
      lastUpdatedAt: now,
      termsAccepted: args.termsAccepted,
    });

    // TODO: Send confirmation email
    // TODO: Notify admins of new application

    return {
      applicationId,
      message: "Application submitted successfully! You will receive a confirmation email shortly.",
    };
  },
});

/**
 * Update application status (Admin only)
 */
export const updateApplicationStatus = mutation({
  args: {
    applicationId: v.id("jobApplications"),
    status: v.union(
      v.literal("submitted"),
      v.literal("under_review"),
      v.literal("interviewing"),
      v.literal("accepted"),
      v.literal("rejected")
    ),
    reviewedBy: v.optional(v.string()),
    reviewNotes: v.optional(v.string()),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    // TODO: Add authentication check for admin users
    // const identity = await ctx.auth.getUserIdentity();
    // if (!identity || !isAdmin(identity)) {
    //   throw new Error("Unauthorized: Admin access required");
    // }

    const application = await ctx.db.get(args.applicationId);
    if (!application) {
      throw new Error("Application not found");
    }

    await ctx.db.patch(args.applicationId, {
      status: args.status,
      lastUpdatedAt: Date.now(),
      reviewedBy: args.reviewedBy,
      reviewNotes: args.reviewNotes,
    });

    // TODO: Send status update email to applicant

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
 * Get a single application by ID
 */
export const getApplicationById = query({
  args: {
    applicationId: v.id("jobApplications"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.applicationId);
  },
});

/**
 * Get application by email (for applicants to check their status)
 */
export const getApplicationByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const applications = await ctx.db
      .query("jobApplications")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .collect();

    // Return limited info for privacy
    return applications.map((app) => ({
      _id: app._id,
      _creationTime: app._creationTime,
      fullName: app.fullName,
      email: app.email,
      position: app.position,
      status: app.status,
      submittedAt: app.submittedAt,
      lastUpdatedAt: app.lastUpdatedAt,
    }));
  },
});

/**
 * List all applications (Admin only - with pagination)
 */
export const listApplications = query({
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
    position: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // TODO: Add authentication check for admin users

    const limit = args.limit ?? 50;

    let applications;

    // Filter by status if provided
    if (args.status) {
      applications = await ctx.db
        .query("jobApplications")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(limit);
    } else {
      applications = await ctx.db
        .query("jobApplications")
        .withIndex("by_submitted_at")
        .order("desc")
        .take(limit);
    }

    // Filter by position if provided (client-side filtering)
    if (args.position) {
      applications = applications.filter(
        (app) => app.position === args.position
      );
    }

    // Return limited fields for list view
    return {
      applications: applications.map((app) => ({
        _id: app._id,
        _creationTime: app._creationTime,
        fullName: app.fullName,
        email: app.email,
        phone: app.phone,
        location: app.location,
        currentRole: app.currentRole,
        experience: app.experience,
        position: app.position,
        status: app.status,
        submittedAt: app.submittedAt,
        lastUpdatedAt: app.lastUpdatedAt,
      })),
      total: applications.length,
    };
  },
});

/**
 * Get application statistics (Admin dashboard)
 */
export const getApplicationStats = query({
  args: {},
  handler: async (ctx) => {
    // TODO: Add authentication check for admin users

    const allApplications = await ctx.db.query("jobApplications").collect();

    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentApplications = allApplications.filter(
      (app) => app.submittedAt > sevenDaysAgo
    ).length;

    // Count by status
    const byStatus = {
      submitted: 0,
      under_review: 0,
      interviewing: 0,
      accepted: 0,
      rejected: 0,
    };

    allApplications.forEach((app) => {
      byStatus[app.status]++;
    });

    // Count by position
    const positionCounts: Record<string, number> = {};
    allApplications.forEach((app) => {
      positionCounts[app.position] = (positionCounts[app.position] || 0) + 1;
    });

    const byPosition = Object.entries(positionCounts).map(
      ([position, count]) => ({
        position,
        count,
      })
    );

    return {
      total: allApplications.length,
      byStatus,
      byPosition,
      recentApplications,
    };
  },
});

/**
 * Get download URL for resume/cover letter
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