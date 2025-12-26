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
- unit: string | null
- source: string | null
- source_reference: { url: string | null, document_type: string | null, excerpt: string | null, accessed_at: string | null } | null
- tie_out_status: string | null
- last_updated: string | null
- availability: string | null
- unavailable_reason: string | null
- confidence: number | null
- data_quality: { coverage: number | null, auditability: number | null, freshness_days: number | null } | null
- decision_context: {
    confidence_level: string | null,
    sufficiency_status: string | null,
    knowns: string[] | null,
    unknowns: string[] | null,
    what_changes_conclusion: string[] | null
  } | null
- definition: { metric_name: string | null, period: string | null, basis: string | null, currency: string | null, unit: string | null } | null

## 3. TIME-SERIES METRICS (ONLY for Revenue and EBITDA)
- Historical data for 1D, 1W, 1M, 1Y, 5Y, 10Y horizons (NO 1H)
- Quarterly slices Q1-Q4 per horizon - MAXIMIZE QUARTERS: Fetch as many quarters as possible for each horizon
- Each horizon must include:
  - quarters: { Q1: number | null, Q2: number | null, Q3: number | null, Q4: number | null } | null
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
- P/E Ratio (NO HISTORY - current value only)
- EV/EBITDA (NO HISTORY - current value only)
- Analyst Target Price (NO HISTORY - current value only)

For Stock Price and Volume, include quarterly data across ALL horizons: 1D, 1W, 1M, 1Y, 5Y, 10Y

## 5. RECENT EVENTS
Last 6 months - each event MUST include:
- id: string | null
- date: string | null (ISO format)
- type: string | null
- title: string | null
- description: string | null
- impact: string | null
- source_url: string | null

## 6. RISKS
Top 5–10 risk factors - each risk MUST include:
- id: string | null
- category: string | null
- title: string | null
- description: string | null
- severity: string | null
- trigger: string | null
- mitigation: string | null

## 7. SCENARIOS (EXACTLY 3 REQUIRED)
CRITICAL: You MUST produce EXACTLY three scenarios with these exact property names:

### BASE SCENARIO
- Property name: "base" (exact string, must be object property, not array element)
- probability: number | null
- assumptions: Array<{ key: string | null, value: string | null }> | null
- drivers: Array<{ name: string | null, category: string | null, value: string | null, unit: string | null, source: string | null }> | null
- outputs: {
    revenue: metricSchema | null,
    ebitda: metricSchema | null,
    valuation: metricSchema | null
  } | null

### DOWNSIDE SCENARIO
- Property name: "downside" (exact string, must be object property, not array element)
- probability: number | null
- assumptions: Array<{ key: string | null, value: string | null }> | null
- drivers: Array<{ name: string | null, category: string | null, value: string | null, unit: string | null, source: string | null }> | null
- outputs: {
    revenue: metricSchema | null,
    ebitda: metricSchema | null,
    valuation: metricSchema | null
  } | null

### UPSIDE SCENARIO
- Property name: "upside" (exact string, must be object property, not array element)
- probability: number | null
- assumptions: Array<{ key: string | null, value: string | null }> | null
- drivers: Array<{ name: string | null, category: string | null, value: string | null, unit: string | null, source: string | null }> | null
- outputs: {
    revenue: metricSchema | null,
    ebitda: metricSchema | null,
    valuation: metricSchema | null
  } | null

⚠️ SCENARIOS SCHEMA STRUCTURE:
The scenarios field is an OBJECT with three properties (base, downside, upside), NOT an array.

