import { BaseMetrics, InvestorDashboard, SourceReference } from "./seo-schema";

// === KPI FORMULAS ===

export interface CalculatedKPIInput {
  name: string;
  value: number | null;
  formatted: string;
  source?: string;
  sourceReference?: SourceReference | null;
}

export interface CalculatedKPI {
  value: number | null;
  formatted: string;
  formula: string;
  inputs: CalculatedKPIInput[];
}

function formatCurrency(value: number | null): string {
  if (value === null || value === undefined) return "—";
  if (value === 0) return "—";
  const abs = Math.abs(value);
  if (abs >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (abs >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

function formatPercent(value: number | null, decimals = 1): string {
  if (value === null || value === undefined) return "—";
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}

function formatMultiple(value: number | null): string {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(1)}x`;
}

function formatNumber(value: number | null): string {
  if (value === null || value === undefined) return "—";
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(0);
}

// === PRICE CATEGORY ===

export function calcEnterpriseValue(m: BaseMetrics): CalculatedKPI {
  const marketCap = m?.market_cap ?? null;
  const totalDebt = m?.total_debt ?? 0;
  const preferred = m?.preferred_stock ?? 0;
  const minority = m?.minority_interest ?? 0;
  const cash = m?.cash ?? 0;
  
  const value = marketCap !== null ? marketCap + totalDebt + preferred + minority - cash : null;
  
  return {
    value,
    formatted: formatCurrency(value),
    formula: "Market Cap + Total Debt + Preferred + Minority Interest − Cash",
    inputs: [
      { name: "Market Cap", value: marketCap, formatted: formatCurrency(marketCap) },
      { name: "Total Debt", value: totalDebt, formatted: formatCurrency(totalDebt) },
      { name: "Preferred Stock", value: preferred, formatted: formatCurrency(preferred) },
      { name: "Minority Interest", value: minority, formatted: formatCurrency(minority) },
      { name: "Cash", value: cash, formatted: formatCurrency(cash) },
    ]
  };
}

export function calcEVRevenue(m: BaseMetrics): CalculatedKPI {
  const ev = calcEnterpriseValue(m).value;
  const revenue = m?.revenue ?? null;
  const value = ev !== null && revenue && revenue > 0 ? ev / revenue : null;
  
  return {
    value,
    formatted: formatMultiple(value),
    formula: "EV ÷ TTM Revenue",
    inputs: [
      { name: "Enterprise Value", value: ev, formatted: formatCurrency(ev) },
      { name: "Revenue", value: revenue, formatted: formatCurrency(revenue) },
    ]
  };
}

export function calcEVGrossProfit(m: BaseMetrics): CalculatedKPI {
  const ev = calcEnterpriseValue(m).value;
  const gp = m?.gross_profit ?? null;
  const value = ev !== null && gp && gp > 0 ? ev / gp : null;
  
  return {
    value,
    formatted: formatMultiple(value),
    formula: "EV ÷ Gross Profit",
    inputs: [
      { name: "Enterprise Value", value: ev, formatted: formatCurrency(ev) },
      { name: "Gross Profit", value: gp, formatted: formatCurrency(gp) },
    ]
  };
}

export function calcFCFYield(m: BaseMetrics): CalculatedKPI {
  const fcf = m?.free_cash_flow ?? null;
  const ev = calcEnterpriseValue(m).value;
  const value = fcf !== null && ev && ev > 0 ? (fcf / ev) * 100 : null;
  
  return {
    value,
    formatted: value !== null ? `${value.toFixed(1)}%` : "—",
    formula: "TTM Free Cash Flow ÷ EV × 100",
    inputs: [
      { name: "Free Cash Flow", value: fcf, formatted: formatCurrency(fcf) },
      { name: "Enterprise Value", value: ev, formatted: formatCurrency(ev) },
    ]
  };
}

export function calcEarningsYield(m: BaseMetrics): CalculatedKPI {
  const ebit = m?.operating_income ?? null;
  const ev = calcEnterpriseValue(m).value;
  const value = ebit !== null && ev && ev > 0 ? (ebit / ev) * 100 : null;
  
  return {
    value,
    formatted: value !== null ? `${value.toFixed(1)}%` : "—",
    formula: "EBIT ÷ EV × 100",
    inputs: [
      { name: "EBIT", value: ebit, formatted: formatCurrency(ebit) },
      { name: "Enterprise Value", value: ev, formatted: formatCurrency(ev) },
    ]
  };
}

// === PATH CATEGORY ===

export function calcRevenueGrowth(m: BaseMetrics): CalculatedKPI {
  const rev = m?.revenue ?? null;
  const revPrior = m?.revenue_prior ?? null;
  const value = rev !== null && revPrior && revPrior > 0 
    ? ((rev - revPrior) / revPrior) * 100 
    : null;
  
  return {
    value,
    formatted: formatPercent(value),
    formula: "(Revenue − Prior Revenue) ÷ Prior Revenue × 100",
    inputs: [
      { name: "Revenue", value: rev, formatted: formatCurrency(rev) },
      { name: "Prior Revenue", value: revPrior, formatted: formatCurrency(revPrior) },
    ]
  };
}

export function calcGrossMargin(m: BaseMetrics): CalculatedKPI {
  const gp = m?.gross_profit ?? null;
  const rev = m?.revenue ?? null;
  const value = gp !== null && rev && rev > 0 ? (gp / rev) * 100 : null;
  
  return {
    value,
    formatted: value !== null ? `${value.toFixed(1)}%` : "—",
    formula: "Gross Profit ÷ Revenue × 100",
    inputs: [
      { name: "Gross Profit", value: gp, formatted: formatCurrency(gp) },
      { name: "Revenue", value: rev, formatted: formatCurrency(rev) },
    ]
  };
}

export function calcOperatingMargin(m: BaseMetrics): CalculatedKPI {
  const ebit = m?.operating_income ?? null;
  const rev = m?.revenue ?? null;
  const value = ebit !== null && rev && rev > 0 ? (ebit / rev) * 100 : null;
  
  return {
    value,
    formatted: value !== null ? `${value.toFixed(1)}%` : "—",
    formula: "Operating Income ÷ Revenue × 100",
    inputs: [
      { name: "Operating Income", value: ebit, formatted: formatCurrency(ebit) },
      { name: "Revenue", value: rev, formatted: formatCurrency(rev) },
    ]
  };
}

export function calcFCFMargin(m: BaseMetrics): CalculatedKPI {
  const fcf = m?.free_cash_flow ?? null;
  const rev = m?.revenue ?? null;
  const value = fcf !== null && rev && rev > 0 ? (fcf / rev) * 100 : null;
  
  return {
    value,
    formatted: value !== null ? `${value.toFixed(1)}%` : "—",
    formula: "Free Cash Flow ÷ Revenue × 100",
    inputs: [
      { name: "Free Cash Flow", value: fcf, formatted: formatCurrency(fcf) },
      { name: "Revenue", value: rev, formatted: formatCurrency(rev) },
    ]
  };
}

export function calcRevenuePerEmployee(m: BaseMetrics): CalculatedKPI {
  const rev = m?.revenue ?? null;
  const hc = m?.headcount ?? null;
  const value = rev !== null && hc && hc > 0 ? rev / hc : null;
  
  return {
    value,
    formatted: formatCurrency(value),
    formula: "Revenue ÷ Headcount",
    inputs: [
      { name: "Revenue", value: rev, formatted: formatCurrency(rev) },
      { name: "Headcount", value: hc, formatted: formatNumber(hc) },
    ]
  };
}

export function calcRDIntensity(m: BaseMetrics): CalculatedKPI {
  const rd = m?.rd_spend ?? null;
  const rev = m?.revenue ?? null;
  const value = rd !== null && rev && rev > 0 ? (rd / rev) * 100 : null;
  
  return {
    value,
    formatted: value !== null ? `${value.toFixed(1)}%` : "—",
    formula: "R&D Spend ÷ Revenue × 100",
    inputs: [
      { name: "R&D Spend", value: rd, formatted: formatCurrency(rd) },
      { name: "Revenue", value: rev, formatted: formatCurrency(rev) },
    ]
  };
}

// SaaS Metrics
export function calcNRR(m: BaseMetrics): CalculatedKPI {
  const startARR = m?.arr_prior ?? null;
  const expansion = m?.expansion_arr ?? 0;
  const contraction = m?.contraction_arr ?? 0;
  const churned = m?.churned_arr ?? 0;
  
  const value = startARR && startARR > 0 
    ? ((startARR + expansion - contraction - churned) / startARR) * 100 
    : null;
  
  return {
    value,
    formatted: value !== null ? `${value.toFixed(0)}%` : "—",
    formula: "(Start ARR + Expansion − Contraction − Churn) ÷ Start ARR × 100",
    inputs: [
      { name: "Start ARR", value: startARR, formatted: formatCurrency(startARR) },
      { name: "Expansion", value: expansion, formatted: formatCurrency(expansion) },
      { name: "Contraction", value: contraction, formatted: formatCurrency(contraction) },
      { name: "Churned", value: churned, formatted: formatCurrency(churned) },
    ]
  };
}

export function calcCAC(m: BaseMetrics): CalculatedKPI {
  const cac = m?.cac ?? null;
  const smSpend = m?.sm_spend ?? null;
  const customerCount = m?.customer_count ?? null;
  
  // If CAC is directly provided, use it; otherwise could be derived from S&M / New Customers
  return {
    value: cac,
    formatted: formatCurrency(cac),
    formula: "Total S&M Spend ÷ New Customers Acquired",
    inputs: [
      { name: "CAC (stored)", value: cac, formatted: formatCurrency(cac) },
      { name: "S&M Spend", value: smSpend, formatted: formatCurrency(smSpend) },
    ]
  };
}

export function calcLTV(m: BaseMetrics): CalculatedKPI {
  const arpa = m?.arpa ?? null;
  const gm = m?.gross_margin_percent ?? null;
  const churn = m?.monthly_churn_percent ?? null;
  
  const value = arpa !== null && gm !== null && churn && churn > 0
    ? (arpa * (gm / 100)) / (churn / 100)
    : null;
  
  return {
    value,
    formatted: formatCurrency(value),
    formula: "(ARPA × Gross Margin %) ÷ Monthly Churn %",
    inputs: [
      { name: "ARPA", value: arpa, formatted: formatCurrency(arpa) },
      { name: "Gross Margin %", value: gm, formatted: gm !== null ? `${gm.toFixed(1)}%` : "—" },
      { name: "Monthly Churn %", value: churn, formatted: churn !== null ? `${churn.toFixed(2)}%` : "—" },
    ]
  };
}

export function calcLTVCAC(m: BaseMetrics): CalculatedKPI {
  const ltv = calcLTV(m).value;
  const cac = m?.cac ?? null;
  const value = ltv !== null && cac && cac > 0 ? ltv / cac : null;
  
  return {
    value,
    formatted: formatMultiple(value),
    formula: "LTV ÷ CAC",
    inputs: [
      { name: "LTV", value: ltv, formatted: formatCurrency(ltv) },
      { name: "CAC", value: cac, formatted: formatCurrency(cac) },
    ]
  };
}

export function calcPaybackPeriod(m: BaseMetrics): CalculatedKPI {
  // Formula: CAC / (ARPA × Gross Margin %)
  // All inputs must be in schema: cac, arpa, gross_margin_percent
  const cac = m?.cac ?? null;
  const arpa = m?.arpa ?? null;
  const gm = m?.gross_margin_percent ?? null;
  
  // Monthly contribution = ARPA × Gross Margin %
  const monthlyContribution = arpa !== null && gm !== null ? arpa * (gm / 100) : null;
  
  // Payback = CAC / Monthly Contribution
  const value = cac !== null && monthlyContribution && monthlyContribution > 0
    ? cac / monthlyContribution
    : null;
  
  return {
    value,
    formatted: value !== null ? `${value.toFixed(0)} months` : "—",
    formula: "CAC ÷ (ARPA × Gross Margin %)",
    inputs: [
      { name: "CAC", value: cac, formatted: formatCurrency(cac) },
      { name: "ARPA", value: arpa, formatted: formatCurrency(arpa) },
      { name: "Gross Margin %", value: gm, formatted: gm !== null ? `${gm.toFixed(1)}%` : "—" },
      { name: "Monthly Contribution", value: monthlyContribution, formatted: formatCurrency(monthlyContribution) },
    ]
  };
}

// === PROTECTION CATEGORY ===

export function calcNetCash(m: BaseMetrics): CalculatedKPI {
  const cash = m?.cash ?? 0;
  const debt = m?.total_debt ?? 0;
  const value = cash - debt;
  
  return {
    value,
    formatted: formatCurrency(value),
    formula: "Cash − Total Debt",
    inputs: [
      { name: "Cash", value: cash, formatted: formatCurrency(cash) },
      { name: "Total Debt", value: debt, formatted: formatCurrency(debt) },
    ]
  };
}

export function calcInterestCoverage(m: BaseMetrics): CalculatedKPI {
  const ebit = m?.operating_income ?? null;
  const interest = m?.interest_expense ?? null;
  const value = ebit !== null && interest && interest > 0 ? ebit / interest : null;
  
  return {
    value,
    formatted: formatMultiple(value),
    formula: "EBIT ÷ Interest Expense",
    inputs: [
      { name: "EBIT", value: ebit, formatted: formatCurrency(ebit) },
      { name: "Interest Expense", value: interest, formatted: formatCurrency(interest) },
    ]
  };
}

export function calcDebtEBITDA(m: BaseMetrics): CalculatedKPI {
  const debt = m?.total_debt ?? null;
  const ebitda = getEffectiveEBITDA(m);
  const value = debt !== null && ebitda && ebitda > 0 ? debt / ebitda : null;
  
  return {
    value,
    formatted: formatMultiple(value),
    formula: "Total Debt ÷ EBITDA",
    inputs: [
      { name: "Total Debt", value: debt, formatted: formatCurrency(debt) },
      { name: "EBITDA", value: ebitda, formatted: formatCurrency(ebitda) },
    ]
  };
}

export function calcCurrentRatio(m: BaseMetrics): CalculatedKPI {
  const ca = m?.current_assets ?? null;
  const cl = m?.current_liabilities ?? null;
  const value = ca !== null && cl && cl > 0 ? ca / cl : null;
  
  return {
    value,
    formatted: formatMultiple(value),
    formula: "Current Assets ÷ Current Liabilities",
    inputs: [
      { name: "Current Assets", value: ca, formatted: formatCurrency(ca) },
      { name: "Current Liabilities", value: cl, formatted: formatCurrency(cl) },
    ]
  };
}

export function calcQuickRatio(m: BaseMetrics): CalculatedKPI {
  const cash = m?.cash ?? 0;
  const securities = m?.marketable_securities ?? 0;
  const ar = m?.accounts_receivable ?? 0;
  const cl = m?.current_liabilities ?? null;
  
  const value = cl && cl > 0 ? (cash + securities + ar) / cl : null;
  
  return {
    value,
    formatted: formatMultiple(value),
    formula: "(Cash + Marketable Securities + A/R) ÷ Current Liabilities",
    inputs: [
      { name: "Cash", value: cash, formatted: formatCurrency(cash) },
      { name: "Marketable Securities", value: securities, formatted: formatCurrency(securities) },
      { name: "Accounts Receivable", value: ar, formatted: formatCurrency(ar) },
      { name: "Current Liabilities", value: cl, formatted: formatCurrency(cl) },
    ]
  };
}

export function calcCashRunway(m: BaseMetrics): CalculatedKPI {
  const cash = m?.cash ?? null;
  const burn = m?.net_burn ?? null;
  const monthlyBurn = burn ? burn / 12 : null;
  const value = cash !== null && monthlyBurn && monthlyBurn > 0 ? cash / monthlyBurn : null;
  
  return {
    value,
    formatted: value !== null ? `${value.toFixed(0)} months` : "—",
    formula: "Cash ÷ Monthly Net Burn",
    inputs: [
      { name: "Cash", value: cash, formatted: formatCurrency(cash) },
      { name: "Monthly Net Burn", value: monthlyBurn, formatted: formatCurrency(monthlyBurn) },
    ]
  };
}

// === EBITDA HELPER ===

export function getEffectiveEBITDA(m: BaseMetrics): number | null {
  if (m?.ebitda_availability === "not_applicable") return null;
  if (m?.ebitda_reported !== null && m?.ebitda_reported !== undefined) return m.ebitda_reported;
  if (m?.ebitda_proxy !== null && m?.ebitda_proxy !== undefined) return m.ebitda_proxy;
  return null;
}

export function getEBITDADisplay(m: BaseMetrics): { value: number | null; label: string; isProxy: boolean } {
  if (m?.ebitda_availability === "not_applicable") {
    return { value: null, label: "Not Applicable", isProxy: false };
  }
  if (m?.ebitda_reported !== null && m?.ebitda_reported !== undefined) {
    return { value: m.ebitda_reported, label: "Reported", isProxy: false };
  }
  if (m?.ebitda_proxy !== null && m?.ebitda_proxy !== undefined) {
    return { value: m.ebitda_proxy, label: "Operating Income + D&A", isProxy: true };
  }
  return { value: null, label: "Not Available", isProxy: false };
}

// === VALUATION HELPERS ===

export function calcImpliedUpside(data: InvestorDashboard): CalculatedKPI {
  const val = data.valuation;
  const low = val?.valuation_range_low;
  const high = val?.valuation_range_high;
  const marketCap = data.base_metrics?.market_cap;
  
  // Don't calculate if valuation range is null/0 or market cap is missing
  if (!low || !high || low === 0 || high === 0 || !marketCap || marketCap === 0) {
    return {
      value: null,
      formatted: "—",
      formula: "(Midpoint Valuation − Market Cap) ÷ Market Cap × 100",
      inputs: []
    };
  }
  
  const midpoint = (low + high) / 2;
  const value = ((midpoint - marketCap) / marketCap) * 100;
  
  return {
    value,
    formatted: formatPercent(value),
    formula: "(Midpoint Valuation − Market Cap) ÷ Market Cap × 100",
    inputs: [
      { name: "Valuation Low", value: low, formatted: formatCurrency(low) },
      { name: "Valuation High", value: high, formatted: formatCurrency(high) },
      { name: "Midpoint", value: midpoint, formatted: formatCurrency(midpoint) },
      { name: "Market Cap", value: marketCap, formatted: formatCurrency(marketCap) },
    ]
  };
}

// === MARKET EXPECTATIONS CALCULATIONS ===

export function calcGuidanceGap(
  guidanceLow: number | null | undefined,
  guidanceHigh: number | null | undefined,
  consensus: number | null | undefined
): CalculatedKPI {
  if (!guidanceLow || !guidanceHigh || !consensus) {
    return {
      value: null,
      formatted: "—",
      formula: "(Consensus − Guidance Midpoint) ÷ Guidance Midpoint × 100",
      inputs: []
    };
  }
  
  const midpoint = (guidanceLow + guidanceHigh) / 2;
  const value = ((consensus - midpoint) / midpoint) * 100;
  
  return {
    value,
    formatted: `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`,
    formula: "(Consensus − Guidance Midpoint) ÷ Guidance Midpoint × 100",
    inputs: [
      { name: "Guidance Low", value: guidanceLow, formatted: formatCurrency(guidanceLow) },
      { name: "Guidance High", value: guidanceHigh, formatted: formatCurrency(guidanceHigh) },
      { name: "Guidance Midpoint", value: midpoint, formatted: formatCurrency(midpoint) },
      { name: "Consensus", value: consensus, formatted: formatCurrency(consensus) },
    ]
  };
}

export function calcValuationMidpoint(low: number | null | undefined, high: number | null | undefined): CalculatedKPI {
  if (!low || !high) {
    return {
      value: null,
      formatted: "—",
      formula: "(Valuation Low + Valuation High) ÷ 2",
      inputs: []
    };
  }
  
  const value = (low + high) / 2;
  
  return {
    value,
    formatted: formatCurrency(value),
    formula: "(Valuation Low + Valuation High) ÷ 2",
    inputs: [
      { name: "Valuation Low", value: low, formatted: formatCurrency(low) },
      { name: "Valuation High", value: high, formatted: formatCurrency(high) },
    ]
  };
}

// === SCENARIO CALCULATIONS ===

export interface ScenarioCalculationInputs {
  revenueTTM: number;
  ebitdaTTM: number;
  growthRate: number; // as decimal, e.g., 0.09 for 9%
  ebitdaMargin: number; // as decimal, e.g., 0.255 for 25.5%
  exitMultiple: number;
  wacc: number; // as decimal
  // Source references for traceability
  growthRateSource?: string;
  growthRateSourceRef?: SourceReference | null;
  ebitdaMarginSource?: string;
  ebitdaMarginSourceRef?: SourceReference | null;
}

export interface CalculatedScenarioOutputs {
  revenue: CalculatedKPI;
  ebitda: CalculatedKPI;
  valuation: CalculatedKPI;
}

export function calcScenarioOutputs(inputs: ScenarioCalculationInputs): CalculatedScenarioOutputs {
  const { 
    revenueTTM, ebitdaTTM, growthRate, ebitdaMargin, exitMultiple, wacc,
    growthRateSource, growthRateSourceRef, ebitdaMarginSource, ebitdaMarginSourceRef
  } = inputs;
  
  // Revenue = TTM × (1 + Growth Rate)
  const projectedRevenue = revenueTTM * (1 + growthRate);
  
  // EBITDA = Projected Revenue × EBITDA Margin
  const projectedEBITDA = projectedRevenue * ebitdaMargin;
  
  // Simple DCF approximation: EBITDA × Exit Multiple / (1 + WACC)
  // In a real model this would be a proper DCF with terminal value
  const impliedValuation = (projectedEBITDA * exitMultiple) / (1 + wacc);
  
  return {
    revenue: {
      value: projectedRevenue,
      formatted: formatCurrency(projectedRevenue),
      formula: "Revenue TTM × (1 + Growth Rate)",
      inputs: [
        { 
          name: "Revenue TTM", 
          value: revenueTTM, 
          formatted: formatCurrency(revenueTTM),
          source: "base_metrics.revenue_ttm"
        },
        { 
          name: "Growth Rate", 
          value: growthRate * 100, 
          formatted: `${(growthRate * 100).toFixed(1)}%`,
          source: growthRateSource || "scenario.drivers",
          sourceReference: growthRateSourceRef
        },
      ]
    },
    ebitda: {
      value: projectedEBITDA,
      formatted: formatCurrency(projectedEBITDA),
      formula: "Projected Revenue × EBITDA Margin",
      inputs: [
        { 
          name: "Projected Revenue", 
          value: projectedRevenue, 
          formatted: formatCurrency(projectedRevenue),
          source: "Calculated above"
        },
        { 
          name: "EBITDA Margin", 
          value: ebitdaMargin * 100, 
          formatted: `${(ebitdaMargin * 100).toFixed(1)}%`,
          source: ebitdaMarginSource || "scenario.drivers",
          sourceReference: ebitdaMarginSourceRef
        },
      ]
    },
    valuation: {
      value: impliedValuation,
      formatted: formatCurrency(impliedValuation),
      formula: "EBITDA × Exit Multiple ÷ (1 + WACC)",
      inputs: [
        { name: "Projected EBITDA", value: projectedEBITDA, formatted: formatCurrency(projectedEBITDA) },
        { name: "Exit Multiple", value: exitMultiple, formatted: `${exitMultiple.toFixed(1)}x` },
        { name: "WACC", value: wacc * 100, formatted: `${(wacc * 100).toFixed(1)}%` },
      ]
    }
  };
}

// Parse driver value to extract growth rate (e.g., "9%" -> 0.09)
export function parseDriverPercent(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return value / 100;
  const match = String(value).match(/([\d.]+)/);
  return match ? parseFloat(match[1]) / 100 : null;
}

// === FORMAT UTILITIES ===

export { formatCurrency, formatPercent, formatMultiple, formatNumber };
