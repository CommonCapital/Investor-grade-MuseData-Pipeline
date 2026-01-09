'use node'
import { internalAction, action } from './_generated/server';
import { v } from 'convex/values';
import { openai } from "@ai-sdk/openai";
import { generateObject } from 'ai';

import { internal, api } from './_generated/api';
import { investorDashboardSchema } from '@/lib/seo-schema';
import { z } from 'zod';

// ============================================================================
// DISTRIBUTED LLM ORCHESTRATOR
// ============================================================================

/**
 * Entry point for distributed architecture
 * Launches 7 LLM jobs in batches to avoid rate limits
 */
export const processAllShards = action({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    console.log("🚀 Starting distributed LLM processing for job:", args.jobId);

    try {
      const job = await ctx.runQuery(api.scrapingJobs.getJobById, {
        jobId: args.jobId,
      });

      if (!job || !job.shards) {
        console.error("Job or shards not found for:", args.jobId);
        await ctx.runMutation(api.scrapingJobs.failJob, {
          jobId: args.jobId,
          error: "Job or shards not found",
        });
        return null;
      }

      console.log(`📊 Found ${job.shards.length} shards to process`);

      // ✅ BATCH PROCESSING: Process 2 shards at a time with 35s delays
      const BATCH_SIZE = 1;
      const BATCH_DELAY_MS = 35000; // 35 seconds between batches

      for (let i = 0; i < job.shards.length; i += BATCH_SIZE) {
  const batch = job.shards.slice(i, i + BATCH_SIZE);
  const batchNum = Math.floor(i / BATCH_SIZE);
  const delayMs = batchNum * BATCH_DELAY_MS;

  console.log(`📦 Batch ${batchNum + 1}: Scheduling shards ${batch.map(s => s.shardIndex).join(', ')} with ${delayMs}ms delay`);

  for (const shard of batch) {
    await ctx.scheduler.runAfter(delayMs, internal.analysis.processSingleShard, {
      jobId: args.jobId,
      shardIndex: shard.shardIndex,
    });
  }
}


      console.log(`✅ All ${job.shards.length} LLM jobs scheduled in batches`);
      return null;

    } catch (error) {
      console.error("❌ Error in processAllShards:", error);
      
      await ctx.runMutation(api.scrapingJobs.failJob, {
        jobId: args.jobId,
        error: error instanceof Error ? error.message : "Failed to launch LLM orchestrator",
      });
      
      return null;
    }
  },
});

/**
 * Process a single shard - LLM analyzes Gemini data and returns strict JSON
 */
export const processSingleShard = internalAction({
  args: {
    jobId: v.id("scrapingJobs"),
    shardIndex: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    console.log(`🔍 Processing LLM for shard ${args.shardIndex} of job ${args.jobId}`);

    try {
      const job = await ctx.runQuery(api.scrapingJobs.getJobById, {
        jobId: args.jobId,
      });

      if (!job || !job.shards) {
        throw new Error("Job or shards not found");
      }

      const shard = job.shards.find(s => s.shardIndex === args.shardIndex);
      
      if (!shard) {
        throw new Error(`Shard ${args.shardIndex} not found`);
      }

      if (!shard.geminiRawData) {
        throw new Error(`Shard ${args.shardIndex} has no Gemini data`);
      }

      console.log(`🤖 Calling LLM for shard ${args.shardIndex}...`);

      // Get shard configuration
      const shardConfig = getShardConfig(args.shardIndex);

      // Build comprehensive analysis prompt
      const analysisPrompt = shardConfig.buildPrompt(shard.geminiRawData);

      // Call LLM
      const { object: parsedData } = await generateObject({
        model: openai(shardConfig.llmModel),
        system: shardConfig.buildSystemPrompt(),
        prompt: analysisPrompt,
        schema: shardConfig.partialSchema,
      });

      console.log(`✅ Shard ${args.shardIndex} LLM completed`);

      // Validate
      const validation = shardConfig.partialSchema.safeParse(parsedData);

      if (!validation.success) {
        console.error(`❌ Shard ${args.shardIndex} validation failed:`, validation.error);
        throw new Error(`Validation failed: ${validation.error.message}`);
      }

      // Save result
      const result = await ctx.runMutation(internal.scrapingJobs.saveLLMResult, {
        jobId: args.jobId,
        shardIndex: args.shardIndex,
        parsedData: validation.data,
      });

      console.log(`💾 Shard ${args.shardIndex} result saved. Progress: ${result.completedCount}/${result.totalCount}`);

      // Trigger merge when all complete
      if (result.allLLMsComplete) {
        console.log(`🎯 All ${result.totalCount} LLMs complete - starting merge`);
        
        await ctx.scheduler.runAfter(0, internal.analysis.mergeAllShards, {
          jobId: args.jobId,
        });
      }

      return null;

    } catch (error) {
      console.error(`❌ Shard ${args.shardIndex} LLM failed:`, error);

      await ctx.runMutation(internal.scrapingJobs.failLLMShard, {
        jobId: args.jobId,
        shardIndex: args.shardIndex,
        error: error instanceof Error ? error.message : "Unknown LLM error",
      });

      return null;
    }
  },
});

/**
 * Merge all shard results into final investorDashboard
 */
