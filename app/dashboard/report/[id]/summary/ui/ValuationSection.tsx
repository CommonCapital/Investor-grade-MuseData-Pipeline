import { Valuation, DataQuality, InvestorDashboard } from "@/lib/seo-schema";
import { calcValuationMidpoint, calcImpliedUpside, CalculatedKPI } from "@/lib/kpi-calculations";
import { cn } from "@/lib/utils";
import { 
  Calculator, 
  TrendingUp, 
  GitCompare, 
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  Info
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface ValuationSectionProps {
  data: InvestorDashboard;
}

// Helper to extract atomic value from schema
function getAtomicValue(val: any): number | null {
  if (val == null) return null;
  if (typeof val === "number") return val;
  if (typeof val === "object" && val.value != null) return val.value;
  return null;
}

function getAtomicFormatted(val: any): string | null {
  if (val == null) return null;
  if (typeof val === "object" && val.formatted) return val.formatted;
  return null;
}

// Get source reference from schema (the only traceable thing in schema)
function getSourceRef(val: any): { url?: string; document_type?: string; excerpt?: string } | null {
  if (val == null || typeof val !== "object") return null;
  return val.source_reference || null;
}

function getQualityBand(quality: DataQuality): "high" | "medium" | "low" {
const scores = [quality?.coverage, quality?.auditability].filter(
  (v): v is number => typeof v === "number"
);

const avgScore = scores.length > 0
  ? scores.reduce((a, b) => a + b, 0) / scores.length
  : 0;

  if (avgScore >= 85) return "high";
  if (avgScore >= 60) return "medium";
  return "low";
}

function DataQualityBadge({ quality }: { quality: DataQuality | null | undefined }) {
  if (!quality) return null;
  
  const band = getQualityBand(quality);
  
  const bandStyles = {
    high: { icon: CheckCircle, bg: "bg-foreground", text: "text-background" },
    medium: { icon: AlertCircle, bg: "bg-foreground/60", text: "text-background" },
    low: { icon: XCircle, bg: "bg-foreground/30", text: "text-foreground" },
  };
  
  const style = bandStyles[band];
  const Icon = style.icon;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className={cn("px-2 py-0.5 text-[10px] uppercase tracking-ultra-wide font-mono flex items-center gap-1", style.bg, style.text)}>
          <Icon className="w-3 h-3" />
          {band}
        </span>
      </div>
      <div className="flex gap-3 text-[10px] text-muted-foreground font-mono">
        {quality.coverage !== null && quality.coverage !== undefined && (
          <span>Coverage: {quality.coverage}%</span>
        )}
        {quality.auditability !== null && quality.auditability !== undefined && (
          <span>Audit: {quality.auditability}%</span>
        )}
        {quality.freshness_days !== null && quality.freshness_days !== undefined && (
          <span>{quality.freshness_days}d old</span>
        )}
      </div>
    </div>
  );
}

