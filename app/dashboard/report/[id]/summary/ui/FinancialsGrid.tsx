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

        {/* Mode-specific metrics */}
        {mode === "public" && (
          <>
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 mt-8">
              Market Data
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-border">
              <UncertainMetric
                label="Stock Price"
                metric={data.market_data?.stock_price}
                size="lg"
                className="bg-card"
              />
              <UncertainMetric
                label="Market Cap"
                metric={data.market_data?.market_cap}
                className="bg-card"
              />
              <UncertainMetric
                label="P/E Ratio"
                metric={data.market_data?.pe_ratio}
                className="bg-card"
              />
              <UncertainMetric
                label="EV/EBITDA"
                metric={data.market_data?.ev_ebitda}
                className="bg-card"
              />
              <UncertainMetric
                label="Target Price"
                metric={data.market_data?.target_price}
                className="bg-card"
              />
            </div>
          </>
        )}

        {mode === "private" && (
          <>
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 mt-8">
              Private Metrics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
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
              <UncertainMetric
                label="Liquidity Runway"
                metric={data.private_data?.liquidity_runway}
                className="bg-card"
              />
              <UncertainMetric
                label="Covenant Headroom"
                metric={data.private_data?.covenant_headroom}
                className="bg-card"
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}