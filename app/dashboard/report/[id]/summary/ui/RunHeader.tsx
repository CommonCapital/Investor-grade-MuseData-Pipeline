import { CompanyType, InvestorDashboard } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";

interface RunHeaderProps {
  metadata: InvestorDashboard["run_metadata"];
  companyType: CompanyType;
}

export function RunHeader({ metadata, companyType }: RunHeaderProps) {
  return (
    <header className="border-b border-border">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-6 text-micro font-mono uppercase tracking-wide text-muted-foreground">
          <span>
            Run: <span className="text-foreground">{metadata?.run_id ?? "N/A"}</span>
          </span>
          <span className="w-px h-3 bg-border" />
          <span>
            Cut:{" "}
            <span className="text-foreground">
              {metadata?.timestamp ? new Date(metadata.timestamp).toLocaleString() : "—"}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-micro font-mono uppercase tracking-wide text-muted-foreground">
          <span>
            Owner: <span className="text-foreground">{metadata?.owner ?? "Unknown"}</span>
          </span>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
                Entity
              </span>
              {metadata?.ticker && (
                <span className="px-2 py-0.5 bg-foreground text-background text-micro font-mono uppercase">
                  {metadata.ticker}
                </span>
              )}
              {/* Company Type Badge */}
              <span className={cn(
                "px-2 py-0.5 text-micro font-mono uppercase",
                companyType === "public" 
                  ? "bg-foreground/10 text-foreground border border-foreground/20" 
                  : "bg-foreground/80 text-background"
              )}>
                {companyType === "public" ? "Public" : "Private"}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight">
              {metadata?.entity ?? "Unknown Entity"}
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
