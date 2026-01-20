import { InvestorDashboard } from "@/lib/seo-schema";
import { calcGuidanceGap, CalculatedKPI } from "@/lib/kpi-calculations";
import { TrendingUp, TrendingDown, Minus, Target, BarChart3, ExternalLink, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface MarketExpectationsPanelProps {
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

// Get source reference from schema (the only thing schema should store besides atomic values)
function getSourceRef(val: any): { url?: string; document_type?: string; excerpt?: string } | null {
  if (val == null || typeof val !== "object") return null;
  return val.source_reference || null;
}

function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "—";
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function SourceLink({
  sourceRef,
}: {
  sourceRef?: { url?: string | null; document_type?: string | null } | null;
}) {
  // Normalize null -> undefined
  const safeSourceRef = sourceRef
    ? {
        url: sourceRef.url ?? undefined,
        document_type: sourceRef.document_type ?? undefined,
      }
    : undefined;

  if (!safeSourceRef?.url) return null;

  return (
    <a
      href={safeSourceRef.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
    >
      <ExternalLink className="w-3 h-3" />
      {safeSourceRef.document_type ?? "Source"}
    </a>
  );
}


// Shows formula from kpi-calculations (NOT from schema)
function FormulaTooltip({ kpi }: { kpi: CalculatedKPI }) {
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

// Displays atomic value from schema with source reference
function AtomicMetric({ 
  label, 
  val, 
  showSource = true 
}: { 
  label: string; 
  val: any;
  showSource?: boolean;
}) {
  const value = getAtomicValue(val);
  const formatted = getAtomicFormatted(val);
  const sourceRef = getSourceRef(val);

  return (
    <div>
      <span className="text-micro text-muted-foreground block mb-1">{label}</span>
      <span className="font-mono text-lg">{formatted || formatCurrency(value)}</span>
      {showSource && sourceRef && (
        <div className="mt-1">
          <SourceLink sourceRef={sourceRef} />
        </div>
      )}
    </div>
  );
}

function GuidanceBridge({ data, gapKPI }: { data: InvestorDashboard["guidance_bridge"]; gapKPI: CalculatedKPI }) {
  if (!data) return null;

  const { low, high, current_consensus, source, source_reference } = data;
  
  const gapValue = gapKPI.value;
  const gapIsPositive = (gapValue ?? 0) > 0;
  const gapIsNeutral = (gapValue ?? 0) === 0;

  return (
    <div className="border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
          Guidance vs. Consensus
        </h4>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <AtomicMetric label="Guidance Low" val={low} />
        <AtomicMetric label="Guidance High" val={high} />
        <AtomicMetric label="Current Consensus" val={current_consensus} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <span className="text-micro text-muted-foreground">Gap:</span>
          <span className={cn(
            "font-mono font-medium",
            gapIsPositive ? "text-emerald-600 dark:text-emerald-400" : 
            gapIsNeutral ? "text-muted-foreground" : "text-rose-600 dark:text-rose-400"
          )}>
            {gapKPI.formatted}
          </span>
          {gapIsPositive ? (
            <TrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          ) : gapIsNeutral ? (
            <Minus className="w-3 h-3 text-muted-foreground" />
          ) : (
            <TrendingDown className="w-3 h-3 text-rose-600 dark:text-rose-400" />
          )}
          <FormulaTooltip kpi={gapKPI} />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-micro text-muted-foreground">Source: {source ?? "—"}</span>
          <SourceLink sourceRef={source_reference} />
        </div>
      </div>
    </div>
  );
}

function RevisionsMomentum({ data }: { data: InvestorDashboard["revisions_momentum"] }) {
  if (!data) return null;

  const { direction, magnitude, trend, source, source_reference } = data;
  const isUp = direction === "up";
  const isDown = direction === "down";
  
  // magnitude is an atomic value from schema (not calculated)
  const magnitudeFormatted = getAtomicFormatted(magnitude);
  const magnitudeValue = getAtomicValue(magnitude);
  const magnitudeSourceRef = getSourceRef(magnitude);

  return (
    <div className="border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-4 h-4 text-muted-foreground" />
        <h4 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
          30-Day Estimate Revisions
        </h4>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <span className="text-micro text-muted-foreground block mb-1">Direction</span>
          <div className="flex items-center gap-2">
            {isUp ? (
              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : isDown ? (
              <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            ) : (
              <Minus className="w-4 h-4 text-muted-foreground" />
            )}
            <span className={cn(
              "font-medium capitalize",
              isUp ? "text-emerald-600 dark:text-emerald-400" :
              isDown ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"
            )}>
              {direction ?? "—"}
            </span>
          </div>
        </div>
        <div>
          <span className="text-micro text-muted-foreground block mb-1">Magnitude</span>
          <span className={cn(
            "font-mono text-lg",
            isUp ? "text-emerald-600 dark:text-emerald-400" :
            isDown ? "text-rose-600 dark:text-rose-400" : "text-foreground"
          )}>
            {magnitudeFormatted || (magnitudeValue != null ? `${magnitudeValue > 0 ? '+' : ''}${magnitudeValue}%` : "—")}
          </span>
          {magnitudeSourceRef && (
            <div className="mt-1">
              <SourceLink sourceRef={magnitudeSourceRef} />
            </div>
          )}
        </div>
        <div>
          <span className="text-micro text-muted-foreground block mb-1">Trend</span>
          <span className={cn(
            "text-sm capitalize",
            trend === "accelerating" ? "text-emerald-600 dark:text-emerald-400" :
            trend === "decelerating" ? "text-amber-600 dark:text-amber-400" : "text-foreground"
          )}>
            {trend ?? "—"}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-border flex items-center justify-between">
        <span className="text-micro text-muted-foreground">Source: {source ?? "—"}</span>
        <SourceLink sourceRef={source_reference} />
      </div>
    </div>
  );
}

export function MarketExpectationsPanel({ data }: MarketExpectationsPanelProps) {
  const hasGuidance = data.guidance_bridge != null;
  const hasRevisions = data.revisions_momentum != null;

  if (!hasGuidance && !hasRevisions) return null;

  // Calculate gap using kpi-calculations (NOT from schema)
  const gapKPI = calcGuidanceGap(
    getAtomicValue(data.guidance_bridge?.low),
    getAtomicValue(data.guidance_bridge?.high),
    getAtomicValue(data.guidance_bridge?.current_consensus)
  );

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-4 h-4" />
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            Market Expectations
          </h2>
          <span className="text-micro text-muted-foreground ml-auto">
            Calculated via: kpi-calculations.ts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hasGuidance && <GuidanceBridge data={data.guidance_bridge} gapKPI={gapKPI} />}
          {hasRevisions && <RevisionsMomentum data={data.revisions_momentum} />}
        </div>
      </div>
    </section>
  );
}
