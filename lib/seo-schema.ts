import { z } from "zod";

// === CORE ENUMS ===

export const companyTypeSchema = z.enum(["public", "private"]);

const tieOutStatusSchema = z.string().nullable().optional();
const availabilityStatusSchema = z.string().nullable().optional();
export const timeHorizonSchema = z.enum(["1D", "1W", "1M", "1Y", "5Y", "10Y"]);

// === RISK CATEGORY ===

export const riskCategorySchema = z.enum([
  "regulatory",
  "market", 
  "operational",
  "cybersecurity",
  "financial",
  "strategic"
]);

// === EBITDA AVAILABILITY ===

const ebitdaAvailabilitySchema = z.enum(["reported", "proxy", "not_applicable"]);

// === DATA QUALITY ===

const dataQualitySchema = z.object({
  coverage: z.number().nullable().optional(),
  auditability: z.number().nullable().optional(),
  freshness_days: z.number().nullable().optional(),
}).nullable().optional();

// === METRIC DEFINITION ===

const metricDefinitionSchema = z.object({
  metric_name: z.string().nullable().optional(),
  period: z.string().nullable().optional(),
  basis: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
}).nullable().optional();

// === DECISION CONTEXT ===

const decisionContextSchema = z.object({
  confidence_level: z.string().nullable().optional(),
  sufficiency_status: z.string().nullable().optional(),
  knowns: z.array(z.string()).nullable().optional(),
  unknowns: z.array(z.string()).nullable().optional(),
  what_changes_conclusion: z.array(z.string()).nullable().optional(),
}).nullable().optional();

// === SOURCE REFERENCE ===

const sourceReferenceSchema = z.object({
  url: z.string().nullable().optional(),
  document_type: z.string().nullable().optional(),
  excerpt: z.string().nullable().optional(),
  accessed_at: z.string().nullable().optional(),
}).nullable().optional();

// === CORE METRIC ===

const metricSchema = z.object({
  value: z.union([z.number(), z.string()]).nullable().optional(),
  formatted: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  source_reference: sourceReferenceSchema,
  tie_out_status: tieOutStatusSchema,
  last_updated: z.string().nullable().optional(),
  availability: availabilityStatusSchema,
  unavailable_reason: z.string().nullable().optional(),
  confidence: z.number().nullable().optional(),
  data_quality: dataQualitySchema,
  decision_context: decisionContextSchema,
  definition: metricDefinitionSchema,
}).nullable().optional();

// === TIME-SERIES ===

const quarterlySeriesSchema = z.object({
  Q1: z.number().nullable().optional(),
  Q2: z.number().nullable().optional(),
  Q3: z.number().nullable().optional(),
  Q4: z.number().nullable().optional(),
}).nullable().optional();

const horizonStatsSchema = z.object({
  quarters: quarterlySeriesSchema,
  high: z.number().nullable().optional(),
  low: z.number().nullable().optional(),
  average: z.number().nullable().optional(),
  volatility: z.number().nullable().optional(),
  change_percent: z.number().nullable().optional(),
}).nullable().optional();

const timeSeriesMetricSchema = z.object({
  horizons: z.object({
    "1D": horizonStatsSchema,
    "1W": horizonStatsSchema,
    "1M": horizonStatsSchema,
    "1Y": horizonStatsSchema,
    "5Y": horizonStatsSchema,
    "10Y": horizonStatsSchema,
  }).nullable().optional(),
  availability: availabilityStatusSchema,
  unavailable_reason: z.string().nullable().optional(),
  confidence: z.number().nullable().optional(),
  data_quality: dataQualitySchema,
  source: z.string().nullable().optional(),
  decision_context: decisionContextSchema,
}).nullable().optional();

const metricWithHistorySchema = z.object({
  current: metricSchema,
  history: timeSeriesMetricSchema.optional().nullable(),
}).nullable().optional();

// === HYPOTHESIS ===

