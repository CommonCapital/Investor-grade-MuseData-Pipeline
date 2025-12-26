import { InvestorDashboard as DashboardData } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";
import { Target, Route, Shield, TrendingDown, AlertTriangle, Check } from "lucide-react";

interface PricePathProtectionProps {
  data: DashboardData;
}

export function PricePathProtection({ data }: PricePathProtectionProps) {
  // Derive Price section data from valuation and market data
  const currentPrice = data.market_data?.stock_price?.current?.value as number | null;
  const valuation = data.valuation;
  
  // Calculate variant view (what we believe vs consensus)
  const midpointValue = valuation?.valuation_range_midpoint;
  const currentMarketCap = data.market_data?.market_cap?.current?.value as number | null;
  const impliedUpside = midpointValue && currentMarketCap 
    ? ((midpointValue - currentMarketCap) / currentMarketCap * 100)
    : null;

  // Path indicators from schema
  const pathIndicators = data.path_indicators || [];

  // Protection triggers - derived from risks
  const protectionTriggers = data.risks?.slice(0, 3).map(risk => ({
    condition: risk?.trigger || risk?.title || "Unknown",
    threshold: "N/A",
    action: risk?.mitigation || "Review",
    status: "active" as const
  })) || [];

  // Position sizing from schema
  const positionSizing = data.position_sizing;

  // Variant view from schema
  const variantView = data.variant_view;

  // Kill switch from schema
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
              {/* Current vs Target */}
              <div>
                <span className="text-micro text-muted-foreground block mb-1">Current Price</span>
                <span className="font-mono text-2xl">${currentPrice?.toFixed(2) || "—"}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary/50 p-3">
                  <span className="text-micro text-muted-foreground block mb-1">Valuation Range</span>
                  <span className="font-mono text-sm">
                    ${((valuation?.valuation_range_low || 0) / 1e9).toFixed(1)}B - ${((valuation?.valuation_range_high || 0) / 1e9).toFixed(1)}B
                  </span>
                </div>
                <div className="bg-secondary/50 p-3">
                  <span className="text-micro text-muted-foreground block mb-1">Implied Upside</span>
                  <span className={cn(
                    "font-mono text-sm",
                    (impliedUpside || 0) >= 0 ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {impliedUpside ? `${impliedUpside >= 0 ? "+" : ""}${impliedUpside.toFixed(0)}%` : "—"}
                  </span>
                </div>
              </div>

              {/* Variant View */}
              <div className="pt-3 border-t border-border">
                <span className="text-micro text-muted-foreground block mb-2">Variant View</span>
                {variantView?.summary ? (
                  <p className="text-sm font-light">{variantView.summary}</p>
                ) : (
                  <p className="text-sm text-muted-foreground font-light">No variant view available.</p>
                )}
              </div>

              {/* Sensitivity */}
              {variantView?.sensitivity && variantView.sensitivity.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <span className="text-micro text-muted-foreground block mb-2">Sensitivity</span>
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
              <p className="text-sm text-muted-foreground font-light">
                Measurable indicators confirming thesis over time
              </p>

              {pathIndicators.length > 0 ? (
                <div className="space-y-3">
                  {pathIndicators.map((indicator, i) => {
                    if (!indicator) return null;
                    const status = indicator.status || "unknown";
                    return (
                      <div key={i} className="flex items-start justify-between gap-3 p-3 bg-secondary/30">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {status === "on_track" && (
                              <Check className="w-3 h-3 text-foreground" />
                            )}
                            {status === "at_risk" && (
                              <AlertTriangle className="w-3 h-3 text-muted-foreground" />
                            )}
                            {status === "off_track" && (
                              <TrendingDown className="w-3 h-3 text-muted-foreground" />
                            )}
                            {!["on_track", "at_risk", "off_track"].includes(status) && (
                              <span className="w-3 h-3" />
                            )}
                            <span className="text-sm font-medium">{indicator.label || "Unknown"}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{indicator.value || "—"}</span>
                        </div>
                        {indicator.next_check && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            Next: {indicator.next_check}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No path indicators available.</p>
              )}

              {/* On Track Summary */}
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-micro text-muted-foreground">Thesis Status</span>
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
              {/* Position Limits */}
              <div>
                <span className="text-micro text-muted-foreground block mb-2">Position Sizing</span>
                {positionSizing ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono text-2xl">{positionSizing.current_percent ?? "—"}%</span>
                      <span className="text-sm text-muted-foreground">
                        of portfolio (max {positionSizing.max_percent ?? "—"}%)
                      </span>
                    </div>
                    {positionSizing.current_percent != null && positionSizing.max_percent != null && (
                      <div className="mt-2 h-2 bg-secondary">
                        <div 
                          className="h-full bg-foreground transition-all"
                          style={{ width: `${(positionSizing.current_percent / positionSizing.max_percent) * 100}%` }}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No position sizing data available.</p>
                )}
              </div>

              {/* Active Triggers */}
              <div className="pt-3 border-t border-border">
                <span className="text-micro text-muted-foreground block mb-2">Active Tripwires</span>
                {protectionTriggers.length > 0 ? (
                  <div className="space-y-2">
                    {protectionTriggers.map((trigger, i) => (
                      <div key={i} className="text-sm p-2 bg-secondary/30 border-l-2 border-foreground/30">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium truncate">{trigger.condition}</span>
                          <span className={cn(
                            "flex-shrink-0 px-1.5 py-0.5 text-[9px] uppercase tracking-wide font-mono",
                            trigger.status === "active" ? "bg-foreground/10 text-foreground" :
                            trigger.status === "triggered" ? "bg-foreground text-background" :
                            "bg-secondary text-muted-foreground"
                          )}>
                            {trigger.status}
                          </span>
                        </div>
                        {trigger.threshold !== "N/A" && (
                          <span className="text-muted-foreground">→ {trigger.action}</span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No tripwires configured.</p>
                )}
              </div>

              {/* Kill Switch */}
              <div className="pt-3 border-t border-border">
                <span className="text-micro text-muted-foreground block mb-2">Kill Switch</span>
                {killSwitch?.conditions && killSwitch.conditions.length > 0 ? (
                  <p className="text-sm bg-secondary/50 p-2 font-light">
                    Exit if: {killSwitch.conditions.join(", ")}
                  </p>
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
