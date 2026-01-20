import { InvestorDashboard as DashboardData } from "@/lib/seo-schema";
import { calcImpliedUpside, formatCurrency } from "@/lib/kpi-calculations";
import { cn } from "@/lib/utils";
import { Target, Route, Shield, TrendingDown, AlertTriangle, Check, Info, ExternalLink, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PricePathProtectionProps {
  data: DashboardData;
}

// Get source from schema sources
function getSource(sources: DashboardData["sources"], name: string) {
  return sources?.find(s => s.name.toLowerCase().includes(name.toLowerCase()));
}

// Source traceability tooltip component
function SourceTooltip({ 
  source, 
  formula,
  inputs,
}: { 
  source?: { document: string; last_updated?: string; url?: string };
  formula?: string;
  inputs?: { name: string; formatted: string }[];
}) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Info className="w-3 h-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="end" className="max-w-xs bg-card border border-border p-3">
          <div className="space-y-2">
            {formula && (
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Formula</div>
                <code className="text-xs font-mono bg-secondary px-2 py-1 block">{formula}</code>
              </div>
            )}
            {inputs && inputs.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Inputs</div>
                {inputs.map((input, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{input.name}</span>
                    <span className="font-mono">{input.formatted}</span>
                  </div>
                ))}
              </div>
            )}
            {source && (
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Source</div>
                <div className="flex items-center gap-1.5 text-xs">
                  <FileText className="w-3 h-3 text-muted-foreground" />
                  <span>{source.document}</span>
                </div>
                {source.last_updated && (
                  <div className="text-[10px] text-muted-foreground/70 pl-4 mt-1">
                    Updated: {new Date(source.last_updated).toLocaleDateString()}
                  </div>
                )}
                {source.url && (
                  <a href={source.url} target="_blank" rel="noopener noreferrer" 
                     className="flex items-center gap-1 text-xs text-foreground hover:underline pl-4 mt-1">
                    <ExternalLink className="w-3 h-3" /> View Source
                  </a>
                )}
              </div>
            )}
            {!formula && !source && (
              <div className="text-xs text-muted-foreground italic">Source reference pending</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function PricePathProtection({ data }: PricePathProtectionProps) {
  const m = data.base_metrics;
  const valuation = data.valuation;
  const sources = data.sources;
  
  // Get sources from schema
  const bloombergSource = getSource(sources, "Bloomberg");
  const secSource = getSource(sources, "SEC") || getSource(sources, "EDGAR");
  
  // Calculate implied upside using formula
  const impliedUpside = calcImpliedUpside(data);
  
  // Check if valuation range is valid (not null/0)
  const hasValidValuation = valuation?.valuation_range_low && valuation?.valuation_range_high 
    && valuation.valuation_range_low > 0 && valuation.valuation_range_high > 0;

  const pathIndicators = data.path_indicators || [];
  
  // Flatten risks from category structure to array for protection triggers
const riskCategories = [
  "regulatory",
  "market",
  "operational",
  "cybersecurity",
  "financial",
  "strategic",
] as const;

const risks = data.risks ?? {
  regulatory: [],
  market: [],
  operational: [],
  cybersecurity: [],
  financial: [],
  strategic: [],
};

const flattenedRisks: Array<{
  trigger?: string;
  title?: string;
  mitigation?: string;
}> = riskCategories.flatMap(cat =>
  risks[cat].map(risk => ({
    trigger: risk?.trigger ?? undefined,
    title: risk?.title ?? undefined,
    mitigation: risk?.mitigation ?? undefined,
  }))
);

  
  const protectionTriggers = flattenedRisks.slice(0, 3).map(risk => ({
    condition: risk?.trigger || risk?.title || "Unknown",
    action: risk?.mitigation || "Review",
    status: "active" as const
  }));
  const positionSizing = data.position_sizing;
  const variantView = data.variant_view;
  const killSwitch = data.kill_switch;

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-6">
          Price → Path → Protection
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PRICE */}
          <div className="border border-border bg-card">
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <Target className="w-4 h-4" />
              <span className="text-micro uppercase tracking-ultra-wide font-medium">Price</span>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-micro text-muted-foreground">Current Price</span>
                  <SourceTooltip source={bloombergSource ? { document: bloombergSource.name, last_updated: bloombergSource.last_refresh } : { document: "Market Data" }} />
                </div>
                <span className="font-mono text-2xl">${m?.stock_price?.toFixed(2) || "—"}</span>
              </div>

              {hasValidValuation ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/50 p-3">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-micro text-muted-foreground">Valuation Range</span>
                      <SourceTooltip 
                        source={{ document: "DCF + Trading Comps" }}
                        formula="Weighted average of DCF, Trading Comps, Precedent Transactions"
                      />
                    </div>
                    <span className="font-mono text-sm">
                      {formatCurrency(valuation?.valuation_range_low ?? null)} - {formatCurrency(valuation?.valuation_range_high ?? null)}
                    </span>
                  </div>
                  <div className="bg-secondary/50 p-3">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-micro text-muted-foreground">Implied Upside</span>
                      <SourceTooltip 
                        formula={impliedUpside.formula}
                        inputs={impliedUpside.inputs.map(i => ({ name: i.name, formatted: i.formatted }))}
                      />
                    </div>
                    <span className={cn("font-mono text-sm", (impliedUpside.value ?? 0) >= 0 ? "text-foreground" : "text-muted-foreground")}>
                      {impliedUpside.formatted}
                    </span>
                  </div>
                </div>
              ) : null}

              <div className="pt-3 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-micro text-muted-foreground">Variant View</span>
                  <SourceTooltip source={{ document: "Internal Analysis" }} />
                </div>
                {variantView?.summary ? (
                  <p className="text-sm font-light">{variantView.summary}</p>
                ) : (
                  <p className="text-sm text-muted-foreground font-light">No variant view available.</p>
                )}
              </div>

              {variantView?.sensitivity && variantView.sensitivity.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-micro text-muted-foreground">Sensitivity</span>
                    <SourceTooltip 
                      source={{ document: "Sensitivity Model" }}
                      formula="Δ Valuation = f(Driver change)"
                    />
                  </div>
                  <div className="space-y-2 text-sm">
                    {variantView.sensitivity.map((item, i) => (
                      <div key={i} className="flex justify-between">
                        <span className="text-muted-foreground">{item?.label || "—"}</span>
                        <span className="font-mono">{item?.impact || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PATH */}
          <div className="border border-border bg-card">
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <Route className="w-4 h-4" />
              <span className="text-micro uppercase tracking-ultra-wide font-medium">Path</span>
            </div>
            
            <div className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground font-light">Measurable indicators confirming thesis over time</p>

              {pathIndicators.length > 0 ? (
                <div className="space-y-3">
                  {pathIndicators.map((indicator, i) => {
                    if (!indicator) return null;
                    const status = indicator.status || "unknown";
                    return (
                      <div key={i} className="flex items-start justify-between gap-3 p-3 bg-secondary/30">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {status === "on_track" && <Check className="w-3 h-3 text-foreground" />}
                            {status === "at_risk" && <AlertTriangle className="w-3 h-3 text-muted-foreground" />}
                            {status === "off_track" && <TrendingDown className="w-3 h-3 text-muted-foreground" />}
                            <span className="text-sm font-medium">{indicator.label || "Unknown"}</span>
                            <SourceTooltip source={secSource ? { document: secSource.name, last_updated: secSource.last_refresh } : { document: "Tracking Data" }} />
                          </div>
                          <span className="text-sm text-muted-foreground">{indicator.value || "—"}</span>
                        </div>
                        {indicator.next_check && (
                          <span className="text-[10px] text-muted-foreground font-mono">Next: {indicator.next_check}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No path indicators available.</p>
              )}

              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-micro text-muted-foreground">Thesis Status</span>
                    <SourceTooltip source={{ document: "Executive Summary Analysis" }} />
                  </div>
                  <span className={cn(
                    "px-2 py-0.5 text-[10px] uppercase tracking-ultra-wide font-mono",
                    data.executive_summary?.thesis_status === "intact" 
                      ? "bg-foreground text-background"
                      : data.executive_summary?.thesis_status === "challenged"
                      ? "bg-foreground/50 text-background"
                      : "bg-foreground/20 text-foreground"
                  )}>
                    {data.executive_summary?.thesis_status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* PROTECTION */}
          <div className="border border-border bg-card">
            <div className="flex items-center gap-2 p-4 border-b border-border">
              <Shield className="w-4 h-4" />
              <span className="text-micro uppercase tracking-ultra-wide font-medium">Protection</span>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-micro text-muted-foreground">Position Sizing</span>
                  <SourceTooltip source={{ document: "Portfolio Management System" }} />
                </div>
                {positionSizing ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xl">{positionSizing.current_percent ?? "—"}%</span>
                      <span className="text-sm text-muted-foreground">of portfolio (max {positionSizing.max_percent ?? "—"}%)</span>
                    </div>
                    {positionSizing.current_percent != null && positionSizing.max_percent != null && (
                      <div className="mt-2 h-2 bg-secondary">
                        <div className="h-full bg-foreground transition-all" style={{ width: `${(positionSizing.current_percent / positionSizing.max_percent) * 100}%` }} />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No position sizing data available.</p>
                )}
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-micro text-muted-foreground">Active Tripwires</span>
                  <SourceTooltip source={{ document: "Risk Framework" }} />
                </div>
                {protectionTriggers.length > 0 ? (
                  <div className="space-y-2">
                    {protectionTriggers.map((trigger, i) => (
                      <div key={i} className="text-sm p-2 bg-secondary/30 border-l-2 border-foreground/30">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium truncate">{trigger.condition}</span>
                          <span className="flex-shrink-0 px-1.5 py-0.5 text-[9px] uppercase tracking-wide font-mono bg-foreground/10 text-foreground">
                            {trigger.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tripwires configured.</p>
                )}
              </div>

              <div className="pt-3 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-micro text-muted-foreground">Kill Switch</span>
                  <SourceTooltip source={{ document: "Investment Policy" }} />
                </div>
                {killSwitch?.conditions && killSwitch.conditions.length > 0 ? (
                  <p className="text-sm bg-secondary/50 p-2 font-light">Exit if: {killSwitch.conditions.join(", ")}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">No kill switch conditions defined.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
