import { cn } from "@/lib/utils";
import { Metric, MetricWithHistory, AvailabilityStatus } from "@/lib/seo-schema";
import { TieOutBadge } from "./TieOutBadge";
import { DefinitionPill } from "./DefinitionPill";
import { TieOutView } from "./TieOutView";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  HelpCircle, 
  Clock, 
  Lock, 
  AlertTriangle,
  Ban,
  CheckCircle2,
  LucideIcon
} from "lucide-react";

interface UncertainMetricProps {
  label: string;
  metric?: MetricWithHistory | Metric | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const AVAILABILITY_CONFIG: Record<string, {
  icon: LucideIcon;
  label: string;
  color: string;
  bgColor: string;
}> = {
  available: {
    icon: CheckCircle2,
    label: "Available",
    color: "text-emerald-600",
    bgColor: "bg-card",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
  },
  unavailable: {
    icon: Ban,
    label: "Not Available",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
  },
  restricted: {
    icon: Lock,
    label: "Restricted",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  stale: {
    icon: Clock,
    label: "Stale",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  conflicting: {
    icon: AlertTriangle,
    label: "Conflicting",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
};

// Helper to extract the current metric from MetricWithHistory or plain Metric
function extractCurrentMetric(metric: MetricWithHistory | Metric | null | undefined): Metric | null {
  if (!metric) return null;
  // Check if it's MetricWithHistory (has 'current' property)
  if ('current' in metric && metric.current) {
    return metric.current;
  }
  // It's a plain Metric
  return metric as Metric;
}

export function UncertainMetric({
  label,
  metric,
  size = "md",
  className,
}: UncertainMetricProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-4xl",
  };

  const currentMetric = extractCurrentMetric(metric);

  // If no metric provided at all, show unavailable state
  if (!currentMetric) {
    return (
      <div
        className={cn(
          "group relative p-4 border border-border transition-all duration-150 bg-muted/50",
          className
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            {label}
          </span>
          <div className="flex items-center gap-1 text-micro uppercase tracking-wide text-muted-foreground">
            <Ban className="w-3 h-3" />
            <span>Not Available</span>
          </div>
        </div>
        <div className={cn("font-mono tracking-tight text-muted-foreground/50", sizeClasses[size])}>
          —
        </div>
      </div>
    );
  }

  const availability = currentMetric?.availability || "unavailable";
  const config = AVAILABILITY_CONFIG[availability] || AVAILABILITY_CONFIG.unavailable;
  const Icon = config.icon;

  // If metric has a value and is available, render with full context
  if (currentMetric?.value != null && availability === "available") {
    return (
      <div
        className={cn(
          "group relative p-4 border border-border bg-card transition-all duration-150 hover:shadow-subtle",
          className
        )}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
              {label}
            </span>
            {/* Definition Pill */}
            <DefinitionPill definition={currentMetric?.definition} />
          </div>
          <div className="flex items-center gap-2">
            {/* Data Quality: Coverage, Auditability, Freshness */}
            {currentMetric?.data_quality && (
              <div className="flex items-center gap-1.5">
                <span className="text-micro uppercase tracking-wide">
                  {currentMetric.data_quality.coverage || 0}%
                </span>
                <span className="text-[9px] text-muted-foreground/50">cov</span>
                <span className="text-muted-foreground/30">•</span>
                <span className="text-micro uppercase tracking-wide">
                  {currentMetric.data_quality.auditability || 0}%
                </span>
                <span className="text-[9px] text-muted-foreground/50">aud</span>
                {currentMetric.data_quality.freshness_days != null && (
                  <>
                    <span className="text-muted-foreground/30">•</span>
                    <span className="text-micro text-muted-foreground">
                      {currentMetric.data_quality.freshness_days}d
                    </span>
                  </>
                )}
              </div>
            )}
            <TieOutBadge status={currentMetric?.tie_out_status} />
          </div>
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "font-mono font-medium tracking-tight cursor-help",
                sizeClasses[size]
              )}
              data-metric
            >
              {currentMetric?.formatted || "—"}
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            align="start"
            className="max-w-xs p-4 bg-foreground text-background border-0"
          >
            <div className="space-y-2 text-xs">
              {/* Data Quality Breakdown */}
              {currentMetric?.data_quality && (
                <div className="space-y-1 pb-2 border-b border-background/20">
                  <span className="text-background/60 uppercase tracking-wide text-[10px] block">
                    Data Quality
                  </span>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div>
                      <span className="text-background/50">Coverage</span>
                      <p className="font-mono">{currentMetric.data_quality.coverage}%</p>
                    </div>
                    <div>
                      <span className="text-background/50">Auditability</span>
                      <p className="font-mono">{currentMetric.data_quality.auditability}%</p>
                    </div>
                    <div>
                      <span className="text-background/50">Freshness</span>
                      <p className="font-mono">{currentMetric.data_quality.freshness_days}d</p>
                    </div>
                  </div>
                </div>
              )}
              {!currentMetric?.data_quality && (
                <div className="text-background/50 text-[10px] italic">
                  No quality metrics available
                </div>
              )}
              <div>
                <span className="text-background/60 uppercase tracking-wide text-[10px]">
                  Source
                </span>
                <p className="font-medium">{currentMetric?.source || "Unknown"}</p>
              </div>
              {currentMetric?.last_updated && (
                <div>
                  <span className="text-background/60 uppercase tracking-wide text-[10px]">
                    Updated
                  </span>
                  <p className="font-mono text-[10px]">
                    {new Date(currentMetric.last_updated).toLocaleString()}
                  </p>
                </div>
              )}
              {/* Decision Context */}
              {currentMetric?.decision_context && (
                <div className="pt-2 border-t border-background/20">
                  <span className="text-background/60 uppercase tracking-wide text-[10px]">
                    Decision Context
                  </span>
                  <div className="mt-1 space-y-1">
                    {currentMetric?.decision_context?.knowns && currentMetric.decision_context.knowns.length > 0 && (
                      <p className="text-[10px]">
                        <span className="text-emerald-400">Known:</span> {currentMetric.decision_context.knowns.join(", ")}
                      </p>
                    )}
                    {currentMetric?.decision_context?.unknowns && currentMetric.decision_context.unknowns.length > 0 && (
                      <p className="text-[10px]">
                        <span className="text-amber-400">Unknown:</span> {currentMetric.decision_context.unknowns.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tie-Out View Button */}
              {currentMetric?.source_reference?.excerpt && (
                <div className="pt-2 border-t border-background/20">
                  <TieOutView metric={currentMetric} label={label} />
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground/10 group-hover:bg-foreground/20 transition-colors" />
      </div>
    );
  }

  // Render uncertainty state for non-available metrics
  const reason = currentMetric?.unavailable_reason || getDefaultReason(availability, label);

  return (
    <div
      className={cn(
        "group relative p-4 border border-border transition-all duration-150",
        config.bgColor,
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
          {label}
        </span>
        <div className={cn(
          "flex items-center gap-1 text-micro uppercase tracking-wide",
          config.color
        )}>
          <Icon className="w-3 h-3" />
          <span>{config.label}</span>
        </div>
      </div>

      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "font-mono tracking-tight cursor-help flex items-center gap-2",
              sizeClasses[size],
              "text-muted-foreground/50"
            )}
          >
            <span>{currentMetric?.formatted || "—"}</span>
            <Icon className={cn("w-5 h-5", config.color)} />
          </div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          align="start"
          className="max-w-xs p-4 bg-foreground text-background border-0"
        >
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-background/60 uppercase tracking-wide text-[10px]">
                Data Quality
              </span>
              <span className="font-medium text-muted-foreground">
                Insufficient
              </span>
            </div>
            <div>
              <span className="text-background/60 uppercase tracking-wide text-[10px]">
                Status
              </span>
              <p className="font-medium">{config.label}</p>
            </div>
            <div>
              <span className="text-background/60 uppercase tracking-wide text-[10px]">
                Reason
              </span>
              <p>{reason}</p>
            </div>
            <div>
              <span className="text-background/60 uppercase tracking-wide text-[10px]">
                Decision Impact
              </span>
              <p className="italic">
                {getDecisionImpact(availability, label)}
              </p>
            </div>
            {/* Decision Context */}
            {currentMetric?.decision_context?.what_changes_conclusion && currentMetric.decision_context.what_changes_conclusion.length > 0 && (
              <div className="pt-2 border-t border-background/20">
                <span className="text-background/60 uppercase tracking-wide text-[10px]">
                  What Changes Conclusion
                </span>
                <ul className="mt-1 list-disc list-inside text-[10px]">
                  {currentMetric.decision_context.what_changes_conclusion.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>

      <div className={cn(
        "absolute bottom-0 left-0 right-0 h-[2px]",
        availability === "unavailable" ? "bg-muted-foreground/20" :
        availability === "pending" ? "bg-amber-500/30" :
        availability === "restricted" ? "bg-orange-500/30" :
        "bg-red-500/30"
      )} />
    </div>
  );
}

function getDefaultReason(availability: string, label: string): string {
  switch (availability) {
    case "pending":
      return `${label} data is being processed or awaiting source confirmation`;
    case "unavailable":
      return `${label} is not available from current data sources`;
    case "restricted":
      return `${label} requires premium data access or authentication`;
    case "stale":
      return `${label} data is outdated and may not reflect current state`;
    case "conflicting":
      return `Multiple sources report different values for ${label}`;
    default:
      return `${label} data status unknown`;
  }
}

function getDecisionImpact(availability: string, label: string): string {
  switch (availability) {
    case "pending":
      return "May proceed with caution; verify when available";
    case "unavailable":
      return "Consider if this metric is critical for your decision";
    case "restricted":
      return "Evaluate if premium access is worth the decision value";
    case "stale":
      return "Factor potential changes since last update";
    case "conflicting":
      return "Manual reconciliation recommended before decision";
    default:
      return "Assess importance to your investment thesis";
  }
}