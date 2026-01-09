import { useState } from "react";
import { InvestorDashboard as InvestorDashboardType } from "@/lib/seo-schema";


import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircle, X } from "lucide-react";

import { useTimeHorizon } from "@/hooks/use-time-horizon";
import { RunHeader } from "@/app/dashboard/report/[id]/summary/ui/RunHeader";
import { ChangesSection } from "@/app/dashboard/report/[id]/summary/ui/ChangesSection";
import { DecisionSufficiency } from "@/app/dashboard/report/[id]/summary/ui/DecisionSufficiency";
import { ExecutiveSummary } from "@/app/dashboard/report/[id]/summary/ui/ExecutiveSummary";
import { PricePathProtection } from "@/app/dashboard/report/[id]/summary/ui/PricePathProtection";
import { TimeSeriesSection } from "@/app/dashboard/report/[id]/summary/ui/TimeSeriesSection";
import { AIInsightsPanel } from "@/app/dashboard/report/[id]/summary/ui/AIInsightsPanel";
import { FinancialsGrid } from "@/app/dashboard/report/[id]/summary/ui/FinancialsGrid";
import { UnitEconomicsPanel } from "@/app/dashboard/report/[id]/summary/ui/UnitEconomicsPanel";
import { MarketExpectationsPanel } from "@/app/dashboard/report/[id]/summary/ui/MarketExpectationsPanel";
import { ValuationSection } from "@/app/dashboard/report/[id]/summary/ui/ValuationSection";
import { EventsTimeline } from "@/app/dashboard/report/[id]/summary/ui/EventsTimeline";
import { DriverScenariosPanel } from "@/app/dashboard/report/[id]/summary/ui/DriverScenariosPanel";
import { RisksPanel } from "@/app/dashboard/report/[id]/summary/ui/RisksPanel";
import { DataLineage } from "@/app/dashboard/report/[id]/summary/ui/DataLineage";


interface InvestorDashboardProps {
  data: any;
  
}

export function SampleDashboard({ data }: InvestorDashboardProps) {
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { 
    horizon, 
    setHorizon, 
    isTransitioning 
  } = useTimeHorizon();
const isPublic = data.company_type === "public";

  return (
    <div className="min-h-screen bg-background">
      <RunHeader
        metadata={data.run_metadata}
        companyType={data.company_type}
      />

      <main>
        <ChangesSection changes={data.changes_since_last_run} />
        
        <section className="py-6 px-6 border-b border-border">
          <DecisionSufficiency data={data} />
        </section>
        
        <ExecutiveSummary summary={data.executive_summary} />
        
        {isPublic && (
          <PricePathProtection data={data} />
        )}
        
        {isPublic && data.time_series && (
          <TimeSeriesSection
            data={data}
            horizon={horizon}
            onHorizonChange={setHorizon}
            isTransitioning={isTransitioning}
          />
        )}
        
        {((data.ai_insights && data.ai_insights.length > 0) || (data.hypotheses && data.hypotheses.length > 0)) && (
          <AIInsightsPanel
            insights={data.ai_insights || data.hypotheses || []}
            horizon={horizon}
            isTransitioning={isTransitioning}
          />
        )}
        
        <FinancialsGrid data={data} />
        
        {data.unit_economics && (
          <UnitEconomicsPanel data={data} />
        )}
        
        {(data.guidance_bridge || data.revisions_momentum) && (
          <MarketExpectationsPanel data={data} />
        )}
        
        <ValuationSection data={data} />
        
        <EventsTimeline events={data.events} />
        
        <DriverScenariosPanel scenarios={data.scenarios} baseMetrics={data.base_metrics} />
        
        <RisksPanel risks={data.risks} />
        
        <DataLineage sources={data.sources} />
      </main>

     
      <footer className="border-t border-border py-6 px-6">
        <div className="flex items-center justify-between text-micro text-muted-foreground">
          <span>
            Decision-Grade Dashboard • {data.run_metadata?.entity || "Unknown"} •{" "}
            {data.run_metadata?.run_id || "N/A"}
          </span>
          <span className="font-mono">
            {data.run_metadata?.timestamp ? new Date(data.run_metadata.timestamp).toLocaleString() : "N/A"}
          </span>
        </div>
      </footer>
    
    </div>
  );
}
