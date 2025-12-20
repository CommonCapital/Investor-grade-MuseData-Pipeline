import { InvestorDashboard } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";

interface RunHeaderProps {
  metadata: InvestorDashboard["run_metadata"];
  mode: "public" | "private";
  onModeChange: (mode: "public" | "private") => void;
}

export function RunHeader({ metadata, mode, onModeChange }: RunHeaderProps) {
  return (
    <header className="border-b border-border">
      {/* Top bar with run metadata */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-6 text-micro font-mono uppercase tracking-wide text-muted-foreground">
          <span>
            Run: <span className="text-foreground">{metadata.run_id}</span>
          </span>
          <span className="w-px h-3 bg-border" />
          <span>
            Cut:{" "}
            <span className="text-foreground">
              {new Date(metadata.timestamp).toLocaleString()}
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4 text-micro font-mono uppercase tracking-wide text-muted-foreground">
          <span>
            Owner: <span className="text-foreground">{metadata.owner}</span>
          </span>
        </div>
      </div>

      {/* Main header */}
      <div className="px-6 py-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
                Entity
              </span>
              {metadata.ticker && (
                <span className="px-2 py-0.5 bg-foreground text-background text-micro font-mono uppercase">
                  {metadata.ticker}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight">
              {metadata.entity}
            </h1>
          </div>

          {/* Mode toggle */}
          <div className="flex items-center border border-foreground">
            <button
              onClick={() => onModeChange("public")}
              className={cn(
                "px-4 py-2 text-micro uppercase tracking-ultra-wide font-sans transition-all duration-150",
                mode === "public"
                  ? "bg-foreground text-background"
                  : "bg-transparent text-foreground hover:bg-foreground/5"
              )}
            >
              Primary
            </button>
            <button
              onClick={() => onModeChange("private")}
              className={cn(
                "px-4 py-2 text-micro uppercase tracking-ultra-wide font-sans transition-all duration-150",
                mode === "private"
                  ? "bg-foreground text-background"
                  : "bg-transparent text-foreground hover:bg-foreground/5"
              )}
            >
              Secondary
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
