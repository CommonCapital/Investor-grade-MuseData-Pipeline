import { MetricDefinition } from "@/lib/seo-schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface DefinitionPillProps {
  definition: MetricDefinition | null | undefined;
}

const PERIOD_LABELS: Record<string, string> = {
  quarter: "Quarterly",
  TTM: "Trailing 12 Months",
  FY: "Fiscal Year",
  LTM: "Last Twelve Months",
  NTM: "Next Twelve Months",
};

const BASIS_LABELS: Record<string, string> = {
  GAAP: "GAAP",
  non_GAAP: "Non-GAAP",
  adjusted: "Adjusted",
  reported: "As Reported",
};

export function DefinitionPill({ definition }: DefinitionPillProps) {
  if (!definition) return null;

  const hasContent = definition.period || definition.basis || definition.currency;
  if (!hasContent) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-secondary text-micro font-mono text-muted-foreground hover:bg-secondary/80 transition-colors">
          <Info className="w-3 h-3" />
          {definition.period && (
            <span>{definition.period}</span>
          )}
          {definition.basis && (
            <span className="border-l border-border pl-1 ml-1">{definition.basis}</span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs">
        <div className="space-y-2 text-sm">
          {definition.metric_name && (
            <div>
              <span className="text-muted-foreground">Metric: </span>
              <span className="font-medium">{definition.metric_name}</span>
            </div>
          )}
          {definition.period && (
            <div>
              <span className="text-muted-foreground">Period: </span>
              <span>{PERIOD_LABELS[definition.period] || definition.period}</span>
            </div>
          )}
          {definition.basis && (
            <div>
              <span className="text-muted-foreground">Basis: </span>
              <span>{BASIS_LABELS[definition.basis] || definition.basis}</span>
            </div>
          )}
          {definition.currency && (
            <div>
              <span className="text-muted-foreground">Currency: </span>
              <span>{definition.currency}</span>
            </div>
          )}
          {definition.unit && (
            <div>
              <span className="text-muted-foreground">Unit: </span>
              <span>{definition.unit}</span>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
