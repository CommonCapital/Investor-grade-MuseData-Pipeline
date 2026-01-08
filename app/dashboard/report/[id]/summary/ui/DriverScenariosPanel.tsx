import { Scenarios, SingleScenario, ScenarioDriver, BaseMetrics } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";
import { EmptySection } from "./EmptySection";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { calcScenarioOutputs, parseDriverPercent, formatCurrency, CalculatedKPI } from "@/lib/kpi-calculations";

interface DriverScenariosPanelProps {
  scenarios?: Scenarios | null;
  baseMetrics?: BaseMetrics | null;
}

type ScenarioName = "base" | "downside" | "upside";

const scenarioLabels: Record<ScenarioName, string> = {
  base: "Base Case",
  downside: "Downside",
  upside: "Upside",
};

// Default valuation parameters by scenario type
const defaultScenarioParams: Record<ScenarioName, { exitMultiple: number; wacc: number }> = {
  base: { exitMultiple: 12.0, wacc: 0.082 },
  downside: { exitMultiple: 10.5, wacc: 0.09 },
  upside: { exitMultiple: 14.0, wacc: 0.075 },
};

export function DriverScenariosPanel({ scenarios, baseMetrics }: DriverScenariosPanelProps) {
  const [activeScenario, setActiveScenario] = useState<ScenarioName>("base");
  const [showDrivers, setShowDrivers] = useState(true);

  // Calculate scenario outputs from base_metrics + drivers
  const calculatedOutputs = useMemo(() => {
  if (!baseMetrics?.revenue_ttm || !baseMetrics?.ebitda_ttm) return null;
  
  const results: Record<ScenarioName, ReturnType<typeof calcScenarioOutputs> | null> = {
    base: null,
    downside: null,
    upside: null,
  };
  
  const scenarioNames: ScenarioName[] = ["base", "downside", "upside"];
  
  for (const name of scenarioNames) {
    const scenario = scenarios?.[name];
    if (!scenario) continue;
    
    // ✅ FIXED: Try assumptions first, then drivers
    const growthSource = scenario.assumptions?.find(a => 
      a?.key?.toLowerCase().includes("revenue") ||
      a?.key?.toLowerCase().includes("growth")
    ) || scenario.drivers?.find(d => 
      d?.name?.toLowerCase().includes("revenue") ||
      d?.name?.toLowerCase().includes("growth")
    );

    const marginSource = scenario.assumptions?.find(a => 
      a?.key?.toLowerCase().includes("margin") ||
      a?.key?.toLowerCase().includes("ebitda")
    ) || scenario.drivers?.find(d => 
      d?.name?.toLowerCase().includes("margin") ||
      d?.name?.toLowerCase().includes("ebitda")
    );
    
    const growthRate = parseDriverPercent(growthSource?.value);
    const ebitdaMargin = parseDriverPercent(marginSource?.value);
    
    // ✅ Debug logging
   
    
    if (growthRate === null || ebitdaMargin === null) {
      console.warn(`${name} scenario: Missing growth or margin data`, {
        growthRate,
        ebitdaMargin,
      });
      continue;
    }
    
    const params = defaultScenarioParams[name];
    
    // Build source description
    const growthSourceDesc = growthSource?.source === "fact" 
      ? growthSource?.source_reference?.document_type || "Source-linked"
      : "Analyst judgment";
    const marginSourceDesc = marginSource?.source === "fact"
      ? marginSource?.source_reference?.document_type || "Source-linked"
      : "Analyst judgment";
    
    results[name] = calcScenarioOutputs({
      revenueTTM: baseMetrics.revenue_ttm,
      ebitdaTTM: baseMetrics.ebitda_ttm,
      growthRate,
      ebitdaMargin,
      exitMultiple: params.exitMultiple,
      wacc: params.wacc,
      growthRateSource: growthSourceDesc,
      growthRateSourceRef: growthSource?.source_reference,
      ebitdaMarginSource: marginSourceDesc,
      ebitdaMarginSourceRef: marginSource?.source_reference,
    });
  }
  
  return results;
}, [scenarios, baseMetrics]);

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
  const currentCalc = calculatedOutputs?.[activeScenario];
  
  if (!current) {
    return null;
  }

  // Extract valuation values from CALCULATED outputs (not mock data)
  const getCalculatedValuation = (name: ScenarioName): number => {
    return calculatedOutputs?.[name]?.valuation?.value || 0;
  };
  
  const baseVal = getCalculatedValuation("base");
  const downsideVal = getCalculatedValuation("downside");
  const upsideVal = getCalculatedValuation("upside");
  
  // Calculate min/max range across all scenarios with valid valuations
  const validValuations = [baseVal, downsideVal, upsideVal].filter(v => v > 0);
  const minVal = validValuations.length > 0 ? Math.min(...validValuations) : 0;
  const maxVal = validValuations.length > 0 ? Math.max(...validValuations) : 0;
  const range = maxVal - minVal;

  // Calculate probability-weighted expected value
  // EV = (Base × w_base) + (Downside × w_downside) + (Upside × w_upside)
  const baseProb = scenarios.base?.probability || 0;
  const downsideProb = scenarios.downside?.probability || 0;
  const upsideProb = scenarios.upside?.probability || 0;
  
  const expectedValue = (baseVal * baseProb) + (downsideVal * downsideProb) + (upsideVal * upsideProb);
  
  // Get TTM values from base metrics for display
  const revenueTTM = baseMetrics?.revenue_ttm || 0;
  const ebitdaTTM = baseMetrics?.ebitda_ttm || 0;

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
                  {minVal > 0 ? `$${(minVal / 1e9).toFixed(1)}B` : "N/A"} — {maxVal > 0 ? `$${(maxVal / 1e9).toFixed(1)}B` : "N/A"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-micro text-muted-foreground block">Expected Value</span>
                <span className="font-mono text-xl">
                  {expectedValue > 0 ? `$${(expectedValue / 1e9).toFixed(1)}B` : "N/A"}
                </span>
              </div>
            </div>
          </div>
          
          {/* Formula tooltip */}
          <div className="text-[10px] text-muted-foreground mb-3">
            EV = (Base × {(baseProb * 100).toFixed(0)}%) + (Downside × {(downsideProb * 100).toFixed(0)}%) + (Upside × {(upsideProb * 100).toFixed(0)}%)
          </div>
          
          {/* Visual range */}
          <div className="relative h-10 bg-secondary border border-border">
            {availableScenarios.map(({ name }) => {
              const val = calculatedOutputs?.[name]?.valuation?.value || 0;
              const position = range > 0 ? ((val - minVal) / range) * 100 : 50;
              const formatted = calculatedOutputs?.[name]?.valuation?.formatted || "N/A";

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
                      {formatted}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver Breakdown Table */}
        {showDrivers && (() => {
          // Build merged drivers from all scenarios
          const baseDrivers = scenarios.base?.drivers || [];
          const downsideDrivers = scenarios.downside?.drivers || [];
          const upsideDrivers = scenarios.upside?.drivers || [];
          
          // Create a map of driver names across all scenarios
          const driverNames = new Set<string>();
          baseDrivers.forEach(d => d?.name && driverNames.add(d.name));
          downsideDrivers.forEach(d => d?.name && driverNames.add(d.name));
          upsideDrivers.forEach(d => d?.name && driverNames.add(d.name));
          
          const getDriverValue = (drivers: typeof baseDrivers, name: string) => {
            const driver = drivers.find(d => d?.name === name);
            return driver?.value || "N/A";
          };
          
          const getDriverMeta = (drivers: typeof baseDrivers, name: string) => {
            const driver = drivers.find(d => d?.name === name);
            return {
              category: driver?.category || "",
              source: driver?.source || "",
            };
          };
          
          const driverNameList = Array.from(driverNames);
          
          if (driverNameList.length === 0) {
            return (
              <div className="mb-8 p-4 border border-border bg-secondary/20">
                <p className="text-sm text-muted-foreground">No driver data available in scenarios.</p>
              </div>
            );
          }
          
          return (
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
              
              {driverNameList.map((driverName, i) => {
                const getDriverFull = (drivers: typeof baseDrivers, name: string) => {
                  return drivers.find(d => d?.name === name);
                };
                
                const baseFull = getDriverFull(baseDrivers, driverName);
                const downsideFull = getDriverFull(downsideDrivers, driverName);
                const upsideFull = getDriverFull(upsideDrivers, driverName);
                const meta = baseFull || downsideFull || upsideFull;
                
                const downsideValue = downsideFull?.value || "N/A";
                const baseValue = baseFull?.value || "N/A";
                const upsideValue = upsideFull?.value || "N/A";
                const source = meta?.source || "";
                const category = meta?.category || "";
                
                // Get source reference for tooltip
                const sourceRef = baseFull?.source_reference || downsideFull?.source_reference || upsideFull?.source_reference;
                
                return (
                  <div key={i} className="grid grid-cols-5 gap-px bg-border">
                    <div className="bg-card p-3 flex items-center gap-2">
                      <span className="text-sm">{driverName}</span>
                      {category && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-secondary text-muted-foreground uppercase">
                          {category}
                        </span>
                      )}
                    </div>
                    <div className={cn(
                      "bg-card p-3 text-center font-mono text-sm",
                      activeScenario === "downside" ? "bg-foreground/5" : ""
                    )}>
                      <span className="text-muted-foreground">{downsideValue}</span>
                    </div>
                    <div className={cn(
                      "bg-card p-3 text-center font-mono text-sm font-medium",
                      activeScenario === "base" ? "bg-foreground/5" : ""
                    )}>
                      {baseValue}
                    </div>
                    <div className={cn(
                      "bg-card p-3 text-center font-mono text-sm",
                      activeScenario === "upside" ? "bg-foreground/5" : ""
                    )}>
                      <span className="text-muted-foreground">{upsideValue}</span>
                    </div>
                    <div className="bg-card p-3 text-center">
                      {source && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className={cn(
                              "text-[10px] px-1.5 py-0.5 uppercase tracking-wide cursor-help",
                              source === "fact" 
                                ? "bg-foreground text-background" 
                                : "bg-foreground/20 text-foreground border border-dashed border-foreground/30"
                            )}>
                              {source}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <div className="text-xs space-y-1">
                              <p className="font-medium">
                                {source === "fact" 
                                  ? "Source-linked assumption" 
                                  : "Judgment call - analyst estimate"}
                              </p>
                              {sourceRef?.excerpt && (
                                <p className="text-muted-foreground italic">"{sourceRef.excerpt}"</p>
                              )}
                              {sourceRef?.document_type && (
                                <p className="text-muted-foreground">Source: {sourceRef.document_type}</p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}

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

          {/* Outputs with Traceability - CALCULATED, not mock */}
          <div>
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 border-b border-border pb-2">
              {scenarioLabels[activeScenario]} Outputs
              <span className="ml-2 text-[10px] bg-secondary px-2 py-0.5">FY25E (Annual)</span>
            </h3>
            <div className="bg-secondary/30 border border-border p-3 mb-4">
              <p className="text-[10px] text-muted-foreground">
                <strong>Calculated from schema:</strong> Outputs derived from base_metrics.revenue_ttm ({formatCurrency(revenueTTM)}) 
                and base_metrics.ebitda_ttm ({formatCurrency(ebitdaTTM)}) × scenario drivers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border">
              {/* Revenue - CALCULATED */}
              <div className="bg-card p-4">
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
                  Revenue
                </span>
                <span className="font-mono text-xl">{currentCalc?.revenue?.formatted || "N/A"}</span>
                {currentCalc?.revenue && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-[10px] text-muted-foreground mt-1 cursor-help underline decoration-dashed">
                        {currentCalc.revenue.formula}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
                      <div className="text-xs space-y-2">
                        <p className="font-medium">Calculation Breakdown:</p>
                        {currentCalc.revenue.inputs?.map((input, i) => (
                          <div key={i} className="border-b border-border pb-2">
                            <div className="flex justify-between gap-4">
                              <span className="font-medium">{input.name}:</span>
                              <span className="font-mono">{input.formatted}</span>
                            </div>
                            {input.source && (
                              <p className="text-muted-foreground text-[10px] mt-1">
                                Source: {input.source}
                              </p>
                            )}
                            {input.sourceReference?.excerpt && (
                              <p className="text-muted-foreground text-[10px] mt-1 italic">
                                &quot;{input.sourceReference.excerpt}&quot;
                              </p>
                            )}
                            {input.sourceReference?.url && (
                              <a 
                                href={input.sourceReference.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] text-primary underline mt-1 block"
                              >
                                View source →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              {/* EBITDA - CALCULATED */}
              <div className="bg-card p-4">
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
                  EBITDA
                </span>
                <span className="font-mono text-xl">{currentCalc?.ebitda?.formatted || "N/A"}</span>
                {currentCalc?.ebitda && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-[10px] text-muted-foreground mt-1 cursor-help underline decoration-dashed">
                        {currentCalc.ebitda.formula}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-md">
                      <div className="text-xs space-y-2">
                        <p className="font-medium">Calculation Breakdown:</p>
                        {currentCalc.ebitda.inputs?.map((input, i) => (
                          <div key={i} className="border-b border-border pb-2">
                            <div className="flex justify-between gap-4">
                              <span className="font-medium">{input.name}:</span>
                              <span className="font-mono">{input.formatted}</span>
                            </div>
                            {input.source && (
                              <p className="text-muted-foreground text-[10px] mt-1">
                                Source: {input.source}
                              </p>
                            )}
                            {input.sourceReference?.excerpt && (
                              <p className="text-muted-foreground text-[10px] mt-1 italic">
                                &quot;{input.sourceReference.excerpt}&quot;
                              </p>
                            )}
                            {input.sourceReference?.url && (
                              <a 
                                href={input.sourceReference.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[10px] text-primary underline mt-1 block"
                              >
                                View source →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              {/* Implied Valuation - CALCULATED */}
              <div className="bg-card p-4 col-span-2">
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
                  Implied Valuation
                </span>
                <span className="font-mono text-2xl">{currentCalc?.valuation?.formatted || "N/A"}</span>
                {currentCalc?.valuation && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <p className="text-[10px] text-muted-foreground mt-1 cursor-help underline decoration-dashed">
                        {currentCalc.valuation.formula}
                      </p>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <div className="text-xs space-y-1">
                        <p className="font-medium mb-2">Calculated Inputs:</p>
                        {currentCalc.valuation.inputs?.map((input, i) => (
                          <div key={i} className="flex justify-between gap-4">
                            <span>{input.name}:</span>
                            <span className="font-mono">{input.formatted}</span>
                          </div>
                        ))}
                        <div className="border-t border-border pt-2 mt-2">
                          <p className="text-muted-foreground">Valuation model: DCF approximation using exit multiple</p>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}