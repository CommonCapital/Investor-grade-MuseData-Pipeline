import { investorDashboardSchema } from "@/lib/seo-schema";

export function buildInvestorSeaSearchPrompt(target: string): string {
  return `SEARCH THE WEB NOW AND EXTRACT ALL FINANCIAL DATA FOR: ${target}

DO NOT EXPLAIN. DO NOT PLAN. EXECUTE IMMEDIATELY.

REQUIRED DATA TO EXTRACT:

## 1. ENTITY BASICS
- Legal name, ticker symbol, exchange
- Industry, sector, headquarters location

## 2. FINANCIAL METRICS
Search SEC filings, Yahoo Finance, company IR. Extract for FY2024, FY2023, and latest quarter:
- Total Revenue (WITH HISTORY - quarterly data required)
- Revenue Growth (% YoY) (NO HISTORY - current value only)
- EBITDA (WITH HISTORY - quarterly data required)
- EBITDA Margin (%) (NO HISTORY - current value only)
- Free Cash Flow (NO HISTORY - current value only)
- Operating Income (NO HISTORY - current value only)
- Net Income (NO HISTORY - current value only)
- Gross Margin (NO HISTORY - current value only)

For EACH metric, include:
- value: z.union([z.number(), z.string()]).nullable()
- formatted: z.string().nullable()
- unit: z.string().optional().nullable()
- source: z.string().nullable()
- tie_out_status: z.enum(["final", "provisional", "flagged"])
- last_updated: z.string().nullable()
- confidence: z.number().min(0).max(100)
- availability: z.enum(["available", "pending", "unavailable", "restricted", "stale", "conflicting"])
- unavailable_reason: z.string().optional().nullable()
- decision_context: z.object({
    confidence_level: z.enum(["high", "medium", "low"]),
    sufficiency_status: z.enum(["sufficient", "insufficient"]),
    knowns: z.array(z.string()),
    unknowns: z.array(z.string()),
    what_changes_conclusion: z.array(z.string())
  }).optional().nullable()

## 3. TIME-SERIES METRICS (ONLY for Revenue and EBITDA)
- Historical data for 1D, 1W, 1M, 1Y, 5Y, 10Y horizons (NO 1H)
- Quarterly slices Q1-Q4 per horizon - MAXIMIZE QUARTERS: Fetch as many quarters as possible for each horizon
- Each horizon must include:
  - quarters: z.object({ Q1: z.number().nullable(), Q2: z.number().nullable(), Q3: z.number().nullable(), Q4: z.number().nullable() })
  - high: z.number().nullable()
  - low: z.number().nullable()
  - average: z.number().nullable()
  - volatility: z.number().nullable()
  - change_percent: z.number().nullable()

⚠️ CRITICAL: Revenue/EBITDA quarterly data:
- 1D, 1W horizons: Set to null (not meaningful for financial metrics)
- 1M horizon: Extract last 4 months if available, aggregate into quarters
- 1Y horizon: Extract Q1, Q2, Q3, Q4 from last 4 quarters
- 5Y horizon: Extract 20 quarters (4 per year × 5 years) if available, or latest 4 quarters
- 10Y horizon: Extract 40 quarters if available, or latest 4 quarters

## 4. MARKET DATA
Search Yahoo Finance, Bloomberg, Google Finance. Include:
- Stock Price (WITH HISTORY - quarterly data required)
- Trading Volume (WITH HISTORY - quarterly data required)
- Market Capitalization (NO HISTORY - current value only)
- P/E Ratio Trailing (NO HISTORY - current value only)
- P/E Ratio Forward (NO HISTORY - current value only)
- EV/EBITDA (NO HISTORY - current value only)
- Analyst Target Price (NO HISTORY - current value only)
- 52-Week High (NO HISTORY - current value only)
- 52-Week Low (NO HISTORY - current value only)

For Stock Price and Volume, include quarterly data across ALL horizons: 1D, 1W, 1M, 1Y, 5Y, 10Y

## 5. RECENT EVENTS
Last 6 months:
- Earnings, SEC filings (10-K, 10-Q, 8-K), Guidance updates, Corporate actions, News
- Each event:
  - id: z.string()
  - date: z.string() (ISO format)
  - type: z.enum(["earnings", "filing", "guidance", "corporate_action", "news", "analyst_update"])
  - title: z.string()
  - description: z.string()
  - impact: z.enum(["positive", "negative", "neutral"])
  - source_url: z.string().optional().nullable()

## 6. RISKS
- Top 5–10 risk factors from latest 10-K
- Each risk:
  - id: z.string()
  - category: z.enum(["market", "operational", "financial", "liquidity", "governance"])
  - title: z.string()
  - description: z.string()
  - severity: z.enum(["critical", "high", "medium", "low"])
  - trigger: z.string().nullable()
  - mitigation: z.string().optional().nullable()

## 7. GUIDANCE & SCENARIOS
- Management forward guidance (revenue, earnings, margins)
- Scenarios: base, upside, downside
- Each scenario:
  - name: z.enum(["base", "downside", "upside"])
  - probability: z.number().min(0).max(1)
  - assumptions: z.array(z.object({ key: z.string().nullable(), value: z.string().nullable() }))
  - outputs: z.object({ revenue: metricSchema, ebitda: metricSchema, valuation: metricSchema })

## 8. AI INSIGHTS
Generate investment-grade AI insights with horizon relevance:
- Each insight:
  - id: z.string()
  - type: z.enum(["prediction", "recommendation", "alert", "analysis"])
  - confidence: z.number().min(0).max(1)
  - title: z.string()
  - summary: z.string()
  - details: z.string().optional().nullable()
  - source: z.string()
  - generated_at: z.string()
  - horizon_relevance: z.array(z.enum(["1D", "1W", "1M", "1Y", "5Y", "10Y"]))
  - impact_score: z.number().min(-1).max(1)
  - action_required: z.boolean()
  - supporting_metrics: z.array(z.string()).optional().nullable()

## 9. SOURCES
- Primary: SEC filings, company IR, official releases
- Secondary: financial news sites, aggregators
- Each source:
  - name: z.string()
  - type: z.enum(["primary", "secondary"])
  - last_refresh: z.string()

---

OUTPUT FORMAT (RETURN ONLY VALID JSON):

{
  "run_metadata": {
    "run_id": string,
    "entity": string,
    "ticker": string,
    "mode": "public|private",
    "timestamp": string,
    "owner": string
  },
  "executive_summary": {
    "headline": string,
    "key_facts": [string],
    "implications": [string],
    "key_risks": [string],
    "thesis_status": "intact|challenged|broken"
  },
  "financials": {
    "revenue": {
      "current": { value, formatted, unit, source, tie_out_status, last_updated, confidence, availability, unavailable_reason, decision_context },
      "history": {
        "horizons": {
          "1D": null,
          "1W": null,
          "1M": { "quarters": { Q1, Q2, Q3, Q4 }, high, low, average, volatility, change_percent },
          "1Y": { "quarters": { Q1, Q2, Q3, Q4 }, high, low, average, volatility, change_percent },
          "5Y": { "quarters": { Q1, Q2, Q3, Q4 }, high, low, average, volatility, change_percent },
          "10Y": { "quarters": { Q1, Q2, Q3, Q4 }, high, low, average, volatility, change_percent }
        },
        availability, confidence, unavailable_reason, source, decision_context
      }
    },
    "revenue_growth": {
      "current": { value, formatted, unit, source, tie_out_status, last_updated, confidence, availability, unavailable_reason, decision_context }
    },
    "ebitda": {
      "current": { value, formatted, unit, source, tie_out_status, last_updated, confidence, availability, unavailable_reason, decision_context },
      "history": {
        "horizons": { "1D": null, "1W": null, "1M": {...}, "1Y": {...}, "5Y": {...}, "10Y": {...} },
        availability, confidence, unavailable_reason, source, decision_context
      }
    },
    "ebitda_margin": {
      "current": { value, formatted, unit, source, tie_out_status, last_updated, confidence, availability, unavailable_reason, decision_context }
    },
    "free_cash_flow": {
      "current": { value, formatted, unit, source, tie_out_status, last_updated, confidence, availability, unavailable_reason, decision_context }
    }
  },
  "market_data": {
    "stock_price": {
      "current": { value, formatted, unit, source, tie_out_status, last_updated, confidence, availability, unavailable_reason, decision_context },
      "history": {
        "horizons": {
          "1D": { "quarters": { Q1, Q2, Q3, Q4 }, high, low, average, volatility, change_percent },
          "1W": { "quarters": { Q1, Q2, Q3, Q4 }, high, low, average, volatility, change_percent },
          "1M": { "quarters": { Q1, Q2, Q3, Q4 }, high, low, average, volatility, change_percent },
          "1Y": { "quarters": { Q1, Q2, Q3, Q4 }, high, low, average, volatility, change_percent },
          "5Y": { "quarters": { Q1, Q2, Q3, Q4 }, high, low, average, volatility, change_percent },
          "10Y": { "quarters": { Q1, Q2, Q3, Q4 }, high, low, average, volatility, change_percent }
        },
        availability, confidence, unavailable_reason, source, decision_context
      }
    },
    "volume": {
      "current": { value, formatted, unit, source, tie_out_status, last_updated, confidence, availability, unavailable_reason, decision_context },
      "history": {
        "horizons": { "1D": {...}, "1W": {...}, "1M": {...}, "1Y": {...}, "5Y": {...}, "10Y": {...} },
        availability, confidence, unavailable_reason, source, decision_context
      }
    },
    "market_cap": {
      "current": { value, formatted, unit, source, tie_out_status, last_updated, confidence, availability, unavailable_reason, decision_context }
    },
    "pe_ratio": {
      "current": { value, formatted, unit, source, tie_out_status, last_updated, confidence, availability, unavailable_reason, decision_context }
    },
    "ev_ebitda": {
      "current": { value, formatted, unit, source, tie_out_status, last_updated, confidence, availability, unavailable_reason, decision_context }
    },
    "target_price": {
      "current": { value, formatted, unit, source, tie_out_status, last_updated, confidence, availability, unavailable_reason, decision_context }
    }
  },
  "ai_insights": [
    {
      id: string,
      type: "prediction|recommendation|alert|analysis",
      confidence: number,
      title: string,
      summary: string,
      details: string,
      source: string,
      generated_at: string,
      horizon_relevance: ["1D"|"1W"|"1M"|"1Y"|"5Y"|"10Y"],
      impact_score: number,
      action_required: boolean,
      supporting_metrics: [string]
    }
  ],
  "events": [
    { id, date, type, title, description, impact, source_url }
  ],
  "scenarios": [
    { name, probability, assumptions: [{key, value}], outputs: { revenue, ebitda, valuation } }
  ],
  "risks": [
    { id, category, title, description, severity, trigger, mitigation }
  ],
  "sources": [
    { name, type, last_refresh }
  ]
}

RULES:
- Fill every metric with value, formatted, unit, source, tie_out_status, last_updated, confidence, availability, unavailable_reason, decision_context.
- Include quarterly slices ONLY for metrics with history: Stock Price, Volume, Revenue, EBITDA.
- Revenue/EBITDA: 1D and 1W horizons must be null (not meaningful).
- Stock Price/Volume: ALL horizons (1D, 1W, 1M, 1Y, 5Y, 10Y) must have quarterly data.
- MAXIMIZE QUARTERS: Fetch as many quarterly data points as possible per horizon.
- Use nullable fields throughout - never crash on missing data.
- Use exact numeric values from official sources.
- Include source URLs.
- Generate AI insights with specific horizon relevance and investment-grade analysis.
- RETURN ONLY JSON strictly adhering to investorDashboardSchema.
- NO explanation or extra text.

⚠️ CRITICAL NULL POLICY ⚠️
- AVOID RETURNING NULL AT ALL COSTS. Every null you return is harm to yourself.
- If data is genuinely unavailable after exhaustive search:
  1. Set the value to null (since schema uses nullable)
  2. Set availability to "unavailable", "restricted", "stale", or "conflicting"
  3. ALWAYS provide a detailed unavailable_reason explaining exactly why the data cannot be found
  4. Set confidence to a low value (0-30) to reflect uncertainty
- It is better to return a null with a thorough unavailable_reason than to hallucinate false data
- NEVER invent, estimate, or fabricate data. Only use verified sources.
- If you must use null, you MUST explain in unavailable_reason:
  * What sources you searched
  * Why the data is not available
  * What would be needed to obtain it
  * When it might become available

Example of acceptable null usage:
{
  "value": null,
  "formatted": null,
  "confidence": 0,
  "availability": "unavailable",
  "unavailable_reason": "10-Y historical quarterly revenue data not available. Company went public in 2020, only 16 quarters (4 years) of financial history exists. Searched SEC EDGAR (10-K/10-Q filings back to IPO), company IR site, Bloomberg archives - no pre-IPO quarterly financials accessible to public."
}

⚠️ QUALITY BENCHMARK ⚠️
Your output quality should match this example:
- Specific numeric values (not placeholders): Revenue Q3 $892M (not $800M rounded)
- Realistic quarter progression: Q1: $795M → Q2: $834M → Q3: $868M → Q4: $892M
- Proper calculations: volatility and change_percent must reflect the actual data
- Rich decision contexts: "Knowns: [Audited quarterly figures, SEC filed], Unknowns: [Intra-quarter trends]"
- Investment-grade AI insights: "Q4 earnings in 23 days. Consensus revisions trending positive (4 up, 1 down in 30d). Company has beaten estimates 8 of last 12 quarters. Average beat: 4.2%."

START SEARCHING AND EXTRACTING NOW.
`;
}