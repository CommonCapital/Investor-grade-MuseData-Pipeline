import { Scenarios, SingleScenario } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EmptySection } from "./EmptySection";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DriverScenariosPanelProps {
  scenarios?: Scenarios | null;
}

type ScenarioName = "base" | "downside" | "upside";

// Driver breakdown structure
interface DriverBreakdown {
  name: string;
  category: "revenue" | "margin" | "other";
  baseValue: string;
  downsideValue: string;
  upsideValue: string;
  unit: string;
  source: "fact" | "judgment";
}

// Mock driver breakdowns - would come from scenarios.drivers in full implementation
const mockDrivers: DriverBreakdown[] = [
  { name: "Units Shipped", category: "revenue", baseValue: "2.4M", downsideValue: "2.1M", upsideValue: "2.8M", unit: "units", source: "judgment" },
  { name: "ASP", category: "revenue", baseValue: "$1,420", downsideValue: "$1,350", upsideValue: "$1,480", unit: "USD", source: "fact" },
  { name: "Revenue Growth", category: "revenue", baseValue: "9.2%", downsideValue: "5.0%", upsideValue: "14.0%", unit: "%", source: "judgment" },
  { name: "Gross Margin", category: "margin", baseValue: "42.5%", downsideValue: "39.0%", upsideValue: "44.0%", unit: "%", source: "judgment" },
  { name: "EBITDA Margin", category: "margin", baseValue: "25.5%", downsideValue: "22.0%", upsideValue: "27.0%", unit: "%", source: "fact" },
  { name: "CapEx % Rev", category: "other", baseValue: "4.5%", downsideValue: "5.0%", upsideValue: "4.0%", unit: "%", source: "fact" },
  { name: "Working Capital Days", category: "other", baseValue: "45", downsideValue: "52", upsideValue: "40", unit: "days", source: "judgment" },
];

const scenarioLabels: Record<ScenarioName, string> = {
  base: "Base Case",
  downside: "Downside",
  upside: "Upside",
};

