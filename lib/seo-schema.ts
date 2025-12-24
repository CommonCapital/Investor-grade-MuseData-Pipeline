import { z } from "zod";

// === CORE ENUMS (flexible with fallback to string) ===

const tieOutStatusSchema = z.string().nullable().optional();

const availabilityStatusSchema = z.string().nullable().optional();

export const timeHorizonSchema = z.enum(["1D", "1W", "1M", "1Y", "5Y", "10Y"]);

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

const scenarioOutputsSchema = z.object({
  revenue: metricSchema,
  ebitda: metricSchema,
  valuation: metricSchema,
}).nullable().optional();

const singleScenarioSchema = z.object({
  probability: z.number().nullable().optional(),
  assumptions: z.array(z.object({
    key: z.string().nullable().optional(),
    value: z.string().nullable().optional(),
  })).nullable().optional(),
  outputs: scenarioOutputsSchema,
}).nullable().optional();

const scenariosSchema = z.object({
  base: singleScenarioSchema.optional().nullable(),
  downside: singleScenarioSchema.optional().nullable(),
  upside: singleScenarioSchema.optional().nullable(),
}).optional().nullable();

// === RISK ===

const riskSchema = z.object({
  id: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  severity: z.string().nullable().optional(),
  trigger: z.string().nullable().optional(),
  mitigation: z.string().nullable().optional(),
}).nullable().optional();

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

// === VALUATION ===

const valuationSchema = z.object({
  valuation_range_low: z.number().nullable().optional(),
  valuation_range_high: z.number().nullable().optional(),
  valuation_range_midpoint: z.number().nullable().optional(),
  why_range_exists: z.string().nullable().optional(),
  
  dcf: z.object({
    terminal_growth_rate: z.number().nullable().optional(),
    wacc: z.number().nullable().optional(),
    implied_value: z.number().nullable().optional(),
    implied_value_per_share: z.number().nullable().optional(),
  }).nullable().optional(),
  
  trading_comps: z.object({
    implied_value_range_low: z.number().nullable().optional(),
    implied_value_range_high: z.number().nullable().optional(),
    confidence: dataQualitySchema,
  }).nullable().optional(),
  
  precedent_transactions: z.object({
    implied_value_range_low: z.number().nullable().optional(),
    implied_value_range_high: z.number().nullable().optional(),
    confidence: dataQualitySchema,
  }).nullable().optional(),
}).nullable().optional();

// === MAIN SCHEMA ===

export const investorDashboardSchema = z.object({
  run_metadata: z.object({
    run_id: z.string().nullable().optional(),
    entity: z.string().nullable().optional(),
    ticker: z.string().nullable().optional(),
    mode: z.string().nullable().optional(),
    timestamp: z.string().nullable().optional(),
    owner: z.string().nullable().optional(),
  }).nullable().optional(),

  changes_since_last_run: z.array(changeSchema).nullable().optional(),

  executive_summary: z.object({
    headline: z.string().nullable().optional(),
    key_facts: z.array(z.string()).nullable().optional(),
    implications: z.array(z.string()).nullable().optional(),
    key_risks: z.array(z.string()).nullable().optional(),
    thesis_status: z.string().nullable().optional(),
  }).nullable().optional(),

  financials: z.object({
    revenue: metricWithHistorySchema,
    revenue_growth: z.object({ current: metricSchema }).nullable().optional(),
    ebitda: metricWithHistorySchema,
    ebitda_margin: z.object({ current: metricSchema }).nullable().optional(),
    free_cash_flow: z.object({ current: metricSchema }).nullable().optional(),
  }).nullable().optional(),

  market_data: z.object({
    stock_price: metricWithHistorySchema,
    volume: metricWithHistorySchema,
    market_cap: z.object({ current: metricSchema }).nullable().optional(),
    pe_ratio: z.object({ current: metricSchema }).nullable().optional(),
    ev_ebitda: z.object({ current: metricSchema }).nullable().optional(),
    target_price: z.object({ current: metricSchema }).nullable().optional(),
  }).nullable().optional(),

  private_data: z.object({
    valuation_mark: z.object({ current: metricSchema }).nullable().optional(),
    net_leverage: z.object({ current: metricSchema }).nullable().optional(),
  }).nullable().optional(),

  valuation: valuationSchema,

  hypotheses: z.array(hypothesisSchema).nullable().optional(),
  ai_insights: z.array(hypothesisSchema).nullable().optional(),

  events: z.array(eventSchema).nullable().optional(),
  scenarios: scenariosSchema.optional().nullable(),
  risks: z.array(riskSchema).optional().nullable(),

  sources: z.array(z.object({
    name: z.string(),
    type: z.enum(["primary", "secondary"]),
    last_refresh: z.string(),
  })).optional().nullable(),

  run_data_quality: dataQualitySchema,
}).passthrough();

// === TYPE EXPORTS ===

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
export type DataQuality = z.infer<typeof dataQualitySchema>;
export type MetricDefinition = z.infer<typeof metricDefinitionSchema>;
export type SourceReference = z.infer<typeof sourceReferenceSchema>;
export type Change = z.infer<typeof changeSchema>;
export type Valuation = z.infer<typeof valuationSchema>;
