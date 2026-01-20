import { Metric } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";
import { ExternalLink, FileText, Link2 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TieOutViewProps {
  metric: Metric;
  label: string;
}

export function TieOutView({ metric, label }: TieOutViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!metric) return null;
  
  const hasSource = metric.source_reference?.excerpt || metric.source;
  
  if (!hasSource) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors">
          <Link2 className="w-3 h-3" />
          Tie-Out
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">
            {label}: {metric.formatted ?? "—"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Source verification
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <DirectSourceView metric={metric} />

          {metric.definition && (
            <div className="border border-border p-4 bg-secondary/30">
              <h4 className="text-micro uppercase tracking-ultra-wide text-muted-foreground mb-3">
                Metric Definition
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {metric.definition.period && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Period</span>
                    <span>{metric.definition.period}</span>
                  </div>
                )}
                {metric.definition.basis && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Basis</span>
                    <span>{metric.definition.basis}</span>
                  </div>
                )}
                {metric.definition.currency && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Currency</span>
                    <span>{metric.definition.currency}</span>
                  </div>
                )}
                {metric.definition.unit && (
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase">Unit</span>
                    <span>{metric.definition.unit}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground border-t border-border pt-4">
            <span>Last Refresh: {metric.last_updated ? new Date(metric.last_updated).toLocaleString() : "Unknown"}</span>
            <span className={cn(
              "px-2 py-0.5 text-[10px] uppercase tracking-wide",
              metric.tie_out_status === "final" ? "bg-foreground text-background" :
              metric.tie_out_status === "provisional" ? "bg-muted-foreground/20 text-muted-foreground" :
              "bg-foreground/20 text-foreground border border-foreground"
            )}>
              {metric.tie_out_status}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DirectSourceView({ metric }: { metric: Metric }) {
  if (!metric) return null;
  const ref = metric.source_reference;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-4 h-4" />
        <h4 className="text-micro uppercase tracking-ultra-wide text-muted-foreground">
          Source
        </h4>
      </div>

      <div className="border border-border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-medium">{metric.source ?? "Unknown"}</span>
          {ref?.url && (
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-3 h-3" />
              View Source
            </a>
          )}
        </div>

        {ref?.document_type && (
          <div className="text-sm">
            <span className="text-muted-foreground">Type: </span>
            <span className="font-mono">{ref.document_type}</span>
          </div>
        )}

        {ref?.excerpt && (
          <div className="text-sm border-l-2 border-foreground pl-3 italic">
            "{ref.excerpt}"
          </div>
        )}

        {ref?.accessed_at && (
          <div className="text-[10px] text-muted-foreground">
            Accessed: {new Date(ref.accessed_at).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
}