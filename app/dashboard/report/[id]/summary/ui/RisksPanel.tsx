import { Risk } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { EmptySection } from "./EmptySection";

interface RisksPanelProps {
  risks: Risk[];
}

const severityStyles: Record<Risk["severity"], { bg: string; text: string }> = {
  critical: { bg: "bg-foreground", text: "text-background" },
  high: { bg: "bg-foreground/80", text: "text-background" },
  medium: { bg: "bg-foreground/40", text: "text-background" },
  low: { bg: "bg-foreground/20", text: "text-foreground" },
};

const categoryLabels: Record<Risk["category"], string> = {
  market: "Market",
  operational: "Operational",
  financial: "Financial",
  liquidity: "Liquidity",
  governance: "Governance",
};

export function RisksPanel({ risks }: RisksPanelProps) {
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  const sortedRisks = [...risks].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-4 h-4" />
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            Risks & Breakpoints
          </h2>
        </div>

        {risks.length === 0 ? (
          <EmptySection
            title="Risks & Breakpoints"
            type="unavailable"
            reason="No explicit risks have been identified or documented. This does NOT mean the investment is risk-free—it means risk analysis is incomplete or pending."
            impact="Proceeding without documented risks is itself a risk. Consider: What assumptions must hold for the thesis to work? What would break the investment case?"
            suggestion="Common risk categories to investigate: customer concentration, competitive dynamics, regulatory exposure, balance sheet leverage, management execution."
          />
        ) : (
          <div className="space-y-4">
            {sortedRisks.map((risk, index) => {
              const styles = severityStyles[risk.severity];

              return (
                <div
                  key={risk.id}
                  className="border border-border hover:shadow-subtle transition-all duration-150"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 text-[10px] uppercase tracking-ultra-wide font-mono",
                          styles.bg,
                          styles.text
                        )}
                      >
                        {risk.severity}
                      </span>
                      <span className="text-micro uppercase tracking-wide text-muted-foreground">
                        {categoryLabels[risk.category]}
                      </span>
                    </div>
                    <span className="text-micro font-mono text-muted-foreground">
                      {risk.id}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h4 className="font-serif text-lg font-medium mb-2">
                      {risk.title}
                    </h4>
                    <p className="text-sm text-muted-foreground font-light mb-4">
                      {risk.description}
                    </p>

                    <div className="text-sm">
                      <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
                        Trigger
                      </span>
                      <span className="font-light">{risk.trigger}</span>
                    </div>

                    {risk.mitigation && (
                      <div className="mt-4 p-3 bg-secondary/50 border-l-2 border-foreground">
                        <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
                          Mitigation
                        </span>
                        <span className="text-sm font-light">{risk.mitigation}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
