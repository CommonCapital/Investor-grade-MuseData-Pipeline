import { investorDashboardSchema } from "@/lib/seo-schema";

export function buildInvestorSeaSearchPrompt(target: string): string {
  return `SEARCH THE WEB NOW AND EXTRACT ALL FINANCIAL DATA FOR: ${target}

DO NOT EXPLAIN. DO NOT PLAN. EXECUTE IMMEDIATELY.

You are operating under a STRICT SCHEMA CONTRACT. Any deviation is invalid.

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

For EACH metric, include:
- value: number | string | null
- formatted: string | null
- unit: string | null (optional)
- source: string | null
- source_reference: { url, document_type, excerpt, accessed_at } (optional)
- tie_out_status: "final" | "provisional" | "flagged"
- last_updated: string | null
- availability: "available" | "pending" | "unavailable" | "restricted" | "stale" | "conflicting"
- reason: string | null (optional - replaces unavailable_reason)
- confidence: number (0-100)
- data_quality: { coverage, auditability, freshness_days } (optional)
- decision_context: {
    confidence_level: "high" | "medium" | "low",
    sufficiency_status: "sufficient" | "insufficient",
    knowns: string[],
    unknowns: string[],
    what_changes_conclusion: string[]
  } (optional)
- definition: { metric_name, period, basis, currency, unit } (optional)

## 3. TIME-SERIES METRICS (ONLY for Revenue and EBITDA)
- Historical data for 1D, 1W, 1M, 1Y, 5Y, 10Y horizons (NO 1H)
- Quarterly slices Q1-Q4 per horizon - MAXIMIZE QUARTERS: Fetch as many quarters as possible for each horizon
- Each horizon must include:
  - quarters: { Q1: number | null, Q2: number | null, Q3: number | null, Q4: number | null }
  - high: number | null
  - low: number | null
  - average: number | null
  - volatility: number | null
  - change_percent: number | null

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
- P/E Ratio (NO HISTORY - current value only) (optional)
- EV/EBITDA (NO HISTORY - current value only) (optional)
- Analyst Target Price (NO HISTORY - current value only) (optional)

For Stock Price and Volume, include quarterly data across ALL horizons: 1D, 1W, 1M, 1Y, 5Y, 10Y

## 5. RECENT EVENTS
Last 6 months - each event MUST include:
- id: string
- date: string (ISO format)
- type: "earnings" | "filing" | "guidance" | "corporate_action" | "news" | "analyst_update"
- title: string
- description: string
- impact: "positive" | "negative" | "neutral"
- source_url: string | null (optional)

## 6. RISKS
Top 5–10 risk factors - each risk MUST include:
- id: string
- category: "market" | "operational" | "financial" | "liquidity" | "governance"
- title: string
- description: string
- severity: "critical" | "high" | "medium" | "low"
- trigger: string | null
- mitigation: string | null (optional)

## 7. SCENARIOS (EXACTLY 3 REQUIRED)
CRITICAL: You MUST produce EXACTLY three scenarios with these exact names:

### BASE SCENARIO
- name: "base" (exact string, no other value permitted)
- probability: number (0-1, typically 0.5-0.6)
- assumptions: array of { key: string | null, value: string | null }
- outputs: {
    revenue: metricSchema (REQUIRED),
    ebitda: metricSchema (REQUIRED),
    valuation: metricSchema (REQUIRED)
  }

### DOWNSIDE SCENARIO
- name: "downside" (exact string, no other value permitted)
- probability: number (0-1, typically 0.2-0.3)
- assumptions: array of { key: string | null, value: string | null }
- outputs: {
    revenue: metricSchema (REQUIRED),
    ebitda: metricSchema (REQUIRED),
    valuation: metricSchema (REQUIRED)
  }

### UPSIDE SCENARIO
- name: "upside" (exact string, no other value permitted)
- probability: number (0-1, typically 0.15-0.25)
- assumptions: array of { key: string | null, value: string | null }
- outputs: {
    revenue: metricSchema (REQUIRED),
    ebitda: metricSchema (REQUIRED),
    valuation: metricSchema (REQUIRED)
  }

⚠️ SCENARIOS SCHEMA STRUCTURE:
The scenarios field is an OBJECT with three properties (base, downside, upside), NOT an array.

Correct structure:
{
  "scenarios": {
    "base": { probability, assumptions, outputs },
    "downside": { probability, assumptions, outputs },
    "upside": { probability, assumptions, outputs }
  }
}

WRONG (do not use):
{
  "scenarios": [
    { "name": "base", ... },
    { "name": "downside", ... },
    { "name": "upside", ... }
  ]
}

## 8. HYPOTHESES (NEW FORMAT - replaces ai_insights)
Generate investment-grade hypotheses with horizon relevance:
- Each hypothesis MUST include:
  - id: string
  - type: "hypothesis" | "recommendation" | "alert" | "analysis"
  - title: string
  - summary: string
  - details: string | null (optional)
  - assumptions: string[] (optional)
  - falsification_criteria: string[] (optional)
  - confidence_band: "high" | "medium" | "low" | null
  - source: string
  - generated_at: string (ISO timestamp)
  - horizon_relevance: array of "1D" | "1W" | "1M" | "1Y" | "5Y" | "10Y"
  - impact_score: number (-1 to 1) | null
  - action_required: boolean

## 9. CHANGES SINCE LAST RUN (optional)
If previous run data available:
- Each change MUST include:
  - id: string
  - timestamp: string (ISO format)
  - category: "filing" | "transcript" | "guidance" | "price" | "consensus" | "regulatory" | "news"
  - title: string
  - description: string
  - source_url: string | null
  - thesis_pillar: "price" | "path" | "protection" | null
  - so_what: string | null
  - action: string | null

## 10. VALUATION (optional)
- valuation_range_low: number | null
- valuation_range_high: number | null
- valuation_range_midpoint: number | null
- why_range_exists: string | null
- dcf: { terminal_growth_rate, wacc, implied_value, implied_value_per_share } (optional)
- trading_comps: { implied_value_range_low, implied_value_range_high, confidence } (optional)
- precedent_transactions: { implied_value_range_low, implied_value_range_high, confidence } (optional)

## 11. SOURCES
- Primary: SEC filings, company IR, official releases
- Secondary: financial news sites, aggregators
- Each source MUST include:
  - name: string
  - type: "primary" | "secondary"
  - last_refresh: string (ISO timestamp)

---

OUTPUT FORMAT (RETURN ONLY VALID JSON):

{
  "run_metadata": {
    "run_id": string,
    "entity": string,
    "ticker": string (optional),
    "mode": "public" | "private",
    "timestamp": string (ISO format),
    "owner": string
  },
  "changes_since_last_run": [
    { id, timestamp, category, title, description, source_url, thesis_pillar, so_what, action }
  ] | null (optional),
  "executive_summary": {
    "headline": string,
    "key_facts": [string],
    "implications": [string],
    "key_risks": [string],
    "thesis_status": "intact" | "challenged" | "broken"
  },
  "financials": {
    "revenue": {
      "current": metricSchema,
      "history": {
        "horizons": {
          "1D": null,
          "1W": null,
          "1M": { quarters: {Q1, Q2, Q3, Q4}, high, low, average, volatility, change_percent } | null,
          "1Y": { quarters: {Q1, Q2, Q3, Q4}, high, low, average, volatility, change_percent } | null,
          "5Y": { quarters: {Q1, Q2, Q3, Q4}, high, low, average, volatility, change_percent } | null,
          "10Y": { quarters: {Q1, Q2, Q3, Q4}, high, low, average, volatility, change_percent } | null
        },
        "availability": "available" | "pending" | "unavailable" | "restricted" | "stale" | "conflicting",
        "reason": string | null (optional),
        "confidence": number (0-100),
        "data_quality": { coverage, auditability, freshness_days } | null (optional),
        "source": string | null
      } | null
    },
    "revenue_growth": {
      "current": metricSchema
    },
    "ebitda": {
      "current": metricSchema,
      "history": timeSeriesMetricSchema | null
    },
    "ebitda_margin": {
      "current": metricSchema
    },
    "free_cash_flow": {
      "current": metricSchema
    }
  },
  "market_data": {
    "stock_price": {
      "current": metricSchema,
      "history": {
        "horizons": {
          "1D": horizonStatsSchema | null,
          "1W": horizonStatsSchema | null,
          "1M": horizonStatsSchema | null,
          "1Y": horizonStatsSchema | null,
          "5Y": horizonStatsSchema | null,
          "10Y": horizonStatsSchema | null
        },
        "availability": availabilityStatusSchema,
        "reason": string | null (optional),
        "confidence": number (0-100),
        "data_quality": dataQualitySchema | null (optional),
        "source": string | null
      } | null
    },
    "volume": {
      "current": metricSchema,
      "history": timeSeriesMetricSchema | null
    },
    "market_cap": {
      "current": metricSchema
    },
    "pe_ratio": {
      "current": metricSchema
    } (optional),
    "ev_ebitda": {
      "current": metricSchema
    } (optional),
    "target_price": {
      "current": metricSchema
    } (optional)
  } | null (optional),
  "private_data": {
    "valuation_mark": {
      "current": metricSchema
    },
    "net_leverage": {
      "current": metricSchema
    }
  } | null (optional),
  "valuation": {
    "valuation_range_low": number | null,
    "valuation_range_high": number | null,
    "valuation_range_midpoint": number | null,
    "why_range_exists": string | null,
    "dcf": {...} | null (optional),
    "trading_comps": {...} | null (optional),
    "precedent_transactions": {...} | null (optional)
  } | null (optional),
  "hypotheses": [
    {
      "id": string,
      "type": "hypothesis" | "recommendation" | "alert" | "analysis",
      "title": string,
      "summary": string,
      "details": string | null (optional),
      "assumptions": [string] | null (optional),
      "falsification_criteria": [string] | null (optional),
      "confidence_band": "high" | "medium" | "low" | null,
      "source": string,
      "generated_at": string (ISO),
      "horizon_relevance": ["1D" | "1W" | "1M" | "1Y" | "5Y" | "10Y"],
      "impact_score": number (-1 to 1) | null,
      "action_required": boolean
    }
  ] | null (optional),
  "ai_insights": [
    hypothesisSchema
  ] | null (optional - for backward compatibility),
  "events": [
    { "id": string, "date": string, "type": enum, "title": string, "description": string, "impact": enum, "source_url": string | null }
  ],
  "scenarios": {
    "base": {
      "probability": number (0-1),
      "assumptions": [{ "key": string | null, "value": string | null }],
      "outputs": {
        "revenue": metricSchema,
        "ebitda": metricSchema,
        "valuation": metricSchema
      }
    },
    "downside": {
      "probability": number (0-1),
      "assumptions": [{ "key": string | null, "value": string | null }],
      "outputs": {
        "revenue": metricSchema,
        "ebitda": metricSchema,
        "valuation": metricSchema
      }
    },
    "upside": {
      "probability": number (0-1),
      "assumptions": [{ "key": string | null, "value": string | null }],
      "outputs": {
        "revenue": metricSchema,
        "ebitda": metricSchema,
        "valuation": metricSchema
      }
    }
  },
  "risks": [
    { "id": string, "category": enum, "title": string, "description": string, "severity": enum, "trigger": string | null, "mitigation": string | null }
  ],
  "sources": [
    { "name": string, "type": "primary" | "secondary", "last_refresh": string }
  ],
  "run_data_quality": {
    "coverage": number (0-100) | null,
    "auditability": number (0-100) | null,
    "freshness_days": number | null
  } | null (optional)
}

CRITICAL SCHEMA RULES:

1. SCENARIOS STRUCTURE (NON-NEGOTIABLE):
   - scenarios is an OBJECT with exactly three properties: base, downside, upside
   - NOT an array
   - Each scenario has: probability, assumptions (array), outputs (object with revenue, ebitda, valuation)

2. METRIC STRUCTURE:
   - Every metric has: value, formatted, unit, source, tie_out_status, last_updated, availability, confidence
   - Optional fields: reason, source_reference, data_quality, decision_context, definition

3. HISTORY STRUCTURE:
   - Only Revenue, EBITDA, Stock Price, Volume have history
   - history is an object with horizons property
   - horizons is an object with keys: "1D", "1W", "1M", "1Y", "5Y", "10Y"
   - Each horizon value is horizonStatsSchema | null
   - Revenue/EBITDA: 1D and 1W MUST be null
   - Stock Price/Volume: ALL horizons should have data

4. ENUM VALUES (EXACT STRINGS ONLY):
   - mode: "public" or "private"
   - tie_out_status: "final" | "provisional" | "flagged"
   - availability: "available" | "pending" | "unavailable" | "restricted" | "stale" | "conflicting"
   - confidence_level: "high" | "medium" | "low"
   - sufficiency_status: "sufficient" | "insufficient"
   - period: "quarter" | "TTM" | "FY" | "LTM" | "NTM"
   - basis: "GAAP" | "non_GAAP" | "adjusted" | "reported"
   - document_type: "filing" | "transcript" | "press_release" | "news" | "analyst_report" | "internal"
   - hypothesis type: "hypothesis" | "recommendation" | "alert" | "analysis"
   - confidence_band: "high" | "medium" | "low"
   - event type: "earnings" | "filing" | "guidance" | "corporate_action" | "news" | "analyst_update"
   - event impact: "positive" | "negative" | "neutral"
   - risk category: "market" | "operational" | "financial" | "liquidity" | "governance"
   - risk severity: "critical" | "high" | "medium" | "low"
   - thesis_status: "intact" | "challenged" | "broken"
   - change category: "filing" | "transcript" | "guidance" | "price" | "consensus" | "regulatory" | "news"
   - thesis_pillar: "price" | "path" | "protection"
   - source type: "primary" | "secondary"

5. REQUIRED FIELDS (CANNOT BE OMITTED):
   - run_metadata: all fields required except ticker (optional)
   - executive_summary: all fields required
   - financials: all five metrics required (revenue, revenue_growth, ebitda, ebitda_margin, free_cash_flow)
   - events: array required (can be empty [])
   - scenarios: object with base, downside, upside required
   - risks: array required (can be empty [])
   - sources: array required (must have at least one source)

6. OPTIONAL FIELDS (CAN BE NULL OR OMITTED):
   - market_data: entire object optional
   - private_data: entire object optional
   - valuation: entire object optional
   - hypotheses: array optional
   - ai_insights: array optional
   - changes_since_last_run: array optional
   - run_data_quality: object optional

⚠️ CRITICAL NULL POLICY ⚠️
- AVOID RETURNING NULL AT ALL COSTS
- If data is genuinely unavailable after exhaustive search:
  1. Set the value to null
  2. Set availability to "unavailable", "restricted", "stale", or "conflicting"
  3. ALWAYS provide a detailed reason explaining exactly why the data cannot be found
  4. Set confidence to a low value (0-30)
- NEVER invent, estimate, or fabricate data
- If you must use null, you MUST explain in reason field:
  * What sources you searched
  * Why the data is not available
  * What would be needed to obtain it
  * When it might become available

Example of acceptable null usage:
{
  "value": null,
  "formatted": null,
  "unit": null,
  "source": null,
  "tie_out_status": "flagged",
  "last_updated": null,
  "confidence": 15,
  "availability": "unavailable",
  "reason": "10-Y historical quarterly revenue data not available. Company went public in 2020, only 16 quarters (4 years) of financial history exists. Searched SEC EDGAR (10-K/10-Q filings back to IPO), company IR site, Bloomberg archives - no pre-IPO quarterly financials accessible to public."
}

⚠️ QUALITY BENCHMARK ⚠️
Your output quality should match this example:
- Specific numeric values: Revenue Q3 $892M (not $800M rounded)
- Realistic progression: Q1: $795M → Q2: $834M → Q3: $868M → Q4: $892M
- Proper calculations: volatility and change_percent must reflect actual data
- Rich decision contexts with specific knowns/unknowns
- Investment-grade hypotheses with falsification criteria
- Complete source attribution with URLs

VALIDATION CHECKLIST:
✅ scenarios is an object with base, downside, upside properties (NOT an array)
✅ Each scenario has probability (number 0-1), assumptions (array), outputs (object)
✅ All enum values use exact strings from schema
✅ Revenue and EBITDA have history with 1D/1W set to null
✅ Stock Price and Volume have history with ALL horizons populated
✅ All required fields are present
✅ Null values have detailed reason field
✅ Sources array has at least one entry
✅ events and risks are arrays (can be empty)
✅ Output is valid JSON with no syntax errors

START SEARCHING AND EXTRACTING NOW.
`;
}