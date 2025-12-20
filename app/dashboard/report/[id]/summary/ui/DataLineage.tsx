import { InvestorDashboard } from "@/lib/seo-schema";
import { Database, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataLineageProps {
  sources: InvestorDashboard["sources"];
}

export function DataLineage({ sources }: DataLineageProps) {
  return (
    <section className="py-8 animate-fade-in">
      <div className="px-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-4 h-4" />
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            Data Sources
          </h2>
        </div>

        <div className="space-y-2">
          {sources.map((source, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-border/50"
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "w-2 h-2 rounded-full",
                    source.type === "primary"
                      ? "bg-foreground"
                      : "bg-foreground/50"
                  )}
                />
                <div>
                  <span className="text-sm font-medium">{source.name}</span>
                  <span className="ml-2 text-[10px] uppercase tracking-wide text-muted-foreground">
                    {source.type}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <RefreshCw className="w-3 h-3" />
                <span className="font-mono">
                  {new Date(source.last_refresh).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
