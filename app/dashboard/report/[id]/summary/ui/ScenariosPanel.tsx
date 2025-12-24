import { Scenarios, SingleScenario } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EmptySection } from "./EmptySection";

interface ScenariosPanelProps {
  scenarios?: Scenarios | null;
}

type ScenarioName = "base" | "downside" | "upside";

export function ScenariosPanel({ scenarios }: ScenariosPanelProps) {
  const [activeScenario, setActiveScenario] = useState<ScenarioName>("base");

  const scenarioLabels: Record<ScenarioName, string> = {
    base: "Base Case",
    downside: "Downside",
    upside: "Upside",
  };

  // Handle empty scenarios
  if (!scenarios) {
    return (
      <section className="py-8 border-b border-border animate-fade-in">
        <div className="px-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-6">
            Scenario Analysis
          </h2>
          <EmptySection
            title="Scenario Analysis"
            type="unavailable"
            reason="No scenario models have been constructed. Without scenarios, you cannot stress-test the investment thesis against different market conditions or assumptions."
            impact="Single-point estimates create false precision. Consider what happens if growth is 50% lower or multiples compress 2-3 turns."
            suggestion="Build Base/Downside/Upside cases with explicit probability weights and assumption deltas."
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
            Scenario Analysis
          </h2>
          <EmptySection
            title="Scenario Analysis"
            type="unavailable"
            reason="No scenario data available."
            impact="Cannot stress-test thesis."
            suggestion="Build scenarios with explicit driver deltas."
          />
        </div>
      </section>
    );
  }

  const current = scenarios[activeScenario] || availableScenarios[0]?.scenario;
  
  if (!current) return null;

  const valuations = availableScenarios
    .filter(s => s.scenario?.outputs?.valuation?.value != null)
    .map((s) => s?.scenario?.outputs?.valuation?.value as number);
  const minVal = valuations.length > 0 ? Math.min(...valuations) : 0;
  const maxVal = valuations.length > 0 ? Math.max(...valuations) : 0;
  const range = maxVal - minVal;

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans">
            Scenario Analysis
          </h2>

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

        {/* Valuation range visualization */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2 text-micro text-muted-foreground">
            <span>Valuation Range</span>
            <span className="font-mono">
              {scenarios.downside?.outputs?.valuation?.formatted || "N/A"} —{" "}
              {scenarios.upside?.outputs?.valuation?.formatted || "N/A"}
            </span>
          </div>
          <div className="relative h-8 bg-secondary border border-border">
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
                    left: `${Math.max(0, position - 8)}%`,
                    width: "16%",
                  }}
                >
                  <span className="text-micro font-mono uppercase">
                    {scenario?.outputs?.valuation?.formatted || "N/A"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active scenario details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assumptions */}
          <div>
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 border-b border-border pb-2">
              Assumptions
            </h3>
            <div className="space-y-3">
              {(current?.assumptions || []).map((assumption, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between py-2 border-b border-border/50"
                >
                  <span className="text-sm font-medium">{assumption?.key || ""}</span>
                  <span className="font-mono text-sm bg-secondary px-2 py-1">
                    {assumption?.value || ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Outputs */}
          <div>
            <h3 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-4 border-b border-border pb-2">
              Scenario Outputs
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
              <div className="bg-card p-4 col-span-2">
                <span className="text-micro uppercase tracking-ultra-wide text-muted-foreground block mb-1">
                  Implied Valuation
                </span>
                <span className="font-mono text-3xl">{current?.outputs?.valuation?.formatted || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}