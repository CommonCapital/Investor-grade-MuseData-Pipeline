import { TimeHorizon, TIME_HORIZONS, HORIZON_LABELS } from "@/lib/time-series-data";
import { cn } from "@/lib/utils";

interface TimeHorizonSelectorProps {
  current: TimeHorizon;
  onChange: (horizon: TimeHorizon) => void;
  disabled?: boolean;
}

export function TimeHorizonSelector({ 
  current, 
  onChange, 
  disabled 
}: TimeHorizonSelectorProps) {
  return (
    <div className="flex items-center border border-foreground">
      {TIME_HORIZONS.map((horizon) => (
        <button
          key={horizon}
          onClick={() => onChange(horizon)}
          disabled={disabled}
          className={cn(
            "px-4 py-2 text-micro uppercase tracking-ultra-wide font-mono transition-all duration-150",
            "border-r border-foreground last:border-r-0",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            current === horizon
              ? "bg-foreground text-background"
              : "bg-transparent text-foreground hover:bg-foreground/5"
          )}
        >
          {horizon}
        </button>
      ))}
    </div>
  );
}

// Compact version for inline use
export function TimeHorizonTabs({ 
  current, 
  onChange,
  className,
}: TimeHorizonSelectorProps & { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {TIME_HORIZONS.map((horizon) => (
        <button
          key={horizon}
          onClick={() => onChange(horizon)}
          className={cn(
            "px-3 py-1.5 text-micro font-mono transition-all duration-150",
            current === horizon
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {horizon}
        </button>
      ))}
    </div>
  );
}