const hypothesisSchema = z.object({
  id: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  summary: z.string().nullable().optional(),
  details: z.string().nullable().optional(),
  assumptions: z.array(z.string()).nullable().optional(),
  falsification_criteria: z.array(z.string()).nullable().optional(),
  confidence_band: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  generated_at: z.string().nullable().optional(),
  horizon_relevance: z.array(z.string()).nullable().optional(),
  impact_score: z.number().nullable().optional(),
  action_required: z.boolean().nullable().optional(),
}).nullable().optional();

// === EVENT ===

const eventSchema = z.object({
  id: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  type: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  impact: z.string().nullable().optional(),
  source_url: z.string().nullable().optional(),
}).nullable().optional();

// === SCENARIO ===

const scenarioDriverSchema = z.object({
  name: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  value: z.string().nullable().optional(),
  unit: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  source_reference: sourceReferenceSchema,
}).nullable().optional();

// Formula input for scenario traceability
const formulaInputSchema = z.object({
  name: z.string().nullable().optional(),
  value: z.union([z.number(), z.string()]).nullable().optional(),
  source: z.string().nullable().optional(),
  source_reference: sourceReferenceSchema,
}).nullable().optional();

// Scenario output metric with formula traceability
const scenarioOutputMetricSchema = z.object({
  value: z.union([z.number(), z.string()]).nullable().optional(),
  formatted: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  formula: z.string().nullable().optional(),
  formula_inputs: z.array(formulaInputSchema).nullable().optional(),
  period: z.string().nullable().optional(), // e.g., "FY24E", "NTM"
  source_reference: sourceReferenceSchema,
}).nullable().optional();

const scenarioOutputsSchema = z.object({
  revenue: scenarioOutputMetricSchema,
  ebitda: scenarioOutputMetricSchema,
  valuation: scenarioOutputMetricSchema,
}).nullable().optional();

const scenarioAssumptionSchema = z.object({
  key: z.string().nullable().optional(),
  value: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  source_reference: sourceReferenceSchema,
}).nullable().optional();

const singleScenarioSchema = z.object({
  probability: z.number().nullable().optional(),
  assumptions: z.array(scenarioAssumptionSchema).nullable().optional(),
  drivers: z.array(scenarioDriverSchema).nullable().optional(),
  outputs: scenarioOutputsSchema,
}).nullable().optional();

const scenariosSchema = z.object({
  base: singleScenarioSchema.optional().nullable(),
  downside: singleScenarioSchema.optional().nullable(),
  upside: singleScenarioSchema.optional().nullable(),
}).optional().nullable();

// === RISK ===

const riskItemSchema = z.object({
  id: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  severity: z.string().nullable().optional(),
  probability: z.number().nullable().optional(),
  trigger: z.string().nullable().optional(),
  trigger_metric: z.string().nullable().optional(),
  mitigation: z.string().nullable().optional(),
  mitigation_action: z.string().nullable().optional(),
  status: z.enum(["Active", "Monitoring", "Resolved"]).nullable().optional(),
  source: z.string().nullable().optional(),
  source_reference: sourceReferenceSchema,
}).nullable().optional();

// Risks structured by required category - each category must be present
const risksSchema = z.object({
  regulatory: z.array(riskItemSchema),
  market: z.array(riskItemSchema),
  operational: z.array(riskItemSchema),
  cybersecurity: z.array(riskItemSchema),
  financial: z.array(riskItemSchema),
  strategic: z.array(riskItemSchema),
}).nullable().optional();

// Legacy single risk schema for backwards compatibility
const riskSchema = riskItemSchema;

// === CHANGE ===

const changeSchema = z.object({
  id: z.string().nullable().optional(),
  timestamp: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  source_url: z.string().nullable().optional(),
  thesis_pillar: z.string().nullable().optional(),
  so_what: z.string().nullable().optional(),
  action: z.string().nullable().optional(),
}).nullable().optional();

// === PATH INDICATOR ===

const pathIndicatorSchema = z.object({
  label: z.string().nullable().optional(),
  value: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  next_check: z.string().nullable().optional(),
}).nullable().optional();