export const mergeAllShards = internalAction({
  args: {
    jobId: v.id("scrapingJobs"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    console.log("🔀 Merging all shards for job:", args.jobId);

    try {
      const job = await ctx.runQuery(api.scrapingJobs.getJobById, {
        jobId: args.jobId,
      });

      if (!job || !job.shards) {
        throw new Error("Job or shards not found");
      }

      // Extract successful shards
      const shardResults = job.shards
        .filter(s => s.llmStatus === "completed" && s.llmParsedData)
        .map(s => ({
          shardIndex: s.shardIndex,
          shardName: s.shardName,
          data: s.llmParsedData,
        }));

      console.log(`📦 Merging ${shardResults.length}/${job.shards.length} successful shards`);

      if (shardResults.length === 0) {
        throw new Error("No successful shard results to merge");
      }

      // Merge with smart conflict resolution
      const mergedData = mergeShardData(shardResults, job.results);

      console.log("✅ Merge complete, validating final schema...");

      // Final validation
      const validation = investorDashboardSchema.safeParse(mergedData);

      if (!validation.success) {
        console.error("❌ Final schema validation failed:", validation.error.issues.slice(0, 10));
        throw new Error(`Final validation failed: ${validation.error.issues[0]?.message}`);
      }

      // Save
      const result = await ctx.runMutation(internal.scrapingJobs.mergeAndFinalize, {
        jobId: args.jobId,
        mergedData: validation.data,
      });

      if (result.success) {
        console.log(`🎉 Job ${args.jobId} completed successfully!`);
      } else {
        console.error("❌ Merge finalization failed:", result.errors);
      }

      return null;

    } catch (error) {
      console.error("❌ Merge error:", error);

      await ctx.runMutation(api.scrapingJobs.failJob, {
        jobId: args.jobId,
        error: error instanceof Error ? error.message : "Failed to merge shard results",
      });

      return null;
    }
  },
});

// ============================================================================
// SHARD CONFIGURATIONS
// ============================================================================

interface ShardConfig {
  index: number;
  name: string;
  llmModel: string;
  schemaFields: string[];
  buildSystemPrompt: () => string;
  buildPrompt: (geminiData: any) => string;
  partialSchema: z.ZodType<any>;
}

function getShardConfig(shardIndex: number): ShardConfig {
  const config = SHARD_CONFIGS.find(c => c.index === shardIndex);
  if (!config) {
    throw new Error(`No configuration found for shard ${shardIndex}`);
  }
  return config;
}

const SHARD_CONFIGS: ShardConfig[] = [
 {
    index: 1,
    name: "financial_metrics",
    llmModel: "gpt-4.1",
    schemaFields: [
      "company_type",
      "run_metadata (run_id, entity, ticker, timestamp, owner)",
      "base_metrics (market_cap, stock_price, revenue, revenue_ttm, ebitda_ttm, total_debt, cash, etc.)",
      "valuation (dcf, trading_comps, precedent_transactions)",
      "scenarios (base, upside, downside with probability, assumptions, drivers, outputs)"
    ],
    buildSystemPrompt: () => `You are an expert financial analyst. Analyze the provided  search data and generate a comprehensive financial analysis.

YOUR RESPONSIBILITY: Analyze and return financial_metrics shard data including company metadata.

CRITICAL REQUIREMENTS:
1. ANALYZE the data - don't just extract, provide investment-grade analysis
2. Return ONLY valid JSON matching the schema
3. Extract company_type: "public" or "private" (infer from context - look for stock tickers, SEC filings, IPO mentions)
4. Extract run_metadata: entity name, ticker symbol (if public), generate run_id, timestamp
5. NEVER return null - use these fallbacks:
   - Numbers: Use 0 if unavailable
   - Strings: Use "Not Available" or "Data Not Found"
   - Arrays: Use empty array []
   - Objects: Populate all sub-fields with appropriate defaults
6. ALWAYS include source_reference for every value with url, document_type, excerpt, accessed_at
7. For scenarios: assumptions MUST be objects with {key, value, source, source_reference}, NOT strings
8. For scenarios: outputs MUST include formula and formula_inputs for ALL metrics in ALL three scenarios
9. Provide formatted versions alongside numeric values

Return ONLY the JSON object. No markdown, no explanations, no preamble.`,

   

    buildPrompt: (geminiData: any) => `ANALYZE THIS MuseData Research Engine's SEARCH DATA AND GENERATE FINANCIAL METRICS WITH METADATA:

${JSON.stringify(geminiData, null, 2)}

YOUR SPECIFIC SCHEMA RESPONSIBILITY - Return these fields:

**company_type**: 
- Value: "public" or "private"
- Inference: Look for stock ticker symbols, SEC filings (10-K, 10-Q, 8-K), market cap, shares outstanding
- If ticker exists OR SEC filings mentioned → "public"
- If Series A/B/C funding OR venture capital mentioned → "private"

**run_metadata**:
{
  "run_id": "run_TIMESTAMP" (generate using current timestamp),
  "entity": "Company Full Legal Name" (extract from search results),
  "ticker": "AAPL" (if public, extract ticker symbol; if private, use null),
  "timestamp": "2026-01-08T10:00:00Z" (current ISO timestamp),
  "owner": null (always null - filled by system later)
}

**base_metrics**: 
- Market & Price: market_cap (number), stock_price (number), shares_outstanding (number)
- Balance Sheet: total_debt (number), cash (number), marketable_securities (number), current_assets (number), current_liabilities (number)
- Income Statement (Quarterly): revenue (number), revenue_prior (number), gross_profit (number), operating_income (number)
- Income Statement (TTM): revenue_ttm (number), ebitda_ttm (number), gross_profit_ttm (number), operating_income_ttm (number)
- EBITDA: ebitda_reported (number), ebitda_proxy (number), ebitda_availability (string: "reported" or "proxy" or "not_applicable")
- Cash Flow: free_cash_flow (number), net_burn (number)
- Use 0 for unavailable numeric values, never null

**valuation**:
- valuation_range_low (number), valuation_range_high (number), valuation_range_midpoint (number), why_range_exists (string)
- dcf: {
    terminal_growth_rate: {value (number), formatted (string), source (string), source_reference: {url, document_type, excerpt, accessed_at}},
    wacc: {value, formatted, source, source_reference},
    implied_value: {value, formatted, source, source_reference},
    implied_value_per_share: {value, formatted, source, source_reference},
    source (string),
    source_reference: {url, document_type, excerpt, accessed_at},
    methodology (string)
  }
- trading_comps: {
    implied_value_range_low: {value, formatted, source, source_reference},
    implied_value_range_high: {value, formatted, source, source_reference},
    peer_set (array of ticker strings),
    multiple_used (string),
    source (string),
    source_reference: {url, document_type, excerpt, accessed_at},
    confidence: {coverage (number 0-1), auditability (number 0-1), freshness_days (number)}
  }
- precedent_transactions: {
    implied_value_range_low: {value, formatted, source, source_reference},
    implied_value_range_high: {value, formatted, source, source_reference},
    transactions (array): [{name (string), date (string YYYY-MM), multiple (number)}],
    source (string),
    source_reference: {url, document_type, excerpt, accessed_at},
    confidence: {coverage, auditability, freshness_days}
  }

**scenarios**:
## 🚨 CRITICAL REQUIREMENTS:
1. ALL THREE scenarios (base, upside, downside) MUST have IDENTICAL assumption/driver structures
2. Each scenario MUST have assumptions with these EXACT keys: "Revenue Growth" and "EBITDA Margin"
3. Each scenario MUST have drivers with these EXACT names: "Revenue Growth" and "EBITDA Margin"
4. Driver values MUST be parseable percentages (e.g., "11%", "14%", "5%")
5. ALL outputs MUST include formula and formula_inputs with complete source_reference objects
6. NEVER use qualitative values like "High", "Severe", "$5B+" - ONLY percentages
- base: {
    probability (number 0-1),
    assumptions (array of OBJECTS - NOT strings): [
      {
        key (string),
        value (string),
        source (string),
        source_reference: {url, document_type, excerpt, accessed_at}
      }
    ],
    drivers (array of objects): [
      {
        name (string),
        category (string),
        value (string),
        unit (string),
        source (string),
        source_reference: {url, document_type, excerpt, accessed_at}
      }
    ],
    outputs: {
      revenue: {
        value (number),
        formatted (string),
        source (string),
        period (string),
        formula (string - REQUIRED),
        formula_inputs (array - REQUIRED): [
          {
            name (string),
            value (number),
            source (string),
            source_reference: {url, document_type, excerpt, accessed_at}
          }
        ],
        source_reference: {url, document_type, excerpt, accessed_at}
      },
      ebitda: {value, formatted, source, period, formula, formula_inputs[], source_reference},
      valuation: {value, formatted, source, period, formula, formula_inputs[], source_reference}
    }
  }
- upside: {same complete structure with formula/formula_inputs for ALL outputs}
- downside: {same complete structure with formula/formula_inputs for ALL outputs}

🚨 CRITICAL ANTI-NULL REQUIREMENTS:
1. company_type: MUST be "public" or "private" (never null)
2. run_metadata: ALL fields required (entity, ticker extracted from data; run_id, timestamp generated)
3. run_metadata.ticker: use actual ticker if public, null if private
4. ALL numeric fields must be numbers (use 0 if unavailable, NEVER null)
5. ALL string fields must be strings (use "Not Available" if missing, NEVER null)
6. ALL arrays must be arrays (use [] if empty, NEVER null)
7. EVERY value object must have complete source_reference with ALL 4 fields
8. scenarios MUST include formula and formula_inputs for ALL outputs in ALL three scenarios
9. assumptions and drivers MUST be arrays of objects, NOT arrays of strings
10. ebitda_availability must be exactly one of: "reported", "proxy", "not_applicable"
11. confidence objects must have all 3 numeric fields: coverage, auditability, freshness_days
12. ALL source_reference objects must have: url, document_type, excerpt, accessed_at
13. accessed_at must be ISO 8601 timestamp string (YYYY-MM-DDTHH:MM:SSZ)

RESPOND WITH VALID JSON MATCHING THIS EXACT STRUCTURE:

{
  "company_type": "public",
  "run_metadata": {
    "run_id": "run_1736337600000",
    "entity": "Apple Inc.",
    "ticker": "AAPL",
    "timestamp": "2026-01-08T10:00:00Z",
    "owner": null
  },
  "base_metrics": {
    "market_cap": 3950000000000,
    "stock_price": 267.25,
    "shares_outstanding": 14780000000,
    "total_debt": 90678000000,
    "cash": 35934000000,
    "marketable_securities": 96486000000,
    "current_assets": 147957000000,
    "current_liabilities": 165631000000,
    "revenue": 102466000000,
    "revenue_prior": 94036000000,
    "gross_profit": 48000000000,
    "operating_income": 33000000000,
    "revenue_ttm": 416161000000,
    "ebitda_ttm": 144748000000,
    "gross_profit_ttm": 195201000000,
    "operating_income_ttm": 133050000000,
    "ebitda_reported": 144748000000,
    "ebitda_proxy": 0,
    "ebitda_availability": "reported",
    "free_cash_flow": 98767000000,
    "net_burn": 0
  },
  "valuation": {
    "valuation_range_low": 2050000000000,
    "valuation_range_high": 4800000000000,
    "valuation_range_midpoint": 3425000000000,
    "why_range_exists": "Range reflects uncertainty in AI monetization timeline and regulatory outcomes",
    "dcf": {
      "terminal_growth_rate": {
        "value": 2.5,
        "formatted": "2.5%",
        "source": "Alpha Spread DCF",
        "source_reference": {
          "url": "https://www.alphaspread.com/security/nasdaq/aapl/dcf-valuation",
          "document_type": "Intrinsic Value Calculator",
          "excerpt": "Terminal growth rate of 2.5% applied in base case DCF model",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "wacc": {
        "value": 8.2,
        "formatted": "8.2%",
        "source": "Estimated based on risk profile",
        "source_reference": {
          "url": "https://www.alphaspread.com/security/nasdaq/aapl/dcf-valuation",
          "document_type": "Valuation Model",
          "excerpt": "Estimated discount rate for Apple mega-cap profile",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "implied_value": {
        "value": 2100000000000,
        "formatted": "$2.1T",
        "source": "Alpha Spread DCF",
        "source_reference": {
          "url": "https://www.alphaspread.com/security/nasdaq/aapl/dcf-valuation",
          "document_type": "Valuation Model",
          "excerpt": "The total present value equals 2.1T USD",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "implied_value_per_share": {
        "value": 139.31,
        "formatted": "$139.31",
        "source": "Alpha Spread DCF",
        "source_reference": {
          "url": "https://www.alphaspread.com/security/nasdaq/aapl/dcf-valuation",
          "document_type": "Valuation Model",
          "excerpt": "Estimated DCF Value of one AAPL stock is 139.31 USD",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "source": "Alpha Spread DCF Model",
      "source_reference": {
        "url": "https://www.alphaspread.com/security/nasdaq/aapl/dcf-valuation",
        "document_type": "Valuation Model",
        "excerpt": "Comprehensive DCF analysis with 10-year projection",
        "accessed_at": "2026-01-08T10:00:00Z"
      },
      "methodology": "10-year discounted cash flow with Gordon Growth terminal value"
    },
    "trading_comps": {
      "implied_value_range_low": {
        "value": 3700000000000,
        "formatted": "$3.7T",
        "source": "P/E Comparison",
        "source_reference": {
          "url": "https://simplywall.st/stocks/pl/tech/wse-aapl/apple-shares/valuation",
          "document_type": "Peer Analysis",
          "excerpt": "Comparison based on 35.8x P/E ratio vs industry average 27.2x",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "implied_value_range_high": {
        "value": 4500000000000,
        "formatted": "$4.5T",
        "source": "Forward Analyst Targets",
        "source_reference": {
          "url": "https://radcliffecoop.com/news/story/35851722/apple-s-free-cash-flow-surges",
          "document_type": "Equity Research",
          "excerpt": "AAPL price target of $325 over the next 12 months",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "peer_set": ["MSFT", "GOOGL", "META", "AMZN"],
      "multiple_used": "P/E",
      "source": "Simply Wall St Comps",
      "source_reference": {
        "url": "https://simplywall.st/stocks/pl/tech/wse-aapl/apple-shares/valuation",
        "document_type": "Peer Analysis",
        "excerpt": "Peer group valuation analysis",
        "accessed_at": "2026-01-08T10:00:00Z"
      },
      "confidence": {
        "coverage": 0.95,
        "auditability": 0.88,
        "freshness_days": 1
      }
    },
    "precedent_transactions": {
      "implied_value_range_low": {
        "value": 0,
        "formatted": "Data Not Found",
        "source": "Precedent Analysis",
        "source_reference": {
          "url": "Not Available",
          "document_type": "Transaction Analysis",
          "excerpt": "No large-scale whole-company precedent transactions available for a $4T entity",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "implied_value_range_high": {
        "value": 0,
        "formatted": "Data Not Found",
        "source": "Precedent Analysis",
        "source_reference": {
          "url": "Not Available",
          "document_type": "Transaction Analysis",
          "excerpt": "No relevant transactions of comparable scale",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      },
      "transactions": [],
      "source": "M&A Database",
      "source_reference": {
        "url": "Not Available",
        "document_type": "Transaction Analysis",
        "excerpt": "No precedent transactions available",
        "accessed_at": "2026-01-08T10:00:00Z"
      },
      "confidence": {
        "coverage": 0.0,
        "auditability": 0.0,
        "freshness_days": 0
      }
    }
  },
  "scenarios": {
    "base": {
      "probability": 0.6,
      "assumptions": [
        {
          "key": "revenue_growth",
          "value": "8.8%",
          "source": "Analyst Consensus",
          "source_reference": {
            "url": "https://radcliffecoop.com/news/story/35851722/apple-s-free-cash-flow-surges",
            "document_type": "Market Report",
            "excerpt": "Analysts are projecting that revenue for the year ending Sept. 2026 will rise 8.8%",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        {
          "key": "ebitda_margin",
          "value": "35.5%",
          "source": "Historical Average",
          "source_reference": {
            "url": "https://www.alphaspread.com/security/nasdaq/aapl/summary",
            "document_type": "Financial Summary",
            "excerpt": "EBITDA margin has averaged 35% over past 3 years",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      ],
      "drivers": [
        {
          "name": "Services Expansion",
          "category": "growth",
          "value": "15",
          "unit": "percent",
          "source": "Q4 Results",
          "source_reference": {
            "url": "https://leverageshares.com/en/insights/apple-q4-earnings-services-and-ai-drive-a-structural-turnaround/",
            "document_type": "Earnings Analysis",
            "excerpt": "Services revenue climbed to $28.75 billion, up more than 15% YoY",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        {
          "name": "iPhone Unit Growth",
          "category": "volume",
          "value": "3",
          "unit": "percent",
          "source": "Industry Forecast",
          "source_reference": {
            "url": "https://www.idc.com/getdoc.jsp?containerId=prUS52582525",
            "document_type": "Market Research",
            "excerpt": "Smartphone market expected to grow 3% in 2026",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      ],
      "outputs": {
        "revenue": {
          "value": 452900000000,
          "formatted": "$452.9B",
          "source": "Consensus Model",
          "period": "FY2026E",
          "formula": "revenue_ttm * (1 + growth_rate)",
          "formula_inputs": [
            {
              "name": "revenue_ttm",
              "value": 416161000000,
              "source": "FY2025 10-K",
              "source_reference": {
                "url": "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000320193",
                "document_type": "10-K Filing",
                "excerpt": "Total revenue for fiscal 2025 was $416.2B",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "growth_rate",
              "value": 0.088,
              "source": "Analyst Projection",
              "source_reference": {
                "url": "https://radcliffecoop.com/news/story/35851722/apple-s-free-cash-flow-surges",
                "document_type": "Market Report",
                "excerpt": "8.8% revenue growth consensus",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000320193",
            "document_type": "Financial Model",
            "excerpt": "Base case revenue projection for FY2026",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        "ebitda": {
          "value": 160780500000,
          "formatted": "$160.8B",
          "source": "Estimated based on margin",
          "period": "FY2026E",
          "formula": "projected_revenue * ebitda_margin",
          "formula_inputs": [
            {
              "name": "projected_revenue",
              "value": 452900000000,
              "source": "Calculated above",
              "source_reference": {
                "url": "Calculated",
                "document_type": "Financial Model",
                "excerpt": "FY2026E revenue from base case",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "ebitda_margin",
              "value": 0.355,
              "source": "Historical Average",
              "source_reference": {
                "url": "https://www.alphaspread.com/security/nasdaq/aapl/summary",
                "document_type": "Financial Summary",
                "excerpt": "35.5% EBITDA margin assumption",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "Calculated",
            "document_type": "Financial Model",
            "excerpt": "Base case EBITDA projection",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        "valuation": {
          "value": 3950000000000,
          "formatted": "$3.95T",
          "source": "Current Market Cap",
          "period": "Current",
          "formula": "market_cap",
          "formula_inputs": [
            {
              "name": "market_cap",
              "value": 3950000000000,
              "source": "Market Data",
              "source_reference": {
                "url": "https://public.com/stocks/aapl/market-cap",
                "document_type": "Market Data",
                "excerpt": "As of Jan 5, 2026, market cap is $3.95T",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://public.com/stocks/aapl/market-cap",
            "document_type": "Market Data",
            "excerpt": "Current market capitalization",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      }
    },
    "upside": {
      "probability": 0.25,
      "assumptions": [
        {
          "key": "pe_expansion",
          "value": "35x",
          "source": "Bull Case Scenario",
          "source_reference": {
            "url": "https://www.mexc.co/crypto-pulse/article/aapl-stock-price-performance-prediction-2026-2030-62812",
            "document_type": "Market Prediction",
            "excerpt": "Bull case P/E range 28 to 35",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        {
          "key": "ai_revenue_acceleration",
          "value": "20% incremental growth",
          "source": "AI Monetization Analysis",
          "source_reference": {
            "url": "https://www.goldmansachs.com/intelligence/",
            "document_type": "Analyst Report",
            "excerpt": "AI services could drive 8-10% incremental growth",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      ],
      "drivers": [
        {
          "name": "AI Supercycle",
          "category": "growth",
          "value": "13-15",
          "unit": "percent",
          "source": "JP Morgan",
          "source_reference": {
            "url": "https://www.jpmorgan.com/insights/global-research/outlook/market-outlook",
            "document_type": "Outlook",
            "excerpt": "AI supercycle driving earnings growth of 13-15%",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      ],
      "outputs": {
        "revenue": {
          "value": 478000000000,
          "formatted": "$478B",
          "source": "Upside Model",
          "period": "FY2026E",
          "formula": "revenue_ttm * (1 + upside_growth_rate)",
          "formula_inputs": [
            {
              "name": "revenue_ttm",
              "value": 416161000000,
              "source": "FY2025 10-K",
              "source_reference": {
                "url": "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000320193",
                "document_type": "10-K Filing",
                "excerpt": "Total revenue for fiscal 2025 was $416.2B",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "upside_growth_rate",
              "value": 0.15,
              "source": "Bull Case Estimate",
              "source_reference": {
                "url": "https://www.jpmorgan.com/insights/global-research/outlook/market-outlook",
                "document_type": "Analyst Report",
                "excerpt": "15% growth in AI-driven supercycle",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://www.jpmorgan.com/insights/global-research/outlook/market-outlook",
            "document_type": "Financial Model",
            "excerpt": "Upside revenue projection",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        "ebitda": {
          "value": 170000000000,
          "formatted": "$170B",
          "source": "Upside Model",
          "period": "FY2026E",
          "formula": "projected_revenue * upside_ebitda_margin",
          "formula_inputs": [
            {
              "name": "projected_revenue",
              "value": 478000000000,
              "source": "Calculated above",
              "source_reference": {
                "url": "Calculated",
                "document_type": "Financial Model",
                "excerpt": "Upside revenue from above",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "upside_ebitda_margin",
              "value": 0.3556,
              "source": "Operating Leverage",
              "source_reference": {
                "url": "https://www.alphaspread.com/security/nasdaq/aapl/summary",
                "document_type": "Financial Analysis",
                "excerpt": "Margin expansion to 35.6% with operating leverage",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "Calculated",
            "document_type": "Financial Model",
            "excerpt": "Upside EBITDA projection",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        "valuation": {
          "value": 4800000000000,
          "formatted": "$4.8T",
          "source": "High price target implied",
          "period": "FY2026E",
          "formula": "earnings * upside_pe_multiple",
          "formula_inputs": [
            {
              "name": "earnings",
              "value": 137142857143,
              "source": "Projected EPS",
              "source_reference": {
                "url": "Calculated",
                "document_type": "Financial Model",
                "excerpt": "Upside earnings estimate",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "upside_pe_multiple",
              "value": 35,
              "source": "Bull Case P/E",
              "source_reference": {
                "url": "https://www.mexc.co/crypto-pulse/article/aapl-stock-price-performance-prediction-2026-2030-62812",
                "document_type": "Market Prediction",
                "excerpt": "Bull case P/E of 35x",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://www.mexc.co/crypto-pulse/article/aapl-stock-price-performance-prediction-2026-2030-62812",
            "document_type": "Valuation Model",
            "excerpt": "Upside valuation",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      }
    },
    "downside": {
      "probability": 0.15,
      "assumptions": [
        {
          "key": "pe_compression",
          "value": "18x",
          "source": "Bear Case Scenario",
          "source_reference": {
            "url": "https://www.mexc.co/crypto-pulse/article/aapl-stock-price-performance-prediction-2026-2030-62812",
            "document_type": "Market Prediction",
            "excerpt": "Bear case P/E range 18 to 22",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        {
          "key": "china_revenue_decline",
          "value": "15% decline",
          "source": "Geopolitical Risk",
          "source_reference": {
            "url": "https://www.tradingview.com/news/invezz:672e9c7e3094b:0-apple-leans-on-china",
            "document_type": "Market Analysis",
            "excerpt": "Potential China market contraction risk",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      ],
      "drivers": [],
      "outputs": {
        "revenue": {
          "value": 408000000000,
          "formatted": "$408B",
          "source": "Downside Model",
          "period": "FY2026E",
          "formula": "revenue_ttm * (1 + downside_growth_rate)",
          "formula_inputs": [
            {
              "name": "revenue_ttm",
              "value": 416161000000,
              "source": "FY2025 10-K",
              "source_reference": {
                "url": "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0000320193",
                "document_type": "10-K Filing",
                "excerpt": "Total revenue for fiscal 2025 was $416.2B",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "downside_growth_rate",
              "value": -0.02,
              "source": "Bear Case Estimate",
              "source_reference": {
                "url": "https://www.tradingview.com/news/invezz:672e9c7e3094b:0-apple-leans-on-china",
                "document_type": "Market Analysis",
                "excerpt": "Potential 2% revenue decline in downside scenario",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://www.tradingview.com/news/invezz:672e9c7e3094b:0-apple-leans-on-china",
            "document_type": "Financial Model",
            "excerpt": "Downside revenue projection",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        "ebitda": {
          "value": 130000000000,
          "formatted": "$130B",
          "source": "Downside Model",
          "period": "FY2026E",
          "formula": "projected_revenue * downside_ebitda_margin",
          "formula_inputs": [
            {
              "name": "projected_revenue",
              "value": 408000000000,
              "source": "Calculated above",
              "source_reference": {
                "url": "Calculated",
                "document_type": "Financial Model",
                "excerpt": "Downside revenue from above",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "downside_ebitda_margin",
              "value": 0.3186,
              "source": "Margin Compression",
              "source_reference": {
                "url": "https://www.investing.com/news/stock-market-news/apple-price-target-raised-at-morgan-stanley",
                "document_type": "Analyst Report",
                "excerpt": "Memory cost inflation could compress margins by 160bps",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "Calculated",
            "document_type": "Financial Model",
            "excerpt": "Downside EBITDA projection",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        },
        "valuation": {
          "value": 2050000000000,
          "formatted": "$2.05T",
          "source": "Implied bear case price",
          "period": "FY2026E",
          "formula": "earnings * downside_pe_multiple",
          "formula_inputs": [
            {
              "name": "earnings",
              "value": 113888888889,
              "source": "Projected EPS",
              "source_reference": {
                "url": "Calculated",
                "document_type": "Financial Model",
                "excerpt": "Downside earnings estimate",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            },
            {
              "name": "downside_pe_multiple",
              "value": 18,
              "source": "Bear Case P/E",
              "source_reference": {
                "url": "https://www.mexc.co/crypto-pulse/article/aapl-stock-price-performance-prediction-2026-2030-62812",
                "document_type": "Market Prediction",
                "excerpt": "Bear case P/E of 18x",
                "accessed_at": "2026-01-08T10:00:00Z"
              }
            }
          ],
          "source_reference": {
            "url": "https://www.mexc.co/crypto-pulse/article/aapl-stock-price-performance-prediction-2026-2030-62812",
            "document_type": "Valuation Model",
            "excerpt": "Downside valuation",
            "accessed_at": "2026-01-08T10:00:00Z"
          }
        }
      }
    }
  }
}

Return ONLY this JSON structure. No markdown, no code blocks, no explanations.`,

    partialSchema: investorDashboardSchema.pick({
      company_type: true,
      run_metadata: true,
      base_metrics: true,
      valuation: true,
      scenarios: true,
    }),
  },

  // ============================================================================
  // SHARD 2: RISK ANALYSIS
  // ============================================================================
  {
    index: 2,
    name: "risk_analysis",
    llmModel: "gpt-4.1",
    schemaFields: [
      "risks (ALL 6 categories: regulatory, market, operational, cybersecurity, financial, strategic)",
      "kill_switch (conditions[])"
    ],
    buildSystemPrompt: () => `You are an expert risk analyst. Analyze the provided search data and generate a comprehensive risk assessment.

YOUR RESPONSIBILITY: Analyze and return risk_analysis shard data.

CRITICAL REQUIREMENTS:
1. ANALYZE the data - identify, categorize, and assess all material risks
2. Return ONLY valid JSON matching the schema
3. ALL 6 risk categories MUST be present: regulatory, market, operational, cybersecurity, financial, strategic
4. Empty arrays [] are acceptable if no risks found for a category
5. Each risk must have ALL fields populated (id, title, description, severity, probability, trigger, mitigation, status, source_reference)
6. status must be one of: "Active", "Monitoring", "Resolved"
7. NEVER return null for any field
8. Generate unique IDs like "REG-001", "MKT-001", etc.
9. severity must be: "Low", "Medium", or "High"
10. probability must be a number between 0 and 1

Return ONLY the JSON object. No markdown, no explanations, no preamble.`,

    buildPrompt: (geminiData: any) => `ANALYZE THIS MuseData Research Engine's SEARCH DATA AND GENERATE RISK ASSESSMENT:

${JSON.stringify(geminiData, null, 2)}

YOUR SPECIFIC SCHEMA RESPONSIBILITY - Return ONLY these fields:

**risks** - MUST contain ALL 6 categories (use empty array [] if no risks found):
Each category is an array of risk objects with this structure:
{
  "id": "REG-001" (string - generate unique IDs),
  "title": "Risk title" (string),
  "description": "Detailed risk description" (string),
  "severity": "High" | "Medium" | "Low" (string),
  "probability": 0.25 (number 0-1),
  "trigger": "What would trigger this risk" (string),
  "mitigation": "How company is mitigating" (string),
  "status": "Active" | "Monitoring" | "Resolved" (string),
  "source_reference": {
    "url": "source URL",
    "document_type": "document type",
    "excerpt": "relevant quote",
    "accessed_at": "ISO timestamp"
  }
}

Categories:
- regulatory: Regulatory and legal risks
- market: Market and competitive risks
- operational: Operational and execution risks
- cybersecurity: Cybersecurity and data risks
- financial: Financial and liquidity risks
- strategic: Strategic and M&A risks

**kill_switch**:
- conditions: Array of strings describing deal-breaker scenarios that would require immediate exit

🚨 CRITICAL ANTI-NULL REQUIREMENTS:
1. ALL 6 risk categories MUST be present in output (use [] if no risks for that category)
2. NEVER return null for the risks object itself
3. Each risk item must have ALL fields populated:
   - id: generate unique like "REG-001"
   - title, description: provide meaningful text or "Not Available"
   - severity: must be "Low", "Medium", or "High"
   - probability: number 0-1, use 0.5 if unknown
   - trigger, mitigation: provide text or "Unknown"
   - status: must be "Active", "Monitoring", or "Resolved"
   - source_reference: ALWAYS include with all sub-fields
4. kill_switch.conditions must be an array (use [] if no conditions identified)

EXPECTED JSON OUTPUT FORMAT:
{
  "risks": {
    "regulatory": [
      {
        "id": "REG-AAPL-2026-001",
        "title": "Digital Markets Act (DMA) Non-Compliance",
        "description": "European Commission found Apple in breach of anti-steering obligations under DMA",
        "severity": "High",
        "probability": 0.90,
        "trigger": "European Commission enforcement actions and final court rulings",
        "mitigation": "Implementing Compliance by Design changes in EU, reducing App Store fees",
        "status": "Active",
        "source_reference": {
          "url": "https://ec.europa.eu/commission/presscorner/detail/en/ip_25_1085",
          "document_type": "European Commission Press Release",
          "excerpt": "Commission found that Apple fails to comply with anti-steering obligation",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      }
    ],
    "market": [
      {
        "id": "MKT-AAPL-2026-001",
        "title": "Geopolitical China-US Trade Tensions",
        "description": "Increased tariffs and retaliatory restrictions threaten largest manufacturing hub",
        "severity": "High",
        "probability": 0.75,
        "trigger": "Imposition of new tariffs or export controls",
        "mitigation": "Diversification to India and Vietnam via China + 1 strategy",
        "status": "Active",
        "source_reference": {
          "url": "https://www.tradingview.com/news/invezz:672e9c7e3094b:0-apple-leans-on-china",
          "document_type": "Market Analysis",
          "excerpt": "Potential duties could affect devices made in China",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      }
    ],
    "operational": [
      {
        "id": "OPS-AAPL-2026-001",
        "title": "Supply Chain Concentration & Transition Risk",
        "description": "Reliance on single-source suppliers and challenges replicating China ecosystem",
        "severity": "Medium",
        "probability": 0.60,
        "trigger": "Natural disasters, political instability, or quality failures",
        "mitigation": "Investing in India infrastructure, partnering with Tata Electronics",
        "status": "Monitoring",
        "source_reference": {
          "url": "https://www.hfsresearch.com/research/apple-india-manufacturing-de-risk-supply-chains/",
          "document_type": "Research Report",
          "excerpt": "Diversification to India signals critical shift",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      }
    ],
    "cybersecurity": [
      {
        "id": "CYB-AAPL-2026-001",
        "title": "OS Privacy Control Bypass (CVE-2025-43530)",
        "description": "macOS vulnerability allows TCC bypass, exposing sensitive user data",
        "severity": "Medium",
        "probability": 0.30,
        "trigger": "Active exploitation of TCC bypass in the wild",
        "mitigation": "Rapid patching (macOS 26.2) and promoting Advanced Data Protection",
        "status": "Active",
        "source_reference": {
          "url": "https://www.esecurityplanet.com/threats/macos-flaw-enables-silent-bypass",
          "document_type": "Security Bulletin",
          "excerpt": "CVE-2025-43530 allows attackers to bypass TCC privacy controls",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      }
    ],
    "financial": [
      {
        "id": "FIN-AAPL-2026-001",
        "title": "Memory Component Cost Inflation",
        "description": "Rising DRAM and NAND costs expected to pressure margins in 2026-2027",
        "severity": "Medium",
        "probability": 0.80,
        "trigger": "Sustained increase in commodity pricing for semiconductors",
        "mitigation": "Leveraging demand elasticity to pass costs to consumers",
        "status": "Active",
        "source_reference": {
          "url": "https://www.investing.com/news/stock-market-news/apple-price-target-raised-at-morgan-stanley",
          "document_type": "Analyst Report",
          "excerpt": "Memory cost inflation emerges as growing headwind",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      }
    ],
    "strategic": [
      {
        "id": "STR-AAPL-2026-001",
        "title": "Generative AI Competitive Lag",
        "description": "Conservative AI approach and Siri delays may cause mindshare loss",
        "severity": "Medium",
        "probability": 0.40,
        "trigger": "Sustained failure to match competitor capabilities by late 2026",
        "mitigation": "Google Gemini partnership while focusing on on-device privacy",
        "status": "Monitoring",
        "source_reference": {
          "url": "https://www.macrumors.com/2025/12/30/apple-ai-strategy-could-pay-off-in-2026/",
          "document_type": "Strategic Analysis",
          "excerpt": "Apple's biggest AI move will be long-anticipated Siri overhaul",
          "accessed_at": "2026-01-08T10:00:00Z"
        }
      }
    ]
  },
  "kill_switch": {
    "conditions": [
      "Final court ruling upholding DMA fine exceeding 10% of global revenue",
      "Total ban on iPhone sales in Greater China region",
      "Confirmed state-sponsored breach of iCloud end-to-end encryption",
      "Unplanned departure of CEO and COO within same 6-month window",
      "Material accounting restatement related to Services revenue recognition"
    ]
  }
}

Return ONLY this JSON structure. No markdown, no code blocks, no explanations.`,

    partialSchema: investorDashboardSchema.pick({
      risks: true,
      kill_switch: true,
    }),
  },

  {
    index: 3,
    name: "strategic_insights",
    llmModel: "gpt-4.1",
    schemaFields: [
      "executive_summary (headline, key_facts[], implications[], key_risks[], thesis_status)",
      "hypotheses[] (with falsification_criteria)",
      "ai_insights[] (same structure as hypotheses)"
    ],
    buildSystemPrompt: () => `You are an expert strategic analyst. Analyze the provided search data and generate comprehensive strategic insights.

YOUR RESPONSIBILITY: Analyze and return strategic_insights shard data.

CRITICAL REQUIREMENTS:
1. ANALYZE the data - synthesize key strategic themes and investment implications
2. Return ONLY valid JSON matching the schema
3. executive_summary must have ALL fields populated
4. thesis_status must be exactly one of: "intact", "challenged", "broken"
5. hypotheses and ai_insights must be arrays (use [] if empty)
6. Each hypothesis must have ALL fields including confidence_band, action_required
7. confidence_band must be: "Low", "Medium", or "High"
8. Generate unique IDs like "HYP-001", "AI-001"
9. NEVER return null for any field

Return ONLY the JSON object. No markdown, no explanations, no preamble.`,

    buildPrompt: (geminiData: any) => `ANALYZE THIS MuseData Research Engine's SEARCH DATA AND GENERATE STRATEGIC INSIGHTS:

${JSON.stringify(geminiData, null, 2)}

YOUR SPECIFIC SCHEMA RESPONSIBILITY - Return ONLY these fields:

**executive_summary**:
{
  "headline": "One-sentence strategic summary" (string),
  "key_facts": ["Fact 1", "Fact 2", ...] (array of 3-5 strings),
  "implications": ["Implication 1", ...] (array of strings),
  "key_risks": ["Risk 1", "Risk 2", "Risk 3"] (array of top 3 risk summaries),
  "thesis_status": "intact" | "challenged" | "broken" (string - MUST be one of these)
}

**hypotheses**: Array of investment hypotheses
[
  {
    "id": "HYP-001" (string),
    "type": "Growth" | "Margin" | "Risk" | etc (string),
    "title": "Hypothesis title" (string),
    "summary": "One-sentence summary" (string),
    "details": "Detailed explanation" (string),
    "assumptions": ["Assumption 1", ...] (array of strings),
    "falsification_criteria": ["Criterion 1", ...] (array of strings),
    "confidence_band": "Low" | "Medium" | "High" (string - MUST be one of these),
    "source": "Source attribution" (string),
    "generated_at": "ISO timestamp" (string),
    "horizon_relevance": ["1Y", "5Y"] (array of strings),
    "impact_score": 9 (number 1-10),
    "action_required": true | false (boolean)
  }
]

**ai_insights**: Array with same structure as hypotheses (AI-generated insights)

🚨 CRITICAL ANTI-NULL REQUIREMENTS:
1. executive_summary: ALL fields required (use [] for empty arrays)
2. thesis_status: MUST be "intact", "challenged", or "broken" (no other values allowed)
3. hypotheses and ai_insights: must be arrays (use [] if empty)
4. Each hypothesis: ALL fields required
5. id: generate unique like "HYP-001" for hypotheses, "AI-001" for insights
6. confidence_band: MUST be "Low", "Medium", or "High"
7. action_required: MUST be true or false (boolean)
8. horizon_relevance: array of time periods like ["1Y", "5Y"]
9. impact_score: number between 1-10
10. NEVER return null for any field

EXPECTED JSON OUTPUT FORMAT:
{
  "executive_summary": {
    "headline": "Company enters 2026 pivoting toward an AI Supercycle",
    "key_facts": [
      "FY2025 revenue reached record $416B (+6.4% YoY)",
      "Services segment hit $100B with high margins",
      "Management guided Q1 2026 revenue growth of 10-12% YoY",
      "Major product roadmap includes Siri 2.0 and foldable iPhone",
      "Disciplined AI capex at $12.7B vs peers' $70B+"
    ],
    "implications": [
      "AI platform launch is critical falsification point for bull thesis",
      "Biannual iPhone strategy aims to smooth seasonal volatility",
      "Conservative capex protects cash for M&A opportunities",
      "Vertical integration through custom silicon will be tested"
    ],
    "key_risks": [
      "AI Execution: Failure to deliver Siri 2.0 could label company as laggard",
      "Supply Chain: Expiring memory contracts expose to doubling DRAM prices",
      "Regulatory: US antitrust trial and EU DMA compliance threaten Services"
    ],
    "thesis_status": "intact"
  },
  "hypotheses": [
    {
      "id": "HYP-001",
      "type": "Growth",
      "title": "AI-Driven Replacement Cycle",
      "summary": "Apple Intelligence will trigger massive upgrade cycle",
      "details": "Requirement for high-end silicon to run AI features will force users on older models to upgrade",
      "assumptions": [
        "Siri 2.0 provides must-have utility",
        "Consumer willingness to pay Pro premiums remains high",
        "Carrier subsidies continue"
      ],
      "falsification_criteria": [
        "iPhone revenue growth drops below 5% in H2 2026",
        "Siri 2.0 launch delayed beyond Spring 2026",
        "Low user engagement with AI features"
      ],
      "confidence_band": "High",
      "source": "Analyst reports and earnings calls",
      "generated_at": "2026-01-07T10:30:00Z",
      "horizon_relevance": ["1Y", "2Y"],
      "impact_score": 9,
      "action_required": false
    },
    {
      "id": "HYP-002",
      "type": "Margin",
      "title": "Vertical Integration Offsets Inflation",
      "summary": "In-house modems and custom silicon will preserve 45%+ margins",
      "details": "Replacing Qualcomm modems extracts enough margin to offset rising component costs",
      "assumptions": [
        "Custom modem achieves performance parity",
        "TSMC pricing remains favorable",
        "India diversification lowers assembly costs"
      ],
      "falsification_criteria": [
        "Gross margins contract by >150bps for two quarters",
        "Custom modem launch cancelled due to performance",
        "DRAM contracts result in 20%+ higher costs"
      ],
      "confidence_band": "Medium",
      "source": "Supply chain analysis",
      "generated_at": "2026-01-07T10:30:00Z",
      "horizon_relevance": ["1Y", "3Y"],
      "impact_score": 7,
      "action_required": true
    }
  ],
  "ai_insights": [
    {
      "id": "AI-001",
      "type": "Strategy",
      "title": "Rent-Not-Build AI Strategy Advantage",
      "summary": "Partnering for AI vs building is superior capital allocation",
      "details": "While peers spend $50-70B/year on datacenters, $12B capex leaves $130B for M&A when valuations rationalize",
      "assumptions": [
        "Foundational LLMs become commoditized",
        "On-device processing remains privacy moat",
        "$130B cash stays liquid"
      ],
      "falsification_criteria": [
        "Competitor develops proprietary killer app LLM",
        "Forced to massively increase capex for own infrastructure",
        "Cloud AI latency makes partnerships obsolete"
      ],
      "confidence_band": "High",
      "source": "AI industry analysis",
      "generated_at": "2026-01-07T10:30:00Z",
      "horizon_relevance": ["1Y", "5Y"],
      "impact_score": 8,
      "action_required": false
    }
  ]
}

Return ONLY this JSON structure. No markdown, no code blocks, no explanations.`,

    partialSchema: investorDashboardSchema.pick({
      executive_summary: true,
      hypotheses: true,
      ai_insights: true,
    }),
  },

  {
    index: 4,
    name: "operational_metrics",
    llmModel: "gpt-4.1",
    schemaFields: [
      "base_metrics (operational: headcount, arr, cac, ltv, customer_count, churn, etc.)",
      "unit_economics (cac, ltv, ltv_cac_ratio, payback_period_months, investor_context)",
      "segments[] (name, revenue, growth, margin)"
    ],
    buildSystemPrompt: () => `You are an expert operational analyst. Analyze the provided  search data and generate comprehensive operational metrics.

YOUR RESPONSIBILITY: Analyze and return operational_metrics shard data.

CRITICAL REQUIREMENTS:
1. ANALYZE the data - provide investor-grade operational metrics
2. Return ONLY valid JSON matching the schema
3. base_metrics: return numeric values (use 0 if unavailable)
4. unit_economics: ALL sub-fields required (cac, ltv, ltv_cac_ratio, payback_period_months, investor_context)
5. investor_context: ALL sub-fields required (provide meaningful analysis)
6. segments: must be array (use [] if no segment data)
7. Each segment: name, revenue, growth, margin ALL required with full metric structure
8. NEVER return null for any field

Return ONLY the JSON object. No markdown, no explanations, no preamble.`,

    buildPrompt: (geminiData: any) => `ANALYZE THIS MuseData Research Engine's SEARCH DATA AND GENERATE OPERATIONAL METRICS:

${JSON.stringify(geminiData, null, 2)}

YOUR SPECIFIC SCHEMA RESPONSIBILITY - Return ONLY these fields:

**base_metrics** (operational fields only):
- Operational: headcount, rd_spend, sm_spend
- SaaS/Subscription: arr, arr_prior, new_arr, expansion_arr, contraction_arr, churned_arr, monthly_churn_percent, arpa, gross_margin_percent, average_customer_lifespan_months
- Customers: customer_count, top_customer_revenue_percent, top_3_customer_revenue_percent, top_10_customer_revenue_percent
- Suppliers: top_supplier_spend_percent, top_5_supplier_spend_percent

**unit_economics**:
{
  "cac": {value, formatted, source, source_reference},
  "ltv": {value, formatted, source, source_reference},
  "ltv_cac_ratio": {value, formatted, source, source_reference},
  "payback_period_months": {value, formatted, source, source_reference},
  "investor_context": {
    "ltv_cac_interpretation": "Analysis text",
    "benchmark_comparison": "Comparison text",
    "trend_analysis": "Trend text",
    "risk_factors": ["Risk 1", "Risk 2"],
    "action_implications": "Implications text"
  }
}

**segments**: Array of business segments
[
  {
    "name": "Segment Name",
    "revenue": {value, formatted, source, source_reference},
    "growth": {value, formatted, source, source_reference},
    "margin": {value, formatted, source, source_reference}
  }
]

🚨 CRITICAL ANTI-NULL REQUIREMENTS:
1. base_metrics: use 0 for unavailable numbers
2. unit_economics: ALL 5 fields required (cac, ltv, ltv_cac_ratio, payback_period_months, investor_context)
3. Each metric in unit_economics: {value, formatted, source, source_reference} ALL required
4. investor_context: ALL 5 sub-fields required (provide "Not Available" if unknown, but try to analyze)
5. segments: array (use [] if no segments)
6. Each segment: ALL fields required (name, revenue, growth, margin)
7. For SaaS metrics: if company is not SaaS, use 0 and note "Not Applicable - Not a SaaS business"
8. ALWAYS include source_reference for every value

EXPECTED JSON OUTPUT FORMAT:
{
  "base_metrics": {
    "headcount": 164000,
    "rd_spend": 34550000000,
    "sm_spend": 27601000000,
    "arr": 109158000000,
    "arr_prior": 96169000000,
    "new_arr": 12989000000,
    "expansion_arr": 0,
    "contraction_arr": 0,
    "churned_arr": 0,
    "monthly_churn_percent": 0.5,
    "arpa": 109,
    "gross_margin_percent": 46.9,
    "average_customer_lifespan_months": 51,
    "customer_count": 1000000000,
    "top_customer_revenue_percent": 0.0,
    "top_3_customer_revenue_percent": 0.0,
    "top_10_customer_revenue_percent": 0.0,
    "top_supplier_spend_percent": 0.0,
    "top_5_supplier_spend_percent": 0.0
  },
  "unit_economics": {
    "cac": {
      "value": 27.6,
      "formatted": "$27.60",
      "source": "Estimated from SG&A",
      "source_reference": {
        "url": "https://example.com/10k",
        "document_type": "10-K",
        "excerpt": "Total SG&A applied against ecosystem growth",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "ltv": {
      "value": 8000.0,
      "formatted": "$8,000",
      "source": "Market Analysis",
      "source_reference": {
        "url": "https://mercury.one/analysis",
        "document_type": "Market Analysis",
        "excerpt": "Estimated customer worth $8,000 over 20-year lifespan",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "ltv_cac_ratio": {
      "value": 289.8,
      "formatted": "289.8x",
      "source": "Calculated",
      "source_reference": {
        "url": "Calculated",
        "document_type": "Analysis",
        "excerpt": "LTV ($8,000) / CAC ($27.60) = 289.8",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "payback_period_months": {
      "value": 6,
      "formatted": "6 months",
      "source": "Estimated",
      "source_reference": {
        "url": "https://example.com/analysis",
        "document_type": "Analysis",
        "excerpt": "High ARPU and ecosystem lock-in results in rapid payback",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "investor_context": {
      "ltv_cac_interpretation": "Extremely high ratio reflecting unique brand equity where customers self-acquire through retail and organic demand",
      "benchmark_comparison": "Incomparable to B2B SaaS; significantly outperforms consumer electronics benchmarks",
      "trend_analysis": "LTV increasing as company transitions users from hardware-only to hardware+services models",
      "risk_factors": [
        "Antitrust regulations targeting App Store could impact Services margins",
        "Hardware replacement cycles lengthening beyond current average",
        "Saturation in core markets limiting new user acquisition"
      ],
      "action_implications": "Prioritize Apple Intelligence integration to maintain premium pricing and extend replacement cycle"
    }
  },
  "segments": [
    {
      "name": "iPhone",
      "revenue": {
        "value": 209586000000,
        "formatted": "$209.59B",
        "source": "FY2025 Financial Results",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "iPhone net sales were $209,586 million",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      },
      "growth": {
        "value": 4.1,
        "formatted": "4.1%",
        "source": "FY2025 Financial Results",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "Increased from $201,183 million in 2024",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      },
      "margin": {
        "value": 36.8,
        "formatted": "36.8%",
        "source": "Estimated Product Margin",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "Total Product gross margin was 36.8%",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      }
    },
    {
      "name": "Services",
      "revenue": {
        "value": 109158000000,
        "formatted": "$109.16B",
        "source": "FY2025 Financial Results",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "Services net sales were $109,158 million",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      },
      "growth": {
        "value": 13.5,
        "formatted": "13.5%",
        "source": "FY2025 Financial Results",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "Increased from $96,169 million in 2024",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      },
      "margin": {
        "value": 75.4,
        "formatted": "75.4%",
        "source": "FY2025 Financial Results",
        "source_reference": {
          "url": "https://example.com/10k",
          "document_type": "10-K",
          "excerpt": "Services gross margin was 75.4%",
          "accessed_at": "2026-01-07T10:30:00Z"
        }
      }
    }
  ]
}

Return ONLY this JSON structure. No markdown, no code blocks, no explanations.`,

    partialSchema: investorDashboardSchema.pick({
      base_metrics: true,
      unit_economics: true,
      segments: true,
    }),
  },

  {
    index: 5,
    name: "time_series",
    llmModel: "gpt-4.1",
    schemaFields: [
      "time_series (stock_price, revenue, ebitda, volume)",
      "All with horizons: 1D, 1W, 1M, 1Y, 5Y, 10Y",
      "Each horizon: quarters{Q1-Q4}, high, low, average, volatility, change_percent"
    ],
    buildSystemPrompt: () => `You are an expert time-series analyst. Analyze the provided search data and generate comprehensive historical data.

YOUR RESPONSIBILITY: Analyze and return time_series shard data.

CRITICAL REQUIREMENTS:
1. ANALYZE the data - extract and structure all historical time-series data
2. Return ONLY valid JSON matching the schema
3. ALL 4 metrics required: stock_price, revenue, ebitda, volume
4. Each metric: ALL 6 horizons required (1D, 1W, 1M, 1Y, 5Y, 10Y)
5. Each horizon: ALL fields required (quarters{Q1-Q4}, high, low, average, volatility, change_percent)
6. Use 0 for unavailable numeric values
7. quarters object: Q1, Q2, Q3, Q4 ALL required (use 0 for short-term horizons like 1D, 1W, 1M)
8. NEVER return null for any field

Return ONLY the JSON object. No markdown, no explanations, no preamble.`,

    buildPrompt: (geminiData: any) => `ANALYZE THIS MuseData Research Engine's SEARCH DATA AND GENERATE TIME-SERIES DATA:

${JSON.stringify(geminiData, null, 2)}

YOUR SPECIFIC SCHEMA RESPONSIBILITY - Return ONLY these fields:

**time_series**: Historical data for charting
Structure for each of these 4 metrics: stock_price, revenue, ebitda, volume

{
  "horizons": {
    "1D": {quarters: {Q1,Q2,Q3,Q4}, high, low, average, volatility, change_percent},
    "1W": {quarters: {Q1,Q2,Q3,Q4}, high, low, average, volatility, change_percent},
    "1M": {quarters: {Q1,Q2,Q3,Q4}, high, low, average, volatility, change_percent},
    "1Y": {quarters: {Q1,Q2,Q3,Q4}, high, low, average, volatility, change_percent},
    "5Y": {quarters: {Q1,Q2,Q3,Q4}, high, low, average, volatility, change_percent},
    "10Y": {quarters: {Q1,Q2,Q3,Q4}, high, low, average, volatility, change_percent}
  },
  "availability": "Available" | "Not Available",
  "confidence": 0.95 (number 0-1),
  "data_quality": {coverage, auditability, freshness_days},
  "source": "Source name",
  "decision_context": {confidence_level, sufficiency_status, knowns[], unknowns[]}
}

🚨 CRITICAL ANTI-NULL REQUIREMENTS:
1. ALL 4 metrics present: stock_price, revenue, ebitda, volume
2. Each metric: ALL 6 horizons present (1D, 1W, 1M, 1Y, 5Y, 10Y)
3. Each horizon: ALL 6 fields present (use 0 if unavailable)
4. quarters: Q1, Q2, Q3, Q4 ALL required
   - For 1D, 1W, 1M: use 0 for all quarters
   - For 1Y, 5Y, 10Y: provide actual quarterly data or 0
5. availability: string (use "Available" or "Not Available")
6. confidence: number 0-1 (use 0.5 if unknown)
7. data_quality: ALL sub-fields required (use 0 for numbers if unknown)
8. decision_context: ALL sub-fields required (use [] for arrays, "Unknown" for strings)
9. For revenue/ebitda: 1D, 1W, 1M horizons should be all 0s (no intra-period data)
10. ALWAYS include source and decision_context

EXPECTED JSON OUTPUT FORMAT - This is a sample, replicate for all 4 metrics:
{
  "time_series": {
    "stock_price": {
      "horizons": {
        "1D": {
          "quarters": {"Q1": 0, "Q2": 0, "Q3": 0, "Q4": 0},
          "high": 267.70,
          "low": 262.12,
          "average": 264.91,
          "volatility": 1.83,
          "change_percent": -1.83
        },
        "1W": {
          "quarters": {"Q1": 0, "Q2": 0, "Q3": 0, "Q4": 0},
          "high": 277.84,
          "low": 262.12,
          "average": 269.98,
          "volatility": 3.92,
          "change_percent": -3.66
        },
        "1M": {
          "quarters": {"Q1": 0, "Q2": 0, "Q3": 0, "Q4": 0},
          "high": 288.62,
          "low": 262.12,
          "average": 275.37,
          "volatility": 6.31,
          "change_percent": -6.48
        },
        "1Y": {
          "quarters": {"Q1": 182.40, "Q2": 210.60, "Q3": 225.80, "Q4": 272.21},
          "high": 288.62,
          "low": 169.21,
          "average": 232.48,
          "volatility": 18.63,
          "change_percent": 7.39
        },
        "5Y": {
          "quarters": {"Q1": 121.40, "Q2": 136.70, "Q3": 175.20, "Q4": 271.01},
          "high": 288.62,
          "low": 116.21,
          "average": 184.30,
          "volatility": 45.0,
          "change_percent": 104.39
        },
        "10Y": {
          "quarters": {"Q1": 25.40, "Q2": 48.90, "Q3": 115.30, "Q4": 262.36},
          "high": 288.62,
          "low": 22.50,
          "average": 134.50,
          "volatility": 92.4,
          "change_percent": 963.48
        }
      },
      "availability": "Available",
      "confidence": 0.98,
      "data_quality": {
        "coverage": 1.0,
        "auditability": 1.0,
        "freshness_days": 0
      },
      "source": "Nasdaq / Market Data",
      "decision_context": {
        "confidence_level": "High",
        "sufficiency_status": "Sufficient",
        "knowns": ["Real-time price data", "Historical splits adjusted"],
        "unknowns": []
      }
    },
    "revenue": {
      "horizons": {
        "1D": {
          "quarters": {"Q1": 0, "Q2": 0, "Q3": 0, "Q4": 0},
          "high": 0,
          "low": 0,
          "average": 0,
          "volatility": 0,
          "change_percent": 0
        },
        "1W": {
          "quarters": {"Q1": 0, "Q2": 0, "Q3": 0, "Q4": 0},
          "high": 0,
          "low": 0,
          "average": 0,
          "volatility": 0,
          "change_percent": 0
        },
        "1M": {
          "quarters": {"Q1": 0, "Q2": 0, "Q3": 0, "Q4": 0},
          "high": 0,
          "low": 0,
          "average": 0,
          "volatility": 0,
          "change_percent": 0
        },
        "1Y": {
          "quarters": {"Q1": 90753000000, "Q2": 85777000000, "Q3": 94930000000, "Q4": 124300000000},
          "high": 124300000000,
          "low": 85777000000,
          "average": 98940000000,
          "volatility": 6.43,
          "change_percent": 6.43
        },
        "5Y": {
          "quarters": {"Q1": 58313000000, "Q2": 81434000000, "Q3": 90146000000, "Q4": 124300000000},
          "high": 124300000000,
          "low": 58313000000,
          "average": 88548250000,
          "volatility": 32.4,
          "change_percent": 41.5
        },
        "10Y": {
          "quarters": {"Q1": 42358000000, "Q2": 53265000000, "Q3": 64698000000, "Q4": 124300000000},
          "high": 124300000000,
          "low": 42358000000,
          "average": 71155250000,
          "volatility": 58.2,
          "change_percent": 112.4
        }
      },
      "availability": "Available",
      "confidence": 0.95,
      "data_quality": {
        "coverage": 0.95,
        "auditability": 1.0,
        "freshness_days": 102
      },
      "source": "SEC Filings",
      "decision_context": {
        "confidence_level": "High",
        "sufficiency_status": "Sufficient",
        "knowns": ["TTM Revenue from 10-K", "Quarterly data available"],
        "unknowns": ["Current Q1 2026 revenue (reporting Jan 29)"]
      }
    },
    "ebitda": {
      ... similar structure ...
    },
    "volume": {
      ... similar structure ...
    }
  }
}

Return ONLY this JSON structure. No markdown, no code blocks, no explanations.`,

    partialSchema: investorDashboardSchema.pick({
      time_series: true,
    }),
  },

  {
    index: 6,
    name: "market_position",
    llmModel: "gpt-4.1",
    schemaFields: [
      "guidance_bridge (low, high, current_consensus, gap_percent)",
      "revisions_momentum (direction, magnitude, trend)",
      "net_cash_or_debt, buyback_capacity, sbc_percent_revenue, share_count_trend"
    ],
    buildSystemPrompt: () => `You are an expert market analyst. Analyze the provided search data and generate comprehensive market positioning metrics.

YOUR RESPONSIBILITY: Analyze and return market_position shard data.

CRITICAL REQUIREMENTS:
1. ANALYZE the data - provide guidance analysis and capital allocation metrics
2. Return ONLY valid JSON matching the schema
3. guidance_bridge: ALL sub-fields required (low, high, current_consensus, gap_percent) with full metric structure
4. revisions_momentum.direction: must be "up", "down", or "stable"
5. ALL 4 public market metrics required with FULL metric structure
6. Each metric: value, formatted, unit, source, source_reference, availability, confidence, data_quality, decision_context ALL required
7. NEVER return null for any field

Return ONLY the JSON object. No markdown, no explanations, no preamble.`,

    buildPrompt: (geminiData: any) => `ANALYZE THIS MuseData Research Engine's SEARCH DATA AND GENERATE MARKET POSITIONING METRICS:

${JSON.stringify(geminiData, null, 2)}

YOUR SPECIFIC SCHEMA RESPONSIBILITY - Return ONLY these fields:

**guidance_bridge**: Company guidance vs analyst consensus
{
  "low": {value, formatted, source, source_reference},
  "high": {value, formatted, source, source_reference},
  "current_consensus": {value, formatted, source, source_reference},
  "gap_percent": {value, formatted, source, source_reference},
  "last_updated": "ISO timestamp"
}

**revisions_momentum**: Analyst estimate changes
{
  "direction": "up" | "down" | "stable",
  "magnitude": {value, formatted, source, source_reference},
  "trend": "Descriptive trend analysis",
  "last_updated": "ISO timestamp"
}

**Public Market Metrics** (each with FULL metric schema):
- net_cash_or_debt
- buyback_capacity
- sbc_percent_revenue
- share_count_trend

Each metric structure:
{
  "value": number,
  "formatted": "formatted string",
  "unit": "USD" | "percent" | etc,
  "source": "source name",
  "source_reference": {url, document_type, excerpt, accessed_at},
  "availability": "Available" | "Not Available",
  "confidence": number 0-1,
  "data_quality": {coverage, auditability, freshness_days},
  "decision_context": {confidence_level, sufficiency_status, knowns[], unknowns[]}
}

🚨 CRITICAL ANTI-NULL REQUIREMENTS:
1. guidance_bridge: ALL 4 sub-fields required (low, high, current_consensus, gap_percent)
2. Each sub-field: {value, formatted, source, source_reference} ALL required
3. Use 0 for numeric value if unavailable, note in source_reference
4. revisions_momentum.direction: MUST be "up", "down", or "stable"
5. ALL 4 public market metrics MUST be present with COMPLETE structure
6. Each metric: ALL 9 fields required (value, formatted, unit, source, source_reference, availability, confidence, data_quality, decision_context)
7. decision_context: ALL sub-fields required (use [] for arrays, "Unknown" for strings if needed)
8. data_quality: ALL 3 fields required (use 0 if unknown)
9. NEVER return null for any field

EXPECTED JSON OUTPUT FORMAT:
{
  "guidance_bridge": {
    "low": {
      "value": 131560000000,
      "formatted": "$131.56B",
      "source": "Management Guidance",
      "source_reference": {
        "url": "https://example.com/earnings",
        "document_type": "Earnings Call",
        "excerpt": "Guided for revenue of 10-12% growth",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "high": {
      "value": 133950000000,
      "formatted": "$133.95B",
      "source": "Management Guidance",
      "source_reference": {
        "url": "https://example.com/earnings",
        "document_type": "Earnings Call",
        "excerpt": "High end of guidance range",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "current_consensus": {
      "value": 137460000000,
      "formatted": "$137.46B",
      "source": "Zacks Consensus",
      "source_reference": {
        "url": "https://example.com/consensus",
        "document_type": "Analyst Consensus",
        "excerpt": "Consensus estimate of $137.46B",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "gap_percent": {
      "value": 3.54,
      "formatted": "3.54%",
      "source": "Calculated",
      "source_reference": {
        "url": "Calculated",
        "document_type": "Analysis",
        "excerpt": "Consensus exceeds midpoint by 3.54%",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "last_updated": "2026-01-07T10:30:00Z"
  },
  "revisions_momentum": {
    "direction": "up",
    "magnitude": {
      "value": 0.03,
      "formatted": "$0.03/share",
      "source": "Zacks",
      "source_reference": {
        "url": "https://example.com/revisions",
        "document_type": "Estimate Revisions",
        "excerpt": "Consensus raised by $0.03 over past 30 days",
        "accessed_at": "2026-01-07T10:30:00Z"
      }
    },
    "trend": "Upward momentum driven by strong product demand",
    "last_updated": "2026-01-07T10:30:00Z"
  },
  "net_cash_or_debt": {
    "value": 33760000000,
    "formatted": "$33.76B net cash",
    "unit": "USD",
    "source": "10-K Filing",
    "source_reference": {
      "url": "https://example.com/10k",
      "document_type": "10-K",
      "excerpt": "Cash $132.42B less debt $98.66B",
      "accessed_at": "2026-01-07T10:30:00Z"
    },
    "availability": "Available",
    "confidence": 1.0,
    "data_quality": {
      "coverage": 1.0,
      "auditability": 1.0,
      "freshness_days": 102
    },
    "decision_context": {
      "confidence_level": "High",
      "sufficiency_status": "Sufficient",
      "knowns": ["Cash and debt from balance sheet"],
      "unknowns": ["Intra-quarter changes"]
    }
  },
  "buyback_capacity": {
    "value": 90000000000,
    "formatted": "$90B authorized",
    "unit": "USD",
    "source": "Company Announcement",
    "source_reference": {
      "url": "https://example.com/pr",
      "document_type": "Press Release",
      "excerpt": "$110B program with est. $90B remaining",
      "accessed_at": "2026-01-07T10:30:00Z"
    },
    "availability": "Available",
    "confidence": 0.9,
    "data_quality": {
      "coverage": 1.0,
      "auditability": 0.9,
      "freshness_days": 102
    },
    "decision_context": {
      "confidence_level": "High",
      "sufficiency_status": "Sufficient",
      "knowns": ["$110B authorization", "$20B repurchased in Q4"],
      "unknowns": ["Exact remaining balance"]
    }
  },
  "sbc_percent_revenue": {
    "value": 3.09,
    "formatted": "3.09%",
    "unit": "percent",
    "source": "10-K Filing",
    "source_reference": {
      "url": "https://example.com/10k",
      "document_type": "10-K",
      "excerpt": "SBC $12.86B on revenue $416B",
      "accessed_at": "2026-01-07T10:30:00Z"
    },
    "availability": "Available",
    "confidence": 0.98,
    "data_quality": {
      "coverage": 1.0,
      "auditability": 1.0,
      "freshness_days": 102
    },
    "decision_context": {
      "confidence_level": "High",
      "sufficiency_status": "Sufficient",
      "knowns": ["FY2025 SBC expense", "FY2025 Revenue"],
      "unknowns": ["Quarterly variance in timing"]
    }
  },
  "share_count_trend": {
    "value": -2.62,
    "formatted": "-2.62% YoY",
    "unit": "percent",
    "source": "Macrotrends",
    "source_reference": {
      "url": "https://macrotrends.net",
      "document_type": "Financial Analysis",
      "excerpt": "2025 shares 15.005B, 2.62% decline from 2024",
      "accessed_at": "2026-01-07T10:30:00Z"
    },
    "availability": "Available",
    "confidence": 1.0,
    "data_quality": {
      "coverage": 1.0,
      "auditability": 1.0,
      "freshness_days": 102
    },
    "decision_context": {
      "confidence_level": "High",
      "sufficiency_status": "Sufficient",
      "knowns": ["Diluted shares 15.005B", "Historical 2.5-3.5% annual reduction"],
      "unknowns": []
    }
  }
}

Return ONLY this JSON structure. No markdown, no code blocks, no explanations.`,

    partialSchema: investorDashboardSchema.pick({
      guidance_bridge: true,
      revisions_momentum: true,
      net_cash_or_debt: true,
      buyback_capacity: true,
      sbc_percent_revenue: true,
      share_count_trend: true,
    }),
  },

  {
    index: 7,
    name: "events_timeline",
    llmModel: "gpt-4.1",
    schemaFields: [
      "events[] (recent material events)",
      "changes_since_last_run[] (material changes)",
      "path_indicators[] (thesis progress tracking)",
      "position_sizing, variant_view"
    ],
    buildSystemPrompt: () => `You are an expert events analyst. Analyze the provided search data and generate comprehensive events timeline and thesis tracking.

YOUR RESPONSIBILITY: Analyze and return events_timeline shard data.

CRITICAL REQUIREMENTS:
1. ANALYZE the data - identify and structure recent material events and changes
2. Return ONLY valid JSON matching the schema
3. events, changes_since_last_run, path_indicators ALL must be arrays (use [] if empty)
4. Each event: ALL fields required (id, date, type, title, description, impact, source_url)
5. Each change: ALL fields required including thesis_pillar, so_what, action
6. position_sizing: ALL numeric fields required
7. variant_view: summary (string) and sensitivity (array) both required
8. Generate unique IDs like "EVT-001", "CHG-001"
9. NEVER return null for any field

Return ONLY the JSON object. No markdown, no explanations, no preamble.`,

    buildPrompt: (geminiData: any) => `ANALYZE THIS MuseData Research Engine's SEARCH DATA AND GENERATE EVENTS TIMELINE:

${JSON.stringify(geminiData, null, 2)}

YOUR SPECIFIC SCHEMA RESPONSIBILITY - Return ONLY these fields:

**events[]**: Recent material events (last 90 days)
[
  {
    "id": "EVT-001",
    "date": "YYYY-MM-DD",
    "type": "Earnings" | "Product Launch" | "M&A" | "Regulatory" | etc,
    "title": "Event title",
    "description": "Detailed description",
    "impact": "Positive/Negative/Neutral - Impact assessment",
    "source_url": "URL"
  }
]

**changes_since_last_run[]**: Material changes affecting thesis
[
  {
    "id": "CHG-001",
    "timestamp": "ISO timestamp",
    "category": "Category",
    "title": "Change title",
    "description": "Change description",
    "source_url": "URL",
    "thesis_pillar": "Which thesis pillar affected",
    "so_what": "Why this matters",
    "action": "What action to take"
  }
]

**path_indicators[]**: Thesis progress indicators
[
  {
    "label": "Indicator name",
    "value": "Current value",
    "status": "On Track" | "Ahead" | "Behind" | "At Risk",
    "next_check": "When to check next"
  }
]

**position_sizing**:
{
  "current_percent": number,
  "max_percent": number,
  "target_low": number,
  "target_high": number
}

**variant_view**:
{
  "summary": "Alternative perspective text",
  "sensitivity": [
    {
      "label": "Scenario description",
      "impact": "Impact description"
    }
  ]
}

🚨 CRITICAL ANTI-NULL REQUIREMENTS:
1. events, changes_since_last_run, path_indicators: ALL must be arrays (use [] if empty)
2. Each event: ALL 7 fields required (generate IDs like "EVT-001")
3. Each change: ALL 8 fields required (generate IDs like "CHG-001")
4. Each path_indicator: ALL 4 fields required
5. position_sizing: ALL 4 numeric fields required (use 0 if unknown)
6. variant_view: BOTH summary (string) and sensitivity (array) required
7. Each sensitivity item: BOTH label and impact required (strings)
8. If no recent events: return [] but consider noting in first event why none found
9. NEVER return null for any field

EXPECTED JSON OUTPUT FORMAT:
{
  "events": [
    {
      "id": "EVT-001",
      "date": "2025-12-15",
      "type": "Earnings",
      "title": "Q4 FY24 Earnings Beat",
      "description": "Reported Q4 revenue of $32B vs $31.2B consensus, EPS $1.85 vs $1.72 consensus",
      "impact": "Positive - Beat-and-raise quarter reinforces growth trajectory",
      "source_url": "https://example.com/earnings"
    },
    {
      "id": "EVT-002",
      "date": "2025-12-20",
      "type": "Product Launch",
      "title": "AI Platform Launch",
      "description": "Announced next-gen AI platform with 50% performance improvement",
      "impact": "Positive - Strengthens competitive position",
      "source_url": "https://example.com/pr"
    }
  ],
  "changes_since_last_run": [
    {
      "id": "CHG-001",
      "timestamp": "2025-12-15T16:00:00Z",
      "category": "Financial Performance",
      "title": "Q4 Revenue Beat by 2.5%",
      "description": "Quarterly revenue exceeded consensus by $800M",
      "source_url": "https://example.com/earnings",
      "thesis_pillar": "Growth Acceleration",
      "so_what": "Validates cloud adoption acceleration thesis",
      "action": "Maintain position; monitor Q1 for confirmation"
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
    }
  ],
  "position_sizing": {
    "current_percent": 4.5,
    "max_percent": 7.0,
    "target_low": 4.0,
    "target_high": 6.0
  },
  "variant_view": {
    "summary": "Bears argue valuation stretched at 25x forward earnings, and competitive threats could pressure margins",
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
        "label": "AI platform adoption exceeds expectations",
        "impact": "Revenue upside of 5-10%, stock up 15-25%"
      }
    ]
  }
}

Return ONLY this JSON structure. No markdown, no code blocks, no explanations.`,

    partialSchema: investorDashboardSchema.pick({
      events: true,
      changes_since_last_run: true,
      path_indicators: true,
      position_sizing: true,
      variant_view: true,
    }),
  },
];

// ============================================================================
// MERGE LOGIC
// ============================================================================

function mergeShardData(
  shardResults: Array<{ shardIndex: number; shardName: string; data: any }>,
  geminiResults?: any[]
): any {
  console.log("🔀 Merging shard data...");

  const sorted = shardResults.sort((a, b) => a.shardIndex - b.shardIndex);

  // Initialize with defaults to ensure no nulls
  const merged: any = {
    company_type: "public", // Default - will be overridden if in shard data
    run_metadata: {
      run_id: `run_${Date.now()}`,
      timestamp: new Date().toISOString(),
    },
    changes_since_last_run: [],
    risks: {
      regulatory: [],
      market: [],
      operational: [],
      cybersecurity: [],
      financial: [],
      strategic: [],
    },
  };

  // Merge each shard
  sorted.forEach(shard => {
    console.log(`  Merging shard ${shard.shardIndex} (${shard.shardName})`);
    
    Object.keys(shard.data).forEach(key => {
      const value = shard.data[key];
      
      if (value === undefined || value === null) {
        return; // Skip null/undefined
      }
      
      if (key === 'base_metrics') {
        // Deep merge base_metrics (comes from shards 1 and 4)
        merged.base_metrics = {
          ...merged.base_metrics,
          ...value,
        };
      } else if (key === 'risks') {
        // Merge all 6 risk categories
        merged.risks = {
          regulatory: [...(merged.risks?.regulatory || []), ...(value.regulatory || [])],
          market: [...(merged.risks?.market || []), ...(value.market || [])],
          operational: [...(merged.risks?.operational || []), ...(value.operational || [])],
          cybersecurity: [...(merged.risks?.cybersecurity || []), ...(value.cybersecurity || [])],
          financial: [...(merged.risks?.financial || []), ...(value.financial || [])],
          strategic: [...(merged.risks?.strategic || []), ...(value.strategic || [])],
        };
      } else if (Array.isArray(value)) {
        // For other arrays, concatenate
        merged[key] = [...(merged[key] || []), ...value];
      } else if (typeof value === 'object' && !Array.isArray(value)) {
        // For objects, deep merge
        merged[key] = { ...merged[key], ...value };
      } else {
        // For primitives, use the value
        merged[key] = value;
      }
    });
  });

  console.log("✅ Merge complete");
  console.log(`📊 Final structure has ${Object.keys(merged).length} top-level keys`);
  
  return merged;
}

// ============================================================================
// LEGACY SINGLE-SCRAPER FLOW (Backward Compatibility)
// ============================================================================
