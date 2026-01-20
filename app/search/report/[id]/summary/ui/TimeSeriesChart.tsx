import { useMemo } from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { HorizonStats, TimeHorizon } from "@/lib/seo-schema";
import { HORIZON_LABELS } from "@/lib/time-series-data";
import { cn } from "@/lib/utils";

interface QuarterlyChartProps {
  horizonStats: HorizonStats;
  horizon: TimeHorizon;
  label: string;
  currentValue: number | string | null;
  currentFormatted: string | null;
  isTransitioning?: boolean;
  className?: string;
}

export function QuarterlyChart({
  horizonStats,
  horizon,
  label,
  currentValue,
  currentFormatted,
  isTransitioning,
  className,
}: QuarterlyChartProps) {
  // Build chart data from Q1-Q4 quarters
  const chartData = useMemo(() => {
    const quarters = horizonStats?.quarters;
    if (!quarters) return [];
    
    const data: { quarter: string; value: number | null; formatted: string }[] = [];
    
    if (quarters.Q1 !== null && quarters.Q1 !== undefined) {
      data.push({ quarter: "Q1", value: quarters.Q1, formatted: formatNumber(quarters.Q1) });
    }
    if (quarters.Q2 !== null && quarters.Q2 !== undefined) {
      data.push({ quarter: "Q2", value: quarters.Q2, formatted: formatNumber(quarters.Q2) });
    }
    if (quarters.Q3 !== null && quarters.Q3 !== undefined) {
      data.push({ quarter: "Q3", value: quarters.Q3, formatted: formatNumber(quarters.Q3) });
    }
    if (quarters.Q4 !== null && quarters.Q4 !== undefined) {
      data.push({ quarter: "Q4", value: quarters.Q4, formatted: formatNumber(quarters.Q4) });
    }
    
    return data;
  }, [horizonStats?.quarters]);

  const isPositive = (horizonStats?.change_percent ?? 0) >= 0;

  if (chartData.length === 0) {
    return (
      <div className={cn("bg-card p-4", className)}>
        <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
          {label} • {HORIZON_LABELS[horizon]}
        </span>
        <p className="text-sm text-muted-foreground mt-4">
          No quarterly data available for this horizon
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-card p-4 transition-all duration-300",
        isTransitioning ? "opacity-50 scale-[0.99]" : "opacity-100 scale-100",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans block mb-1">
            {label} • {HORIZON_LABELS[horizon]}
          </span>
          <span className="text-2xl font-mono font-medium">
            {currentFormatted ?? "—"}
          </span>
        </div>
        <div className="text-right">
          <span
            className={cn(
              "text-lg font-mono",
              isPositive ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {horizonStats?.change_percent !== null 
              ? `${isPositive ? "+" : ""}${horizonStats?.change_percent?.toFixed(1)}%`
              : "—"
            }
          </span>
          <span className="block text-micro text-muted-foreground">
            {HORIZON_LABELS[horizon]} change
          </span>
        </div>
      </div>

      {/* Chart - Q1 to Q4 connected line */}
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(0, 0%, 90%)" />
            <XAxis
              dataKey="quarter"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(0, 0%, 40%)" }}
              tickMargin={8}
            />
            <YAxis hide domain={["dataMin - 5%", "dataMax + 5%"]} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.[0]) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-foreground text-background px-3 py-2 text-micro font-mono">
                    <div>{data.formatted}</div>
                    <div className="text-background/70">{data.quarter}</div>
                  </div>
                );
              }}
            />
            {horizonStats?.average !== null && (
              <ReferenceLine
                y={horizonStats?.average}
                stroke="hsl(0, 0%, 70%)"
                strokeDasharray="3 3"
                strokeWidth={1}
                label={{ value: "Avg", fontSize: 10, fill: "hsl(0, 0%, 50%)" }}
              />
            )}
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(0, 0%, 0%)"
              strokeWidth={2}
              dot={{ r: 4, fill: "hsl(0, 0%, 0%)" }}
              activeDot={{ r: 6, fill: "hsl(0, 0%, 0%)" }}
              animationDuration={300}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats - High, Low, Avg, Volatility, Change */}
      <div className="grid grid-cols-5 gap-2 mt-3 pt-3 border-t border-border">
        <div>
          <span className="text-micro text-muted-foreground block">High</span>
          <span className="text-sm font-mono">
            {horizonStats?.high !== null && horizonStats?.high !== undefined  ? formatNumber(horizonStats.high) : "—"}
          </span>
        </div>
        <div>
          <span className="text-micro text-muted-foreground block">Low</span>
          <span className="text-sm font-mono">
            {horizonStats?.low !== null &&  horizonStats?.low !== undefined  ? formatNumber(horizonStats.low) : "—"}
          </span>
        </div>
        <div>
          <span className="text-micro text-muted-foreground block">Avg</span>
          <span className="text-sm font-mono">
            {horizonStats?.average !== null && horizonStats?.average !== undefined ? formatNumber(horizonStats.average) : "—"}
          </span>
        </div>
        <div>
          <span className="text-micro text-muted-foreground block">Vol</span>
          <span className="text-sm font-mono">
            {horizonStats?.volatility !== null ? `${horizonStats?.volatility?.toFixed(1)}%` : "—"}
          </span>
        </div>
        <div>
          <span className="text-micro text-muted-foreground block">Chg</span>
          <span className={cn(
            "text-sm font-mono",
            isPositive ? "text-foreground" : "text-muted-foreground"
          )}>
            {horizonStats?.change_percent !== null 
              ? `${isPositive ? "+" : ""}${horizonStats?.change_percent?.toFixed(1)}%`
              : "—"
            }
          </span>
        </div>
      </div>
    </div>
  );
}

function formatNumber(value: number): string {
  if (Math.abs(value) >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
  if (Math.abs(value) >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `$${(value / 1000).toFixed(1)}K`;
  if (Math.abs(value) >= 1) return `$${value.toFixed(2)}`;
  return `${value.toFixed(2)}`;
}