Correct structure:
{
  "scenarios": {
    "base": { "probability": 0.5, "assumptions": [...], "drivers": [...], "outputs": {...} },
    "downside": { "probability": 0.25, "assumptions": [...], "drivers": [...], "outputs": {...} },
    "upside": { "probability": 0.25, "assumptions": [...], "drivers": [...], "outputs": {...} }
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

⚠️ DRIVERS ARRAY IN SCENARIOS:
Each scenario MUST include a "drivers" array with scenario-specific assumptions. Each driver object must have:
- name: string | null (e.g., "Revenue Growth Rate", "EBITDA Margin", "Market Share")
- category: string | null (e.g., "revenue", "margin", "other")
- value: string | null (e.g., "12%", "35%", "2.4M units")
- unit: string | null (e.g., "%", "USD", "units")
- source: string | null (e.g., "fact", "judgment")

Example drivers for base scenario:
json
"drivers": [
  { "name": "Revenue Growth Rate", "category": "revenue", "value": "9.2%", "unit": "%", "source": "judgment" },
  { "name": "EBITDA Margin", "category": "margin", "value": "25.5%", "unit": "%", "source": "fact" },
  { "name": "Market Share", "category": "revenue", "value": "18%", "unit": "%", "source": "judgment" }
]


## 8. HYPOTHESES
Generate investment-grade hypotheses with horizon relevance:
- Each hypothesis MUST include:
  - id: string | null
  - type: string | null
  - title: string | null
  - summary: string | null
  - details: string | null
  - assumptions: string[] | null
  - falsification_criteria: string[] | null
  - confidence_band: string | null
  - source: string | null
  - generated_at: string | null (ISO timestamp)
  - horizon_relevance: string[] | null
  - impact_score: number | null
  - action_required: boolean | null

## 9. CHANGES SINCE LAST RUN
If previous run data available:
- Each change MUST include:
  - id: string | null
  - timestamp: string | null (ISO format)
  - category: string | null
  - title: string | null
  - description: string | null
  - source_url: string | null
  - thesis_pillar: string | null
  - so_what: string | null
  - action: string | null

## 10. VALUATION
- valuation_range_low: number | null
- valuation_range_high: number | null
- valuation_range_midpoint: number | null
- why_range_exists: string | null
- dcf: { 
    terminal_growth_rate: number | null, 
    wacc: number | null, 
    implied_value: number | null, 
    implied_value_per_share: number | null 
  } | null
- trading_comps: { 
    implied_value_range_low: number | null, 
    implied_value_range_high: number | null, 
    confidence: { coverage: number | null, auditability: number | null, freshness_days: number | null } | null 
  } | null
- precedent_transactions: { 
    implied_value_range_low: number | null, 
    implied_value_range_high: number | null, 
    confidence: { coverage: number | null, auditability: number | null, freshness_days: number | null } | null 
  } | null

## 11. PUBLIC MARKET METRICS
- net_cash_or_debt: { current: metricSchema | null } | null
- buyback_capacity: { current: metricSchema | null } | null
- sbc_percent_revenue: { current: metricSchema | null } | null
- share_count_trend: { current: metricSchema | null } | null
- segments: Array<{
    segment_name: string | null,
    revenue: { current: metricSchema | null } | null,
    growth_percent: number | null,
    margin_percent: number | null
  }> | null
- guidance_bridge: {
    metric: string | null,
    company_guidance_low: number | null,
    company_guidance_high: number | null,
    consensus: number | null,
    delta_to_consensus: number | null
  } | null
- revisions_momentum: {
    eps_revisions_30d: number | null,
    revenue_revisions_30d: number | null,
    direction: string | null
  } | null

## 12. PATH INDICATORS
Array of path indicators - each MUST include:
- label: string | null
- value: string | null
- status: string | null
- next_check: string | null

## 13. POSITION SIZING
- current_percent: number | null
- max_percent: number | null
- target_low: number | null
- target_high: number | null

## 14. VARIANT VIEW
- summary: string | null
- sensitivity: Array<{
    label: string | null,
    impact: string | null
  }> | null

## 15. KILL SWITCH
- conditions: string[] | null

## 16. SOURCES
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
    "run_id": string | null,
    "entity": string | null,
    "ticker": string | null,
    "mode": string | null,
    "timestamp": string | null,
    "owner": string | null
  } | null,
  "changes_since_last_run": [
    { 
      "id": string | null, 
      "timestamp": string | null, 
      "category": string | null, 
      "title": string | null, 
      "description": string | null, 
      "source_url": string | null, 
      "thesis_pillar": string | null, 
      "so_what": string | null, 
      "action": string | null 
    }
  ] | null,
  "executive_summary": {
    "headline": string | null,
    "key_facts": string[] | null,
    "implications": string[] | null,
    "key_risks": string[] | null,
    "thesis_status": string | null
  } | null,
  "financials": {
    "revenue": {
      "current": metricSchema | null,
      "history": {
        "horizons": {
          "1D": null,
          "1W": null,
          "1M": { "quarters": {"Q1": number | null, "Q2": number | null, "Q3": number | null, "Q4": number | null} | null, "high": number | null, "low": number | null, "average": number | null, "volatility": number | null, "change_percent": number | null } | null,
          "1Y": { "quarters": {"Q1": number | null, "Q2": number | null, "Q3": number | null, "Q4": number | null} | null, "high": number | null, "low": number | null, "average": number | null, "volatility": number | null, "change_percent": number | null } | null,
          "5Y": { "quarters": {"Q1": number | null, "Q2": number | null, "Q3": number | null, "Q4": number | null} | null, "high": number | null, "low": number | null, "average": number | null, "volatility": number | null, "change_percent": number | null } | null,
          "10Y": { "quarters": {"Q1": number | null, "Q2": number | null, "Q3": number | null, "Q4": number | null} | null, "high": number | null, "low": number | null, "average": number | null, "volatility": number | null, "change_percent": number | null } | null
        } | null,
        "availability": string | null,
        "unavailable_reason": string | null,
        "confidence": number | null,
        "data_quality": { "coverage": number | null, "auditability": number | null, "freshness_days": number | null } | null,
        "source": string | null,
        "decision_context": {
          "confidence_level": string | null,
          "sufficiency_status": string | null,
          "knowns": string[] | null,
          "unknowns": string[] | null,
          "what_changes_conclusion": string[] | null
        } | null
      } | null
    } | null,
    "revenue_growth": {
      "current": metricSchema | null
    } | null,
    "ebitda": {
      "current": metricSchema | null,
      "history": timeSeriesMetricSchema | null
    } | null,
    "ebitda_margin": {
      "current": metricSchema | null
    } | null,
    "free_cash_flow": {
      "current": metricSchema | null
    } | null
  } | null,
  "market_data": {
    "stock_price": {
      "current": metricSchema | null,
      "history": {
        "horizons": {
          "1D": horizonStatsSchema | null,
          "1W": horizonStatsSchema | null,
          "1M": horizonStatsSchema | null,
          "1Y": horizonStatsSchema | null,
          "5Y": horizonStatsSchema | null,
          "10Y": horizonStatsSchema | null
        } | null,
        "availability": string | null,
        "unavailable_reason": string | null,
        "confidence": number | null,
        "data_quality": { "coverage": number | null, "auditability": number | null, "freshness_days": number | null } | null,
        "source": string | null,
        "decision_context": {
          "confidence_level": string | null,
          "sufficiency_status": string | null,
          "knowns": string[] | null,
          "unknowns": string[] | null,
          "what_changes_conclusion": string[] | null
        } | null
      } | null
    } | null,
    "volume": {
      "current": metricSchema | null,
      "history": timeSeriesMetricSchema | null
    } | null,
    "market_cap": {
      "current": metricSchema | null
    } | null,
    "pe_ratio": {
      "current": metricSchema | null
    } | null,
    "ev_ebitda": {
      "current": metricSchema | null
    } | null,
    "target_price": {
      "current": metricSchema | null
    } | null
  } | null,
  "private_data": {
    "valuation_mark": {
      "current": metricSchema | null
    } | null,
    "net_leverage": {
      "current": metricSchema | null
    } | null
  } | null,
  "valuation": {
    "valuation_range_low": number | null,
    "valuation_range_high": number | null,
    "valuation_range_midpoint": number | null,
    "why_range_exists": string | null,
    "dcf": {
      "terminal_growth_rate": number | null,
      "wacc": number | null,
      "implied_value": number | null,
      "implied_value_per_share": number | null
    } | null,
    "trading_comps": {
      "implied_value_range_low": number | null,
      "implied_value_range_high": number | null,
      "confidence": { "coverage": number | null, "auditability": number | null, "freshness_days": number | null } | null
    } | null,
    "precedent_transactions": {
      "implied_value_range_low": number | null,
      "implied_value_range_high": number | null,
      "confidence": { "coverage": number | null, "auditability": number | null, "freshness_days": number | null } | null
    } | null
  } | null,
  "hypotheses": [
    {
      "id": string | null,
      "type": string | null,
      "title": string | null,
      "summary": string | null,
      "details": string | null,
      "assumptions": string[] | null,
      "falsification_criteria": string[] | null,
      "confidence_band": string | null,
      "source": string | null,
      "generated_at": string | null,
      "horizon_relevance": string[] | null,
      "impact_score": number | null,
      "action_required": boolean | null
    }
  ] | null,
  "ai_insights": [
    {
      "id": string | null,
      "type": string | null,
      "title": string | null,
      "summary": string | null,
      "details": string | null,
      "assumptions": string[] | null,
      "falsification_criteria": string[] | null,
      "confidence_band": string | null,
      "source": string | null,
      "generated_at": string | null,
      "horizon_relevance": string[] | null,
      "impact_score": number | null,
      "action_required": boolean | null
    }
  ] | null,
  "events": [
    { 
      "id": string | null, 
      "date": string | null, 
      "type": string | null, 
      "title": string | null, 
      "description": string | null, 
      "impact": string | null, 
      "source_url": string | null 
    }
  ] | null,
  "scenarios": {
    "base": {
      "probability": number | null,
      "assumptions": [{ "key": string | null, "value": string | null }] | null,
      "drivers": [
        {
          "name": string | null,
          "category": string | null,
          "value": string | null,
          "unit": string | null,
          "source": string | null
        }
      ] | null,
      "outputs": {
        "revenue": metricSchema | null,
        "ebitda": metricSchema | null,
        "valuation": metricSchema | null
      } | null
    } | null,
    "downside": {
      "probability": number | null,
      "assumptions": [{ "key": string | null, "value": string | null }] | null,
      "drivers": [
        {
          "name": string | null,
          "category": string | null,
          "value": string | null,
          "unit": string | null,
          "source": string | null
        }
      ] | null,
      "outputs": {
        "revenue": metricSchema | null,
        "ebitda": metricSchema | null,
        "valuation": metricSchema | null
      } | null
    } | null,
    "upside": {
      "probability": number | null,
      "assumptions": [{ "key": string | null, "value": string | null }] | null,
      "drivers": [
        {
          "name": string | null,
          "category": string | null,
          "value": string | null,
          "unit": string | null,
          "source": string | null
        }
      ] | null,
      "outputs": {
        "revenue": metricSchema | null,
        "ebitda": metricSchema | null,
        "valuation": metricSchema | null
      } | null
    } | null
  } | null,
  "risks": [
    { 
      "id": string | null, 
      "category": string | null, 
      "title": string | null, 
      "description": string | null, 
      "severity": string | null, 
      "trigger": string | null, 
      "mitigation": string | null 
    }
  ] | null,
  "public_market_metrics": {
    "net_cash_or_debt": { "current": metricSchema | null } | null,
    "buyback_capacity": { "current": metricSchema | null } | null,
    "sbc_percent_revenue": { "current": metricSchema | null } | null,
    "share_count_trend": { "current": metricSchema | null } | null,
    "segments": [
      {
        "segment_name": string | null,
        "revenue": { "current": metricSchema | null } | null,
        "growth_percent": number | null,
        "margin_percent": number | null
      }
    ] | null,
    "guidance_bridge": {
      "metric": string | null,
      "company_guidance_low": number | null,
      "company_guidance_high": number | null,
      "consensus": number | null,
      "delta_to_consensus": number | null
    } | null,
    "revisions_momentum": {
      "eps_revisions_30d": number | null,
      "revenue_revisions_30d": number | null,
      "direction": string | null
    } | null
  } | null,
  "path_indicators": [
    {
      "label": string | null,
      "value": string | null,
      "status": string | null,
      "next_check": string | null
    }
  ] | null,
  "position_sizing": {
    "current_percent": number | null,
    "max_percent": number | null,
    "target_low": number | null,
    "target_high": number | null
  } | null,
  "variant_view": {
    "summary": string | null,
    "sensitivity": [
      {
        "label": string | null,
        "impact": string | null
      }
    ] | null
  } | null,
  "kill_switch": {
    "conditions": string[] | null
  } | null,
  "sources": [
    { 
      "name": string, 
      "type": "primary" | "secondary", 
      "last_refresh": string 
    }
  ] | null,
  "run_data_quality": {
    "coverage": number | null,
    "auditability": number | null,
    "freshness_days": number | null
  } | null
}

