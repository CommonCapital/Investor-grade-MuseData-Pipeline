import { Change } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";
import { 
  ArrowRight, 
  FileText, 
  Mic, 
  TrendingUp, 
  BarChart3, 
  AlertTriangle, 
  Newspaper,
  ExternalLink,
  LucideIcon
} from "lucide-react";

interface ChangesSectionProps {
  changes: Change[] | null | undefined;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  filing: FileText,
  transcript: Mic,
  guidance: TrendingUp,
  price: BarChart3,
  consensus: BarChart3,
  regulatory: AlertTriangle,
  news: Newspaper,
};

const PILLAR_STYLES: Record<string, { label: string; bg: string; text: string }> = {
  price: { label: "Price", bg: "bg-foreground", text: "text-background" },
  path: { label: "Path", bg: "bg-foreground/60", text: "text-background" },
  protection: { label: "Protection", bg: "bg-foreground/30", text: "text-foreground" },
};

export function ChangesSection({ changes }: ChangesSectionProps) {
  if (!changes || changes.length === 0) return null;

  const displayChanges = changes.slice(0, 5);

  return (
    <section className="py-6 px-6 border-b border-border bg-secondary/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
          What Changed Since Last Run
        </h2>
        <span className="text-micro text-muted-foreground font-mono">
          {displayChanges.length} delta{displayChanges.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-3">
        {displayChanges.map((change, index) => {
          const categoryKey = change?.category || "news";
          const Icon = CATEGORY_ICONS[categoryKey] || FileText;
          const pillarKey = change?.thesis_pillar;
          const pillarStyle = pillarKey ? PILLAR_STYLES[pillarKey] : null;

          return (
            <div
              key={change?.id || `change-${index}`}
              className="bg-card border border-border p-4 hover:shadow-subtle transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Icon className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-micro uppercase tracking-wide text-muted-foreground">
                        {change?.category?.replace("_", " ") || "update"}
                      </span>
                      {pillarStyle && (
                        <span
                          className={cn(
                            "px-2 py-0.5 text-[10px] uppercase tracking-ultra-wide font-mono",
                            pillarStyle.bg,
                            pillarStyle.text
                          )}
                        >
                          {pillarStyle.label}
                        </span>
                      )}
                    </div>
                    <h4 className="font-medium text-foreground mb-1">
                      {change?.title || "Untitled Change"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {change?.description || "No description available"}
                    </p>
                  </div>
                </div>

                {change?.source_url && (
                  <a
                    href={change.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {(change?.so_what || change?.action) && (
                <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-4">
                  {change?.so_what && (
                    <div>
                      <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-1">
                        So What
                      </span>
                      <span className="text-sm">{change.so_what}</span>
                    </div>
                  )}
                  {change?.action && (
                    <div>
                      <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-1">
                        Action
                      </span>
                      <span className="text-sm flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        {change.action}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}