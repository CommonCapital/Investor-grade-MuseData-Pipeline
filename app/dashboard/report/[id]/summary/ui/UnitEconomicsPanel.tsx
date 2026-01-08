import { InvestorDashboard } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";
import { 
  calcCAC,
  calcLTV,
  calcLTVCAC,
  calcPaybackPeriod,
  CalculatedKPI
} from "@/lib/kpi-calculations";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Info,
  Target
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UnitEconomicsPanelProps {
  data: InvestorDashboard;
}

// Tooltip that shows formula from kpi-calculations (not from schema)
function FormulaTooltip({ kpi, sourceUrl }: { kpi: CalculatedKPI; sourceUrl?: string }) {
  if (!kpi.formula) return null;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <button className="text-muted-foreground hover:text-foreground transition-colors ml-1">
            <Info className="w-3 h-3" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" align="end" className="max-w-sm bg-card border border-border p-3">
          <div className="space-y-2">
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Formula</div>
              <code className="text-xs font-mono bg-secondary px-2 py-1 block">{kpi.formula}</code>
            </div>
            {kpi.inputs && kpi.inputs.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Inputs (from base_metrics)</div>
                {kpi.inputs.map((input, i) => (
                  <div key={i} className="flex justify-between text-xs gap-4">
                    <span className="text-muted-foreground">{input.name}</span>
                    <span className="font-mono">{input.formatted}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="pt-2 border-t border-border text-[10px] text-muted-foreground">
              Calculated by: kpi-calculations.ts
            </div>
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                View Source
              </a>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function MetricCard({ 
  icon: Icon, 
  label, 
  kpi,
  subtext,
  highlight = false,
  sourceUrl
}: { 
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  kpi: CalculatedKPI;
  subtext?: string;
  highlight?: boolean;
  sourceUrl?: string;
}) {
  return (
    <div className={cn(
      "border border-border p-4",
      highlight && "bg-card"
    )}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">{label}</span>
        <FormulaTooltip kpi={kpi} sourceUrl={sourceUrl} />
      </div>
      <div className="text-2xl font-mono font-medium">
        {kpi.formatted || "—"}
      </div>
      {subtext && (
        <div className="text-sm text-muted-foreground mt-1">{subtext}</div>
      )}
    </div>
  );
}

function LtvCacGauge({ ratio, kpi }: { ratio: number | null; kpi: CalculatedKPI }) {
  if (ratio == null) return null;
  
  // Determine health status
  const getStatus = (r: number) => {
    if (r >= 4) return { status: "excellent", color: "text-emerald-600 dark:text-emerald-400", icon: CheckCircle };
    if (r >= 3) return { status: "healthy", color: "text-emerald-600 dark:text-emerald-400", icon: CheckCircle };
    if (r >= 2) return { status: "acceptable", color: "text-amber-600 dark:text-amber-400", icon: AlertTriangle };
    return { status: "concerning", color: "text-rose-600 dark:text-rose-400", icon: AlertTriangle };
  };
  
  const { status, color, icon: StatusIcon } = getStatus(ratio);
  
  // Calculate position on gauge (0-5x scale)
  const position = Math.min(ratio / 5, 1) * 100;
  
  return (
    <div className="border border-border p-4 bg-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-muted-foreground" />
          <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">LTV/CAC Ratio</span>
          <FormulaTooltip kpi={kpi} />
        </div>
        <div className={cn("flex items-center gap-1 text-sm font-medium", color)}>
          <StatusIcon className="w-4 h-4" />
          <span className="capitalize">{status}</span>
        </div>
      </div>
      
      <div className="text-4xl font-mono font-medium mb-4">{ratio.toFixed(1)}x</div>
      
      {/* Gauge */}
      <div className="relative h-2 bg-secondary rounded-full overflow-hidden mb-2">
        <div 
          className="absolute left-0 top-0 h-full bg-foreground rounded-full transition-all duration-500"
          style={{ width: `${position}%` }}
        />
        {/* Benchmark markers */}
        <div className="absolute top-0 h-full w-px bg-muted-foreground/30" style={{ left: '60%' }} title="3x benchmark" />
      </div>
      
      <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
        <span>0x</span>
        <span className="text-foreground/50">3x (benchmark)</span>
        <span>5x+</span>
      </div>
    </div>
  );
}

function InvestorContextCard({ context }: { context: NonNullable<NonNullable<InvestorDashboard["unit_economics"]>["investor_context"]> }) {
  if (!context) return null;

  return (
    <div className="border border-border p-4 col-span-full">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-4 h-4 text-muted-foreground" />
        <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">Investor Context</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {context.ltv_cac_interpretation && (
          <div>
            <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-1">Interpretation</span>
            <p className="text-sm font-light">{context.ltv_cac_interpretation}</p>
          </div>
        )}
        
        {context.benchmark_comparison && (
          <div>
            <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-1">vs. Benchmarks</span>
            <p className="text-sm font-light">{context.benchmark_comparison}</p>
          </div>
        )}
        
        {context.trend_analysis && (
          <div>
            <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-1">Trend Analysis</span>
            <p className="text-sm font-light">{context.trend_analysis}</p>
          </div>
        )}
        
        {context.action_implications && (
          <div>
            <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-1">Action Implications</span>
            <p className="text-sm font-light">{context.action_implications}</p>
          </div>
        )}
        
        {context.risk_factors && context.risk_factors.length > 0 && (
          <div className="col-span-full">
            <span className="text-micro uppercase tracking-wide text-muted-foreground block mb-2">Risk Factors</span>
            <div className="flex flex-wrap gap-2">
              {context.risk_factors.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm bg-secondary/50 px-3 py-2 border-l-2 border-foreground/30">
                  <AlertTriangle className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="font-light">{risk}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function UnitEconomicsPanel({ data }: UnitEconomicsPanelProps) {
  const unitEcon = data.unit_economics;
  const m = data.base_metrics;
  
  if (!unitEcon) return null;
  
  // Calculate all KPIs from base_metrics using kpi-calculations.ts
  const cacKPI = calcCAC(m);
  const ltvKPI = calcLTV(m);
  const ltvCacKPI = calcLTVCAC(m);
  const paybackKPI = calcPaybackPeriod(m);

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-4 h-4" />
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            Unit Economics
          </h2>
          <span className="text-micro text-muted-foreground ml-auto">
            Calculated via: kpi-calculations.ts
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <MetricCard 
            icon={DollarSign} 
            label="Customer Acquisition Cost" 
            kpi={cacKPI}
            subtext="Cost to acquire one customer"
          />
          <MetricCard 
            icon={Users} 
            label="Lifetime Value" 
            kpi={ltvKPI}
            subtext="Revenue per customer lifetime"
          />
          <LtvCacGauge ratio={ltvCacKPI.value} kpi={ltvCacKPI} />
          <MetricCard 
            icon={Clock} 
            label="Payback Period" 
            kpi={paybackKPI}
            subtext="Months to recover CAC"
          />
        </div>

        {unitEcon.investor_context && (
          <InvestorContextCard context={unitEcon.investor_context} />
        )}
      </div>
    </section>
  );
}