CRITICAL SCHEMA RULES:

1. **ALL FIELDS CAN BE NULL OR UNDEFINED** - The schema uses .nullable().optional() everywhere
   - NEVER assume a field is required to have a value
   - Always use | null in type definitions
   - Empty objects, arrays, and null values are all valid

2. **SCENARIOS STRUCTURE** (NON-NEGOTIABLE):
   - scenarios is an OBJECT with exactly three properties: base, downside, upside
   - NOT an array
   - Each property can be null or an object
   - Each scenario has: probability, assumptions (array), drivers (array), outputs (object)
   - ALL scenario properties can be null

3. **DRIVERS IN SCENARIOS** (CRITICAL):
   - Each scenario MUST have a "drivers" array (can be null or empty)
   - Drivers provide the underlying assumptions for each scenario
   - Each driver: { name, category, value, unit, source } (all can be null)

4. **METRIC STRUCTURE**:
   - Every field in a metric can be null
   - value: number | string | null
   - All nested objects can be null

5. **HISTORY STRUCTURE**:
   - Only Revenue, EBITDA, Stock Price, Volume can have history
   - history can be null
   - horizons can be null
   - Each horizon (1D, 1W, 1M, 1Y, 5Y, 10Y) can be null
   - quarters object can be null, each quarter (Q1-Q4) can be null

