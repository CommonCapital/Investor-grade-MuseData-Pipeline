import { InvestorDashboard as DashboardData, TimeSeriesMetric, TimeHorizon } from "@/lib/seo-schema";
import { TIME_HORIZONS, HORIZON_LABELS } from "@/lib/time-series-data";
import { QuarterlyChart } from "./TimeSeriesChart";
import { TimeHorizonTabs } from "./TimeHorizonSelector";
import { cn } from "@/lib/utils";
import { Activity, AlertCircle } from "lucide-react";

interface TimeSeriesSectionProps {
  data: DashboardData;
  horizon: TimeHorizon;
  onHorizonChange: (h: TimeHorizon) => void;
  isTransitioning?: boolean;
}

function getHorizonStats(metric: TimeSeriesMetric | undefined | null, horizon: TimeHorizon) {
  if (!metric) return null;
 if (metric.availability?.toLowerCase() !== "available") return null;
  
  const stats = metric.horizons?.[horizon];
  if (!stats) return null;
  
  const quarters = stats.quarters;
  if (!quarters || (quarters.Q1 === null && quarters.Q2 === null && 
      quarters.Q3 === null && quarters.Q4 === null)) {
    return null;
  }
  
  return stats;
}

export function TimeSeriesSection({
  data,
  horizon,
  onHorizonChange,
  isTransitioning,
}: TimeSeriesSectionProps) {
  const ts = data.time_series;
  
  const stockPriceStats = getHorizonStats(ts?.stock_price, horizon);
  const volumeStats = getHorizonStats(ts?.volume, horizon);
  const revenueStats = getHorizonStats(ts?.revenue, horizon);
  const ebitdaStats = getHorizonStats(ts?.ebitda, horizon);

  const hasAnyCharts = stockPriceStats || volumeStats || revenueStats || ebitdaStats;
  const priceChange = stockPriceStats?.change_percent;

  return (
    <section
      className={cn(
        "py-8 border-b border-border transition-opacity duration-150",
        isTransitioning ? "opacity-50" : "opacity-100"
      )}
    >
      <div className="px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
              Quarterly Analysis by Horizon
            </h2>
          </div>

          <TimeHorizonTabs current={horizon} onChange={onHorizonChange} />
        </div>

        <div className="flex items-center justify-between bg-secondary/50 px-4 py-3 mb-6">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-micro text-muted-foreground block">Horizon</span>
              <span className="font-medium">{HORIZON_LABELS[horizon]}</span>
            </div>
            <div className="w-px h-8 bg-border" />
            <div>
              <span className="text-micro text-muted-foreground block">Charts</span>
              <span className="font-mono">
                {[stockPriceStats, volumeStats, revenueStats, ebitdaStats].filter(Boolean).length}
              </span>
            </div>
          </div>

          {priceChange !== null && priceChange !== undefined && (
            <div className="flex items-center gap-4">
              <span className={cn("text-lg font-mono", priceChange >= 0 ? "text-foreground" : "text-muted-foreground")}>
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(1)}%
              </span>
              <span className="text-micro text-muted-foreground">Price {HORIZON_LABELS[horizon]}</span>
            </div>
          )}
        </div>

        {hasAnyCharts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {stockPriceStats && (
              <QuarterlyChart
                horizonStats={stockPriceStats}
                horizon={horizon}
                label="Stock Price"
                currentValue={data.base_metrics?.stock_price ?? null}
                currentFormatted={`$${data.base_metrics?.stock_price?.toFixed(2) ?? "—"}`}
                isTransitioning={isTransitioning}
              />
            )}
            {revenueStats && (
              <QuarterlyChart
                horizonStats={revenueStats}
                horizon={horizon}
                label="Revenue (Quarterly)"
                currentValue={data.base_metrics?.revenue ?? null}
                currentFormatted={`$${((data.base_metrics?.revenue ?? 0) / 1e6).toFixed(0)}M`}
                isTransitioning={isTransitioning}
              />
            )}
            {ebitdaStats && (
              <QuarterlyChart
                horizonStats={ebitdaStats}
                horizon={horizon}
                label="EBITDA (Quarterly)"
                currentValue={data.base_metrics?.ebitda_reported ?? null}
                currentFormatted={`$${((data.base_metrics?.ebitda_reported ?? 0) / 1e6).toFixed(0)}M`}
                isTransitioning={isTransitioning}
              />
            )}
            {volumeStats && (
              <QuarterlyChart
                horizonStats={volumeStats}
                horizon={horizon}
                label="Volume"
                currentValue={null}
                currentFormatted={null}
                isTransitioning={isTransitioning}
              />
            )}
          </div>
        ) : (
          <div className="bg-muted/30 border border-border p-8 text-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No quarterly data available for {HORIZON_LABELS[horizon]} horizon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
