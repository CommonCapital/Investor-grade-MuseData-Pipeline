// Time-series types and constants - NO mock data generation
// All data comes from the schema

import { TimeHorizon } from "@/lib/seo-schema";

// Re-export TimeHorizon from schema
export type { TimeHorizon } from "@/lib/seo-schema";

// Time horizons array (removed 1H as not illustrated)
export const TIME_HORIZONS: TimeHorizon[] = ["1D", "1W", "1M", "1Y", "5Y", "10Y"];

export const HORIZON_LABELS: Record<TimeHorizon, string> = {
  "1D": "Day",
  "1W": "Week",
  "1M": "Month",
  "1Y": "Year",
  "5Y": "5 Year",
  "10Y": "10 Year",
};

// Horizon date offsets in days
export const HORIZON_DAYS: Record<TimeHorizon, number> = {
  "1D": 1,
  "1W": 7,
  "1M": 30,
  "1Y": 365,
  "5Y": 365 * 5,
  "10Y": 365 * 10,
};

// Get date range for a horizon
export function getHorizonDateRange(horizon: TimeHorizon): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date(end.getTime() - HORIZON_DAYS[horizon] * 24 * 60 * 60 * 1000);
  return { start, end };
}

// Format value for display
export function formatValue(value: number | null, unit?: string): string {
  if (value === null) return "—";
  
  if (unit === "%" || unit === "shares") {
    if (value >= 1000000) return `${(value / 1000000).toFixed(2)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(unit === "%" ? 1 : 0);
  }
  
  // Default currency formatting
  if (Math.abs(value) >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  return `$${value.toFixed(2)}`;
}
