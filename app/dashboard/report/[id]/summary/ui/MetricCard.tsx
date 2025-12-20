import { Metric } from "@/lib/seo-schema";
import { TieOutBadge } from "./TieOutBadge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MetricCardProps {
  label: string;
  metric: Metric;
  size?: "sm" | "md" | "lg";
  showProvenance?: boolean;
  className?: string;
}

export function MetricCard({
  label,
  metric,
  size = "md",
  showProvenance = true,
  className,
}: MetricCardProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div
      className={cn(
        "group relative p-4 border border-border bg-card transition-all duration-150 hover:shadow-subtle",
        className
      )}
    >
      {/* Label */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
          {label}
        </span>
        <TieOutBadge status={metric.tie_out_status} />
      </div>

      {/* Value */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "font-mono font-medium tracking-tight cursor-help",
              sizeClasses[size]
            )}
            data-metric
          >
            {metric.formatted}
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          className="max-w-xs p-4 bg-foreground text-background border-0"
        >
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-background/60 uppercase tracking-wide text-[10px]">
                Source
              </span>
              <p className="font-medium">{metric.source}</p>
            </div>
            {metric.last_updated && (
              <div>
                <span className="text-background/60 uppercase tracking-wide text-[10px]">
                  Updated
                </span>
                <p className="font-mono text-[10px]">
                  {new Date(metric.last_updated).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>

      {/* Provenance indicator line */}
      {showProvenance && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground/10 group-hover:bg-foreground/20 transition-colors" />
      )}
    </div>
  );
}
