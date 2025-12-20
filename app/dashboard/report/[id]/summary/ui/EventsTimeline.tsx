import { Event } from "@/lib/seo-schema";
import { cn } from "@/lib/utils";
import { EmptySection } from "./EmptySection";
import {
  FileText,
  TrendingUp,
  Newspaper,
  Users,
  BarChart3,
  Building,
  ExternalLink,
} from "lucide-react";
interface EventsTimelineProps {
  events: Event[];
}

const eventTypeConfig: Record<Event["type"], { icon: typeof FileText; label: string }> = {
  earnings: { icon: TrendingUp, label: "Earnings" },
  filing: { icon: FileText, label: "Filing" },
  guidance: { icon: BarChart3, label: "Guidance" },
  corporate_action: { icon: Building, label: "Corp Action" },
  news: { icon: Newspaper, label: "News" },
  analyst_update: { icon: Users, label: "Analyst" },
};

const impactStyles: Record<Event["impact"], string> = {
  positive: "border-l-foreground",
  negative: "border-l-muted-foreground",
  neutral: "border-l-border",
};

export function EventsTimeline({ events }: EventsTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <section className="py-8 border-b border-border animate-fade-in">
      <div className="px-6">
        <h2 className="text-micro uppercase tracking-ultra-wide text-muted-foreground font-sans mb-6">
          Events & Filings Timeline
        </h2>

        {events.length === 0 ? (
          <EmptySection
            title="Events & Filings"
            type="pending"
            reason="No material events have been identified yet. This could mean: no recent earnings releases, filings, or corporate actions have been published, or event data sources are still being processed."
            impact="Without event context, you may miss catalysts that could affect near-term price action or fundamentals. Consider whether recent newsflow is material to your thesis."
            suggestion="Monitor SEC EDGAR and company IR for upcoming filings. Check earnings calendar for scheduled releases."
          />
        ) : (
          <div className="space-y-0">
            {sortedEvents.map((event, index) => {
              const config = eventTypeConfig[event.type];
              const Icon = config?.icon || FileText;

              return (
                <div
                  key={event.id}
                  className={cn(
                    "group relative pl-6 py-4 border-l-2 transition-all duration-150 hover:bg-secondary/30",
                    impactStyles[event.impact],
                    index !== sortedEvents.length - 1 && "border-b border-border"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Date */}
                  <div className="absolute left-6 top-4 flex items-center gap-3">
                    <span className="text-micro font-mono text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] uppercase tracking-ultra-wide font-sans border border-border">
                      {config?.label || event.type}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-serif text-lg font-medium mb-1">
                          {event.title}
                        </h4>
                        <p className="text-sm text-muted-foreground font-light leading-relaxed">
                          {event.description}
                        </p>
                      </div>
                      {event.source_url && (
                        <a
                          href={event.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 text-micro uppercase tracking-wide text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                        >
                          Source
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
