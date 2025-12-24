import { InvestorDashboard } from "@/lib/seo-schema";
import { UncertainMetric } from "./UncertainMetric";

interface FinancialsGridProps {
  data: InvestorDashboard;
  mode: "public" | "private";
}

export function FinancialsGrid({ data, mode }: FinancialsGridProps) {
  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-6">
          Financial & Operating Metrics
        </h2>

        {/* Core financials */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-border mb-6">
          <UncertainMetric
            label="Revenue"
            metric={data.financials?.revenue}
            size="lg"
            className="bg-card"
          />
          <UncertainMetric
            label="Revenue Growth"
            metric={data.financials?.revenue_growth}
            className="bg-card"
          />
          <UncertainMetric
            label="EBITDA"
            metric={data.financials?.ebitda}
            size="lg"
            className="bg-card"
          />
          <UncertainMetric
            label="EBITDA Margin"
            metric={data.financials?.ebitda_margin}
            className="bg-card"
          />
          <UncertainMetric
            label="Free Cash Flow"
            metric={data.financials?.free_cash_flow}
            className="bg-card"
          />
        </div>

        {/* Mode-specific metrics - Only show if in proprietary mode */}
        {mode === "private" && data.private_data && (
          <>
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 mt-8">
              Proprietary Metrics
            </h3>
            <div className="grid grid-cols-2 gap-px bg-border">
              <UncertainMetric
                label="Valuation Mark"
                metric={data.private_data?.valuation_mark}
                size="lg"
                className="bg-card"
              />
              <UncertainMetric
                label="Net Leverage"
                metric={data.private_data?.net_leverage}
                className="bg-card"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}