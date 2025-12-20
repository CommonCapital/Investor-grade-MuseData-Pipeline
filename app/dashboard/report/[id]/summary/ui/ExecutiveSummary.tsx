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
  const statusConfig = thesisStatusConfig[summary.thesis_status];
  const StatusIcon = statusConfig.icon;

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
          {summary.headline}
        </p>

        {/* Grid of facts/implications/risks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Key Facts */}
          <div className="space-y-3">
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
              Key Facts
            </h3>
            <ul className="space-y-2">
              {summary.key_facts.map((fact, i) => (
                <li key={i} className="text-sm font-light leading-relaxed">
                  {fact}
                </li>
              ))}
            </ul>
          </div>

          {/* Implications */}
          <div className="space-y-3">
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
              Implications
            </h3>
            <ul className="space-y-2">
              {summary.implications.map((impl, i) => (
                <li key={i} className="text-sm font-light leading-relaxed">
                  {impl}
                </li>
              ))}
            </ul>
          </div>

          {/* Key Risks */}
          <div className="space-y-3">
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans border-b border-border pb-2">
              Key Risks
            </h3>
            <ul className="space-y-2">
              {summary.key_risks.map((risk, i) => (
                <li key={i} className="text-sm font-light leading-relaxed">
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
