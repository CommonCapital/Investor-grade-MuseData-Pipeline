// Uncertainty and Decision Sufficiency Types
// These types work with the schema's built-in uncertainty fields

import { AvailabilityStatus, Metric } from "./seo-schema";

// Re-export for convenience
export type DataAvailability = AvailabilityStatus;

export type SufficiencyLevel = 
  | "sufficient"     // Enough to decide with confidence
  | "partial"        // Can proceed with caveats
  | "insufficient"   // Cannot make informed decision
  | "blocked";       // Critical data missing

export interface UncertaintyReason {
  field: string;
  status: AvailabilityStatus;
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

// Helper to compute sufficiency from metrics
export function computeSufficiencyFromMetrics(
  metrics: { name: string; metric?: Metric | null; critical?: boolean }[]
): DecisionAssessment {
  const available: string[] = [];
  const unavailable: string[] = [];
  const blockers: string[] = [];
  const caveats: string[] = [];
  let totalConfidence = 0;
  let metricCount = 0;

  for (const { name, metric, critical } of metrics) {
  if (metric && metric.availability === "available" && metric.value !== null) {
    available.push(name);
    const confidence = metric.confidence ?? 0;
    totalConfidence += confidence;
    metricCount++;
    
    if (confidence < 70) {
      caveats.push(`${name} has low confidence (${confidence}%)`);
    }
  } else {
    unavailable.push(name);
    if (critical) {
      blockers.push(name);
      }
      if (metric?.unavailable_reason) {
        caveats.push(`${name}: ${metric.unavailable_reason}`);
      }
    }
  }

  const completeness = metrics.length > 0 ? available.length / metrics.length : 0;
  const avgConfidence = metricCount > 0 ? totalConfidence / metricCount : 0;

  let sufficiency: SufficiencyLevel;
  let confidence: number;
  let recommendation: string;

  if (blockers.length > 0) {
    sufficiency = "blocked";
    confidence = Math.min(100, Math.round(completeness * 30));
    recommendation = `Cannot proceed: missing critical data (${blockers.join(", ")})`;
  } else if (completeness >= 0.9 && avgConfidence >= 75) {
    sufficiency = "sufficient";
    confidence = Math.min(100, Math.round(avgConfidence));
    recommendation = "Sufficient data to make informed decision";
  } else if (completeness >= 0.6 || avgConfidence >= 60) {
    sufficiency = "partial";
    confidence = Math.min(100, Math.round(40 + (completeness * 35)));
    recommendation = "Can proceed with documented caveats";
  } else {
    sufficiency = "insufficient";
    confidence = Math.min(100, Math.round(completeness * 40));
    recommendation = "Recommend sourcing additional data before decision";
  }

  return {
    sufficiency,
    confidence,
    known: available,
    unknown: unavailable,
    blockers,
    caveats,
    wouldChangeConclusion: blockers.length > 0
      ? blockers.map(f => `Availability of ${f}`)
      : [],
    recommendation,
  };
}

// Assess a dashboard for decision readiness
export function assessDashboardSufficiency(data: any): DecisionAssessment {
  // Extract current metrics from MetricWithHistory structure
  const getMetric = (metricWithHistory: any): Metric | null => {
    return metricWithHistory?.current || null;
  };

  const metrics: { name: string; metric?: Metric | null; critical?: boolean }[] = [
    { name: "Revenue", metric: getMetric(data?.financials?.revenue), critical: true },
    { name: "EBITDA", metric: getMetric(data?.financials?.ebitda), critical: true },
    { name: "Free Cash Flow", metric: getMetric(data?.financials?.free_cash_flow) },
    { name: "Revenue Growth", metric: getMetric(data?.financials?.revenue_growth) },
    { name: "Stock Price", metric: getMetric(data?.market_data?.stock_price) },
    { name: "Market Cap", metric: getMetric(data?.market_data?.market_cap) },
  ];

  // Check executive summary
  if (data?.executive_summary?.thesis_status) {
    metrics.push({ 
      name: "Thesis Status", 
      metric: { 
        value: data.executive_summary.thesis_status,
        formatted: data.executive_summary.thesis_status,
        source: "Analysis",
        tie_out_status: "final",
        last_updated: new Date().toISOString(),
        confidence: 100,
        availability: "available"
      }, 
      critical: true 
    });
  }

  return computeSufficiencyFromMetrics(metrics);
}

// Get uncertainty reasons from metrics
export function getUncertaintyReasons(data: any): UncertaintyReason[] {
  const reasons: UncertaintyReason[] = [];

  const checkMetric = (
    metric: Metric | undefined,
    label: string,
    impact: "critical" | "material" | "minor"
  ): void => {
    if (!metric) {
      reasons.push({
        field: label,
        status: "unavailable",
        confidence: 0,
        explanation: `${label} not available from current data sources`,
        impact,
        workaround: "Consider alternative data providers or direct company inquiry",
      });
    } else if (metric.availability !== "available") {
      reasons.push({
        field: label,
        status: metric.availability,
        confidence: metric.confidence ?? 0,
        explanation:
          metric.unavailable_reason || `${label} is ${metric.availability}`,
        impact: metric.availability === "conflicting" ? "critical" : impact,
        workaround: getWorkaroundForStatus(metric.availability),
      });
    } else if ((metric.confidence ?? 0) < 70) {
      reasons.push({
        field: label,
        status: metric.availability,
        confidence: metric.confidence ?? 0,
        explanation: `${label} has low confidence (${metric.confidence ?? 0}%)`,
        impact: "minor",
        workaround: "Verify with additional sources",
      });
    }
  };

  // ⬇️ YOU PROBABLY MISSED THESE CALLS TOO
  checkMetric(data?.financials?.revenue?.current, "Revenue", "critical");
  checkMetric(data?.financials?.ebitda?.current, "EBITDA", "critical");
  checkMetric(data?.financials?.free_cash_flow?.current, "Free Cash Flow", "material");
  checkMetric(data?.market_data?.stock_price?.current, "Stock Price", "material");
  checkMetric(data?.market_data?.target_price?.current, "Target Price", "minor");
  checkMetric(data?.market_data?.pe_ratio?.current, "P/E Ratio", "minor");
  checkMetric(data?.market_data?.ev_ebitda?.current, "EV/EBITDA", "material");

  return reasons; // ✅ THIS IS THE FIX
}


function getWorkaroundForStatus(status: AvailabilityStatus): string {
  switch (status) {
    case "pending": return "Value usable with noted uncertainty; verify when confirmed";
    case "restricted": return "Consider premium data access or alternative sources";
    case "stale": return "Use with caution; factor potential changes since last update";
    case "conflicting": return "Manual reconciliation required";
    case "unavailable": return "Consider alternative data providers";
    default: return "Assess importance to your investment thesis";
  }
}
