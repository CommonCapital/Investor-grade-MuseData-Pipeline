import { InvestorDashboard } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ExecutiveSummaryProps {
  summary: InvestorDashboard["executive_summary"];
}

const thesisStatusConfig = {
  intact: {
    icon: CheckCircle,
    label: "THESIS INTACT",
    className: "border-foreground bg-foreground text-background",
  },
  challenged: {
    icon: AlertTriangle,
    label: "THESIS CHALLENGED",
    className: "border-foreground bg-transparent text-foreground",
  },
  broken: {
    icon: XCircle,
    label: "THESIS BROKEN",
    className: "border-foreground bg-foreground/10 text-foreground",
  },
};

export function ExecutiveSummary({ summary }: ExecutiveSummaryProps) {
  if (!summary) return null;
  
  const thesisStatus = (summary.thesis_status === "intact" || summary.thesis_status === "challenged" || summary.thesis_status === "broken") 
    ? summary.thesis_status 
    : "challenged";
  const statusConfig = thesisStatusConfig[thesisStatus];
  const StatusIcon = statusConfig.icon;

  const keyFacts = summary.key_facts ?? [];
  const implications = summary.implications ?? [];
  const keyRisks = summary.key_risks ?? [];

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        {/* Section label */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            Executive Summary
          </h2>
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 border text-micro uppercase tracking-ultra-wide font-sans",
              statusConfig.className
            )}
          >
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </div>
        </div>

        {/* Headline */}
        <p className="text-xl md:text-2xl font-serif font-normal leading-relaxed mb-8 max-w-4xl">
          {summary.headline ?? "No headline available"}
        </p>

        {/* Grid of facts/implications/risks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Key Facts */}
          <div className="space-y-3">
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
              Key Facts
            </h3>
            <ul className="space-y-2">
              {keyFacts.length > 0 ? keyFacts.map((fact, i) => (
                <li key={i} className="text-sm font-light leading-relaxed">
                  {fact}
                </li>
              )) : (
                <li className="text-sm text-muted-foreground italic">No facts available</li>
              )}
            </ul>
          </div>

          {/* Implications */}
          <div className="space-y-3">
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
              Implications
            </h3>
            <ul className="space-y-2">
              {implications.length > 0 ? implications.map((impl, i) => (
                <li key={i} className="text-sm font-light leading-relaxed">
                  {impl}
                </li>
              )) : (
                <li className="text-sm text-muted-foreground italic">No implications available</li>
              )}
            </ul>
          </div>

          {/* Key Risks */}
          <div className="space-y-3">
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
              Key Risks
            </h3>
            <ul className="space-y-2">
              {keyRisks.length > 0 ? keyRisks.map((risk, i) => (
                <li key={i} className="text-sm font-light leading-relaxed">
                  {risk}
                </li>
              )) : (
                <li className="text-sm text-muted-foreground italic">No risks identified</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