// === POSITION SIZING ===

const positionSizingSchema = z.object({
  current_percent: z.number().nullable().optional(),
  max_percent: z.number().nullable().optional(),
  target_low: z.number().nullable().optional(),
  target_high: z.number().nullable().optional(),
}).nullable().optional();

// === VARIANT VIEW ===

const variantViewSchema = z.object({
  summary: z.string().nullable().optional(),
  sensitivity: z.array(z.object({
    label: z.string().nullable().optional(),
    impact: z.string().nullable().optional(),
  })).nullable().optional(),
}).nullable().optional();

// === KILL SWITCH ===

const killSwitchSchema = z.object({
  conditions: z.array(z.string()).nullable().optional(),
}).nullable().optional();

// === ATOMIC VALUE (value + source only, formulas live in kpi-calculations.ts) ===

const atomicValueSchema = z.object({
  value: z.number().nullable().optional(),
  formatted: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  source_reference: sourceReferenceSchema,
}).nullable().optional();

// Alias for backward compatibility during refactor
const traceableValueSchema = atomicValueSchema;

// === VALUATION ===

const valuationSchema = z.object({
  valuation_range_low: z.number().nullable().optional(),
  valuation_range_high: z.number().nullable().optional(),
  valuation_range_midpoint: z.number().nullable().optional(),
  why_range_exists: z.string().nullable().optional(),
  
  dcf: z.object({
    terminal_growth_rate: traceableValueSchema,
    wacc: traceableValueSchema,
    implied_value: traceableValueSchema,
    implied_value_per_share: traceableValueSchema,
    source: z.string().nullable().optional(),
    source_reference: sourceReferenceSchema,
    methodology: z.string().nullable().optional(),
  }).nullable().optional(),
  
  trading_comps: z.object({
    implied_value_range_low: traceableValueSchema,
    implied_value_range_high: traceableValueSchema,
    peer_set: z.array(z.string()).nullable().optional(),
    multiple_used: z.string().nullable().optional(),
    source: z.string().nullable().optional(),
    source_reference: sourceReferenceSchema,
    confidence: dataQualitySchema,
  }).nullable().optional(),
  
  precedent_transactions: z.object({
    implied_value_range_low: traceableValueSchema,
    implied_value_range_high: traceableValueSchema,
    transactions: z.array(z.object({
      name: z.string().nullable().optional(),
      date: z.string().nullable().optional(),
      multiple: z.number().nullable().optional(),
    })).nullable().optional(),
    source: z.string().nullable().optional(),
    source_reference: sourceReferenceSchema,
    confidence: dataQualitySchema,
  }).nullable().optional(),
}).nullable().optional();

// === BASE METRICS (ATOMIC, NON-DERIVABLE) ===

