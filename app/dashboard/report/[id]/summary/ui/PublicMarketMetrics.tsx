import { cn } from "@/lib/utils";
import { UncertainMetric } from "./UncertainMetric";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { InvestorDashboard } from "@/lib/seo-schema";

interface PublicMarketMetricsProps {
  data: InvestorDashboard["public_market_metrics"];
}

export function PublicMarketMetrics({ data }: PublicMarketMetricsProps) {
  if (!data) {
    return (
      <section className="py-8 border-b border-border animate-fade-in">
        <div className="px-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-6">
            Public Market Metrics
          </h2>
          <p className="text-sm text-muted-foreground">No public market metrics data available.</p>
        </div>
      </section>
    );
  }

  const segments = data.segments || [];
  const guidanceBridge = data.guidance_bridge;
  const revisionsMomentum = data.revisions_momentum;

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-6">
          Public Market Metrics
        </h2>

        {/* Capital & Returns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border mb-6">
          <UncertainMetric
            label="Net Cash / Debt"
            metric={data.net_cash_or_debt}
            className="bg-card"
          />
          <UncertainMetric
            label="Buyback Capacity"
            metric={data.buyback_capacity}
            className="bg-card"
          />
          <UncertainMetric
            label="SBC % Revenue"
            metric={data.sbc_percent_revenue}
            className="bg-card"
          />
          <UncertainMetric
            label="Share Count Trend"
            metric={data.share_count_trend}
            className="bg-card"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Segment Performance */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                Segment Performance
              </span>
            </div>
            {segments.length > 0 ? (
              <div className="divide-y divide-border">
                {segments.map((segment: any, i: any) => {
                  if (!segment) return null;
                  return (
                    <div key={i} className="p-4 flex items-center justify-between">
                      <span className="font-medium">{segment.segment_name || "Unknown Segment"}</span>
                      <div className="flex items-center gap-4 font-mono text-sm">
                        <span className={cn(
                          (segment.growth_percent || 0) >= 10 ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {(segment.growth_percent || 0) >= 0 ? "+" : ""}{segment.growth_percent?.toFixed(1) ?? "—"}%
                        </span>
                        <span className="text-muted-foreground">
                          {segment.margin_percent?.toFixed(1) ?? "—"}% margin
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-sm text-muted-foreground">No segment data available.</div>
            )}
          </div>

          {/* Guidance Bridge */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                Guidance vs Consensus
              </span>
            </div>
            {guidanceBridge ? (
              <div className="p-4 space-y-4">
                <div>
                  <span className="text-sm text-muted-foreground">{guidanceBridge.metric || "Metric"}</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-mono text-lg">
                      ${guidanceBridge.company_guidance_low ?? "—"}M - ${guidanceBridge.company_guidance_high ?? "—"}M
                    </span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Consensus</span>
                    <span className="font-mono">${guidanceBridge.consensus ?? "—"}M</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Delta</span>
                    <span className={cn(
                      "font-mono",
                      (guidanceBridge.delta_to_consensus || 0) >= 0 ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {guidanceBridge.delta_to_consensus != null 
                        ? `${guidanceBridge.delta_to_consensus >= 0 ? "+" : ""}${guidanceBridge.delta_to_consensus}%`
                        : "—"}
                    </span>
                  </div>
                </div>

                {/* Visual bridge */}
                <div className="relative h-8 bg-secondary mt-4">
                  <div 
                    className="absolute top-0 bottom-0 bg-foreground/20"
                    style={{ left: '20%', width: '40%' }}
                  />
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-foreground"
                    style={{ left: '40%' }}
                  />
                  <span className="absolute -bottom-5 text-[9px] text-muted-foreground font-mono" style={{ left: '38%' }}>
                    Consensus
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 text-sm text-muted-foreground">No guidance data available.</div>
            )}
          </div>

          {/* Revisions Momentum */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                Estimate Revisions (30D)
              </span>
            </div>
            {revisionsMomentum ? (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Direction</span>
                  <div className="flex items-center gap-2">
                    {revisionsMomentum.direction === "up" && (
                      <>
                        <TrendingUp className="w-4 h-4" />
                        <span className="px-2 py-0.5 bg-foreground text-background text-[10px] uppercase font-mono">
                          Positive
                        </span>
                      </>
                    )}
                    {revisionsMomentum.direction === "down" && (
                      <>
                        <TrendingDown className="w-4 h-4 text-muted-foreground" />
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] uppercase font-mono">
                          Negative
                        </span>
                      </>
                    )}
                    {revisionsMomentum.direction === "flat" && (
                      <>
                        <Minus className="w-4 h-4 text-muted-foreground" />
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] uppercase font-mono">
                          Flat
                        </span>
                      </>
                    )}
                    {!revisionsMomentum.direction && (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">EPS Revisions</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg">
                        {revisionsMomentum.eps_revisions_30d ?? "—"}
                      </span>
                      {revisionsMomentum.direction === "up" && <span className="text-[10px] text-muted-foreground">UP</span>}
                      {revisionsMomentum.direction === "down" && <span className="text-[10px] text-muted-foreground">DOWN</span>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Revenue Revisions</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg">
                        {revisionsMomentum.revenue_revisions_30d ?? "—"}
                      </span>
                      {revisionsMomentum.direction === "up" && <span className="text-[10px] text-muted-foreground">UP</span>}
                      {revisionsMomentum.direction === "down" && <span className="text-[10px] text-muted-foreground">DOWN</span>}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 text-sm text-muted-foreground">No revisions data available.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
