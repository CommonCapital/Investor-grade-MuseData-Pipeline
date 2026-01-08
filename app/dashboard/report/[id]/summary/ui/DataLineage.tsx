import { InvestorDashboard } from "@/lib/seo-schema";
import { Database, RefreshCw, Clock, CheckCircle, AlertTriangle, XCircle, ExternalLink, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface DataLineageProps {
  sources?: InvestorDashboard["sources"] | null;
}

type SourceType = NonNullable<InvestorDashboard["sources"]>[number];

function getStatusIcon(status?: string) {
  switch (status) {
    case "connected":
      return <CheckCircle className="w-3 h-3 text-green-500" />;
    case "stale":
      return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
    case "error":
      return <XCircle className="w-3 h-3 text-red-500" />;
    case "pending":
      return <Clock className="w-3 h-3 text-muted-foreground" />;
    default:
      return <CheckCircle className="w-3 h-3 text-green-500" />;
  }
}

function getFrequencyLabel(freq?: string) {
  switch (freq) {
    case "realtime":
      return "Real-time";
    case "hourly":
      return "Hourly";
    case "daily":
      return "Daily";
    case "weekly":
      return "Weekly";
    case "quarterly":
      return "Quarterly";
    case "manual":
      return "Manual";
    default:
      return "—";
  }
}

function formatTimeSince(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function DataLineage({ sources }: DataLineageProps) {
  const sourcesList = sources || [];
  
  if (sourcesList.length === 0) {
    return null;
  }

  // Sort by priority (lower = higher priority), then by type (primary first)
  const sortedSources = [...sourcesList].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === "primary" ? -1 : 1;
    }
    return (a.priority ?? 99) - (b.priority ?? 99);
  });

  const primarySources = sortedSources.filter(s => s.type === "primary");
  const secondarySources = sortedSources.filter(s => s.type === "secondary");
  
  const connectedCount = sourcesList.filter(s => s.status === "connected").length;
  const staleCount = sourcesList.filter(s => s.status === "stale").length;
  
  return (
    <section className="py-8 animate-fade-in">
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4" />
            <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
              Data Sources
            </h2>
            <Badge variant="outline" className="text-[10px] font-mono">
              {connectedCount}/{sourcesList.length} connected
            </Badge>
            {staleCount > 0 && (
              <Badge variant="secondary" className="text-[10px] font-mono text-yellow-600">
                {staleCount} stale
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Zap className="w-3 h-3" />
            <span>Auto-refresh enabled</span>
          </div>
        </div>

        {/* Primary Sources */}
        {primarySources.length > 0 && (
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 font-medium">
              Primary Sources (Authoritative)
            </div>
            <div className="space-y-1">
              {primarySources.map((source, i) => (
                <SourceRow key={`primary-${i}`} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* Secondary Sources */}
        {secondarySources.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2 font-medium">
              Secondary Sources (Supplementary)
            </div>
            <div className="space-y-1">
              {secondarySources.map((source, i) => (
                <SourceRow key={`secondary-${i}`} source={source} />
              ))}
            </div>
          </div>
        )}

        {/* Refresh Schedule Summary */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
            Refresh Schedule
          </div>
          <div className="flex flex-wrap gap-2">
            {["realtime", "hourly", "daily", "weekly", "quarterly"].map(freq => {
              const count = sourcesList.filter(s => s.refresh_frequency === freq).length;
              if (count === 0) return null;
              return (
                <Badge key={freq} variant="outline" className="text-[10px] font-mono">
                  {getFrequencyLabel(freq)}: {count}
                </Badge>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function SourceRow({ source }: { source: SourceType }) {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-between py-2.5 px-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          {getStatusIcon(source.status)}
          <div className="flex items-center gap-2">
            {source.url ? (
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-medium hover:underline flex items-center gap-1"
              >
                {source.name}
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
              </a>
            ) : (
              <span className="text-sm font-medium">{source.name}</span>
            )}
            {source.priority && source.priority <= 2 && (
              <Badge variant="default" className="text-[9px] px-1.5 py-0">
                P{source.priority}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Metrics Covered */}
          {source.metrics_covered && source.metrics_covered.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="text-[10px] text-muted-foreground cursor-help">
                  {source.metrics_covered.length} metrics
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="text-xs">
                  <span className="font-medium">Metrics covered:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {source.metrics_covered.map((m, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]">
                        {m}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Refresh Frequency */}
          <Badge variant="outline" className="text-[10px] font-mono">
            {getFrequencyLabel(source.refresh_frequency)}
          </Badge>

          {/* Last Refresh */}
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground min-w-[80px] justify-end">
            <RefreshCw className="w-3 h-3" />
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="font-mono cursor-help">
                  {formatTimeSince(source.last_refresh)}
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="text-xs font-mono">
                  Last: {new Date(source.last_refresh).toLocaleString()}
                  {source.next_refresh && (
                    <div className="text-muted-foreground">
                      Next: {new Date(source.next_refresh).toLocaleString()}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
