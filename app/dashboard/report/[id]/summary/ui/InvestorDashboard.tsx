import { useState } from "react";
import { InvestorDashboard as InvestorDashboardType } from "@/lib/seo-schema";
import { useTimeHorizon } from "@/hooks/use-time-horizon";
import { RunHeader } from "./RunHeader";
import { ExecutiveSummary } from "./ExecutiveSummary";
import { TimeSeriesSection } from "./TimeSeriesSection";
import { AIInsightsPanel } from "./AIInsightsPanel";
import { FinancialsGrid } from "./FinancialsGrid";
import { EventsTimeline } from "./EventsTimeline";
import { ScenariosPanel } from "./ScenariosPanel";
import { RisksPanel } from "./RisksPanel";
import { DataLineage } from "./DataLineage";
import { DecisionSufficiency } from "./DecisionSufficiency";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageCircle, X } from "lucide-react";
import AIChat from "./AIChat";

interface InvestorDashboardProps {
  data: InvestorDashboardType;
  id: string;
  user: any;
}

export function InvestorDashboard({ data, id, user }: InvestorDashboardProps) {
  const [mode, setMode] = useState<"public" | "private">(data.run_metadata.mode);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { 
    horizon, 
    setHorizon, 
    isTransitioning 
  } = useTimeHorizon();

  return (
    <div className="min-h-screen bg-background">
      <RunHeader
        metadata={data.run_metadata}
        mode={mode}
        onModeChange={setMode}
      />

      <main>
        {/* Decision Sufficiency Assessment - Always visible */}
        <section className="py-6 px-6 border-b border-border">
          <DecisionSufficiency data={data} />
        </section>
        
        <ExecutiveSummary summary={data.executive_summary} />
        
        {/* Time-Series Section with functional horizon controls */}
        {mode === "public" && data.market_data && (
          <TimeSeriesSection
            data={data}
            horizon={horizon}
            onHorizonChange={setHorizon}
            isTransitioning={isTransitioning}
          />
        )}
        
        {/* AI Insights Panel */}
        {data.ai_insights && data.ai_insights.length > 0 && (
          <AIInsightsPanel
            insights={data.ai_insights}
            horizon={horizon}
            isTransitioning={isTransitioning}
          />
        )}
        
        <FinancialsGrid data={data} mode={mode} />
        <EventsTimeline events={data.events} />
        <ScenariosPanel scenarios={data.scenarios} />
        <RisksPanel risks={data.risks} />
        <DataLineage sources={data.sources} />
        
      </main>
       {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={cn(
          'fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-2xl transition-all duration-300',
          'bg-gradient-to-r from-black to-gray-600',
          'hover:scale-110 active:scale-95',
          isChatOpen && 'rotate-90'
        )}
        aria-label="Toggle AI Chat"
      >
        {isChatOpen ? (
          <X className='h-6 w-6 text-white' />
        ) : (
          <MessageCircle className='h-6 w-6 text-white' />
        )}
      </Button>

      {/* Notification Badge (optional - shows when chat is closed) */}
      {!isChatOpen && (
        <div className='fixed bottom-[88px] right-6 z-40 animate-bounce'>
          <div className='bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center'>
            AI
          </div>
        </div>
      )}

      {/* Chat Component */}
      <AIChat seoReportId={id} isExpanded={isChatOpen} user={user} onClose={() => setIsChatOpen(false)} />

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6">
        <div className="flex items-center justify-between text-micro text-muted-foreground">
          <span>
            Decision-Grade Dashboard • {data.run_metadata.entity} •{" "}
            {data.run_metadata.run_id}
          </span>
          <span className="font-mono">
            {new Date(data.run_metadata.timestamp).toLocaleString()}
          </span>
        </div>
      </footer>
    </div>
  );
}
