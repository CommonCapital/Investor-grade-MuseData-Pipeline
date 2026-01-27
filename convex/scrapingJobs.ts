import { v } from "convex/values";
import { internalAction, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { investorDashboardSchema } from "@/lib/seo-schema";
import { api, internal } from "./_generated/api";
import { ApiPath } from "./http";

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
    hasRetryNeeded: v.boolean(), // ✅ NEW: Flag if any shards need retry
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
    shards[shardIdx].retryReason = undefined; // ✅ NEW: Clear retry reason on success

    const completedGeminis = (job.completedGeminis || 0) + 1;
    
    // ✅ NEW: Check how many shards need retry
    const retryNeededCount = shards.filter(
      s => s.geminiStatus === "retry_needed"
    ).length;
    
    const hasRetryNeeded = retryNeededCount > 0;
    
    // ✅ NEW: All complete means all are either "completed" or gave up on retries
    const allGeminisComplete = shards.every(
      s => s.geminiStatus === "completed" || 
           (s.geminiStatus === "retry_needed" && (s.retryCount || 0) >= 3)
    );

    // ✅ Aggregate all completed Gemini data into legacy results field
    const allResults = shards
      .filter(s => s.geminiStatus === "completed" && s.geminiRawData)
      .map(s => s.geminiRawData);

    // ✅ NEW: Determine correct status
    let newStatus = job.status;
    if (allGeminisComplete) {
      newStatus = "scraped"; // All shards done (successfully or gave up)
    } else if (hasRetryNeeded) {
      newStatus = "retrying"; // Some shards need retry
    } else {
      newStatus = "scraping"; // Still waiting for shards
    }

    await ctx.db.patch(args.jobId, {
      shards,
      completedGeminis,
      status: newStatus,
      results: allResults,
    });

    return {
      allGeminisComplete,
      completedCount: completedGeminis,
      totalCount: job.totalShards || 0,
      hasRetryNeeded, // ✅ NEW: Return this so webhook knows to trigger retry
    };
  },
});
// In convex/scrapingJobs.ts

// ✅ 1. Create an internal query for getJobById
export const getJobByIdInternal = internalQuery({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});