6. **NULLABLE ARRAYS**:
   - Arrays can be null or empty: [] | null
   - Array elements can be null
   - Filter out null elements in TypeScript: .filter((item): item is NonNullable<typeof item> => item != null)

7. **OPTIONAL TOP-LEVEL FIELDS**:
   - market_data: entire object can be null
   - private_data: entire object can be null
   - valuation: entire object can be null
   - hypotheses: can be null
   - ai_insights: can be null
   - changes_since_last_run: can be null
   - public_market_metrics: can be null
   - path_indicators: can be null
   - position_sizing: can be null
   - variant_view: can be null
   - kill_switch: can be null

⚠️ CRITICAL NULL POLICY ⚠️
- NULL IS ACCEPTABLE AND EXPECTED throughout the schema
- If data is genuinely unavailable:
  1. Set the value to null
  2. Set availability to "unavailable" (if applicable)
  3. Provide unavailable_reason explaining why
  4. Set confidence to a low value (0-30)
- NEVER invent, estimate, or fabricate data
- The schema is designed to handle incomplete data gracefully

Example of acceptable null usage:
json
{
  "value": null,
  "formatted": null,
  "unit": null,
  "source": null,
  "tie_out_status": null,
  "last_updated": null,
  "confidence": 15,
  "availability": "unavailable",
  "unavailable_reason": "10-Y historical quarterly revenue data not available. Company went public in 2020, only 16 quarters (4 years) of financial history exists."
}


⚠️ TYPE SAFETY IN TYPESCRIPT ⚠️
When working with this data in TypeScript:
1. Always use optional chaining: data?.field?.nested
2. Always provide fallbacks: data?.field ?? defaultValue
3. Filter arrays before mapping: array?.filter((item): item is NonNullable<typeof item> => item != null) ?? []
4. Check existence before accessing: if (data?.field) { ... }

VALIDATION CHECKLIST:
✅ scenarios is an object with base, downside, upside properties (NOT an array)
✅ Each scenario can be null or have: probability, assumptions, drivers, outputs
✅ All scenario drivers arrays are present (can be null or empty)
✅ Revenue and EBITDA history: 1D/1W are null, 1M/1Y/5Y/10Y can have data or be null
✅ Stock Price and Volume history: ALL horizons can have data or be null
✅ All null values are acceptable and don't require unavailable_reason
✅ Sources array can be null or have entries
✅ events and risks arrays can be null or have entries
✅ Output is valid JSON with no syntax errors
✅ No fabricated data - use null when data is unavailable
 Here is a sample of a solid output: 
    


