import { InvestorDashboard } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";
import { 
  AlertTriangle, 
  ExternalLink,
  Shield,
  TrendingDown,
  Building2,
  Lock,
  DollarSign,
  Target
} from "lucide-react";
import { EmptySection } from "./EmptySection";

// Type for individual risk item
type RiskItem = NonNullable<NonNullable<InvestorDashboard["risks"]>["regulatory"]>[number];

interface RisksPanelProps {
  risks?: InvestorDashboard["risks"];
}

const severityStyles: Record<string, { bg: string; text: string }> = {
  critical: { bg: "bg-foreground", text: "text-background" },
  high: { bg: "bg-foreground/80", text: "text-background" },
  medium: { bg: "bg-foreground/40", text: "text-background" },
  low: { bg: "bg-foreground/20", text: "text-foreground" },
};

const categoryConfig: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  regulatory: { label: "Regulatory", icon: Shield },
  market: { label: "Market", icon: TrendingDown },
  operational: { label: "Operational", icon: Building2 },
  cybersecurity: { label: "Cybersecurity", icon: Lock },
  financial: { label: "Financial", icon: DollarSign },
  strategic: { label: "Strategic", icon: Target },
};

function SourceLink({
  sourceRef,
  source,
}: {
  sourceRef?: { url?: string | null; document_type?: string | null } | null;
  source?: string | null;
}) {
  // Normalize null -> undefined
  const safeSourceRef = sourceRef
    ? {
        url: sourceRef.url ?? undefined,
        document_type: sourceRef.document_type ?? undefined,
      }
    : undefined;

  const safeSource = source ?? undefined;

  // Nothing to show
  if (!safeSourceRef?.url && !safeSource) return null;

  // Show link if url exists
  if (safeSourceRef?.url) {
    return (
      <a
        href={safeSourceRef.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
        {safeSourceRef.document_type ?? safeSource ?? "Source"}
      </a>
    );
  }

  // Fallback if no url
  return (
    <span className="text-[10px] text-muted-foreground">{safeSource ?? "Source"}</span>
  );
}


function RiskCard({ risk, category, index }: { risk: RiskItem; category: string; index: number }) {
  if (!risk) return null;
  
  const styles = severityStyles[risk.severity || "low"] || severityStyles.low;
  const config = categoryConfig[category] || { label: category, icon: AlertTriangle };
  const CategoryIcon = config.icon;

  return (
    <div
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
          <div className="flex items-center gap-1.5 text-micro uppercase tracking-wide text-muted-foreground">
            <CategoryIcon className="w-3 h-3" />
            {config.label}
          </div>
          {risk.status && (
            <span className={cn(
              "px-2 py-0.5 text-[10px] uppercase tracking-ultra-wide font-mono border",
              risk.status === "Active" ? "border-foreground/60 text-foreground" : "border-muted text-muted-foreground"
            )}>
              {risk.status}
            </span>
          )}
        </div>
        <span className="text-micro font-mono text-muted-foreground">
          {risk.id ?? ""}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-serif text-lg font-medium mb-2">
          {risk.title ?? "Untitled Risk"}
        </h4>
        <p className="text-sm text-muted-foreground font-light mb-4">
          {risk.description ?? ""}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-sm">
            <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
              Trigger
            </span>
            <span className="font-light">{risk.trigger ?? "—"}</span>
          </div>
          {risk.probability != null && (
            <div className="text-sm">
              <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
                Probability
              </span>
              <span className="font-mono">{(risk.probability * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>

        {risk.mitigation && (
          <div className="p-3 bg-secondary/50 border-l-2 border-foreground mb-4">
            <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
              Mitigation
            </span>
            <span className="text-sm font-light">{risk.mitigation}</span>
          </div>
        )}

        {/* Source Reference */}
        {(risk.source || risk.source_reference) && (
          <div className="pt-3 border-t border-border flex items-center gap-2">
            <span className="text-micro text-muted-foreground">Source:</span>
            <SourceLink sourceRef={risk.source_reference} source={risk.source} />
          </div>
        )}
      </div>
    </div>
  );
}

function CategorySection({ 
  category, 
  risks, 
  startIndex 
}: { 
  category: string; 
  risks: RiskItem[]; 
  startIndex: number 
}) {
  if (!risks || risks.length === 0) return null;
  
  const config = categoryConfig[category] || { label: category, icon: AlertTriangle };
  const CategoryIcon = config.icon;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <CategoryIcon className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium uppercase tracking-wide">{config.label}</h3>
        <span className="text-micro text-muted-foreground">({risks.length})</span>
      </div>
      <div className="space-y-3">
        {risks.map((risk, idx) => (
          risk ? <RiskCard key={risk.id ?? idx} risk={risk} category={category} index={startIndex + idx} /> : null
        ))}
      </div>
    </div>
  );
}

// Helper to flatten risks into array for other components
export function flattenRisks(risks: InvestorDashboard["risks"]): Array<RiskItem & { category: string }> {
  if (!risks) return [];
  
  const categories = ["regulatory", "market", "operational", "cybersecurity", "financial", "strategic"] as const;
  const flattened: Array<RiskItem & { category: string }> = [];
  
  for (const cat of categories) {
    const categoryRisks = risks[cat];
    if (categoryRisks) {
      for (const risk of categoryRisks) {
        if (risk) {
          flattened.push({ ...risk, category: cat });
        }
      }
    }
  }
  
  return flattened;
}

export function RisksPanel({ risks }: RisksPanelProps) {
  const categories = ["regulatory", "market", "operational", "cybersecurity", "financial", "strategic"] as const;
  
  // Count total risks
  let totalRisks = 0;
  let currentIndex = 0;
  
  for (const cat of categories) {
    const catRisks = risks?.[cat];
    if (catRisks) {
      totalRisks += catRisks.filter(Boolean).length;
    }
  }

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-4 h-4" />
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            Risks & Breakpoints
          </h2>
          <span className="text-micro text-muted-foreground ml-auto">
            {totalRisks} risks across {categories.filter(c => risks?.[c]?.length).length} categories
          </span>
        </div>

        {totalRisks === 0 ? (
          <EmptySection
            title="Risks & Breakpoints"
            type="unavailable"
            reason="No explicit risks have been identified or documented."
            impact="Proceeding without documented risks is itself a risk."
            suggestion="Common risk categories: regulatory, market, operational, cybersecurity, financial, strategic."
          />
        ) : (
          <div>
            {categories.map(cat => {
              const catRisks = risks?.[cat] || [];
              const validRisks = catRisks.filter(Boolean);
              const section = (
                <CategorySection 
                  key={cat}
                  category={cat} 
                  risks={validRisks} 
                  startIndex={currentIndex} 
                />
              );
              currentIndex += validRisks.length;
              return section;
            })}
          </div>
        )}
      </div>
    </section>
  );
}
