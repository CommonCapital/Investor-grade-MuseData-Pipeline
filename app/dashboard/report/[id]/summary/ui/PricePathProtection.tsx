import { InvestorDashboard as DashboardData } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";
import { Target, Route, Shield, TrendingUp, TrendingDown, AlertTriangle, Check } from "lucide-react";

interface PricePathProtectionProps {
  data: DashboardData;
}

interface IndicatorStatus {
  label: string;
  value: string;
  status: "on_track" | "at_risk" | "off_track";
  nextCheck?: string;
}

interface ProtectionTrigger {
  condition: string;
  threshold: string;
  action: string;
  status: "active" | "triggered" | "cleared";
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

  // Path indicators - derived from thesis and scenarios
  const pathIndicators: IndicatorStatus[] = [
    {
      label: "Revenue vs Plan",
      value: "+2.0% ahead",
      status: "on_track",
      nextCheck: "Q4 Earnings"
    },
    {
      label: "Margin Trajectory",
      value: "25.1% (target: 26%)",
      status: "on_track",
      nextCheck: "Monthly"
    },
    {
      label: "Market Share",
      value: "Gaining (+$200M TAM opportunity)",
      status: "on_track",
      nextCheck: "Quarterly"
    },
    {
      label: "Order Book",
      value: "Pending Q4 disclosure",
      status: "at_risk",
      nextCheck: "Jan 15"
    }
  ];

  // Protection triggers - derived from risks
 const protectionTriggers: ProtectionTrigger[] = data.risks?.slice(0, 3).map(risk => ({
  condition: risk?.trigger ?? risk?.title ?? "Unknown condition",
  threshold: "N/A",
  action: risk?.mitigation ?? "Review",
  status: "active" as const
})) || [];


  // Position limits (would come from portfolio context in real implementation)
  const positionLimits = {
    current: 6,
    max: 10,
    targetRange: { low: 5, high: 8 }
  };

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
                <p className="text-sm font-light">
                  Market underestimates margin expansion from competitor exit and operating leverage. 
                  Consensus EPS catching up but still 3-5% below our model.
                </p>
              </div>

              {/* What Matters Most */}
              <div className="pt-3 border-t border-border">
                <span className="text-micro text-muted-foreground block mb-2">Sensitivity</span>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">EBITDA ±1pp</span>
                    <span className="font-mono">±$0.8B EV</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Multiple ±1x</span>
                    <span className="font-mono">±$0.9B EV</span>
                  </div>
                </div>
              </div>
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

              <div className="space-y-3">
                {pathIndicators.map((indicator, i) => (
                  <div key={i} className="flex items-start justify-between gap-3 p-3 bg-secondary/30">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {indicator.status === "on_track" && (
                          <Check className="w-3 h-3 text-foreground" />
                        )}
                        {indicator.status === "at_risk" && (
                          <AlertTriangle className="w-3 h-3 text-muted-foreground" />
                        )}
                        {indicator.status === "off_track" && (
                          <TrendingDown className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span className="text-sm font-medium">{indicator.label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{indicator.value}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Next: {indicator.nextCheck}
                    </span>
                  </div>
                ))}
              </div>

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
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl">{positionLimits.current}%</span>
                  <span className="text-sm text-muted-foreground">
                    of portfolio (max {positionLimits.max}%)
                  </span>
                </div>
                <div className="mt-2 h-2 bg-secondary">
                  <div 
                    className="h-full bg-foreground transition-all"
                    style={{ width: `${(positionLimits.current / positionLimits.max) * 100}%` }}
                  />
                </div>
              </div>

              {/* Active Triggers */}
              <div className="pt-3 border-t border-border">
                <span className="text-micro text-muted-foreground block mb-2">Active Tripwires</span>
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
              </div>

              {/* Kill Switch */}
              <div className="pt-3 border-t border-border">
                <span className="text-micro text-muted-foreground block mb-2">Kill Switch</span>
                <p className="text-sm bg-secondary/50 p-2 font-light">
                  Exit if: Thesis pillar broken, customer loss confirmed, or margin &lt;20%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
