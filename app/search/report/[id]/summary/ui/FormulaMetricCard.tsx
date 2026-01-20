import { cn } from "@/lib/utils";
import { Info, ExternalLink, FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SourceReference {
  document: string;
  line?: string;
  xbrl_tag?: string;
  url?: string;
  last_updated?: string;
}

interface FormulaInput {
  name: string;
  value: number | null;
  formatted: string;
  source?: SourceReference;
}

interface FormulaMetricCardProps {
  label: string;
  value: string;
  formula?: string;
  inputs?: FormulaInput[];
  source?: SourceReference | string;
  size?: "sm" | "lg";
  className?: string;
  hideIfEmpty?: boolean;
}

export function FormulaMetricCard({
  label,
  value,
  formula,
  inputs,
  source,
  size = "sm",
  className,
  hideIfEmpty = false
}: FormulaMetricCardProps) {
  const isEmpty = value === "—" || value === "" || value === null;
  
  if (hideIfEmpty && isEmpty) {
    return null;
  }

  const hasFormula = formula && inputs && inputs.length > 0;
  const sourceRef = typeof source === "string" ? { document: source } : source;

  return (
    <div className={cn("p-4 bg-card", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
          {label}
        </span>
        
        {/* Traceability Tooltip - Always show for every metric */}
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Info className="w-3 h-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              align="end"
              className="max-w-sm bg-card border border-border p-3"
            >
              <div className="space-y-3">
                {/* Formula Section (for calculated metrics) */}
                {hasFormula && (
                  <>
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                        Formula
                      </div>
                      <code className="text-xs font-mono bg-secondary px-2 py-1 block">
                        {formula}
                      </code>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                        Inputs
                      </div>
                      <div className="space-y-1.5">
                        {inputs.map((input, i) => (
                          <div key={i} className="text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">{input.name}</span>
                              <span className="font-mono">{input.formatted}</span>
                            </div>
                            {input.source && (
                              <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground/70">
                                <FileText className="w-2.5 h-2.5" />
                                <span>{input.source.document}</span>
                                {input.source.line && <span>• {input.source.line}</span>}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Direct Source Reference (for base metrics) */}
                {!hasFormula && sourceRef && (
                  <div>
                    <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                      Source
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        <span className="font-medium">{sourceRef.document}</span>
                      </div>
                      {sourceRef.line && (
                        <div className="text-muted-foreground pl-4">
                          Line: {sourceRef.line}
                        </div>
                      )}
                      {sourceRef.xbrl_tag && (
                        <div className="text-muted-foreground pl-4 font-mono text-[10px]">
                          XBRL: {sourceRef.xbrl_tag}
                        </div>
                      )}
                      {sourceRef.last_updated && (
                        <div className="text-muted-foreground/70 pl-4 text-[10px]">
                          Updated: {new Date(sourceRef.last_updated).toLocaleDateString()}
                        </div>
                      )}
                      {sourceRef.url && (
                        <a 
                          href={sourceRef.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-foreground hover:underline pl-4"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Source
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Fallback if no source */}
                {!hasFormula && !sourceRef && (
                  <div className="text-xs text-muted-foreground italic">
                    Source reference pending
                  </div>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className={cn(
        "font-mono font-medium",
        size === "lg" ? "text-2xl" : "text-lg",
        isEmpty && "text-muted-foreground"
      )}>
        {isEmpty ? "—" : value}
      </div>
    </div>
  );
}