const baseMetricsSchema = z.object({
  // Market / Price Base
  market_cap: z.number().nullable().optional(),
  stock_price: z.number().nullable().optional(),
  shares_outstanding: z.number().nullable().optional(),
  
  // Balance Sheet
  total_debt: z.number().nullable().optional(),
  preferred_stock: z.number().nullable().optional(),
  minority_interest: z.number().nullable().optional(),
  cash: z.number().nullable().optional(),
  marketable_securities: z.number().nullable().optional(),
  current_assets: z.number().nullable().optional(),
  current_liabilities: z.number().nullable().optional(),
  accounts_receivable: z.number().nullable().optional(),
  
  // Income Statement (Quarterly)
  revenue: z.number().nullable().optional(),
  revenue_prior: z.number().nullable().optional(),
  gross_profit: z.number().nullable().optional(),
  operating_income: z.number().nullable().optional(),
  depreciation_amortization: z.number().nullable().optional(),
  interest_expense: z.number().nullable().optional(),
  
  // Income Statement (TTM - Trailing Twelve Months)
  revenue_ttm: z.number().nullable().optional(),
  ebitda_ttm: z.number().nullable().optional(),
  gross_profit_ttm: z.number().nullable().optional(),
  operating_income_ttm: z.number().nullable().optional(),
  
  // EBITDA (dual structure)
  ebitda_reported: z.number().nullable().optional(),
  ebitda_proxy: z.number().nullable().optional(),
  ebitda_availability: ebitdaAvailabilitySchema.nullable().optional(),
  
  // Cash Flow
  free_cash_flow: z.number().nullable().optional(),
  net_burn: z.number().nullable().optional(),
  
  // Operational
  headcount: z.number().nullable().optional(),
  rd_spend: z.number().nullable().optional(),
  sm_spend: z.number().nullable().optional(),
  sm_spend_prior: z.number().nullable().optional(),
  
  // SaaS / Subscription
  arr: z.number().nullable().optional(),
  arr_prior: z.number().nullable().optional(),
  new_arr: z.number().nullable().optional(),
  expansion_arr: z.number().nullable().optional(),
  contraction_arr: z.number().nullable().optional(),
  churned_arr: z.number().nullable().optional(),
  monthly_churn_percent: z.number().nullable().optional(),
  cac: z.number().nullable().optional(),
  ltv: z.number().nullable().optional(),
  arpa: z.number().nullable().optional(),
  gross_margin_percent: z.number().nullable().optional(),
  average_customer_lifespan_months: z.number().nullable().optional(),
  
  // Customer Metrics
  customer_count: z.number().nullable().optional(),
  top_customer_revenue_percent: z.number().nullable().optional(),
  top_3_customer_revenue_percent: z.number().nullable().optional(),
  top_10_customer_revenue_percent: z.number().nullable().optional(),
  
  // Supplier Concentration
  top_supplier_spend_percent: z.number().nullable().optional(),
  top_5_supplier_spend_percent: z.number().nullable().optional(),
}).nullable().optional();

// === MAIN SCHEMA ===

export const investorDashboardSchema = z.object({
  // Company Classification
  company_type: companyTypeSchema,
  
  run_metadata: z.object({
    run_id: z.string().nullable().optional(),
    entity: z.string().nullable().optional(),
    ticker: z.string().nullable().optional(),
    timestamp: z.string().nullable().optional(),
    owner: z.string().nullable().optional(),
  }).nullable().optional(),

  // Base Metrics (atomic, non-derivable)
  base_metrics: baseMetricsSchema,
  
  // Time series for charting
  time_series: z.object({
    stock_price: timeSeriesMetricSchema,
    revenue: timeSeriesMetricSchema,
    ebitda: timeSeriesMetricSchema,
    volume: timeSeriesMetricSchema,
  }).nullable().optional(),

  changes_since_last_run: z.array(changeSchema).nullable().optional(),

  executive_summary: z.object({
    headline: z.string().nullable().optional(),
    key_facts: z.array(z.string()).nullable().optional(),
    implications: z.array(z.string()).nullable().optional(),
    key_risks: z.array(z.string()).nullable().optional(),
    thesis_status: z.string().nullable().optional(),
  }).nullable().optional(),

  valuation: valuationSchema,

  hypotheses: z.array(hypothesisSchema).nullable().optional(),
  ai_insights: z.array(hypothesisSchema).nullable().optional(),

  events: z.array(eventSchema).nullable().optional(),
  scenarios: scenariosSchema.optional().nullable(),
  risks: risksSchema,

  path_indicators: z.array(pathIndicatorSchema).nullable().optional(),
  position_sizing: positionSizingSchema,
  variant_view: variantViewSchema,
  kill_switch: killSwitchSchema,

  // Public Market Metrics
  net_cash_or_debt: metricSchema,
  buyback_capacity: metricSchema,
  sbc_percent_revenue: metricSchema,
  share_count_trend: metricSchema,
  
  segments: z.array(z.object({
    name: z.string().nullable().optional(),
    revenue: metricSchema,
    growth: metricSchema,
    margin: metricSchema,
  })).nullable().optional(),
  
  guidance_bridge: z.object({
    low: traceableValueSchema,
    high: traceableValueSchema,
    current_consensus: traceableValueSchema,
    gap_percent: traceableValueSchema,
    source: z.string().nullable().optional(),
    source_reference: sourceReferenceSchema,
    last_updated: z.string().nullable().optional(),
  }).nullable().optional(),
  
  revisions_momentum: z.object({
    direction: z.string().nullable().optional(),
    magnitude: traceableValueSchema,
    trend: z.string().nullable().optional(),
    source: z.string().nullable().optional(),
    source_reference: sourceReferenceSchema,
    last_updated: z.string().nullable().optional(),
  }).nullable().optional(),

  sources: z.array(z.object({
    name: z.string(),
    type: z.enum(["primary", "secondary"]),
    last_refresh: z.string(),
    refresh_frequency: z.enum(["realtime", "hourly", "daily", "weekly", "quarterly", "manual"]).optional(),
    status: z.enum(["connected", "stale", "error", "pending"]).optional(),
    priority: z.number().optional(), // Lower = higher priority
    url: z.string().optional(),
    metrics_covered: z.array(z.string()).optional(),
    next_refresh: z.string().optional(),
  })).optional().nullable(),

  // Unit Economics with Investor Context
  unit_economics: z.object({
    cac: traceableValueSchema,
    ltv: traceableValueSchema,
    ltv_cac_ratio: traceableValueSchema,
    payback_period_months: traceableValueSchema,
    investor_context: z.object({
      ltv_cac_interpretation: z.string().nullable().optional(),
      benchmark_comparison: z.string().nullable().optional(),
      trend_analysis: z.string().nullable().optional(),
      risk_factors: z.array(z.string()).nullable().optional(),
      action_implications: z.string().nullable().optional(),
    }).nullable().optional(),
    source: z.string().nullable().optional(),
    source_reference: sourceReferenceSchema,
  }).nullable().optional(),

  run_data_quality: dataQualitySchema,
}).passthrough();

