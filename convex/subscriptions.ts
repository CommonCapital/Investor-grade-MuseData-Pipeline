
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get or create user's report limit
export const getUserReportLimit = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    let limitRecord = await ctx.db
      .query("user_report_limits")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();
    
    if (!limitRecord) {
      // First time user - 1 free report
      return {
        totalLimit: 1,
        lastPaymentDate: Date.now(),
      };
    }
    
    return {
      totalLimit: limitRecord.totalLimit,
      lastPaymentDate: limitRecord.lastPaymentDate,
    };
  },
});

// Count completed reports for a user
export const getCompletedReportCount = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const completedJobs = await ctx.db
      .query("scrapingJobs")
      .withIndex("by_user_and_status", q => 
        q.eq("userId", userId).eq("status", "completed")
      )
      .collect();
    
    // Count jobs that have seoReport
    const reportsWithData = completedJobs.filter(job => job.seoReport);
    
    return reportsWithData.length;
  },
});

// Check if user can create report (ACCUMULATIVE)
export const canCreateReport = query({
  args: { 
    userId: v.string(),
    isPaidUser: v.boolean(),
  },
  handler: async (ctx, { userId, isPaidUser }) => {
    // Get completed report count
    const completedCount = await ctx.db
      .query("scrapingJobs")
      .withIndex("by_user_and_status", q => 
        q.eq("userId", userId).eq("status", "completed")
      )
      .collect()
      .then(jobs => jobs.filter(job => job.seoReport).length);
    
    // Get user's total limit (accumulative)
    let limitRecord = await ctx.db
      .query("user_report_limits")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();
    
    if (!limitRecord) {
      // New user - 1 free report
      return {
        canCreate: completedCount < 1,
        reportsUsed: completedCount,
        reportsLimit: 1,
        plan: isPaidUser ? "monthly" : "free",
      };
    }
    
    // Use accumulative limit
    return {
      canCreate: completedCount < limitRecord.totalLimit,
      reportsUsed: completedCount,
      reportsLimit: limitRecord.totalLimit,
      plan: isPaidUser ? "monthly" : "free",
    };
  },
});

// Add +30 reports to user's limit (called when user subscribes or renews)
export const addThirtyReports = mutation({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    let limitRecord = await ctx.db
      .query("user_report_limits")
      .withIndex("by_user", q => q.eq("userId", userId))
      .first();
    
    if (!limitRecord) {
      // First payment: 1 (free) + 30 = 31 total
      await ctx.db.insert("user_report_limits", {
        userId,
        totalLimit: 31,
        lastPaymentDate: Date.now(),
      });
      
      return { totalLimit: 31 };
    } else {
      // Subsequent payments: +30 to existing limit
      const newLimit = limitRecord.totalLimit + 30;
      
      await ctx.db.patch(limitRecord._id, {
        totalLimit: newLimit,
        lastPaymentDate: Date.now(),
      });
      
      return { totalLimit: newLimit };
    }
  },
});

