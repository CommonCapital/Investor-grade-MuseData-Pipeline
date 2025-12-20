import { AIInsight, TimeHorizon } from "@/lib/seo-schema";
import { HORIZON_LABELS } from "@/lib/time-series-data";
import { cn } from "@/lib/utils";
import { 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  BarChart3,
  Sparkles,
  ArrowRight
} from "lucide-react";

interface AIInsightsPanelProps {
  insights: AIInsight[];
  horizon: TimeHorizon;
  isTransitioning?: boolean;
}

const INSIGHT_ICONS = {
  prediction: TrendingUp,
  recommendation: Lightbulb,
  alert: AlertTriangle,
  analysis: BarChart3,
};

const INSIGHT_STYLES = {
  prediction: "border-l-foreground",
  recommendation: "border-l-foreground/60",
  alert: "border-l-foreground",
  analysis: "border-l-foreground/40",
};

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1 bg-border">
        <div 
          className="h-full bg-foreground transition-all duration-300"
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <span className="text-micro font-mono text-muted-foreground">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

function InsightCard({ insight }: { insight: AIInsight }) {
  const Icon = INSIGHT_ICONS[insight.type];
  
  return (
    <div 
      className={cn(
        "bg-card p-4 border-l-2 transition-all duration-300",
        INSIGHT_STYLES[insight.type],
        "hover:bg-secondary/50"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-foreground" />
          <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
            {insight.type}
          </span>
        </div>
        <ConfidenceBar value={insight.confidence} />
      </div>
      
      <h4 className="font-medium text-foreground mb-1">
        {insight.title}
      </h4>
      
      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
        {insight.summary}
      </p>
      
      {insight.details && (
        <p className="text-micro text-muted-foreground border-t border-border pt-2 mb-3">
          {insight.details}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {insight.supporting_metrics?.map((metric) => (
            <span 
              key={metric}
              className="px-2 py-0.5 bg-secondary text-micro font-mono text-muted-foreground"
            >
              {metric}
            </span>
          ))}
        </div>
        
        {insight.action_required && (
          <span className="flex items-center gap-1 text-micro uppercase tracking-wide text-foreground">
            Action Required
            <ArrowRight className="w-3 h-3" />
          </span>
        )}
      </div>
    </div>
  );
}

export function AIInsightsPanel({ 
  insights, 
  horizon,
  isTransitioning 
}: AIInsightsPanelProps) {
  const filteredInsights = insights.filter(i => 
    i.horizon_relevance.includes(horizon)
  );
  
  return (
    <section 
      className={cn(
        "py-8 border-b border-border transition-opacity duration-150",
        isTransitioning ? "opacity-50" : "opacity-100"
      )}
    >
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
              AI Insights & Predictions
            </h2>
            <span className="px-2 py-0.5 bg-secondary text-micro font-mono text-muted-foreground">
              {HORIZON_LABELS[horizon]} Horizon
            </span>
          </div>
          <span className="text-micro text-muted-foreground font-mono">
            {filteredInsights.length} insight{filteredInsights.length !== 1 ? 's' : ''} for horizon
          </span>
        </div>
        
        {filteredInsights.length === 0 ? (
          <div className="bg-card border border-dashed border-border p-8 text-center">
            <Sparkles className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              No AI insights available for {HORIZON_LABELS[horizon]} horizon
            </p>
            <p className="text-micro text-muted-foreground mt-1">
              AI layer will generate predictions when more data is available
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredInsights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
