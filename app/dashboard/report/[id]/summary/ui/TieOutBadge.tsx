import { TieOutStatus } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";

interface TieOutBadgeProps {
  status: TieOutStatus;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  final: {
    label: "FINAL",
    className: "status-final",
  },
  provisional: {
    label: "PROVISIONAL",
    className: "status-provisional",
  },
  flagged: {
    label: "FLAGGED",
    className: "status-flagged",
  },
};

export function TieOutBadge({ status, className }: TieOutBadgeProps) {
 const config =
  status 
    ? statusConfig[status] ?? statusConfig.provisional
    : statusConfig.provisional;


  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase tracking-ultra-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
