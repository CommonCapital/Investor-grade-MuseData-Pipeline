import { cn } from "@/lib/utils";
import { 
  DecisionAssessment, 
  UncertaintyReason,
  assessDashboardSufficiency,
  getUncertaintyReasons,
  SufficiencyLevel 
} from "@/lib/uncertainty-types";
import { InvestorDashboard } from "@/lib/seo-schema";
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  ShieldQuestion
} from "lucide-react";
import { useState } from "react";

interface DecisionSufficiencyProps {
  data: InvestorDashboard;
  className?: string;
}

const SUFFICIENCY_CONFIG: Record<SufficiencyLevel, {
  icon: typeof CheckCircle;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}> = {
  sufficient: {
    icon: ShieldCheck,
    label: "Decision Ready",
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  partial: {
    icon: ShieldAlert,
    label: "Proceed with Caveats",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  insufficient: {
    icon: ShieldQuestion,
    label: "More Data Needed",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  blocked: {
    icon: ShieldX,
    label: "Cannot Decide",
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    borderColor: "border-red-200 dark:border-red-800",
  },
};

function ConfidenceMeter({ confidence }: { confidence: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-500 rounded-full",
            confidence >= 80 ? "bg-emerald-500" :
            confidence >= 60 ? "bg-amber-500" :
            confidence >= 40 ? "bg-orange-500" : "bg-red-500"
          )}
          style={{ width: `${confidence}%` }}
        />
      </div>
      <span className="font-mono text-sm font-medium w-12 text-right">
        {confidence}%
      </span>
    </div>
  );
}

function UncertaintyItem({ reason }: { reason: UncertaintyReason }) {
  const impactColors = {
    critical: "border-l-red-500 bg-red-50/50 dark:bg-red-950/20",
    material: "border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20",
    minor: "border-l-muted-foreground/30 bg-muted/30",
  };
  
  const statusLabels = {
    available: "Available",
    pending: "Pending",
    unavailable: "Not Available",
    restricted: "Restricted Access",
    stale: "Stale Data",
    conflicting: "Conflicting Sources",
  };

  return (
    <div className={cn(
      "border-l-2 pl-3 py-2",
      impactColors[reason.impact]
    )}>
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-sm">{reason.field}</span>
        <span className={cn(
          "text-micro uppercase tracking-wide px-1.5 py-0.5 rounded",
          reason.impact === "critical" ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" :
          reason.impact === "material" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" :
          "bg-muted text-muted-foreground"
        )}>
          {statusLabels[reason.status]}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">{reason.explanation}</p>
      {reason.workaround && (
        <p className="text-xs text-foreground/70 mt-1 italic">
          → {reason.workaround}
        </p>
      )}
    </div>
  );
}

export function DecisionSufficiency({ data, className }: DecisionSufficiencyProps) {
  const [expanded, setExpanded] = useState(false);
  
  const assessment = assessDashboardSufficiency(data);
  const uncertainties = getUncertaintyReasons(data);
  const config = SUFFICIENCY_CONFIG[assessment.sufficiency];
  const Icon = config.icon;

  return (
    <div className={cn(
      "border rounded-lg overflow-hidden",
      config.borderColor,
      config.bgColor,
      className
    )}>
      {/* Header - Always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-foreground/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className={cn("w-6 h-6", config.color)} />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className={cn("font-semibold", config.color)}>
                {config.label}
              </span>
              <span className="text-micro uppercase tracking-wide text-muted-foreground">
                Decision Assessment
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              {assessment.recommendation}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-micro uppercase tracking-wide text-muted-foreground">
              Confidence
            </div>
            <div className="font-mono font-bold text-lg">
              {assessment.confidence}%
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-border/50 p-4 space-y-4 bg-background/50">
          {/* Confidence Meter */}
          <div>
            <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-2">
              Confidence Level
            </div>
            <ConfidenceMeter confidence={assessment.confidence} />
          </div>

          {/* Known / Unknown Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* What's Known */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                  What's Known ({assessment.known.length})
                </span>
              </div>
              <div className="space-y-1">
                {assessment.known.length > 0 ? (
                  assessment.known.map(item => (
                    <div key={item} className="text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {item.replace(/_/g, " ")}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground italic">No confirmed data points</p>
                )}
              </div>
            </div>

            {/* What's Unknown */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-amber-500" />
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                  What's Unknown ({assessment.unknown.length})
                </span>
              </div>
              <div className="space-y-1">
                {assessment.unknown.length > 0 ? (
                  assessment.unknown.map(item => (
                    <div key={item} className="text-sm flex items-center gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {item.replace(/_/g, " ")}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">All required data available</p>
                )}
              </div>
            </div>
          </div>

          {/* Blockers */}
          {assessment.blockers.length > 0 && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-micro uppercase tracking-ultra-wide text-red-600 dark:text-red-400 font-medium">
                  Blockers ({assessment.blockers.length})
                </span>
              </div>
              <div className="space-y-1">
                {assessment.blockers.map(item => (
                  <div key={item} className="text-sm text-red-700 dark:text-red-300">
                    • Missing: {item.replace(/_/g, " ")}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What Would Change Conclusion */}
          {assessment.wouldChangeConclusion.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
                  What Would Change the Conclusion
                </span>
              </div>
              <div className="space-y-1">
                {assessment.wouldChangeConclusion.map(item => (
                  <div key={item} className="text-sm text-orange-700 dark:text-orange-300">
                    • {item}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Uncertainties */}
          {uncertainties.length > 0 && (
            <div>
              <div className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-2">
                Data Availability Details
              </div>
              <div className="space-y-2">
                {uncertainties.map((u, i) => (
                  <UncertaintyItem key={i} reason={u} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