function SourceLink({
  sourceRef,
  source,
}: {
  sourceRef?: { url?: string | null; document_type?: string | null } | null;
  source?: string | null;
}) {
  // Normalize null -> undefined
  const safeSourceRef = sourceRef
    ? {
        url: sourceRef.url ?? undefined,
        document_type: sourceRef.document_type ?? undefined,
      }
    : undefined;

  const safeSource = source ?? undefined;

  // Nothing to show
  if (!safeSourceRef?.url && !safeSource) return null;

  return (
    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50">
      <span className="text-[10px] text-muted-foreground">Source:</span>

      {safeSourceRef?.url ? (
        <a
          href={safeSourceRef.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          {safeSourceRef.document_type ?? safeSource ?? "View Source"}
        </a>
      ) : (
        <span className="text-[10px] text-muted-foreground">
          {safeSource ?? "View Source"}
        </span>
      )}
    </div>
  );
}


// Shows formula from kpi-calculations (NOT from schema)
function FormulaTooltip({ kpi, label }: { kpi: CalculatedKPI; label?: string }) {
  if (!kpi.formula) return null;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button className="text-muted-foreground hover:text-foreground transition-colors ml-1">
            <Info className="w-3 h-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="end" className="max-w-sm bg-card border border-border p-3">
          <div className="space-y-2">
            {label && <div className="text-xs font-medium">{label}</div>}
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Formula</div>
              <code className="text-xs font-mono bg-secondary px-2 py-1 block">{kpi.formula}</code>
            </div>
            {kpi.inputs && kpi.inputs.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Inputs</div>
                {kpi.inputs.map((input, i) => (
                  <div key={i} className="flex justify-between text-xs gap-4">
                    <span className="text-muted-foreground">{input.name}</span>
                    <span className="font-mono">{input.formatted}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-2 border-t border-border text-[10px] text-muted-foreground">
              Calculated by: kpi-calculations.ts
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function formatValue(value: number | null): string {
  if (value === null) return "—";
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toFixed(0)}`;
}

export function ValuationSection({ data }: ValuationSectionProps) {
  const valuation = data.valuation;
  if (!valuation) return null;

  const hasRange = valuation.valuation_range_low !== null && valuation.valuation_range_high !== null;

  // Calculate derived values using kpi-calculations (NOT from schema)
  const midpointKPI = calcValuationMidpoint(valuation.valuation_range_low, valuation.valuation_range_high);
  const impliedUpsideKPI = calcImpliedUpside(data);

  return (
    <section className="py-8 border-b border-border">
      <div className="px-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            Valuation Engine
          </h2>
          <span className="text-micro text-muted-foreground ml-auto">
            Derived metrics via: kpi-calculations.ts
          </span>
        </div>

        {/* Summary Range with Traceability */}
        {hasRange && (
          <div className="bg-card border border-border p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-2">
                  Valuation Range
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-mono font-medium">
                    {formatValue(valuation.valuation_range_low ?? null)}
                  </span>
                  <span className="text-muted-foreground">to</span>
                  <span className="text-3xl font-mono font-medium">
                    {formatValue(valuation.valuation_range_high?? null)}
                  </span>
                </div>
                {/* Midpoint - CALCULATED via kpi-calculations */}
                <div className="flex items-center mt-1">
                  <span className="text-sm text-muted-foreground">
                    Midpoint: {midpointKPI.formatted}
                  </span>
                  <FormulaTooltip kpi={midpointKPI} label="Midpoint Calculation" />
                </div>
              </div>
              
              {/* Implied Upside - CALCULATED via kpi-calculations */}
              {impliedUpsideKPI.value !== null && (
                <div className="text-right">
                  <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-1">
                    Implied Upside
                  </span>
                  <div className="flex items-center justify-end">
                    <span className={cn(
                      "text-2xl font-mono font-medium",
                      impliedUpsideKPI.value >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    )}>
                      {impliedUpsideKPI.formatted}
                    </span>
                    <FormulaTooltip kpi={impliedUpsideKPI} label="Implied Upside Calculation" />
                  </div>
                </div>
              )}
            </div>

            {/* Derivation Traceability - Atomic values from schema */}
            <div className="border-t border-border pt-4 mt-4">
              <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-3">
                Range Derivation (Atomic Values from Schema)
              </span>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="bg-secondary/30 p-3">
                  <span className="text-[10px] text-muted-foreground block mb-1">DCF</span>
                  <span className="font-mono">{valuation.dcf ? (getAtomicFormatted(valuation.dcf.implied_value) || formatValue(getAtomicValue(valuation.dcf.implied_value))) : "—"}</span>
                  {valuation.dcf?.source_reference && (
                    <div className="mt-1">
                      <a href={valuation.dcf.source_reference.url ?? ""} target="_blank" rel="noopener noreferrer" className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                        <ExternalLink className="w-2.5 h-2.5" />
                        Source
                      </a>
                    </div>
                  )}
                </div>
                <div className="bg-secondary/30 p-3">
                  <span className="text-[10px] text-muted-foreground block mb-1">Trading Comps</span>
                  <span className="font-mono">
                    {valuation.trading_comps ? `${getAtomicFormatted(valuation.trading_comps.implied_value_range_low) || formatValue(getAtomicValue(valuation.trading_comps.implied_value_range_low))} - ${getAtomicFormatted(valuation.trading_comps.implied_value_range_high) || formatValue(getAtomicValue(valuation.trading_comps.implied_value_range_high))}` : "—"}
                  </span>
                </div>
                <div className="bg-secondary/30 p-3">
                  <span className="text-[10px] text-muted-foreground block mb-1">Precedents</span>
                  <span className="font-mono">
                    {valuation.precedent_transactions ? `${getAtomicFormatted(valuation.precedent_transactions.implied_value_range_low) || formatValue(getAtomicValue(valuation.precedent_transactions.implied_value_range_low))} - ${getAtomicFormatted(valuation.precedent_transactions.implied_value_range_high) || formatValue(getAtomicValue(valuation.precedent_transactions.implied_value_range_high))}` : "—"}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-3">
                Range = min({formatValue(valuation.valuation_range_low ?? null)}) to max({formatValue(valuation.valuation_range_high ?? null)}) across all methodologies
              </p>
            </div>

            {valuation.why_range_exists && (
              <div className="border-t border-border pt-4 mt-4">
                <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-1">
                  Why This Range
                </span>
                <p className="text-sm">{valuation.why_range_exists}</p>
              </div>
            )}
          </div>
        )}

        {/* Three Modalities Grid - Atomic values from schema with source refs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* DCF */}
          <div className="bg-card border border-border p-4">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-4 h-4 text-muted-foreground" />
              <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                DCF Valuation
              </span>
            </div>

            {valuation.dcf ? (
              <div className="mb-4">
                <span className="text-2xl font-mono font-medium">
                  {getAtomicFormatted(valuation.dcf.implied_value) || formatValue(getAtomicValue(valuation.dcf.implied_value))}
                </span>
                {getAtomicValue(valuation.dcf.implied_value_per_share) !== null && (
                  <span className="text-sm text-muted-foreground ml-2">
                    ({getAtomicFormatted(valuation.dcf.implied_value_per_share) || formatValue(getAtomicValue(valuation.dcf.implied_value_per_share))}/share)
                  </span>
                )}
                <div className="mt-3 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Terminal Growth</span>
                    <span className="font-mono">{getAtomicFormatted(valuation.dcf.terminal_growth_rate) || `${getAtomicValue(valuation.dcf.terminal_growth_rate) ?? "—"}%`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WACC</span>
                    <span className="font-mono">{getAtomicFormatted(valuation.dcf.wacc) || `${getAtomicValue(valuation.dcf.wacc) ?? "—"}%`}</span>
                  </div>
                  {valuation.dcf.methodology && (
                    <div className="pt-2 mt-2 border-t border-border/50">
                      <span className="text-[10px] text-muted-foreground">{valuation.dcf.methodology}</span>
                    </div>
                  )}
                </div>
                <SourceLink sourceRef={valuation.dcf.source_reference} source={valuation.dcf.source} />
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not available</p>
            )}
          </div>

          {/* Trading Comps */}
          <div className="bg-card border border-border p-4">
            <div className="flex items-center gap-2 mb-4">
              <GitCompare className="w-4 h-4 text-muted-foreground" />
              <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                Trading Comps
              </span>
            </div>

            {valuation.trading_comps ? (
              <>
                <div className="mb-4">
                  <span className="text-2xl font-mono font-medium">
                    {getAtomicFormatted(valuation.trading_comps.implied_value_range_low) || formatValue(getAtomicValue(valuation.trading_comps.implied_value_range_low))} - {getAtomicFormatted(valuation.trading_comps.implied_value_range_high) || formatValue(getAtomicValue(valuation.trading_comps.implied_value_range_high))}
                  </span>
                  {valuation.trading_comps.multiple_used && (
                    <span className="text-sm text-muted-foreground block mt-1">
                      Multiple: {valuation.trading_comps.multiple_used}
                    </span>
                  )}
                  {valuation.trading_comps.peer_set && valuation.trading_comps.peer_set.length > 0 && (
                    <div className="mt-2">
                      <span className="text-[10px] text-muted-foreground block mb-1">Peer Set:</span>
                      <span className="text-[10px] text-muted-foreground">{valuation.trading_comps.peer_set.join(", ")}</span>
                    </div>
                  )}
                </div>
                <DataQualityBadge quality={valuation.trading_comps.confidence} />
                <SourceLink sourceRef={valuation.trading_comps.source_reference} source={valuation.trading_comps.source} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Not available</p>
            )}
          </div>

          {/* Precedent Transactions */}
          <div className="bg-card border border-border p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                Precedent Transactions
              </span>
            </div>

            {valuation.precedent_transactions ? (
              <>
                <div className="mb-4">
                  <span className="text-2xl font-mono font-medium">
                    {getAtomicFormatted(valuation.precedent_transactions.implied_value_range_low) || formatValue(getAtomicValue(valuation.precedent_transactions.implied_value_range_low))} - {getAtomicFormatted(valuation.precedent_transactions.implied_value_range_high) || formatValue(getAtomicValue(valuation.precedent_transactions.implied_value_range_high))}
                  </span>
                  {valuation.precedent_transactions.transactions && valuation.precedent_transactions.transactions.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <span className="text-[10px] text-muted-foreground block">Reference Transactions:</span>
                      {valuation.precedent_transactions.transactions.map((tx, idx) => (
                        <div key={idx} className="text-[10px] text-muted-foreground flex justify-between">
                          <span>{tx.name}</span>
                          <span className="font-mono">{tx.multiple}x</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <DataQualityBadge quality={valuation.precedent_transactions.confidence} />
                <SourceLink sourceRef={valuation.precedent_transactions.source_reference} source={valuation.precedent_transactions.source} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground">Not available</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
