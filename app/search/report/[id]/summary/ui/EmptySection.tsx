import { cn } from "@/lib/utils";
import { HelpCircle, Clock, Lock, AlertTriangle, FileQuestion } from "lucide-react";

interface EmptySectionProps {
  title: string;
  reason: string;
  impact: string;
  suggestion?: string;
  type?: "unavailable" | "pending" | "restricted" | "none";
  className?: string;
}

const typeConfig = {
  unavailable: {
    icon: FileQuestion,
    label: "Not Available",
    color: "text-muted-foreground",
    bgColor: "bg-muted/30",
    borderColor: "border-muted-foreground/20",
  },
  pending: {
    icon: Clock,
    label: "Data Pending",
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50/50 dark:bg-amber-950/20",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  restricted: {
    icon: Lock,
    label: "Restricted Access",
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50/50 dark:bg-orange-950/20",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  none: {
    icon: HelpCircle,
    label: "No Data",
    color: "text-muted-foreground",
    bgColor: "bg-muted/20",
    borderColor: "border-border",
  },
};

export function EmptySection({ 
  title, 
  reason, 
  impact, 
  suggestion,
  type = "unavailable",
  className 
}: EmptySectionProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      "p-6 border rounded-lg",
      config.bgColor,
      config.borderColor,
      className
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "p-2 rounded-lg",
          type === "unavailable" ? "bg-muted" : 
          type === "pending" ? "bg-amber-100 dark:bg-amber-900/30" :
          type === "restricted" ? "bg-orange-100 dark:bg-orange-900/30" :
          "bg-muted"
        )}>
          <Icon className={cn("w-5 h-5", config.color)} />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className={cn(
              "text-micro uppercase tracking-ultra-wide font-medium",
              config.color
            )}>
              {config.label}
            </span>
            <span className="text-micro text-muted-foreground">
              — {title}
            </span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {reason}
          </p>
          
          <div className="pt-2 border-t border-border/50 mt-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-medium text-foreground">Decision Impact: </span>
                <span className="text-muted-foreground">{impact}</span>
              </div>
            </div>
          </div>
          
          {suggestion && (
            <p className="text-xs text-foreground/70 italic pl-5">
              → {suggestion}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