// ✅ 2. Fix retryNeededShards - use internal query and proper typing
export const retryNeededShards = internalAction({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  handler: async (ctx, { jobId }): Promise<{ retriedCount: number; shardIndices?: number[] }> => {
    // ✅ Use internal query instead of api
    const job = await ctx.runQuery(internal.scrapingJobs.getJobByIdInternal, {
      jobId: jobId,
    });

    if (!job || !job.shards) {
      console.log("Job or shards not found for retry");
      return { retriedCount: 0 };
    }

    const shardsToRetry = job.shards.filter(
      (s: any) => s.geminiStatus === "retry_needed" && (s.retryCount || 0) < 3
    );

    if (shardsToRetry.length === 0) {
      console.log("No shards need retry");
      return { retriedCount: 0 };
    }

    console.log(`🔄 Retrying ${shardsToRetry.length} shards for job ${jobId}`);

    // ✅ 3. Move SHARD_CONFIGS to a type to avoid embedding huge configs
    // Define just the shape we need for retry
    type ShardConfig = {
      index: number;
      name: string;
      prompt: (target: string) => string;
    };

    // ✅ 4. Create minimal shard configs for retry (you already have the prompts above)
   const SHARD_CONFIGS = [
{
    index: 1,
    name: "financial_metrics",
    schemaFields: [
      "base_metrics (market_cap, stock_price, revenue, revenue_ttm, ebitda_ttm, total_debt, cash, etc.)",
      "valuation (dcf, trading_comps, precedent_transactions)",
      "scenarios (base, upside, downside with probability, assumptions, drivers, outputs)"
    ],
    prompt: (target: string) => `SEARCH THE WEB NOW AND EXTRACT FINANCIAL METRICS FOR: ${target}

YOUR SPECIFIC SCHEMA RESPONSIBILITY - Extract ONLY these fields:

**base_metrics**: Core financial data
- Market & Price: market_cap (number), stock_price (number), shares_outstanding (number)
- Balance Sheet: total_debt (number), cash (number), marketable_securities (number), current_assets (number), current_liabilities (number)
- Income Statement (Quarterly): revenue (number), revenue_prior (number), gross_profit (number), operating_income (number)
- Income Statement (TTM): revenue_ttm (number), ebitda_ttm (number), gross_profit_ttm (number), operating_income_ttm (number)
- EBITDA: ebitda_reported (number), ebitda_proxy (number), ebitda_availability (string: "reported" or "proxy" or "not_applicable")
- Cash Flow: free_cash_flow (number), net_burn (number)
- Use 0 for unavailable numeric values, never null

**valuation**: Three-method valuation framework
- valuation_range_low (number)
- valuation_range_high (number)
- valuation_range_midpoint (number)
- why_range_exists (string)
- dcf: {
    terminal_growth_rate: {
      value (number),
      formatted (string),
      source (string),
      source_reference: {
        url (string),
        document_type (string),
        excerpt (string),
        accessed_at (string ISO timestamp)
      }
    },
    wacc: {
      value (number),
      formatted (string),
      source (string),
      source_reference: {
        url (string),
        document_type (string),
        excerpt (string),
        accessed_at (string ISO timestamp)
      }
    },
    implied_value: {
      value (number),
      formatted (string),
      source (string),
      source_reference: {
        url (string),
        document_type (string),
        excerpt (string),
        accessed_at (string ISO timestamp)
      }
    },
    implied_value_per_share: {
      value (number),
      formatted (string),
      source (string),
      source_reference: {
        url (string),
        document_type (string),
        excerpt (string),
        accessed_at (string ISO timestamp)
      }
    },
    source (string),
    source_reference: {
      url (string),
      document_type (string),
      excerpt (string),
      accessed_at (string ISO timestamp)
    },
    methodology (string)
  }
- trading_comps: {
    implied_value_range_low: {
      value (number),
      formatted (string),
      source (string),
      source_reference: {
        url (string),
        document_type (string),
        excerpt (string),
        accessed_at (string ISO timestamp)
      }
    },
    implied_value_range_high: {
      value (number),
      formatted (string),
      source (string),
      source_reference: {
        url (string),
        document_type (string),
        excerpt (string),
        accessed_at (string ISO timestamp)
      }
    },
    peer_set (array of strings: ["TICKER1", "TICKER2", ...]),
    multiple_used (string),
    source (string),
    source_reference: {
      url (string),
      document_type (string),
      excerpt (string),
      accessed_at (string ISO timestamp)
    },
    confidence: {
      coverage (number 0-1),
      auditability (number 0-1),
      freshness_days (number)
    }
  }
- precedent_transactions: {
    implied_value_range_low: {
      value (number),
      formatted (string),
      source (string),
      source_reference: {
        url (string),
        document_type (string),
        excerpt (string),
        accessed_at (string ISO timestamp)
      }
    },
    implied_value_range_high: {
      value (number),
      formatted (string),
      source (string),
      source_reference: {
        url (string),
        document_type (string),
        excerpt (string),
        accessed_at (string ISO timestamp)
      }
    },
    transactions (array): [
      {
        name (string),
        date (string YYYY-MM),
        multiple (number)
      }
    ],
    source (string),
    source_reference: {
      url (string),
      document_type (string),
      excerpt (string),
      accessed_at (string ISO timestamp)
    },
    confidence: {
      coverage (number 0-1),
      auditability (number 0-1),
      freshness_days (number)
    }
  }

**scenarios**: Driver-based scenario modeling
## 🚨 CRITICAL REQUIREMENTS:
1. ALL THREE scenarios (base, upside, downside) MUST have IDENTICAL assumption/driver structures
2. Each scenario MUST have assumptions with these EXACT keys: "Revenue Growth" and "EBITDA Margin"
3. Each scenario MUST have drivers with these EXACT names: "Revenue Growth" and "EBITDA Margin"
4. Driver values MUST be parseable percentages (e.g., "11%", "14%", "5%")
5. ALL outputs MUST include formula and formula_inputs with complete source_reference objects
6. NEVER use qualitative values like "High", "Severe", "$5B+" - ONLY percentages
- base: {
    probability (number: 0.6 for 60%),
    assumptions (array of objects): [
      {
        key (string),
        value (string),
        source (string),
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      }
    ],
    drivers (array of objects): [
      {
        name (string),
        category (string),
        value (string),
        unit (string),
        source (string),
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      }
    ],
    outputs: {
      revenue: {
        value (number),
        formatted (string),
        source (string),
        period (string),
        formula (string),
        formula_inputs (array of objects): [
          {
            name (string),
            value (number),
            source (string),
            source_reference: {
              url (string),
              document_type (string),
              excerpt (string),
              accessed_at (string ISO timestamp)
            }
          }
        ],
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      },
      ebitda: {
        value (number),
        formatted (string),
        source (string),
        period (string),
        formula (string),
        formula_inputs (array of objects): [
          {
            name (string),
            value (number),
            source (string),
            source_reference: {
              url (string),
              document_type (string),
              excerpt (string),
              accessed_at (string ISO timestamp)
            }
          }
        ],
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      },
      valuation: {
        value (number),
        formatted (string),
        source (string),
        period (string),
        formula (string),
        formula_inputs (array of objects): [
          {
            name (string),
            value (number),
            source (string),
            source_reference: {
              url (string),
              document_type (string),
              excerpt (string),
              accessed_at (string ISO timestamp)
            }
          }
        ],
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      }
    }
  }
- upside: {
    probability (number: 0.25 for 25%),
    assumptions (array of objects): [
      {
        key (string),
        value (string),
        source (string),
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      }
    ],
    drivers (array of objects): [
      {
        name (string),
        category (string),
        value (string),
        unit (string),
        source (string),
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      }
    ],
    outputs: {
      revenue: {
        value (number),
        formatted (string),
        source (string),
        period (string),
        formula (string),
        formula_inputs (array of objects): [
          {
            name (string),
            value (number),
            source (string),
            source_reference: {
              url (string),
              document_type (string),
              excerpt (string),
              accessed_at (string ISO timestamp)
            }
          }
        ],
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      },
      ebitda: {
        value (number),
        formatted (string),
        source (string),
        period (string),
        formula (string),
        formula_inputs (array of objects): [
          {
            name (string),
            value (number),
            source (string),
            source_reference: {
              url (string),
              document_type (string),
              excerpt (string),
              accessed_at (string ISO timestamp)
            }
          }
        ],
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      },
      valuation: {
        value (number),
        formatted (string),
        source (string),
        period (string),
        formula (string),
        formula_inputs (array of objects): [
          {
            name (string),
            value (number),
            source (string),
            source_reference: {
              url (string),
              document_type (string),
              excerpt (string),
              accessed_at (string ISO timestamp)
            }
          }
        ],
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      }
    }
  }
- downside: {
    probability (number: 0.15 for 15%),
    assumptions (array of objects): [
      {
        key (string),
        value (string),
        source (string),
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      }
    ],
    drivers (array of objects): [
      {
        name (string),
        category (string),
        value (string),
        unit (string),
        source (string),
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      }
    ],
    outputs: {
      revenue: {
        value (number),
        formatted (string),
        source (string),
        period (string),
        formula (string),
        formula_inputs (array of objects): [
          {
            name (string),
            value (number),
            source (string),
            source_reference: {
              url (string),
              document_type (string),
              excerpt (string),
              accessed_at (string ISO timestamp)
            }
          }
        ],
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      },
      ebitda: {
        value (number),
        formatted (string),
        source (string),
        period (string),
        formula (string),
        formula_inputs (array of objects): [
          {
            name (string),
            value (number),
            source (string),
            source_reference: {
              url (string),
              document_type (string),
              excerpt (string),
              accessed_at (string ISO timestamp)
            }
          }
        ],
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      },
      valuation: {
        value (number),
        formatted (string),
        source (string),
        period (string),
        formula (string),
        formula_inputs (array of objects): [
          {
            name (string),
            value (number),
            source (string),
            source_reference: {
              url (string),
              document_type (string),
              excerpt (string),
              accessed_at (string ISO timestamp)
            }
          }
        ],
        source_reference: {
          url (string),
          document_type (string),
          excerpt (string),
          accessed_at (string ISO timestamp)
        }
      }
    }
  }

🚨 CRITICAL ANTI-NULL REQUIREMENTS:
1. ALL numeric fields must be numbers (use 0 if unavailable, NEVER null)
2. ALL string fields must be strings (use "Not Available" if missing, NEVER null)
3. ALL arrays must be arrays (use [] if empty, NEVER null)
4. EVERY value object must have complete source_reference with ALL 4 fields
5. scenarios MUST include formula and formula_inputs for ALL outputs in ALL three scenarios
6. assumptions and drivers MUST be arrays of objects, NOT arrays of strings
7. ebitda_availability must be exactly one of: "reported", "proxy", "not_applicable"
8. confidence objects must have all 3 numeric fields: coverage, auditability, freshness_days
9. ALL source_reference objects must have: url, document_type, excerpt, accessed_at
10. accessed_at must be ISO 8601 timestamp string (YYYY-MM-DDTHH:MM:SSZ)

SEARCH NOW for: financial data, valuation, analyst reports, earnings.

RESPOND WITH VALID JSON MATCHING THIS EXACT STRUCTURE:

{
  "base_metrics": {
    "market_cap": 12800000000,
    "stock_price": 127.45,
    "shares_outstanding": 100400000,
    "total_debt": 450000000,
    "cash": 1200000000,
    "marketable_securities": 180000000,
    "current_assets": 2100000000,
    "current_liabilities": 890000000,
    "revenue": 892000000,
    "revenue_prior": 817000000,
    "gross_profit": 446000000,
    "operating_income": 198000000,
    "revenue_ttm": 3260000000,
    "ebitda_ttm": 819000000,
    "gross_profit_ttm": 1630000000,
    "operating_income_ttm": 792000000,
    "ebitda_reported": 224000000,
    "ebitda_proxy": 0,
    "ebitda_availability": "reported",
    "free_cash_flow": 158000000,
    "net_burn": 0
  },
  "valuation": {
    "valuation_range_low": 13200000000,
    "valuation_range_high": 15800000000,
    "valuation_range_midpoint": 14500000000,
    "why_range_exists": "Multiple scenarios based on margin trajectory and terminal growth assumptions",
    "dcf": {
      "terminal_growth_rate": {
        "value": 2.5,
        "formatted": "2.5%",
        "source": "Management guidance",
        "source_reference": {
          "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=10-K",
          "document_type": "10-K MD&A",
          "excerpt": "Long-term growth expectation of 2-3%",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "wacc": {
        "value": 8.2,
        "formatted": "8.2%",
        "source": "Internal Model",
        "source_reference": {
          "url": "https://internal.model/dcf",
          "document_type": "Valuation Model",
          "excerpt": "WACC: Risk-free (4.2%) + Beta (1.1) × ERP (5.5%) + Size Premium",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "implied_value": {
        "value": 14500000000,
        "formatted": "$14.5B",
        "source": "DCF Model",
        "source_reference": {
          "url": "https://internal.model/dcf",
          "document_type": "Valuation Model",
          "excerpt": "Sum of discounted FCFs + Terminal Value",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "implied_value_per_share": {
        "value": 145.00,
        "formatted": "$145.00",
        "source": "DCF Model",
        "source_reference": {
          "url": "https://internal.model/dcf",
          "document_type": "Valuation Model",
          "excerpt": "Implied EV / Shares Outstanding",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "source": "Internal DCF Model",
      "source_reference": {
        "url": "https://internal.model/dcf",
        "document_type": "Valuation Model",
        "excerpt": "5-year DCF with terminal value",
        "accessed_at": "2026-01-08T10:00:00Z"
      },
      "methodology": "5-year explicit forecast with terminal value using Gordon Growth"
    },
    "trading_comps": {
      "implied_value_range_low": {
        "value": 13500000000,
        "formatted": "$13.5B",
        "source": "FactSet Comps",
        "source_reference": {
          "url": "https://factset.com/comps/industrials",
          "document_type": "Comparable Analysis",
          "excerpt": "Peer median EV/EBITDA: 12.0x",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "implied_value_range_high": {
        "value": 15200000000,
        "formatted": "$15.2B",
        "source": "FactSet Comps",
        "source_reference": {
          "url": "https://factset.com/comps/industrials",
          "document_type": "Comparable Analysis",
          "excerpt": "Peer 75th percentile EV/EBITDA: 13.5x",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "peer_set": ["HON", "EMR", "ROK", "PH"],
      "multiple_used": "EV/EBITDA",
      "source": "FactSet Comparable Companies",
      "source_reference": {
        "url": "https://factset.com/comps/industrials",
        "document_type": "Comparable Analysis",
        "excerpt": "Industrial sector peer group analysis",
        "accessed_at": "2026-01-08T10:00:00Z"
      },
      "confidence": {
        "coverage": 0.85,
        "auditability": 0.78,
        "freshness_days": 7
      }
    },
    "precedent_transactions": {
      "implied_value_range_low": {
        "value": 14000000000,
        "formatted": "$14.0B",
        "source": "Bloomberg M&A",
        "source_reference": {
          "url": "https://bloomberg.com/ma/industrials",
          "document_type": "M&A Database",
          "excerpt": "Sector transaction median: 11.5x LTM EBITDA",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "implied_value_range_high": {
        "value": 16500000000,
        "formatted": "$16.5B",
        "source": "Bloomberg M&A",
        "source_reference": {
          "url": "https://bloomberg.com/ma/industrials",
          "document_type": "M&A Database",
          "excerpt": "Premium transactions: 14.0x LTM EBITDA",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "transactions": [
        {
          "name": "Emerson / AspenTech",
          "date": "2022-05",
          "multiple": 13.2
        },
        {
          "name": "Rockwell / Plex",
          "date": "2021-06",
          "multiple": 12.8
        }
      ],
      "source": "Bloomberg M&A Database",
      "source_reference": {
        "url": "https://bloomberg.com/ma/industrials",
        "document_type": "M&A Database",
        "excerpt": "Industrial sector precedent transactions 2020-2024",
        "accessed_at": "2026-01-08T10:00:00Z"
      },
      "confidence": {
        "coverage": 0.70,
        "auditability": 0.65,
        "freshness_days": 30
      }
    }
  },
  "scenarios": {
    "base": {
      "probability": 0.6,
      "assumptions": [
        {
          "key": "Revenue Growth",
          "value": "9%",
          "source": "Management guidance + historical growth",
          "source_reference": {
            "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=8-K",
            "document_type": "8-K Filing",
            "excerpt": "Management expects 8-10% organic growth in FY25",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        {
          "key": "EBITDA Margin",
          "value": "25.5%",
          "source": "Historical margin + operating leverage",
          "source_reference": {
            "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=10-K",
            "document_type": "10-K MD&A",
            "excerpt": "EBITDA margin of 25.1% in FY24 with continued operating leverage expected",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      ],
      "drivers": [
        {
          "name": "Revenue Growth",
          "category": "growth",
          "value": "9%",
          "unit": "percent",
          "source": "fact",
          "source_reference": {
            "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=8-K",
            "document_type": "8-K Filing",
            "excerpt": "Management expects 8-10% organic growth",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        {
          "name": "EBITDA Margin",
          "category": "margin",
          "value": "25.5%",
          "unit": "percent",
          "source": "fact",
          "source_reference": {
            "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=10-K",
            "document_type": "10-K MD&A",
            "excerpt": "Historical margin trajectory supports 25-26% target",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      ],
      "outputs": {
        "revenue": {
          "value": 3553400000,
          "formatted": "$3.55B (TTM FY25E)",
          "source": "Model Projection",
          "period": "FY25E (Annual)",
          "formula": "Revenue TTM × (1 + Growth Rate)",
          "formula_inputs": [
            {
              "name": "Revenue TTM (Q1-Q4 FY24)",
              "value": 3260000000,
              "source": "SEC Filings - Sum of quarterly",
              "source_reference": {
                "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=10-K",
                "document_type": "10-K Filing",
                "excerpt": "Total Revenue FY24: $3.26B (Q1: $795M + Q2: $834M + Q3: $868M + Q4: $892M)",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "Growth Rate",
              "value": 0.09,
              "source": "Base Case - 9%",
              "source_reference": {
                "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=8-K",
                "document_type": "8-K Filing",
                "excerpt": "Management expects 8-10% organic growth in FY25",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://internal.model/scenarios",
            "document_type": "Financial Model",
            "excerpt": "Base case revenue projection",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        "ebitda": {
          "value": 906117000,
          "formatted": "$906M (TTM FY25E)",
          "source": "Model Projection",
          "period": "FY25E (Annual)",
          "formula": "Projected Revenue × EBITDA Margin",
          "formula_inputs": [
            {
              "name": "Projected Revenue FY25E",
              "value": 3553400000,
              "source": "Calculated from TTM + Growth",
              "source_reference": {
                "url": "https://internal.model/scenarios",
                "document_type": "Financial Model",
                "excerpt": "Projected revenue FY25E: $3.55B",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "EBITDA Margin",
              "value": 0.255,
              "source": "Base Case - 25.5%",
              "source_reference": {
                "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=10-K",
                "document_type": "10-K MD&A",
                "excerpt": "EBITDA margin expansion from 25.1% to target 25.5%",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://internal.model/scenarios",
            "document_type": "Financial Model",
            "excerpt": "Base case EBITDA projection",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        "valuation": {
          "value": 14500000000,
          "formatted": "$14.5B",
          "source": "DCF Model",
          "period": "Current",
          "formula": "Discounted Cash Flow with Terminal Value",
          "formula_inputs": [
            {
              "name": "FY25E EBITDA",
              "value": 906117000,
              "source": "Calculated",
              "source_reference": {
                "url": "https://internal.model/scenarios",
                "document_type": "Financial Model",
                "excerpt": "FY25E EBITDA: $906M",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "Exit Multiple",
              "value": 12.0,
              "source": "Trading Comps Median",
              "source_reference": {
                "url": "https://factset.com/comps/industrials",
                "document_type": "Comparable Analysis",
                "excerpt": "Peer median EV/EBITDA: 12.0x",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "WACC",
              "value": 0.082,
              "source": "Internal Model",
              "source_reference": {
                "url": "https://internal.model/dcf",
                "document_type": "Valuation Model",
                "excerpt": "WACC: 8.2%",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://internal.model/dcf",
            "document_type": "Valuation Model",
            "excerpt": "Base case DCF valuation",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      }
    },
    "upside": {
      "probability": 0.25,
      "assumptions": [
        {
          "key": "Revenue Growth",
          "value": "14%",
          "source": "Market share gains + new products",
          "source_reference": {
            "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=8-K",
            "document_type": "8-K Filing",
            "excerpt": "New product launch expected to add $300M+ revenue in FY25",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        {
          "key": "EBITDA Margin",
          "value": "27%",
          "source": "Operating leverage + competitor exit",
          "source_reference": {
            "url": "https://bernstein.com/research/industrials/competitive-analysis",
            "document_type": "Analyst Report",
            "excerpt": "Competitor exit creates pricing power; margin upside to 27%+",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      ],
      "drivers": [
        {
          "name": "Revenue Growth",
          "category": "growth",
          "value": "14%",
          "unit": "percent",
          "source": "fact",
          "source_reference": {
            "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=8-K",
            "document_type": "8-K Filing",
            "excerpt": "New product launch + market share gains",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        {
          "name": "EBITDA Margin",
          "category": "margin",
          "value": "27%",
          "unit": "percent",
          "source": "judgment",
          "source_reference": {
            "url": "https://bernstein.com/research/industrials/competitive-analysis",
            "document_type": "Analyst Report",
            "excerpt": "Competitor exit creates margin upside",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      ],
      "outputs": {
        "revenue": {
          "value": 3716400000,
          "formatted": "$3.72B (TTM FY25E)",
          "source": "Model Projection",
          "period": "FY25E (Annual)",
          "formula": "Revenue TTM × (1 + Growth Rate)",
          "formula_inputs": [
            {
              "name": "Revenue TTM (Q1-Q4 FY24)",
              "value": 3260000000,
              "source": "SEC Filings - Sum of quarterly",
              "source_reference": {
                "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=10-K",
                "document_type": "10-K Filing",
                "excerpt": "Total Revenue FY24: $3.26B",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "Growth Rate",
              "value": 0.14,
              "source": "Upside - 14%",
              "source_reference": {
                "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=8-K",
                "document_type": "8-K Filing",
                "excerpt": "New product launch + market share gains to drive 14% growth",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://internal.model/scenarios",
            "document_type": "Financial Model",
            "excerpt": "Upside revenue projection",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        "ebitda": {
          "value": 1003428000,
          "formatted": "$1.00B (TTM FY25E)",
          "source": "Model Projection",
          "period": "FY25E (Annual)",
          "formula": "Projected Revenue × EBITDA Margin",
          "formula_inputs": [
            {
              "name": "Projected Revenue FY25E",
              "value": 3716400000,
              "source": "Calculated from TTM + Growth",
              "source_reference": {
                "url": "https://internal.model/scenarios",
                "document_type": "Financial Model",
                "excerpt": "Upside revenue FY25E: $3.72B",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "EBITDA Margin",
              "value": 0.27,
              "source": "Upside - 27%",
              "source_reference": {
                "url": "https://bernstein.com/research/industrials/competitive-analysis",
                "document_type": "Analyst Report",
                "excerpt": "Competitor exit + operating leverage supports 27% margin",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://internal.model/scenarios",
            "document_type": "Financial Model",
            "excerpt": "Upside EBITDA projection",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        "valuation": {
          "value": 17800000000,
          "formatted": "$17.8B",
          "source": "DCF Model",
          "period": "Current",
          "formula": "Discounted Cash Flow with Terminal Value",
          "formula_inputs": [
            {
              "name": "FY25E EBITDA",
              "value": 1003428000,
              "source": "Calculated",
              "source_reference": {
                "url": "https://internal.model/scenarios",
                "document_type": "Financial Model",
                "excerpt": "Upside FY25E EBITDA: $1.00B",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "Exit Multiple",
              "value": 13.5,
              "source": "Trading Comps 75th Percentile",
              "source_reference": {
                "url": "https://factset.com/comps/industrials",
                "document_type": "Comparable Analysis",
                "excerpt": "Peer 75th percentile EV/EBITDA: 13.5x",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "WACC",
              "value": 0.075,
              "source": "Optimistic Discount Rate",
              "source_reference": {
                "url": "https://internal.model/dcf",
                "document_type": "Valuation Model",
                "excerpt": "Lower risk environment supports 7.5% WACC",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://internal.model/dcf",
            "document_type": "Valuation Model",
            "excerpt": "Upside DCF valuation",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      }
    },
    "downside": {
      "probability": 0.15,
      "assumptions": [
        {
          "key": "Revenue Growth",
          "value": "5%",
          "source": "Conservative: macro headwinds",
          "source_reference": {
            "url": "https://bernstein.com/research/industrials",
            "document_type": "Analyst Report",
            "excerpt": "Industrial sector growth may slow to 4-6% in recessionary scenario",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        {
          "key": "EBITDA Margin",
          "value": "22%",
          "source": "Margin compression from input costs",
          "source_reference": {
            "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=10-Q",
            "document_type": "10-Q Filing",
            "excerpt": "Raw material costs increased 12% YoY",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      ],
      "drivers": [
        {
          "name": "Revenue Growth",
          "category": "growth",
          "value": "5%",
          "unit": "percent",
          "source": "judgment",
          "source_reference": {
            "url": "https://bernstein.com/research/industrials",
            "document_type": "Analyst Report",
            "excerpt": "Recessionary scenario: 4-6% growth",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        {
          "name": "EBITDA Margin",
          "category": "margin",
          "value": "22%",
          "unit": "percent",
          "source": "judgment",
          "source_reference": {
            "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=10-Q",
            "document_type": "10-Q Filing",
            "excerpt": "Input cost inflation pressure on margins",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      ],
      "outputs": {
        "revenue": {
          "value": 3423000000,
          "formatted": "$3.42B (TTM FY25E)",
          "source": "Model Projection",
          "period": "FY25E (Annual)",
          "formula": "Revenue TTM × (1 + Growth Rate)",
          "formula_inputs": [
            {
              "name": "Revenue TTM (Q1-Q4 FY24)",
              "value": 3260000000,
              "source": "SEC Filings - Sum of quarterly",
              "source_reference": {
                "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=10-K",
                "document_type": "10-K Filing",
                "excerpt": "Total Revenue FY24: $3.26B",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "Growth Rate",
              "value": 0.05,
              "source": "Downside - 5%",
              "source_reference": {
                "url": "https://bernstein.com/research/industrials",
                "document_type": "Analyst Report",
                "excerpt": "Recessionary scenario: 4-6% growth",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://internal.model/scenarios",
            "document_type": "Financial Model",
            "excerpt": "Downside revenue projection",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        "ebitda": {
          "value": 753060000,
          "formatted": "$753M (TTM FY25E)",
          "source": "Model Projection",
          "period": "FY25E (Annual)",
          "formula": "Projected Revenue × EBITDA Margin",
          "formula_inputs": [
            {
              "name": "Projected Revenue FY25E",
              "value": 3423000000,
              "source": "Calculated from TTM + Growth",
              "source_reference": {
                "url": "https://internal.model/scenarios",
                "document_type": "Financial Model",
                "excerpt": "Downside revenue FY25E: $3.42B",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "EBITDA Margin",
              "value": 0.22,
              "source": "Downside - 22%",
              "source_reference": {
                "url": "https://sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=XXX&type=10-Q",
                "document_type": "10-Q Filing",
                "excerpt": "Margin pressure from 12% input cost inflation",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://internal.model/scenarios",
            "document_type": "Financial Model",
            "excerpt": "Downside EBITDA projection",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        "valuation": {
          "value": 11200000000,
          "formatted": "$11.2B",
          "source": "DCF Model",
          "period": "Current",
          "formula": "Discounted Cash Flow with Terminal Value",
          "formula_inputs": [
            {
              "name": "FY25E EBITDA",
              "value": 753060000,
              "source": "Calculated",
              "source_reference": {
                "url": "https://internal.model/scenarios",
                "document_type": "Financial Model",
                "excerpt": "Downside FY25E EBITDA: $753M",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "Exit Multiple",
              "value": 10.5,
              "source": "Trading Comps 25th Percentile",
              "source_reference": {
                "url": "https://factset.com/comps/industrials",
                "document_type": "Comparable Analysis",
                "excerpt": "Peer 25th percentile EV/EBITDA: 10.5x",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "WACC",
              "value": 0.09,
              "source": "Stressed Discount Rate",
              "source_reference": {
                "url": "https://internal.model/dcf",
                "document_type": "Valuation Model",
                "excerpt": "Higher risk environment supports 9.0% WACC",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://internal.model/dcf",
            "document_type": "Valuation Model",
            "excerpt": "Downside DCF valuation",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      }
    }
  }
}`
  },




  {
    index: 2,
    name: "risk_analysis",
    schemaFields: [
      "risks (ALL 6 categories: regulatory, market, operational, cybersecurity, financial, strategic)",
      "kill_switch (conditions[])"
    ],
    prompt: (target: string) => `SEARCH THE WEB NOW AND EXTRACT ALL RISKS FOR: ${target}

YOUR SPECIFIC SCHEMA RESPONSIBILITY - Extract ONLY these fields:

**risks** - MUST contain ALL 6 categories (use empty array [] if no risks found):
- regulatory[]: {id, title, description, severity, probability, trigger, mitigation, status, source_reference}
- market[]: {id, title, description, severity, probability, trigger, mitigation, status, source_reference}
- operational[]: {id, title, description, severity, probability, trigger, mitigation, status, source_reference}
- cybersecurity[]: {id, title, description, severity, probability, trigger, mitigation, status, source_reference}
- financial[]: {id, title, description, severity, probability, trigger, mitigation, status, source_reference}
- strategic[]: {id, title, description, severity, probability, trigger, mitigation, status, source_reference}

**kill_switch**:
- conditions[]: Array of deal-breaker scenarios that would require immediate exit

🚨 CRITICAL ANTI-NULL REQUIREMENTS:
1. ALL 6 risk categories MUST be present in output (empty arrays [] are acceptable if no risks found)
2. NEVER return null for the risks object itself
3. Each risk item must have ALL fields populated:
   - If data unavailable, use "Not Available" for strings
   - Use 0 for probability if unknown
   - Use "Unknown" for severity if not specified
   - status must be one of: "Active", "Monitoring", "Resolved"
4. ALWAYS include source_reference for each risk
5. kill_switch.conditions must be an array (empty [] if no conditions)

SEARCH NOW for: risk factors, threats, challenges, regulatory issues.

EXPECTED JSON OUTPUT FORMAT:
{
  "risks": {
    "regulatory": [
      {
        "id": "REG-001",
        "title": "FDA Approval Risk",
        "description": "Pending FDA approval for key product could be delayed or denied",
        "severity": "High",
        "probability": 0.25,
        "trigger": "FDA review outcome",
        "mitigation": "Diversifying product pipeline and geographic markets",
        "status": "Active",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K Filing",
          "excerpt": "FDA approval timeline presents material risk",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      }
    ],
    "market": [
      {
        "id": "MKT-001",
        "title": "Competitive Pressure",
        "description": "New entrants with lower pricing threatening market share",
        "severity": "Medium",
        "probability": 0.45,
        "trigger": "Competitor product launches",
        "mitigation": "Product differentiation and customer lock-in",
        "status": "Monitoring",
        "source_reference": {
          "url": "https://example.com/earnings",
          "document_type": "Earnings Call",
          "excerpt": "Management discussed competitive dynamics",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      }
    ],
    "operational": [
      {
        "id": "OPS-001",
        "title": "Supply Chain Disruption",
        "description": "Single-source supplier for critical component",
        "severity": "High",
        "probability": 0.20,
        "trigger": "Supplier capacity constraints",
        "mitigation": "Qualifying alternative suppliers",
        "status": "Active",
        "source_reference": {
          "url": "https://example.com/10q",
          "document_type": "10-Q Filing",
          "excerpt": "Supply chain concentration risk disclosed",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      }
    ],
    "cybersecurity": [
      {
        "id": "CYB-001",
        "title": "Data Breach Risk",
        "description": "Customer data vulnerability in legacy systems",
        "severity": "Medium",
        "probability": 0.15,
        "trigger": "Security incident or audit finding",
        "mitigation": "System modernization program underway",
        "status": "Monitoring",
        "source_reference": {
          "url": "https://example.com/proxy",
          "document_type": "Proxy Statement",
          "excerpt": "Cybersecurity oversight detailed",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      }
    ],
    "financial": [
      {
        "id": "FIN-001",
        "title": "Covenant Breach Risk",
        "description": "Debt covenant requires maintaining 3.0x leverage ratio",
        "severity": "High",
        "probability": 0.30,
        "trigger": "EBITDA decline below threshold",
        "mitigation": "Working with lenders on waiver if needed",
        "status": "Active",
        "source_reference": {
          "url": "https://example.com/creditagreement",
          "document_type": "Credit Agreement",
          "excerpt": "Financial covenants require 3.0x max leverage",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      }
    ],
    "strategic": [
      {
        "id": "STR-001",
        "title": "M&A Integration Risk",
        "description": "Recent acquisition may not achieve synergy targets",
        "severity": "Medium",
        "probability": 0.40,
        "trigger": "Integration milestones missed",
        "mitigation": "Dedicated integration team and tracking",
        "status": "Active",
        "source_reference": {
          "url": "https://example.com/8k",
          "document_type": "8-K Filing",
          "excerpt": "Acquisition integration risks disclosed",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      }
    ]
  },
  "kill_switch": {
    "conditions": [
      "FDA denial of key product approval",
      "Debt covenant breach without waiver",
      "Loss of top 3 customers (>40% revenue)",
      "SEC investigation or accounting restatement",
      "CEO/CFO unexpected departure"
    ]
  }
}`
  },

  {
    index: 3,
    name: "strategic_insights",
    schemaFields: [
      "executive_summary (headline, key_facts[], implications[], key_risks[], thesis_status)",
      "hypotheses[] (with falsification_criteria)",
      "ai_insights[] (same structure as hypotheses)"
    ],
    prompt: (target: string) => `SEARCH THE WEB NOW AND EXTRACT STRATEGIC INSIGHTS FOR: ${target}

YOUR SPECIFIC SCHEMA RESPONSIBILITY - Extract ONLY these fields:

**executive_summary**:
- headline: One-sentence current status
- key_facts[]: 3-5 most important factual points
- implications[]: What these facts mean for investors
- key_risks[]: Top 3 risk summaries
- thesis_status: "intact" | "challenged" | "broken"

**hypotheses[]**: Investment hypotheses with falsification
- {id, type, title, summary, details, assumptions[], falsification_criteria[], confidence_band: "Low|Medium|High", source, generated_at, horizon_relevance[], impact_score, action_required}

**ai_insights[]**: AI-generated strategic insights (same structure as hypotheses)

🚨 CRITICAL ANTI-NULL REQUIREMENTS:
1. executive_summary must have ALL fields populated (use empty arrays [] for lists if needed)
2. hypotheses and ai_insights must be arrays (use empty [] if none found)
3. Each hypothesis must have ALL required fields:
   - id: generate unique ID like "HYP-001"
   - confidence_band: must be "Low", "Medium", or "High" (never null)
   - horizon_relevance: array of time periods (use [] if unknown)
   - action_required: must be true or false (never null)
4. thesis_status must be one of: "intact", "challenged", "broken"
5. NEVER return null for any field

SEARCH NOW for: strategy, competitive position, market opportunity, investment thesis.

EXPECTED JSON OUTPUT FORMAT:
{
  "executive_summary": {
    "headline": "Company maintains strong market position despite macro headwinds",
    "key_facts": [
      "Revenue grew 18% YoY to $32B in Q4",
      "Operating margin expanded 200bps to 37.5%",
      "Cloud segment now 45% of total revenue, up from 38%",
      "Announced $25B share buyback program",
      "CEO confirmed FY25 guidance of $150B revenue"
    ],
    "implications": [
      "Margin expansion suggests operating leverage is kicking in",
      "Cloud growth acceleration validates strategic pivot",
      "Buyback indicates management confidence in valuation",
      "Guidance reaffirmation reduces execution risk"
    ],
    "key_risks": [
      "Regulatory scrutiny in EU markets intensifying",
      "Top customer represents 12% of revenue with contract renewal in 6 months",
      "Competitive pricing pressure in core business accelerating"
    ],
    "thesis_status": "intact"
  },
  "hypotheses": [
    {
      "id": "HYP-001",
      "type": "Growth",
      "title": "Cloud Migration Drives Sustainable 20%+ Growth",
      "summary": "Enterprise cloud adoption will drive 20%+ annual growth for next 3 years",
      "details": "Company's cloud platform has 95% customer retention and is taking share from legacy competitors. TAM expanding 25% annually.",
      "assumptions": [
        "Enterprise IT budgets grow 8-10% annually",
        "Cloud migration continues at current pace",
        "No major competitive disruption",
        "Pricing power maintained"
      ],
      "falsification_criteria": [
        "Cloud revenue growth decelerates below 15% for 2 consecutive quarters",
        "Net retention rate falls below 90%",
        "Major competitor launches superior product",
        "Enterprise IT spending contracts"
      ],
      "confidence_band": "High",
      "source": "Combination of 10-K, earnings calls, industry reports",
      "generated_at": "2026-01-07T10:30:00Z",
      "horizon_relevance": ["1Y", "5Y"],
      "impact_score": 9,
      "action_required": false
    },
    {
      "id": "HYP-002",
      "type": "Margin",
      "title": "Operating Leverage Drives Margin Expansion to 42%",
      "summary": "Fixed cost base enables 400-500bps of margin expansion over 2 years",
      "details": "With revenue scale achieved, incremental margins should exceed 50%.",
      "assumptions": [
        "Revenue growth continues",
        "No major increase in R&D or S&M spend",
        "Product mix remains favorable"
      ],
      "falsification_criteria": [
        "Margins contract for 2 consecutive quarters",
        "Competitive pressure forces pricing cuts >10%",
        "Company announces major cost investment program"
      ],
      "confidence_band": "Medium",
      "source": "Financial model based on 10-K data",
      "generated_at": "2026-01-07T10:30:00Z",
      "horizon_relevance": ["1Y", "5Y"],
      "impact_score": 7,
      "action_required": false
    }
  ],
  "ai_insights": [
    {
      "id": "AI-001",
      "type": "Risk",
      "title": "Customer Concentration Risk Underappreciated",
      "summary": "Top 10 customers represent 35% of revenue, higher than disclosed",
      "details": "Analysis of segment data and customer references suggests higher concentration than reported metrics indicate. This creates downside risk if any major customer churns.",
      "assumptions": [
        "Current customer retention rates continue",
        "No major customer M&A that changes buying patterns"
      ],
      "falsification_criteria": [
        "Company discloses detailed customer concentration metrics showing <25%",
        "Major customer signs long-term contract extension",
        "Customer base diversifies materially"
      ],
      "confidence_band": "Medium",
      "source": "AI analysis of financial disclosures",
      "generated_at": "2026-01-07T10:30:00Z",
      "horizon_relevance": ["1Y"],
      "impact_score": 6,
      "action_required": true
    }
  ]
}`
  },

  {
    index: 4,
    name: "operational_metrics",
    schemaFields: [
      "base_metrics (operational: headcount, arr, cac, ltv, customer_count, churn, etc.)",
      "unit_economics (cac, ltv, ltv_cac_ratio, payback_period_months, investor_context)",
      "segments[] (name, revenue, growth, margin)"
    ],
    prompt: (target: string) => `SEARCH THE WEB NOW AND EXTRACT OPERATIONAL METRICS FOR: ${target}

YOUR SPECIFIC SCHEMA RESPONSIBILITY - Extract ONLY these fields:

**base_metrics (operational fields only)**:
- Operational: headcount, rd_spend, sm_spend
- SaaS/Subscription: arr, arr_prior, new_arr, expansion_arr, contraction_arr, churned_arr, monthly_churn_percent, arpa, gross_margin_percent, average_customer_lifespan_months
- Customers: customer_count, top_customer_revenue_percent, top_3_customer_revenue_percent, top_10_customer_revenue_percent
- Suppliers: top_supplier_spend_percent, top_5_supplier_spend_percent

**unit_economics**:
- cac: {value, formatted, source, source_reference}
- ltv: {value, formatted, source, source_reference}
- ltv_cac_ratio: {value, formatted, source, source_reference}
- payback_period_months: {value, formatted, source, source_reference}
- investor_context: {ltv_cac_interpretation, benchmark_comparison, trend_analysis, risk_factors[], action_implications}

**segments[]**:
- {name, revenue: {value, formatted, source, source_reference}, growth: {...}, margin: {...}}

🚨 CRITICAL ANTI-NULL REQUIREMENTS:
1. base_metrics must return numeric values (use 0 if unavailable)
2. unit_economics must have ALL sub-fields populated:
   - cac, ltv, ltv_cac_ratio, payback_period_months all required
   - Use 0 for value if unavailable, note in source_reference
   - investor_context must have ALL sub-fields (use "Not Available" or [] as needed)
3. segments must be an array (use [] if no segment data)
4. Each segment must have name, revenue, growth, margin (all required)
5. ALWAYS include source_reference for ALL metrics
6. NEVER return null for any field

SEARCH NOW for: customer metrics, ARR, churn, CAC, LTV, unit economics, segments.

EXPECTED JSON OUTPUT FORMAT:
{
  "base_metrics": {
    "headcount": 25000,
    "rd_spend": 8500000000,
    "sm_spend": 12000000000,
    "arr": 85000000000,
    "arr_prior": 72000000000,
    "new_arr": 18000000000,
    "expansion_arr": 8000000000,
    "contraction_arr": 2000000000,
    "churned_arr": 1000000000,
    "monthly_churn_percent": 1.2,
    "arpa": 125000,
    "gross_margin_percent": 78.5,
    "average_customer_lifespan_months": 48,
    "customer_count": 680000,
    "top_customer_revenue_percent": 12.0,
    "top_3_customer_revenue_percent": 28.0,
    "top_10_customer_revenue_percent": 45.0,
    "top_supplier_spend_percent": 8.5,
    "top_5_supplier_spend_percent": 22.0
  },
  "unit_economics": {
    "cac": {
      "value": 18000,
      "formatted": "$18,000",
      "source": "10-K Filing",
      "source_reference": {
        "url": "https://example.com/10k",
        "document_type": "10-K",
        "excerpt": "S&M expense divided by new customers added",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "ltv": {
      "value": 90000,
      "formatted": "$90,000",
      "source": "Investor Presentation",
      "source_reference": {
        "url": "https://example.com/investor",
        "document_type": "Investor Presentation",
        "excerpt": "Average customer lifetime value disclosed as $90K",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "ltv_cac_ratio": {
      "value": 5.0,
      "formatted": "5.0x",
      "source": "Calculated",
      "source_reference": {
        "url": "https://example.com/10k",
        "document_type": "Calculated",
        "excerpt": "LTV/CAC = $90K / $18K = 5.0x",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "payback_period_months": {
      "value": 14,
      "formatted": "14 months",
      "source": "Earnings Call",
      "source_reference": {
        "url": "https://example.com/earnings",
        "document_type": "Earnings Call",
        "excerpt": "CAC payback period of 14 months",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "investor_context": {
      "ltv_cac_interpretation": "5.0x LTV/CAC ratio indicates healthy unit economics with strong return on customer acquisition spend",
      "benchmark_comparison": "Above industry median of 3.5x for B2B SaaS companies; in line with best-in-class peers",
      "trend_analysis": "Ratio improved from 4.2x last year due to ARPA expansion and churn reduction",
      "risk_factors": [
        "Increasing competition could pressure CAC higher",
        "Macro slowdown could reduce LTV if customers downgrade or churn",
        "Payback period lengthening from 12 to 14 months requires monitoring"
      ],
      "action_implications": "Continue monitoring CAC trends and customer cohort retention; healthy metrics support growth investment"
    }
  },
  "segments": [
    {
      "name": "Cloud Infrastructure",
      "revenue": {
        "value": 45000000000,
        "formatted": "$45B",
        "source": "10-K Filing",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "Cloud Infrastructure segment revenue was $45B",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      },
      "growth": {
        "value": 28.5,
        "formatted": "28.5%",
        "source": "10-K Filing",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "Cloud grew 28.5% year-over-year",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      },
      "margin": {
        "value": 32.0,
        "formatted": "32.0%",
        "source": "10-K Filing",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "Cloud segment operating margin of 32%",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      }
    },
    {
      "name": "Software Applications",
      "revenue": {
        "value": 58000000000,
        "formatted": "$58B",
        "source": "10-K Filing",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "Software segment revenue was $58B",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      },
      "growth": {
        "value": 12.5,
        "formatted": "12.5%",
        "source": "10-K Filing",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "Software grew 12.5% year-over-year",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      },
      "margin": {
        "value": 45.0,
        "formatted": "45.0%",
        "source": "10-K Filing",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "Software segment operating margin of 45%",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      }
    },
    {
      "name": "Hardware",
      "revenue": {
        "value": 25000000000,
        "formatted": "$25B",
        "source": "10-K Filing",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "Hardware segment revenue was $25B",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      },
      "growth": {
        "value": 8.0,
        "formatted": "8.0%",
        "source": "10-K Filing",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "Hardware grew 8.0% year-over-year",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      },
      "margin": {
        "value": 18.0,
        "formatted": "18.0%",
        "source": "10-K Filing",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "Hardware segment operating margin of 18%",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      }
    }
  ]
}`
  },

  {
    index: 5,
    name: "time_series",
    schemaFields: [
      "time_series (stock_price, revenue, ebitda, volume)",
      "All with horizons: 1D, 1W, 1M, 1Y, 5Y, 10Y",
      "Each horizon: quarters{Q1-Q4}, high, low, average, volatility, change_percent"
    ],
    prompt: (target: string) => `SEARCH THE WEB NOW AND EXTRACT TIME-SERIES DATA FOR: ${target}

YOUR SPECIFIC SCHEMA RESPONSIBILITY - Extract ONLY these fields:

**time_series**: Historical data for charting
- stock_price: {horizons{1D, 1W, 1M, 1Y, 5Y, 10Y}}
- revenue: {horizons{1D, 1W, 1M, 1Y, 5Y, 10Y}}
- ebitda: {horizons{1D, 1W, 1M, 1Y, 5Y, 10Y}}
- volume: {horizons{1D, 1W, 1M, 1Y, 5Y, 10Y}}

Each horizon contains:
- quarters: {Q1, Q2, Q3, Q4} (numbers)
- high: highest value in period
- low: lowest value in period
- average: average value
- volatility: measure of variation
- change_percent: % change over period

Plus for each metric:
- availability: status string
- confidence: 0-1 score
- data_quality: {coverage, auditability, freshness_days}
- source: data source
- decision_context: {confidence_level, sufficiency_status, knowns[], unknowns[]}

🚨 CRITICAL ANTI-NULL REQUIREMENTS:
1. ALL 4 metrics (stock_price, revenue, ebitda, volume) must be present
2. Each metric must have ALL 6 horizons (1D, 1W, 1M, 1Y, 5Y, 10Y)
3. Each horizon must have ALL fields (quarters, high, low, average, volatility, change_percent)
4. Use 0 for numeric values if data unavailable
5. quarters object must have Q1, Q2, Q3, Q4 (use 0 if unavailable)
6. availability must be a string (use "Not Available" if unknown)
7. confidence must be a number 0-1 (use 0 if unknown)
8. decision_context must have ALL sub-fields (use [] for arrays, "Unknown" for strings)
9. NEVER return null for any field

SEARCH NOW for: historical data, quarterly trends, stock charts, time series.

EXPECTED JSON OUTPUT FORMAT:
{
  "time_series": {
    "stock_price": {
      "horizons": {
        "1D": {
          "quarters": {
            "Q1": 0,
            "Q2": 0,
            "Q3": 0,
            "Q4": 0
          },
          "high": 176.25,
          "low": 174.80,
          "average": 175.50,
          "volatility": 0.8,
          "change_percent": 0.5
        },
        "1W": {
          "quarters": {
            "Q1": 0,
            "Q2": 0,
            "Q3": 0,
            "Q4": 0
          },
          "high": 178.90,
          "low": 172.30,
          "average": 175.60,
          "volatility": 3.7,
          "change_percent": 2.1
        },
        "1M": {
          "quarters": {
            "Q1": 0,
            "Q2": 0,
            "Q3": 0,
            "Q4": 0
          },
          "high": 182.50,
          "low": 168.20,
          "average": 175.40,
          "volatility": 8.2,
          "change_percent": 4.3
        },
        "1Y": {
          "quarters": {
            "Q1": 165.30,
            "Q2": 172.80,
            "Q3": 178.50,
            "Q4": 175.50
          },
          "high": 185.90,
          "low": 148.20,
          "average": 167.50,
          "volatility": 22.5,
          "change_percent": 18.5
        },
        "5Y": {
          "quarters": {
            "Q1": 145.20,
            "Q2": 158.60,
            "Q3": 162.40,
            "Q4": 175.50
          },
          "high": 185.90,
          "low": 98.50,
          "average": 142.30,
          "volatility": 61.2,
          "change_percent": 78.0
        },
        "10Y": {
          "quarters": {
            "Q1": 98.50,
            "Q2": 112.30,
            "Q3": 135.80,
            "Q4": 175.50
          },
          "high": 185.90,
          "low": 62.30,
          "average": 119.40,
          "volatility": 103.6,
          "change_percent": 181.5
        }
      },
      "availability": "Available",
      "confidence": 0.95,
      "data_quality": {
        "coverage": 1.0,
        "auditability": 1.0,
        "freshness_days": 0
      },
      "source": "Market Data Provider",
      "decision_context": {
        "confidence_level": "High",
        "sufficiency_status": "Sufficient",
        "knowns": [
          "Real-time pricing data",
          "Historical daily closes",
          "Adjusted for splits and dividends"
        ],
        "unknowns": []
      }
    },
    "revenue": {
      "horizons": {
        "1D": {
          "quarters": {
            "Q1": 0,
            "Q2": 0,
            "Q3": 0,
            "Q4": 0
          },
          "high": 0,
          "low": 0,
          "average": 0,
          "volatility": 0,
          "change_percent": 0
        },
        "1W": {
          "quarters": {
            "Q1": 0,
            "Q2": 0,
            "Q3": 0,
            "Q4": 0
          },
          "high": 0,
          "low": 0,
          "average": 0,
          "volatility": 0,
          "change_percent": 0
        },
        "1M": {
          "quarters": {
            "Q1": 0,
            "Q2": 0,
            "Q3": 0,
            "Q4": 0
          },
          "high": 0,
          "low": 0,
          "average": 0,
          "volatility": 0,
          "change_percent": 0
        },
        "1Y": {
          "quarters": {
            "Q1": 29500000000,
            "Q2": 30800000000,
            "Q3": 31200000000,
            "Q4": 32000000000
          },
          "high": 32000000000,
          "low": 29500000000,
          "average": 30875000000,
          "volatility": 8.5,
          "change_percent": 8.5
        },
        "5Y": {
          "quarters": {
            "Q1": 18500000000,
            "Q2": 22300000000,
            "Q3": 27800000000,
            "Q4": 32000000000
          },
          "high": 32000000000,
          "low": 18500000000,
          "average": 25150000000,
          "volatility": 53.8,
          "change_percent": 73.0
        },
        "10Y": {
          "quarters": {
            "Q1": 12200000000,
            "Q2": 16800000000,
            "Q3": 24500000000,
            "Q4": 32000000000
          },
          "high": 32000000000,
          "low": 12200000000,
          "average": 21375000000,
          "volatility": 92.5,
          "change_percent": 162.3
        }
      },
      "availability": "Available",
      "confidence": 0.90,
      "data_quality": {
        "coverage": 0.95,
        "auditability": 1.0,
        "freshness_days": 45
      },
      "source": "SEC Filings",
      "decision_context": {
        "confidence_level": "High",
        "sufficiency_status": "Sufficient",
        "knowns": [
          "Quarterly revenue from 10-Q and 10-K filings",
          "Data adjusted for accounting changes"
        ],
        "unknowns": [
          "Intra-quarter revenue trends",
          "Real-time revenue data"
        ]
      }
    },
    "ebitda": {
      "horizons": {
        "1D": {
          "quarters": {
            "Q1": 0,
            "Q2": 0,
            "Q3": 0,
            "Q4": 0
          },
          "high": 0,
          "low": 0,
          "average": 0,
          "volatility": 0,
          "change_percent": 0
        },
        "1W": {
          "quarters": {
            "Q1": 0,
            "Q2": 0,
            "Q3": 0,
            "Q4": 0
          },
          "high": 0,
          "low": 0,
          "average": 0,
          "volatility": 0,
          "change_percent": 0
        },
        "1M": {
          "quarters": {
            "Q1": 0,
            "Q2": 0,
            "Q3": 0,
            "Q4": 0
          },
          "high": 0,
          "low": 0,
          "average": 0,
          "volatility": 0,
          "change_percent": 0
        },
        "1Y": {
          "quarters": {
            "Q1": 10500000000,
            "Q2": 11200000000,
            "Q3": 11800000000,
            "Q4": 11500000000
          },
          "high": 11800000000,
          "low": 10500000000,
          "average": 11250000000,
          "volatility": 12.4,
          "change_percent": 9.5
        },
        "5Y": {
          "quarters": {
            "Q1": 6200000000,
            "Q2": 7800000000,
            "Q3": 9500000000,
            "Q4": 11500000000
          },
          "high": 11800000000,
          "low": 6200000000,
          "average": 8750000000,
          "volatility": 90.3,
          "change_percent": 85.5
        },
        "10Y": {
          "quarters": {
            "Q1": 3800000000,
            "Q2": 5400000000,
            "Q3": 8200000000,
            "Q4": 11500000000
          },
          "high": 11800000000,
          "low": 3800000000,
          "average": 7225000000,
          "volatility": 210.5,
          "change_percent": 202.6
        }
      },
      "availability": "Available",
      "confidence": 0.85,
      "data_quality": {
        "coverage": 0.90,
        "auditability": 0.95,
        "freshness_days": 45
      },
      "source": "SEC Filings and Earnings Releases",
      "decision_context": {
        "confidence_level": "Medium-High",
        "sufficiency_status": "Sufficient",
        "knowns": [
          "Quarterly EBITDA from earnings releases",
          "Reconciliation to GAAP provided"
        ],
        "unknowns": [
          "Exact adjustments made by company",
          "Comparability across all periods"
        ]
      }
    },
    "volume": {
      "horizons": {
        "1D": {
          "quarters": {
            "Q1": 0,
            "Q2": 0,
            "Q3": 0,
            "Q4": 0
          },
          "high": 85000000,
          "low": 62000000,
          "average": 72000000,
          "volatility": 37.1,
          "change_percent": -5.2
        },
        "1W": {
          "quarters": {
            "Q1": 0,
            "Q2": 0,
            "Q3": 0,
            "Q4": 0
          },
          "high": 92000000,
          "low": 58000000,
          "average": 71000000,
          "volatility": 58.6,
          "change_percent": 2.8
        },
        "1M": {
          "quarters": {
            "Q1": 0,
            "Q2": 0,
            "Q3": 0,
            "Q4": 0
          },
          "high": 105000000,
          "low": 52000000,
          "average": 69000000,
          "volatility": 101.4,
          "change_percent": 4.5
        },
        "1Y": {
          "quarters": {
            "Q1": 65000000,
            "Q2": 72000000,
            "Q3": 68000000,
            "Q4": 72000000
          },
          "high": 125000000,
          "low": 45000000,
          "average": 69250000,
          "volatility": 177.8,
          "change_percent": 10.8
        },
        "5Y": {
          "quarters": {
            "Q1": 55000000,
            "Q2": 62000000,
            "Q3": 65000000,
            "Q4": 72000000
          },
          "high": 145000000,
          "low": 35000000,
          "average": 63500000,
          "volatility": 314.3,
          "change_percent": 30.9
        },
        "10Y": {
          "quarters": {
            "Q1": 42000000,
            "Q2": 48000000,
            "Q3": 58000000,
            "Q4": 72000000
          },
          "high": 165000000,
          "low": 28000000,
          "average": 55000000,
          "volatility": 492.7,
          "change_percent": 71.4
        }
      },
      "availability": "Available",
      "confidence": 1.0,
      "data_quality": {
        "coverage": 1.0,
        "auditability": 1.0,
        "freshness_days": 0
      },
      "source": "Market Data Provider",
      "decision_context": {
        "confidence_level": "High",
        "sufficiency_status": "Sufficient",
        "knowns": [
          "Real-time volume data",
          "Historical daily volume",
          "Adjusted for stock splits"
        ],
        "unknowns": []
      }
    }
  }
}`
  },

  {
    index: 6,
    name: "market_position",
    schemaFields: [
      "guidance_bridge (low, high, current_consensus, gap_percent)",
      "revisions_momentum (direction, magnitude, trend)",
      "net_cash_or_debt, buyback_capacity, sbc_percent_revenue, share_count_trend"
    ],
    prompt: (target: string) => `SEARCH THE WEB NOW AND EXTRACT MARKET POSITIONING DATA FOR: ${target}

YOUR SPECIFIC SCHEMA RESPONSIBILITY - Extract ONLY these fields:

**guidance_bridge**: Company guidance vs analyst consensus
- low: {value, formatted, source, source_reference}
- high: {value, formatted, source, source_reference}
- current_consensus: {value, formatted, source, source_reference}
- gap_percent: {value, formatted, source, source_reference}
- last_updated: timestamp

**revisions_momentum**: Analyst estimate changes
- direction: "up" | "down" | "stable"
- magnitude: {value, formatted, source, source_reference}
- trend: description of revision pattern
- last_updated: timestamp

**Public Market Metrics** (each with full metric schema):
- net_cash_or_debt: {value, formatted, unit, source, source_reference, availability, confidence, data_quality, decision_context}
- buyback_capacity: {value, formatted, unit, source, source_reference, ...}
- sbc_percent_revenue: {value, formatted, unit, source, source_reference, ...}
- share_count_trend: {value, formatted, unit, source, source_reference, ...}

🚨 CRITICAL ANTI-NULL REQUIREMENTS:
1. guidance_bridge must have ALL sub-fields (low, high, current_consensus, gap_percent)
2. Each sub-field must have: value, formatted, source, source_reference (ALL required)
3. Use 0 for numeric value if unavailable, note "Not Available" in source
4. revisions_momentum.direction must be one of: "up", "down", "stable"
5. All 4 public market metrics must be present with FULL metric schema
6. Each metric must include: value, formatted, unit, source, source_reference, availability, confidence, data_quality, decision_context
7. decision_context must have ALL sub-fields (use [] for arrays, "Unknown" for strings)
8. NEVER return null for any field

SEARCH NOW for: guidance, analyst estimates, consensus, buyback programs, share count.

EXPECTED JSON OUTPUT FORMAT:
{
  "guidance_bridge": {
    "low": {
      "value": 148000000000,
      "formatted": "$148B",
      "source": "Management Guidance",
      "source_reference": {
        "url": "https://example.com/earnings-call",
        "document_type": "Earnings Call Transcript",
        "excerpt": "We expect FY25 revenue of $148B to $152B",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "high": {
      "value": 152000000000,
      "formatted": "$152B",
      "source": "Management Guidance",
      "source_reference": {
        "url": "https://example.com/earnings-call",
        "document_type": "Earnings Call Transcript",
        "excerpt": "We expect FY25 revenue of $148B to $152B",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "current_consensus": {
      "value": 150200000000,
      "formatted": "$150.2B",
      "source": "Bloomberg Consensus",
      "source_reference": {
        "url": "https://bloomberg.com/consensus",
        "document_type": "Analyst Consensus",
        "excerpt": "Consensus FY25 revenue estimate of $150.2B",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "gap_percent": {
      "value": 0.13,
      "formatted": "0.13%",
      "source": "Calculated",
      "source_reference": {
        "url": "Calculated",
        "document_type": "Analysis",
        "excerpt": "Consensus $150.2B vs midpoint $150B = +0.13%",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "last_updated": "2026-01-07T10:30:00Z"
  },
  "revisions_momentum": {
    "direction": "up",
    "magnitude": {
      "value": 2500000000,
      "formatted": "$2.5B",
      "source": "Bloomberg Estimates",
      "source_reference": {
        "url": "https://bloomberg.com/revisions",
        "document_type": "Estimate Revisions",
        "excerpt": "Consensus raised $2.5B in past 30 days",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "trend": "Upward revisions accelerating; 15 of 20 analysts raised estimates in past month",
    "last_updated": "2026-01-07T10:30:00Z"
  },
  "net_cash_or_debt": {
    "value": 20000000000,
    "formatted": "$20B net cash",
    "unit": "USD",
    "source": "10-Q Filing",
    "source_reference": {
      "url": "https://example.com/10q",
      "document_type": "10-Q",
      "excerpt": "Cash $45B less debt $25B = $20B net cash",
      "accessed_at": "2026-01-07T10:30:00Z"
    },
    "availability": "Available",
    "confidence": 1.0,
    "data_quality": {
      "coverage": 1.0,
      "auditability": 1.0,
      "freshness_days": 45
    },
    "decision_context": {
      "confidence_level": "High",
      "sufficiency_status": "Sufficient",
      "knowns": [
        "Balance sheet cash and debt from 10-Q",
        "No material off-balance sheet liabilities"
      ],
      "unknowns": []
    }
  },
  "buyback_capacity": {
    "value": 25000000000,
    "formatted": "$25B authorized",
    "unit": "USD",
    "source": "8-K Filing",
    "source_reference": {
      "url": "https://example.com/8k",
      "document_type": "8-K",
      "excerpt": "Board authorized $25B share repurchase program",
      "accessed_at": "2026-01-07T10:30:00Z"
    },
    "availability": "Available",
    "confidence": 1.0,
    "data_quality": {
      "coverage": 1.0,
      "auditability": 1.0,
      "freshness_days": 30
    },
    "decision_context": {
      "confidence_level": "High",
      "sufficiency_status": "Sufficient",
      "knowns": [
        "$25B authorization announced",
        "No expiration date",
        "$8B remaining from prior program"
      ],
      "unknowns": [
        "Pace of buyback execution",
        "Whether full authorization will be used"
      ]
    }
  },
  "sbc_percent_revenue": {
    "value": 3.2,
    "formatted": "3.2%",
    "unit": "percent",
    "source": "10-K Filing",
    "source_reference": {
      "url": "https://example.com/10k",
      "document_type": "10-K",
      "excerpt": "Stock-based compensation was $4.1B on revenue of $128B",
      "accessed_at": "2026-01-07T10:30:00Z"
    },
    "availability": "Available",
    "confidence": 0.95,
    "data_quality": {
      "coverage": 1.0,
      "auditability": 1.0,
      "freshness_days": 60
    },
    "decision_context": {
      "confidence_level": "High",
      "sufficiency_status": "Sufficient",
      "knowns": [
        "SBC expense from income statement",
        "Revenue from financial statements"
      ],
      "unknowns": [
        "Forward-looking SBC as % of revenue"
      ]
    }
  },
  "share_count_trend": {
    "value": -1.2,
    "formatted": "-1.2% YoY",
    "unit": "percent",
    "source": "10-Q Filing",
    "source_reference": {
      "url": "https://example.com/10q",
      "document_type": "10-Q",
      "excerpt": "Diluted shares outstanding decreased 1.2% YoY",
      "accessed_at": "2026-01-07T10:30:00Z"
    },
    "availability": "Available",
    "confidence": 1.0,
    "data_quality": {
      "coverage": 1.0,
      "auditability": 1.0,
      "freshness_days": 45
    },
    "decision_context": {
      "confidence_level": "High",
      "sufficiency_status": "Sufficient",
      "knowns": [
        "Share count from balance sheet",
        "Historical trend shows consistent buybacks"
      ],
      "unknowns": [
        "Future dilution from SBC grants"
      ]
    }
  }
}`
  },

  {
    index: 7,
    name: "events_timeline",
    schemaFields: [
      "events[] (recent material events)",
      "changes_since_last_run[] (material changes)",
      "path_indicators[] (thesis progress tracking)",
      "position_sizing, variant_view"
    ],
    prompt: (target: string) => `SEARCH THE WEB NOW AND EXTRACT RECENT EVENTS FOR: ${target}

YOUR SPECIFIC SCHEMA RESPONSIBILITY - Extract ONLY these fields:

**events[]**: Recent material events (last 90 days)
- {id, date, type, title, description, impact, source_url}

**changes_since_last_run[]**: Material changes affecting thesis
- {id, timestamp, category, title, description, source_url, thesis_pillar, so_what, action}

**path_indicators[]**: Measurable thesis progress indicators
- {label, value, status, next_check}

**position_sizing**:
- {current_percent, max_percent, target_low, target_high}

**variant_view**:
- summary: alternative perspective
- sensitivity[]: {label, impact}

🚨 CRITICAL ANTI-NULL REQUIREMENTS:
1. events, changes_since_last_run, path_indicators must ALL be arrays (use [] if empty)
2. Each event must have ALL fields: id, date, type, title, description, impact, source_url
3. Use "Not Available" for strings if data missing
4. Each change must have ALL fields including thesis_pillar, so_what, action
5. position_sizing must have ALL numeric fields (use 0 if unknown)
6. variant_view must have summary (string) and sensitivity (array)
7. Each sensitivity item must have label and impact (both strings)
8. NEVER return null for any field
9. If no recent events, return empty array [] but include explanation in first event

SEARCH NOW for: recent news, press releases, announcements, material changes, earnings results.

EXPECTED JSON OUTPUT FORMAT:
{
  "events": [
    {
      "id": "EVT-001",
      "date": "2025-12-15",
      "type": "Earnings",
      "title": "Q4 FY24 Earnings Beat",
      "description": "Company reported Q4 revenue of $32B (vs $31.2B consensus) and EPS of $1.85 (vs $1.72 consensus). Raised FY25 guidance.",
      "impact": "Positive - Beat-and-raise quarter reinforces growth trajectory",
      "source_url": "https://example.com/earnings-release"
    },
    {
      "id": "EVT-002",
      "date": "2025-12-20",
      "type": "Product Launch",
      "title": "New AI Platform Launch",
      "description": "Announced next-generation AI platform with 50% performance improvement and new enterprise features. GA in Q2 FY25.",
      "impact": "Positive - Strengthens competitive position and addresses key customer requests",
      "source_url": "https://example.com/press-release"
    },
    {
      "id": "EVT-003",
      "date": "2026-01-05",
      "type": "M&A",
      "title": "Acquisition of DataCorp",
      "description": "$2.5B cash acquisition of DataCorp to expand data analytics capabilities. Expected to close Q2 FY25.",
      "impact": "Neutral to Positive - Strategic fit but integration risk; modest dilution to EPS",
      "source_url": "https://example.com/8k-filing"
    }
  ],
  "changes_since_last_run": [
    {
      "id": "CHG-001",
      "timestamp": "2025-12-15T16:00:00Z",
      "category": "Financial Performance",
      "title": "Q4 Revenue Beat by 2.5%",
      "description": "Quarterly revenue of $32B exceeded consensus by $800M driven by cloud strength",
      "source_url": "https://example.com/earnings",
      "thesis_pillar": "Growth Acceleration",
      "so_what": "Validates thesis that cloud adoption is accelerating; raises confidence in FY25 guidance",
      "action": "Maintain position; monitor Q1 performance for confirmation"
    },
    {
      "id": "CHG-002",
      "timestamp": "2025-12-20T14:30:00Z",
      "category": "Product Strategy",
      "title": "AI Platform Launch Ahead of Schedule",
      "description": "New AI platform launching Q2 instead of Q3; includes key enterprise features",
      "source_url": "https://example.com/press",
      "thesis_pillar": "Product Innovation",
      "so_what": "Earlier launch reduces competitive risk and could accelerate H2 growth",
      "action": "Positive signal; consider adding to position on any weakness"
    },
    {
      "id": "CHG-003",
      "timestamp": "2026-01-05T09:00:00Z",
      "category": "Capital Allocation",
      "title": "DataCorp Acquisition Announced",
      "description": "$2.5B acquisition adds data analytics capabilities",
      "source_url": "https://example.com/8k",
      "thesis_pillar": "Strategic Positioning",
      "so_what": "Fills portfolio gap but integration risk and modest dilution; overall neutral",
      "action": "Monitor integration progress; no position change for now"
    }
  ],
  "path_indicators": [
    {
      "label": "Cloud Revenue Growth",
      "value": "28.5% YoY (Q4)",
      "status": "On Track - Above 25% target",
      "next_check": "Q1 FY25 earnings (April 2026)"
    },
    {
      "label": "Operating Margin",
      "value": "37.5% (Q4)",
      "status": "Ahead - Target was 36%",
      "next_check": "Q1 FY25 earnings (April 2026)"
    },
    {
      "label": "Customer Retention",
      "value": "95% net retention",
      "status": "On Track - Stable vs prior quarter",
      "next_check": "Q1 FY25 earnings (April 2026)"
    },
    {
      "label": "New Product Adoption",
      "value": "AI platform pre-orders exceeding expectations",
      "status": "Ahead - Strong early demand signal",
      "next_check": "GA launch (Q2 FY25)"
    }
  ],
  "position_sizing": {
    "current_percent": 4.5,
    "max_percent": 7.0,
    "target_low": 4.0,
    "target_high": 6.0
  },
  "variant_view": {
    "summary": "Bears argue valuation is stretched at 25x forward earnings, and competitive threats from emerging AI-native companies could pressure margins. Incremental innovation may not justify premium multiple.",
    "sensitivity": [
      {
        "label": "Cloud growth decelerates to 15%",
        "impact": "Stock likely re-rates to 18-20x multiple, -25% downside"
      },
      {
        "label": "Operating margin contracts 200bps",
        "impact": "EPS miss of ~10%, stock down 15-20%"
      },
      {
        "label": "Major competitor launches superior product",
        "impact": "Market share loss concerns, stock down 20-30%"
      },
      {
        "label": "AI platform adoption exceeds expectations",
        "impact": "Revenue upside of 5-10%, stock up 15-25%"
      }
    ]
  }
}`
  }
];

    for (const shardData of shardsToRetry) {
      const shard = SHARD_CONFIGS.find(s => s.index === shardData.shardIndex);
      if (!shard) {
        console.warn(`Shard config not found for index ${shardData.shardIndex}`);
        continue;
      }

      try {
        const endpoint = `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}${ApiPath.Webhook}?jobId=${jobId}&shardIndex=${shard.index}`;
           const encodedEndpoint = encodeURIComponent(endpoint);
       
           const url = `https://api.brightdata.com/datasets/v3/trigger?dataset_id=${process.env.BRIGHTDATA_DATASET_ID}&endpoint=${encodedEndpoint}&format=json&uncompressed_webhook=true&include_errors=true`;
       
        const shardPrompt = shard.prompt(job.originalPrompt);

        console.log(`🔄 Retrying shard ${shard.index} (attempt ${(shardData.retryCount || 0) + 1}/3)`);

       const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.BRIGHTDATA_API_KEY_2}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: [
            {
              url: "https://gemini.google.com/",
              prompt: shardPrompt,
              index: shard.index,
            },
          ],
          custom_output_fields: ["answer_text"],
        }),
      });

        if (response.ok) {
          console.log(`✅ Retry launched successfully for shard ${shard.index}`);
          
          await ctx.runMutation(internal.scrapingJobs.updateShardStatus, {
            jobId,
            shardIndex: shard.index,
            status: "scraping",
          });
        } else {
          console.error(`❌ Retry failed for shard ${shard.index}: ${response.status}`);
        }

        // Delay between retries to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 60000));

      } catch (error) {
        console.error(`❌ Exception retrying shard ${shardData.shardIndex}:`, error);
      }
    }

    return {
      retriedCount: shardsToRetry.length,
      shardIndices: shardsToRetry.map((s: any) => s.shardIndex),
    };
  },
});