// === TYPE EXPORTS ===

export type CompanyType = z.infer<typeof companyTypeSchema>;
export type InvestorDashboard = z.infer<typeof investorDashboardSchema>;
export type Metric = z.infer<typeof metricSchema>;
export type MetricWithHistory = z.infer<typeof metricWithHistorySchema>;
export type TimeSeriesMetric = z.infer<typeof timeSeriesMetricSchema>;
export type HorizonStats = z.infer<typeof horizonStatsSchema>;
export type QuarterlySeries = z.infer<typeof quarterlySeriesSchema>;
export type DecisionContext = z.infer<typeof decisionContextSchema>;
export type TieOutStatus = z.infer<typeof tieOutStatusSchema>;
export type AvailabilityStatus = z.infer<typeof availabilityStatusSchema>;
export type TimeHorizon = z.infer<typeof timeHorizonSchema>;
export type Hypothesis = z.infer<typeof hypothesisSchema>;
export type AIInsight = z.infer<typeof hypothesisSchema>;
export type Event = z.infer<typeof eventSchema>;
export type Scenarios = z.infer<typeof scenariosSchema>;
export type SingleScenario = z.infer<typeof singleScenarioSchema>;
export type Risk = z.infer<typeof riskSchema>;
export type RiskCategory = z.infer<typeof riskCategorySchema>;
export type DataQuality = z.infer<typeof dataQualitySchema>;
export type MetricDefinition = z.infer<typeof metricDefinitionSchema>;
export type SourceReference = z.infer<typeof sourceReferenceSchema>;
export type Change = z.infer<typeof changeSchema>;
export type Valuation = z.infer<typeof valuationSchema>;
export type ScenarioDriver = z.infer<typeof scenarioDriverSchema>;
export type BaseMetrics = z.infer<typeof baseMetricsSchema>;
export type EbitdaAvailability = z.infer<typeof ebitdaAvailabilitySchema>;
export type TraceableValue = z.infer<typeof traceableValueSchema>;
export type UnitEconomics = z.infer<typeof investorDashboardSchema>["unit_economics"];
