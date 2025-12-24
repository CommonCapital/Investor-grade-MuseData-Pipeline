import { InvestorDashboard, TimeHorizon, MetricWithHistory } from "@/lib/seo-schema";
import { TIME_HORIZONS, HORIZON_LABELS } from "@/lib/time-series-data";
import { QuarterlyChart } from "./TimeSeriesChart";
import { TimeHorizonTabs } from "./TimeHorizonSelector";
import { cn } from "@/lib/utils";
import { Activity, AlertCircle } from "lucide-react";

interface TimeSeriesSectionProps {
  data: InvestorDashboard;
  horizon: TimeHorizon;
  onHorizonChange: (h: TimeHorizon) => void;
  isTransitioning?: boolean;
}

// Helper to check if metric has available history for horizon
function getHorizonStats(metric: MetricWithHistory | undefined, horizon: TimeHorizon) {
  if (!metric?.history) return null;
  if (metric.history.availability !== "available") return null;
  
  const stats = metric.history.horizons?.[horizon];
  if (!stats) return null;
  
  // Check if any quarterly data exists
  const quarters = stats.quarters;
  if (!quarters) return null;
  
  if (quarters.Q1 == null && quarters.Q2 == null && 
      quarters.Q3 == null && quarters.Q4 == null) {
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
  // Get horizon stats for each metric with history
  const stockPriceStats = getHorizonStats(data.market_data?.stock_price, horizon);
  const volumeStats = getHorizonStats(data.market_data?.volume, horizon);
  const revenueStats = getHorizonStats(data.financials?.revenue, horizon);
  const ebitdaStats = getHorizonStats(data.financials?.ebitda, horizon);

  const hasAnyCharts = !!(stockPriceStats || volumeStats || revenueStats || ebitdaStats);

  // Get change percent for header display
  const priceChange = stockPriceStats?.change_percent;

  return (
    <section
      className={cn(
        "py-8 border-b border-border transition-opacity duration-150",
        isTransitioning ? "opacity-50" : "opacity-100"
      )}
    >
      <div className="px-6">
        {/* Section Header with Horizon Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
              Quarterly Analysis by Horizon
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Horizon Tabs */}
            <TimeHorizonTabs
              current={horizon}
              onChange={onHorizonChange}
            />
          </div>
        </div>

        {/* Horizon Summary Bar */}
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

          {/* Quick Stats - price change if available */}
          {priceChange != null && (
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "text-lg font-mono",
                  priceChange >= 0 ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(1)}%
              </span>
              <span className="text-micro text-muted-foreground">
                Price {HORIZON_LABELS[horizon]}
              </span>
            </div>
          )}
        </div>

        {/* Charts Grid - only render available metrics */}
        {hasAnyCharts ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {stockPriceStats && (
              <QuarterlyChart
                horizonStats={stockPriceStats}
                horizon={horizon}
                label="Stock Price"
                currentValue={data.market_data?.stock_price?.current?.value ?? null}
                currentFormatted={data.market_data?.stock_price?.current?.formatted ?? null}
                isTransitioning={isTransitioning}
              />
            )}
            {volumeStats && (
              <QuarterlyChart
                horizonStats={volumeStats}
                horizon={horizon}
                label="Volume"
                currentValue={data.market_data?.volume?.current?.value ?? null}
                currentFormatted={data.market_data?.volume?.current?.formatted ?? null}
                isTransitioning={isTransitioning}
              />
            )}
            {revenueStats && (
              <QuarterlyChart
                horizonStats={revenueStats}
                horizon={horizon}
                label="Revenue"
                currentValue={data.financials?.revenue?.current?.value ?? null}
                currentFormatted={data.financials?.revenue?.current?.formatted ?? null}
                isTransitioning={isTransitioning}
              />
            )}
            {ebitdaStats && (
              <QuarterlyChart
                horizonStats={ebitdaStats}
                horizon={horizon}
                label="EBITDA"
                currentValue={data.financials?.ebitda?.current?.value ?? null}
                currentFormatted={data.financials?.ebitda?.current?.formatted ?? null}
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
            <p className="text-xs text-muted-foreground/70 mt-1">
              {horizon === "1D" || horizon === "1W" 
                ? "Daily and weekly horizons don't have quarterly breakdown for financial metrics."
                : "Historical data may be pending, restricted, or unavailable from sources."
              }
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