export function DriverScenariosPanel({ scenarios }: DriverScenariosPanelProps) {
  const [activeScenario, setActiveScenario] = useState<ScenarioName>("base");
  const [showDrivers, setShowDrivers] = useState(true);

  if (!scenarios) {
    return (
      <section className="py-8 border-b border-border animate-fade-in">
        <div className="px-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-6">
            Driver-Based Scenarios
          </h2>
          <EmptySection
            title="Driver-Based Scenarios"
            type="unavailable"
            reason="No driver-based scenario models have been constructed."
            impact="Cannot stress-test thesis against different assumptions."
            suggestion="Build scenarios with explicit driver deltas for revenue, margin, and capital."
          />
        </div>
      </section>
    );
  }

  const availableScenarios: Array<{ name: ScenarioName; scenario: SingleScenario }> = [];
  if (scenarios.base) availableScenarios.push({ name: "base", scenario: scenarios.base });
  if (scenarios.downside) availableScenarios.push({ name: "downside", scenario: scenarios.downside });
  if (scenarios.upside) availableScenarios.push({ name: "upside", scenario: scenarios.upside });

  if (availableScenarios.length === 0) {
    return (
      <section className="py-8 border-b border-border animate-fade-in">
        <div className="px-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-6">
            Driver-Based Scenarios
          </h2>
          <EmptySection
            title="Driver-Based Scenarios"
            type="unavailable"
            reason="No scenario data available."
            impact="Cannot stress-test thesis against different assumptions."
            suggestion="Build scenarios with explicit driver deltas for revenue, margin, and capital."
          />
        </div>
      </section>
    );
  }

  const current = scenarios[activeScenario] || availableScenarios[0]?.scenario;
  
  if (!current) {
    return null;
  }

  const valuations = availableScenarios
    .filter(s => s.scenario?.outputs?.valuation?.value != null)
    .map((s) => s.scenario?.outputs?.valuation?.value as number);
  const minVal = valuations.length > 0 ? Math.min(...valuations) : 0;
  const maxVal = valuations.length > 0 ? Math.max(...valuations) : 0;
  const range = maxVal - minVal;

  // Calculate expected value
  const expectedValue = availableScenarios.reduce((acc, s) => {
    const val = s.scenario?.outputs?.valuation?.value as number || 0;
    const prob = s.scenario?.probability || 0;
    return acc + val * prob;
  }, 0);

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
              Driver-Based Scenarios
            </h2>
            <button
              onClick={() => setShowDrivers(!showDrivers)}
              className="text-micro text-muted-foreground hover:text-foreground transition-colors"
            >
              {showDrivers ? "Hide Drivers" : "Show Drivers"}
            </button>
          </div>

          <div className="flex items-center border border-foreground">
            {availableScenarios.map(({ name, scenario }) => (
              <button
                key={name}
                onClick={() => setActiveScenario(name)}
                className={cn(
                  "px-4 py-2 text-micro uppercase tracking-ultra-wide font-sans transition-all duration-150",
                  activeScenario === name
                    ? "bg-foreground text-background"
                    : "bg-transparent text-foreground hover:bg-foreground/5"
                )}
              >
                {scenarioLabels[name]}
                <span className="ml-2 text-[10px] opacity-60">
                  {Math.round((scenario?.probability || 0) * 100)}%
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Valuation Range with Expected Value */}
        <div className="mb-8 p-4 bg-secondary/30 border border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
              Probability-Weighted Valuation
            </span>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className="text-micro text-muted-foreground block">Range</span>
                <span className="font-mono">
                  {scenarios.downside?.outputs?.valuation?.formatted || "N/A"} — {scenarios.upside?.outputs?.valuation?.formatted || "N/A"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-micro text-muted-foreground block">Expected Value</span>
                <span className="font-mono text-xl">
                  ${(expectedValue / 1e9).toFixed(1)}B
                </span>
              </div>
            </div>
          </div>
          
          {/* Visual range */}
          <div className="relative h-10 bg-secondary border border-border">
            {availableScenarios.map(({ name, scenario }) => {
              const val = (scenario?.outputs?.valuation?.value as number) || 0;
              const position = range > 0 ? ((val - minVal) / range) * 100 : 50;

              return (
                <div
                  key={name}
                  className={cn(
                    "absolute top-0 bottom-0 flex items-center justify-center transition-all duration-300",
                    name === activeScenario
                      ? "bg-foreground text-background z-10"
                      : "bg-foreground/10"
                  )}
                  style={{
                    left: `${Math.max(0, position - 10)}%`,
                    width: "20%",
                  }}
                >
                  <div className="text-center">
                    <span className="text-[10px] uppercase tracking-wide block opacity-70">
                      {scenarioLabels[name]}
                    </span>
                    <span className="text-micro font-mono">
                      {scenario?.outputs?.valuation?.formatted || "N/A"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver Breakdown Table */}
        {showDrivers && (
          <div className="mb-8 border border-border">
            <div className="grid grid-cols-5 gap-px bg-border">
              <div className="bg-secondary p-3 text-micro uppercase tracking-ultra-wide text-muted-foreground">
                Driver
              </div>
              <div className="bg-secondary p-3 text-micro uppercase tracking-ultra-wide text-muted-foreground text-center">
                Downside
              </div>
              <div className="bg-secondary p-3 text-micro uppercase tracking-ultra-wide text-muted-foreground text-center font-medium">
                Base
              </div>
              <div className="bg-secondary p-3 text-micro uppercase tracking-ultra-wide text-muted-foreground text-center">
                Upside
              </div>
              <div className="bg-secondary p-3 text-micro uppercase tracking-ultra-wide text-muted-foreground text-center">
                Source
              </div>
            </div>
            
            {mockDrivers.map((driver, i) => (
              <div key={i} className="grid grid-cols-5 gap-px bg-border">
                <div className="bg-card p-3 flex items-center gap-2">
                  <span className="text-sm">{driver.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 bg-secondary text-muted-foreground uppercase">
                    {driver.category}
                  </span>
                </div>
                <div className={cn(
                  "bg-card p-3 text-center font-mono text-sm",
                  activeScenario === "downside" ? "bg-foreground/5" : ""
                )}>
                  <span className="text-muted-foreground">{driver.downsideValue}</span>
                </div>
                <div className={cn(
                  "bg-card p-3 text-center font-mono text-sm font-medium",
                  activeScenario === "base" ? "bg-foreground/5" : ""
                )}>
                  {driver.baseValue}
                </div>
                <div className={cn(
                  "bg-card p-3 text-center font-mono text-sm",
                  activeScenario === "upside" ? "bg-foreground/5" : ""
                )}>
                  <span className="text-muted-foreground">{driver.upsideValue}</span>
                </div>
                <div className="bg-card p-3 text-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 uppercase tracking-wide cursor-help",
                        driver.source === "fact" 
                          ? "bg-foreground text-background" 
                          : "bg-foreground/20 text-foreground border border-dashed border-foreground/30"
                      )}>
                        {driver.source}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      {driver.source === "fact" 
                        ? "Source-linked assumption from filings or verified data" 
                        : "Judgment call - not source-linked"}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Scenario Outputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Current Scenario Assumptions */}
          <div>
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 border-b border-border pb-2">
              {scenarioLabels[activeScenario]} Assumptions
            </h3>
            <div className="space-y-3">
              {(current?.assumptions || []).map((assumption, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b border-border/50"
                >
                  <span className="text-sm">{assumption?.key || ""}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm bg-secondary px-2 py-1">
                      {assumption?.value || ""}
                    </span>
                    {activeScenario !== "base" && (
                      <span className="text-[10px] text-muted-foreground">
                        {activeScenario === "downside" ? (
                          <ArrowDown className="w-3 h-3 inline" />
                        ) : (
                          <ArrowUp className="w-3 h-3 inline" />
                        )}
                        vs base
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Outputs with FCF */}
          <div>
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 border-b border-border pb-2">
              {scenarioLabels[activeScenario]} Outputs
            </h3>
            <div className="grid grid-cols-2 gap-px bg-border">
              <div className="bg-card p-4">
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
                  Revenue
                </span>
                <span className="font-mono text-xl">{current?.outputs?.revenue?.formatted || "N/A"}</span>
              </div>
              <div className="bg-card p-4">
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
                  EBITDA
                </span>
                <span className="font-mono text-xl">{current?.outputs?.ebitda?.formatted || "N/A"}</span>
              </div>
              <div className="bg-card p-4">
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
                  Implied Valuation
                </span>
                <span className="font-mono text-2xl">{current?.outputs?.valuation?.formatted || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}