// Helper mutation to update shard status
export const updateShardStatus = internalMutation({
  args: {
    jobId: v.id("scrapingJobs"),
    shardIndex: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("scraping"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("retry_needed")
    ),
  },
  handler: async (ctx, { jobId, shardIndex, status }) => {
    const job = await ctx.db.get(jobId);
    if (!job || !job.shards) return;

    const shards = [...job.shards];
    const shardIdx = shards.findIndex(s => s.shardIndex === shardIndex);
    
    if (shardIdx !== -1) {
      shards[shardIdx].geminiStatus = status;
      await ctx.db.patch(jobId, { shards });
    }
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
        v.literal("failed"),
        v.literal("retrying")
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
        // ✅ ADD THESE RETRY FIELDS
        retryCount: v.optional(v.number()),
        lastRetryAt: v.optional(v.number()),
        retryReason: v.optional(v.string()),
        // End of retry fields
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
        v.literal("failed"),
        v.literal("retrying"),
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
        // ✅ ADD THESE RETRY FIELDS
        retryCount: v.optional(v.number()),
        lastRetryAt: v.optional(v.number()),
        retryReason: v.optional(v.string()),
        // End of retry fields
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
        v.literal("failed"),
        v.literal("retrying")
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
        // ✅ ADD THESE RETRY FIELDS
        retryCount: v.optional(v.number()),
        lastRetryAt: v.optional(v.number()),
        retryReason: v.optional(v.string()),
        // End of retry fields
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
// In convex/scrapingJobs.ts

export const markShardForRetry = mutation({
  args: {
    jobId: v.id("scrapingJobs"),
    shardIndex: v.number(),
    reason: v.string(),
  },
  handler: async (ctx, { jobId, shardIndex, reason }) => {
    const job = await ctx.db.get(jobId);

    if (!job || !job.shards) {
      throw new Error("Job or shards not found");
    }

    const MAX_RETRIES = 3;
    
    const updatedShards = job.shards.map((shard) => {
      if (shard.shardIndex === shardIndex) { // ✅ Use shardIndex, not index
        const currentRetryCount = shard.retryCount || 0;
        
        if (currentRetryCount < MAX_RETRIES) {
          return {
            ...shard,
            geminiStatus: "retry_needed" as const, // ✅ Use geminiStatus, not status
            retryCount: currentRetryCount + 1,
            lastRetryAt: Date.now(),
            retryReason: reason,
          };
        } else {
          console.warn(`⚠️ Shard ${shardIndex} exceeded retry limit (${MAX_RETRIES}) - accepting as-is`);
          return {
            ...shard,
            geminiStatus: "completed" as const,
            retryReason: `Retry limit exceeded: ${reason}`,
          };
        }
      }
      return shard;
    });

    await ctx.db.patch(jobId, {
      shards: updatedShards,
      status: "retrying", // ✅ Update job status to retrying
    });

    const needsRetry = updatedShards.some(s => s.geminiStatus === "retry_needed");

    return {
      needsRetry,
      retryCount: updatedShards.find(s => s.shardIndex === shardIndex)?.retryCount || 0,
    };
  },
});
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
