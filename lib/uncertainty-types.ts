// Uncertainty and Decision Sufficiency Types
// Works with base_metrics schema structure

import { AvailabilityStatus, BaseMetrics, InvestorDashboard } from "./seo-schema";

export type DataAvailability = AvailabilityStatus;

export type SufficiencyLevel = 
  | "sufficient"     // Enough to decide with confidence
  | "partial"        // Can proceed with caveats
  | "insufficient"   // Cannot make informed decision
  | "blocked";       // Critical data missing

export interface UncertaintyReason {
  field: string;
  status: string;
  confidence: number;
  explanation: string;
  impact: "critical" | "material" | "minor";
  workaround?: string;
}

export interface DecisionAssessment {
  sufficiency: SufficiencyLevel;
  confidence: number; // 0-100
  known: string[];
  unknown: string[];
  blockers: string[];
  caveats: string[];
  wouldChangeConclusion: string[];
  recommendation: string;
}

interface MetricCheck {
  name: string;
  value: number | string | null | undefined;
  critical?: boolean;
}

export function computeSufficiencyFromMetrics(metrics: MetricCheck[]): DecisionAssessment {
  const available: string[] = [];
  const unavailable: string[] = [];
  const blockers: string[] = [];

  for (const { name, value, critical } of metrics) {
    if (value !== null && value !== undefined) {
      available.push(name);
    } else {
      unavailable.push(name);
      if (critical) {
        blockers.push(name);
      }
    }
  }

  const completeness = metrics.length > 0 ? available.length / metrics.length : 0;
  const confidence = Math.min(100, Math.round(completeness * 100));

  let sufficiency: SufficiencyLevel;
  let recommendation: string;

  if (blockers.length > 0) {
    sufficiency = "blocked";
    recommendation = `Cannot proceed: missing critical data (${blockers.join(", ")})`;
  } else if (completeness >= 0.9) {
    sufficiency = "sufficient";
    recommendation = "Sufficient data to make informed decision";
  } else if (completeness >= 0.6) {
    sufficiency = "partial";
    recommendation = "Can proceed with documented caveats";
  } else {
    sufficiency = "insufficient";
    recommendation = "Recommend sourcing additional data before decision";
  }

  return {
    sufficiency,
    confidence,
    known: available,
    unknown: unavailable,
    blockers,
    caveats: [],
    wouldChangeConclusion: blockers.length > 0 ? blockers.map(f => `Availability of ${f}`) : [],
    recommendation,
  };
}

// Assess a dashboard for decision readiness using base_metrics
export function assessDashboardSufficiency(data: InvestorDashboard): DecisionAssessment {
  const m = data.base_metrics;

  const metrics: MetricCheck[] = [
    { name: "Revenue", value: m?.revenue, critical: true },
    { name: "EBITDA", value: m?.ebitda_reported ?? m?.ebitda_proxy, critical: true },
    { name: "Free Cash Flow", value: m?.free_cash_flow },
    { name: "Revenue Growth", value: m?.revenue && m?.revenue_prior ? "calculated" : null },
    { name: "Stock Price", value: m?.stock_price },
    { name: "Market Cap", value: m?.market_cap },
    { name: "Operating Income", value: m?.operating_income },
    { name: "Gross Profit", value: m?.gross_profit },
    { name: "Total Debt", value: m?.total_debt },
    { name: "Cash", value: m?.cash },
  ];

  // Check for thesis status
  if (data.executive_summary?.thesis_status) {
    metrics.push({ name: "Thesis Status", value: data.executive_summary.thesis_status, critical: true });
  }

  // Check for valuation
  if (data.valuation?.valuation_range_low && data.valuation?.valuation_range_high) {
    metrics.push({ name: "Valuation Range", value: "available" });
  } else {
    metrics.push({ name: "Valuation Range", value: null });
  }

  return computeSufficiencyFromMetrics(metrics);
}

// Get uncertainty reasons from base_metrics
export function getUncertaintyReasons(data: InvestorDashboard): UncertaintyReason[] {
  const reasons: UncertaintyReason[] = [];
  const m = data.base_metrics;

  const checkValue = (value: number | string | null | undefined, label: string, impact: "critical" | "material" | "minor") => {
    if (value === null || value === undefined) {
      reasons.push({
        field: label,
        status: "unavailable",
        confidence: 0,
        explanation: `${label} not available from current data sources`,
        impact,
        workaround: "Consider alternative data providers or direct company inquiry"
      });
    }
  };

  // Check key base metrics
  checkValue(m?.revenue, "Revenue", "critical");
  checkValue(m?.ebitda_reported ?? m?.ebitda_proxy, "EBITDA", "critical");
  checkValue(m?.free_cash_flow, "Free Cash Flow", "material");
  checkValue(m?.stock_price, "Stock Price", "material");
  checkValue(m?.market_cap, "Market Cap", "material");
  checkValue(m?.operating_income, "Operating Income", "material");
  checkValue(m?.gross_profit, "Gross Profit", "minor");

  // Check valuation
  if (!data.valuation?.valuation_range_low || !data.valuation?.valuation_range_high) {
    reasons.push({
      field: "Valuation Range",
      status: "unavailable",
      confidence: 0,
      explanation: "Valuation range not calculated or missing inputs",
      impact: "critical",
      workaround: "Run DCF and/or trading comps analysis"
    });
  }

  return reasons;
}
