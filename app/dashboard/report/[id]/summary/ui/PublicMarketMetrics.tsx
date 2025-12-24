import { cn } from "@/lib/utils";
import { UncertainMetric } from "./UncertainMetric";
import { TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { Metric } from "@/lib/seo-schema";

interface PublicMarketMetricsProps {
  data: {
    net_cash_or_debt?: { current: Metric } | null;
    buyback_capacity?: { current: Metric } | null;
    sbc_percent_revenue?: { current: Metric } | null;
    share_count_trend?: { current: Metric } | null;
  } | null;
  segments?: Array<{
    segment_name: string;
    revenue?: { current: Metric } | null;
    growth_percent: number | null;
    margin_percent: number | null;
  }> | null;
  guidance_bridge?: {
    metric: string | null;
    company_guidance_low: number | null;
    company_guidance_high: number | null;
    consensus: number | null;
    delta_to_consensus: number | null;
  } | null;
  revisions_momentum?: {
    eps_revisions_30d: number | null;
    revenue_revisions_30d: number | null;
    direction: "up" | "down" | "flat" | null;
  } | null;
}

// Mock data for demonstration - would come from actual data in production
const mockData = {
  net_cash: {
    current: {
      value: 1200000000,
      formatted: "$1.2B Net Cash",
      source: "10-Q Balance Sheet",
      tie_out_status: "final" as const,
      last_updated: "2024-12-14T08:00:00Z",
      confidence: 95,
      availability: "available" as const,
    }
  },
  buyback: {
    current: {
      value: 500000000,
      formatted: "$500M",
      source: "Board Authorization",
      tie_out_status: "final" as const,
      last_updated: "2024-12-14T08:00:00Z",
      confidence: 90,
      availability: "available" as const,
    }
  },
  sbc: {
    current: {
      value: 4.2,
      formatted: "4.2%",
      source: "Calculated from 10-Q",
      tie_out_status: "final" as const,
      last_updated: "2024-12-14T08:00:00Z",
      confidence: 92,
      availability: "available" as const,
    }
  },
  share_count: {
    current: {
      value: -1.2,
      formatted: "-1.2% YoY",
      source: "Share Count History",
      tie_out_status: "final" as const,
      last_updated: "2024-12-14T08:00:00Z",
      confidence: 98,
      availability: "available" as const,
    }
  }
};

const mockSegments = [
  { segment_name: "Industrial", growth_percent: 14.2, margin_percent: 28.5 },
  { segment_name: "Commercial", growth_percent: 8.1, margin_percent: 22.3 },
  { segment_name: "Services", growth_percent: 18.5, margin_percent: 35.2 },
];

const mockGuidance = {
  metric: "FY24 Revenue",
  company_guidance_low: 3520,
  company_guidance_high: 3580,
  consensus: 3545,
  delta_to_consensus: 0.3,
};

const mockRevisions = {
  eps_revisions_30d: 4,
  revenue_revisions_30d: 3,
  direction: "up" as const,
};

export function PublicMarketMetrics({ data, segments, guidance_bridge, revisions_momentum }: PublicMarketMetricsProps) {
  // Use mock data if not provided
  const displayData = {
    net_cash: data?.net_cash_or_debt || mockData.net_cash,
    buyback: data?.buyback_capacity || mockData.buyback,
    sbc: data?.sbc_percent_revenue || mockData.sbc,
    share_count: data?.share_count_trend || mockData.share_count,
  };

  const displaySegments = segments || mockSegments;
  const displayGuidance = guidance_bridge || mockGuidance;
  const displayRevisions = revisions_momentum || mockRevisions;

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
            metric={displayData.net_cash}
            className="bg-card"
          />
          <UncertainMetric
            label="Buyback Capacity"
            metric={displayData.buyback}
            className="bg-card"
          />
          <UncertainMetric
            label="SBC % Revenue"
            metric={displayData.sbc}
            className="bg-card"
          />
          <UncertainMetric
            label="Share Count Trend"
            metric={displayData.share_count}
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
            <div className="divide-y divide-border">
              {displaySegments.map((segment, i) => (
                <div key={i} className="p-4 flex items-center justify-between">
                  <span className="font-medium">{segment.segment_name}</span>
                  <div className="flex items-center gap-4 font-mono text-sm">
                    <span className={cn(
                      (segment.growth_percent || 0) >= 10 ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {(segment.growth_percent || 0) >= 0 ? "+" : ""}{segment.growth_percent?.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">
                      {segment.margin_percent?.toFixed(1)}% margin
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guidance Bridge */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                Guidance vs Consensus
              </span>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <span className="text-sm text-muted-foreground">{displayGuidance.metric}</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-lg">
                    ${displayGuidance.company_guidance_low}M - ${displayGuidance.company_guidance_high}M
                  </span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Consensus</span>
                  <span className="font-mono">${displayGuidance.consensus}M</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Delta</span>
                  <span className={cn(
                    "font-mono",
                    (displayGuidance.delta_to_consensus || 0) >= 0 ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {(displayGuidance.delta_to_consensus || 0) >= 0 ? "+" : ""}{displayGuidance.delta_to_consensus}%
                  </span>
                </div>
              </div>

              {/* Visual bridge */}
              <div className="relative h-8 bg-secondary mt-4">
                <div 
                  className="absolute top-0 bottom-0 bg-foreground/20"
                  style={{ 
                    left: '20%', 
                    width: '40%' 
                  }}
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
          </div>

          {/* Revisions Momentum */}
          <div className="border border-border">
            <div className="p-4 border-b border-border">
              <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                Estimate Revisions (30D)
              </span>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Direction</span>
                <div className="flex items-center gap-2">
                  {displayRevisions.direction === "up" && (
                    <>
                      <TrendingUp className="w-4 h-4" />
                      <span className="px-2 py-0.5 bg-foreground text-background text-[10px] uppercase font-mono">
                        Positive
                      </span>
                    </>
                  )}
                  {displayRevisions.direction === "down" && (
                    <>
                      <TrendingDown className="w-4 h-4 text-muted-foreground" />
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] uppercase font-mono">
                        Negative
                      </span>
                    </>
                  )}
                  {displayRevisions.direction === "flat" && (
                    <>
                      <Minus className="w-4 h-4 text-muted-foreground" />
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-[10px] uppercase font-mono">
                        Flat
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">EPS Revisions</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg">
                      {displayRevisions.eps_revisions_30d}
                    </span>
                    <span className="text-[10px] text-muted-foreground">UP</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Revenue Revisions</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg">
                      {displayRevisions.revenue_revisions_30d}
                    </span>
                    <span className="text-[10px] text-muted-foreground">UP</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground font-light">
                  <ArrowRight className="w-3 h-3 inline mr-1" />
                  Consensus catching up to our estimates. Less variant upside remaining.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