{
  "run_metadata": {
    "run_id": "RUN-2024-1214-001",
    "entity": "Meridian Holdings Corp",
    "ticker": "MHC",
    "mode": "public",
    "timestamp": "2024-12-14T09:00:00Z",
    "owner": "Sarah Chen, CFA"
  },
  "changes_since_last_run": [
    {
      "id": "CHG-001",
      "timestamp": "2024-12-12T16:00:00Z",
      "category": "filing",
      "title": "Q3 10-Q Filed with Raised Guidance",
      "description": "Company raised FY24 revenue guidance.",
      "source_url": "https://sec.gov/...",
      "thesis_pillar": "path",
      "so_what": "Confirms operational momentum.",
      "action": "Update model assumptions"
    },
    {
      "id": "CHG-002",
      "timestamp": "2024-12-11T09:30:00Z",
      "category": "price",
      "title": "Stock +7.2% on Guidance Beat",
      "description": "Stock rallied post-earnings.",
      "source_url": null,
      "thesis_pillar": "price",
      "so_what": "Valuation gap narrowing.",
      "action": "Trim position sizing"
    }
  ],
  "executive_summary": {
    "headline": "Investment thesis strengthening: operational execution exceeding plan",
    "key_facts": [
      "Q3 revenue of $892M beat consensus by 4.2%",
      "EBITDA margin expanded 80bps YoY to 25.1%",
      "FY24 guidance raised"
    ],
    "implications": [
      "Valuation upside of 12-18% in base case",
      "Market share gains accelerating"
    ],
    "key_risks": [
      "Customer concentration: top 3 = 34% of revenue",
      "Management succession uncertainty"
    ],
    "thesis_status": "intact"
  },
  "financials": {
    "revenue": {
      "current": {
        "value": 892000000,
        "formatted": "$892M",
        "source": "10-Q Filing",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      },
      "history": {
        "horizons": {
          "1D": null,
          "1W": null,
          "1M": {
            "quarters": {
              "Q1": 285000000,
              "Q2": 289000000,
              "Q3": 294000000,
              "Q4": 297000000
            },
            "high": 297000000,
            "low": 285000000,
            "average": 291250000,
            "volatility": 2.8,
            "change_percent": 4.21
          },
          "1Y": {
            "quarters": {
              "Q1": 795000000,
              "Q2": 834000000,
              "Q3": 868000000,
              "Q4": 892000000
            },
            "high": 892000000,
            "low": 795000000,
            "average": 847250000,
            "volatility": 6.2,
            "change_percent": 12.20
          },
          "5Y": {
            "quarters": {
              "Q1": 520000000,
              "Q2": 628000000,
              "Q3": 752000000,
              "Q4": 892000000
            },
            "high": 892000000,
            "low": 520000000,
            "average": 698000000,
            "volatility": 24.5,
            "change_percent": 71.54
          },
          "10Y": {
            "quarters": {
              "Q1": 245000000,
              "Q2": 385000000,
              "Q3": 580000000,
              "Q4": 892000000
            },
            "high": 892000000,
            "low": 245000000,
            "average": 525500000,
            "volatility": 52.8,
            "change_percent": 264.08
          }
        },
        "availability": "available",
        "confidence": 95,
        "source": "SEC Filings"
      }
    },
    "revenue_growth": {
      "current": {
        "value": 9.2,
        "formatted": "9.2%",
        "source": "Calculated",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      }
    },
    "ebitda": {
      "current": {
        "value": 224000000,
        "formatted": "$224M",
        "source": "10-Q Filing",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      },
      "history": {
        "horizons": {
          "1D": null,
          "1W": null,
          "1M": {
            "quarters": {
              "Q1": 70000000,
              "Q2": 72000000,
              "Q3": 74000000,
              "Q4": 74000000
            },
            "high": 74000000,
            "low": 70000000,
            "average": 72500000,
            "volatility": 3.1,
            "change_percent": 5.71
          },
          "1Y": {
            "quarters": {
              "Q1": 185000000,
              "Q2": 198000000,
              "Q3": 212000000,
              "Q4": 224000000
            },
            "high": 224000000,
            "low": 185000000,
            "average": 204750000,
            "volatility": 9.8,
            "change_percent": 21.08
          },
          "5Y": {
            "quarters": {
              "Q1": 95000000,
              "Q2": 132000000,
              "Q3": 168000000,
              "Q4": 224000000
            },
            "high": 224000000,
            "low": 95000000,
            "average": 154750000,
            "volatility": 35.2,
            "change_percent": 135.79
          },
          "10Y": {
            "quarters": {
              "Q1": 42000000,
              "Q2": 78000000,
              "Q3": 138000000,
              "Q4": 224000000
            },
            "high": 224000000,
            "low": 42000000,
            "average": 120500000,
            "volatility": 62.4,
            "change_percent": 433.33
          }
        },
        "availability": "available",
        "confidence": 92,
        "source": "Management Reconciliation"
      }
    },
    "ebitda_margin": {
      "current": {
        "value": 25.1,
        "formatted": "25.1%",
        "source": "Calculated",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      }
    },
    "free_cash_flow": {
      "current": {
        "value": 158000000,
        "formatted": "$158M",
        "source": "Calculated",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      }
    }
  },
  "market_data": {
    "stock_price": {
      "current": {
        "value": 127.45,
        "formatted": "$127.45",
        "source": "Bloomberg",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      },
      "history": {
        "horizons": {
          "1D": {
            "quarters": {
              "Q1": 126.20,
              "Q2": 126.85,
              "Q3": 127.10,
              "Q4": 127.45
            },
            "high": 127.80,
            "low": 125.90,
            "average": 126.90,
            "volatility": 1.2,
            "change_percent": 0.99
          },
          "1W": {
            "quarters": {
              "Q1": 124.50,
              "Q2": 125.30,
              "Q3": 126.40,
              "Q4": 127.45
            },
            "high": 128.20,
            "low": 123.80,
            "average": 125.86,
            "volatility": 2.8,
            "change_percent": 2.37
          },
          "1M": {
            "quarters": {
              "Q1": 118.90,
              "Q2": 121.45,
              "Q3": 124.60,
              "Q4": 127.45
            },
            "high": 128.50,
            "low": 117.20,
            "average": 123.10,
            "volatility": 5.4,
            "change_percent": 7.19
          },
          "1Y": {
            "quarters": {
              "Q1": 98.20,
              "Q2": 108.45,
              "Q3": 118.90,
              "Q4": 127.45
            },
            "high": 129.80,
            "low": 94.50,
            "average": 113.25,
            "volatility": 18.5,
            "change_percent": 29.79
          },
          "5Y": {
            "quarters": {
              "Q1": 52.30,
              "Q2": 72.80,
              "Q3": 98.20,
              "Q4": 127.45
            },
            "high": 129.80,
            "low": 48.20,
            "average": 87.69,
            "volatility": 42.8,
            "change_percent": 143.69
          },
          "10Y": {
            "quarters": {
              "Q1": 24.50,
              "Q2": 38.90,
              "Q3": 68.40,
              "Q4": 127.45
            },
            "high": 129.80,
            "low": 22.10,
            "average": 64.81,
            "volatility": 68.5,
            "change_percent": 420.20
          }
        },
        "availability": "available",
        "confidence": 98,
        "source": "Bloomberg"
      }
    },
    "volume": {
      "current": {
        "value": 1520000,
        "formatted": "1.52M",
        "source": "Bloomberg",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      },
      "history": {
        "horizons": {
          "1D": {
            "quarters": {
              "Q1": 1200000,
              "Q2": 1450000,
              "Q3": 1380000,
              "Q4": 1520000
            },
            "high": 2100000,
            "low": 980000,
            "average": 1387500,
            "volatility": 28.5,
            "change_percent": 26.67
          },
          "1W": {
            "quarters": {
              "Q1": 6800000,
              "Q2": 7200000,
              "Q3": 7800000,
              "Q4": 8100000
            },
            "high": 9500000,
            "low": 5800000,
            "average": 7475000,
            "volatility": 22.4,
            "change_percent": 19.12
          },
          "1M": {
            "quarters": {
              "Q1": 28000000,
              "Q2": 31000000,
              "Q3": 34000000,
              "Q4": 36000000
            },
            "high": 42000000,
            "low": 24000000,
            "average": 32250000,
            "volatility": 18.6,
            "change_percent": 28.57
          },
          "1Y": {
            "quarters": {
              "Q1": 320000000,
              "Q2": 358000000,
              "Q3": 392000000,
              "Q4": 425000000
            },
            "high": 480000000,
            "low": 280000000,
            "average": 373750000,
            "volatility": 25.2,
            "change_percent": 32.81
          },
          "5Y": {
            "quarters": {
              "Q1": 180000000,
              "Q2": 245000000,
              "Q3": 320000000,
              "Q4": 425000000
            },
            "high": 520000000,
            "low": 150000000,
            "average": 292500000,
            "volatility": 45.8,
            "change_percent": 136.11
          },
          "10Y": {
            "quarters": {
              "Q1": 85000000,
              "Q2": 142000000,
              "Q3": 248000000,
              "Q4": 425000000
            },
            "high": 520000000,
            "low": 68000000,
            "average": 225000000,
            "volatility": 68.2,
            "change_percent": 400.00
          }
        },
        "availability": "available",
        "confidence": 96,
        "source": "Bloomberg"
      }
    },
    "market_cap": {
      "current": {
        "value": 12800000000,
        "formatted": "$12.8B",
        "source": "Calculated",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      }
    },
    "pe_ratio": {
      "current": {
        "value": 28.4,
        "formatted": "28.4x",
        "source": "Calculated",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      }
    },
    "ev_ebitda": {
      "current": {
        "value": 12.4,
        "formatted": "12.4x",
        "source": "Calculated",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      }
    },
    "target_price": {
      "current": {
        "value": 0,
        "formatted": "Pending",
        "source": "Analyst Consensus",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "pending",
        "unavailable_reason": "Analyst consensus update expected after Q3 earnings"
      }
    }
  },
  "private_data": {
    "valuation_mark": {
      "current": {
        "value": 14500000000,
        "formatted": "$14.5B",
        "source": "Internal Model",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      }
    },
    "net_leverage": {
      "current": {
        "value": 1.8,
        "formatted": "1.8x",
        "source": "Calculated",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      }
    }
  },
  "valuation": {
    "valuation_range_low": 13200000000,
    "valuation_range_high": 15800000000,
    "valuation_range_midpoint": 14500000000,
    "why_range_exists": "Multiple scenarios based on margin trajectory and terminal growth assumptions",
    "dcf": {
      "terminal_growth_rate": 2.5,
      "wacc": 8.2,
      "implied_value": 14500000000,
      "implied_value_per_share": 145.00
    },
    "trading_comps": {
      "implied_value_range_low": 13500000000,
      "implied_value_range_high": 15200000000,
      "confidence": {
        "coverage": 85,
        "auditability": 78,
        "freshness_days": 7
      }
    },
    "precedent_transactions": {
      "implied_value_range_low": 14000000000,
      "implied_value_range_high": 16500000000,
      "confidence": {
        "coverage": 70,
        "auditability": 65,
        "freshness_days": 30
      }
    }
  },
  "hypotheses": [
    {
      "id": "ai-1",
      "type": "alert",
      "confidence_band": "high",
      "title": "Unusual Volume Detected",
      "summary": "Trading volume 2.3x above 20-day average.",
      "source": "Volume Analysis",
      "generated_at": "2024-12-14T09:00:00Z",
      "horizon_relevance": ["1D", "1W"],
      "impact_score": 0.4,
      "action_required": false
    },
    {
      "id": "ai-2",
      "type": "hypothesis",
      "confidence_band": "medium",
      "title": "Price Momentum Building",
      "summary": "7-day RSI indicates bullish momentum.",
      "source": "Technical Analysis",
      "generated_at": "2024-12-14T09:00:00Z",
      "horizon_relevance": ["1W", "1M"],
      "impact_score": 0.35,
      "action_required": false
    },
    {
      "id": "ai-3",
      "type": "analysis",
      "confidence_band": "high",
      "title": "Earnings Catalyst Approaching",
      "summary": "Q4 earnings in 23 days. Consensus revisions trending positive.",
      "source": "Earnings Analysis",
      "generated_at": "2024-12-14T09:00:00Z",
      "horizon_relevance": ["1M"],
      "impact_score": 0.6,
      "action_required": true
    },
    {
      "id": "ai-4",
      "type": "hypothesis",
      "confidence_band": "medium",
      "title": "Sector Rotation Tailwind",
      "summary": "Macro cycle analysis suggests industrials outperformance.",
      "source": "Macro Analysis",
      "generated_at": "2024-12-14T09:00:00Z",
      "horizon_relevance": ["1Y"],
      "impact_score": 0.45,
      "action_required": false
    },
    {
      "id": "ai-5",
      "type": "analysis",
      "confidence_band": "medium",
      "title": "Competitive Moat Assessment",
      "summary": "Market share gains sustainable. IP portfolio widening.",
      "source": "Competitive Intelligence",
      "generated_at": "2024-12-14T09:00:00Z",
      "horizon_relevance": ["5Y", "10Y"],
      "impact_score": 0.7,
      "action_required": false
    }
  ],
  "ai_insights": [
    {
      "id": "ai-1",
      "type": "alert",
      "confidence_band": "high",
      "title": "Unusual Volume Detected",
      "summary": "Trading volume 2.3x above 20-day average.",
      "source": "Volume Analysis",
      "generated_at": "2024-12-14T09:00:00Z",
      "horizon_relevance": ["1D", "1W"],
      "impact_score": 0.4,
      "action_required": false
    },
    {
      "id": "ai-2",
      "type": "hypothesis",
      "confidence_band": "medium",
      "title": "Price Momentum Building",
      "summary": "7-day RSI indicates bullish momentum.",
      "source": "Technical Analysis",
      "generated_at": "2024-12-14T09:00:00Z",
      "horizon_relevance": ["1W", "1M"],
      "impact_score": 0.35,
      "action_required": false
    },
    {
      "id": "ai-3",
      "type": "analysis",
      "confidence_band": "high",
      "title": "Earnings Catalyst Approaching",
      "summary": "Q4 earnings in 23 days. Consensus revisions trending positive.",
      "source": "Earnings Analysis",
      "generated_at": "2024-12-14T09:00:00Z",
      "horizon_relevance": ["1M"],
      "impact_score": 0.6,
      "action_required": true
    },
    {
      "id": "ai-4",
      "type": "hypothesis",
      "confidence_band": "medium",
      "title": "Sector Rotation Tailwind",
      "summary": "Macro cycle analysis suggests industrials outperformance.",
      "source": "Macro Analysis",
      "generated_at": "2024-12-14T09:00:00Z",
      "horizon_relevance": ["1Y"],
      "impact_score": 0.45,
      "action_required": false
    },
    {
      "id": "ai-5",
      "type": "analysis",
      "confidence_band": "medium",
      "title": "Competitive Moat Assessment",
      "summary": "Market share gains sustainable. IP portfolio widening.",
      "source": "Competitive Intelligence",
      "generated_at": "2024-12-14T09:00:00Z",
      "horizon_relevance": ["5Y", "10Y"],
      "impact_score": 0.7,
      "action_required": false
    }
  ],
  "events": [
    {
      "id": "evt-1",
      "date": "2025-01-07",
      "type": "earnings",
      "title": "Q4 2024 Earnings Release",
      "description": "Quarterly earnings announcement",
      "impact": "neutral"
    },
    {
      "id": "evt-2",
      "date": "2025-03-15",
      "type": "filing",
      "title": "10-K Annual Report",
      "description": "Annual filing due",
      "impact": "neutral"
    }
  ],
  "scenarios": {
    "base": {
      "probability": 0.6,
      "assumptions": [
        {
          "key": "Revenue Growth",
          "value": "9%"
        },
        {
          "key": "EBITDA Margin",
          "value": "25.5%"
        }
      ],
      "outputs": {
        "revenue": {
          "value": 3550000000,
          "formatted": "$3.55B",
          "source": "Model",
          "tie_out_status": "final",
          "last_updated": "2024-12-14T08:00:00Z",
          "confidence": 95,
          "availability": "available"
        },
        "ebitda": {
          "value": 905000000,
          "formatted": "$905M",
          "source": "Model",
          "tie_out_status": "final",
          "last_updated": "2024-12-14T08:00:00Z",
          "confidence": 95,
          "availability": "available"
        },
        "valuation": {
          "value": 14500000000,
          "formatted": "$14.5B",
          "source": "DCF",
          "tie_out_status": "final",
          "last_updated": "2024-12-14T08:00:00Z",
          "confidence": 95,
          "availability": "available"
        }
      }
    },
    "downside": {
      "probability": 0.25,
      "assumptions": [
        {
          "key": "Revenue Growth",
          "value": "5%"
        },
        {
          "key": "EBITDA Margin",
          "value": "22%"
        }
      ],
      "outputs": {
        "revenue": {
          "value": 3280000000,
          "formatted": "$3.28B",
          "source": "Model",
          "tie_out_status": "final",
          "last_updated": "2024-12-14T08:00:00Z",
          "confidence": 95,
          "availability": "available"
        },
        "ebitda": {
          "value": 722000000,
          "formatted": "$722M",
          "source": "Model",
          "tie_out_status": "final",
          "last_updated": "2024-12-14T08:00:00Z",
          "confidence": 95,
          "availability": "available"
        },
        "valuation": {
          "value": 11200000000,
          "formatted": "$11.2B",
          "source": "DCF",
          "tie_out_status": "final",
          "last_updated": "2024-12-14T08:00:00Z",
          "confidence": 95,
          "availability": "available"
        }
      }
    },
    "upside": {
      "probability": 0.15,
      "assumptions": [
        {
          "key": "Revenue Growth",
          "value": "14%"
        },
        {
          "key": "EBITDA Margin",
          "value": "27%"
        }
      ],
      "outputs": {
        "revenue": {
          "value": 3850000000,
          "formatted": "$3.85B",
          "source": "Model",
          "tie_out_status": "final",
          "last_updated": "2024-12-14T08:00:00Z",
          "confidence": 95,
          "availability": "available"
        },
        "ebitda": {
          "value": 1040000000,
          "formatted": "$1.04B",
          "source": "Model",
          "tie_out_status": "final",
          "last_updated": "2024-12-14T08:00:00Z",
          "confidence": 95,
          "availability": "available"
        },
        "valuation": {
          "value": 17800000000,
          "formatted": "$17.8B",
          "source": "DCF",
          "tie_out_status": "final",
          "last_updated": "2024-12-14T08:00:00Z",
          "confidence": 95,
          "availability": "available"
        }
      }
    }
  },
  "risks": [
    {
      "id": "risk-1",
      "category": "market",
      "title": "Customer Concentration",
      "description": "Top 3 customers represent 34% of revenue",
      "severity": "high",
      "trigger": "Loss of any top-3 customer",
      "mitigation": "Diversification initiatives underway"
    },
    {
      "id": "risk-2",
      "category": "operational",
      "title": "Management Succession",
      "description": "CEO is 67 years old with no public succession plan",
      "severity": "medium",
      "trigger": "CEO departure announcement",
      "mitigation": "Board engaged executive search firm"
    },
    {
      "id": "risk-3",
      "category": "financial",
      "title": "Input Cost Inflation",
      "description": "Raw material costs up 12% YoY",
      "severity": "medium",
      "trigger": "Margin compression >100bps",
      "mitigation": "Price increases implemented Q4"
    }
  ],
  "public_market_metrics": {
    "net_cash_or_debt": {
      "current": {
        "value": 1200000000,
        "formatted": "$1.2B Net Cash",
        "source": "10-Q Balance Sheet",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      }
    },
    "buyback_capacity": {
      "current": {
        "value": 500000000,
        "formatted": "$500M",
        "source": "Board Authorization",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      }
    },
    "sbc_percent_revenue": {
      "current": {
        "value": 4.2,
        "formatted": "4.2%",
        "source": "Calculated from 10-Q",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      }
    },
    "share_count_trend": {
      "current": {
        "value": -1.2,
        "formatted": "-1.2% YoY",
        "source": "Share Count History",
        "tie_out_status": "final",
        "last_updated": "2024-12-14T08:00:00Z",
        "confidence": 95,
        "availability": "available"
      }
    },
    "segments": [
      {
        "segment_name": "Industrial",
        "growth_percent": 14.2,
        "margin_percent": 28.5
      },
      {
        "segment_name": "Commercial",
        "growth_percent": 8.1,
        "margin_percent": 22.3
      },
      {
        "segment_name": "Services",
        "growth_percent": 18.5,
        "margin_percent": 35.2
      }
    ],
    "guidance_bridge": {
      "metric": "FY24 Revenue",
      "company_guidance_low": 3520,
      "company_guidance_high": 3580,
      "consensus": 3545,
      "delta_to_consensus": 0.3
    },
    "revisions_momentum": {
      "eps_revisions_30d": 4,
      "revenue_revisions_30d": 3,
"direction": "up"
}
},
"path_indicators": [
{
"label": "Revenue vs Plan",
"value": "+2.0% ahead",
"status": "on_track",
"next_check": "Q4 Earnings"
},
{
"label": "Margin Trajectory",
"value": "25.1% (target: 26%)",
"status": "on_track",
"next_check": "Monthly"
},
{
"label": "Market Share",
"value": "Gaining (+$200M TAM)",
"status": "on_track",
"next_check": "Quarterly"
},
{
"label": "Order Book",
"value": "Pending Q4 disclosure",
"status": "at_risk",
"next_check": "Jan 15"
}
],
"position_sizing": {
"current_percent": 6,
"max_percent": 10,
"target_low": 5,
"target_high": 8
},
"variant_view": {
"summary": "Market underestimates margin expansion from competitor exit and operating leverage. Consensus EPS catching up but still 3-5% below our model.",
"sensitivity": [
{
"label": "EBITDA ±1pp",
"impact": "±$0.8B EV"
},
{
"label": "Multiple ±1x",
"impact": "±$0.9B EV"
}
]
},
"kill_switch": {
"conditions": [
"Thesis pillar broken",
"Customer loss confirmed",
"Margin <20%"
]
},
"sources": [
{
"name": "SEC EDGAR",
"type": "primary",
"last_refresh": "2024-12-14T06:00:00Z"
},
{
"name": "Bloomberg Terminal",
"type": "primary",
"last_refresh": "2024-12-14T09:00:00Z"
},
{
"name": "FactSet",
"type": "secondary",
"last_refresh": "2024-12-14T08:30:00Z"
}
],
"run_data_quality": {
"coverage": 88,
"auditability": 82,
"freshness_days": 1
}
}
START SEARCHING AND EXTRACTING NOW.
`;
}