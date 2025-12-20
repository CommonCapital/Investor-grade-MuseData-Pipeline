'use client';
import { useState } from "react";
import { InvestorDashboard as InvestorDashboardType } from "@/lib/seo-schema";
import { useTimeHorizon } from "@/hooks/use-time-horizon";
import { RunHeader } from "./ui/RunHeader";
import { ExecutiveSummary } from "./ui/ExecutiveSummary";
import { TimeSeriesSection } from "./ui/TimeSeriesSection";
import { AIInsightsPanel } from "./ui/AIInsightsPanel";
import { FinancialsGrid } from "./ui/FinancialsGrid";
import { EventsTimeline } from "./ui/EventsTimeline";
import { ScenariosPanel } from "./ui/ScenariosPanel";
import { RisksPanel } from "./ui/RisksPanel";
import { DataLineage } from "./ui/DataLineage";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2Icon, LoaderIcon } from "lucide-react";
import { InvestorDashboard } from "./ui/InvestorDashboard";



 function Page() {
  const {id} = useParams<{id: string}>();
  const {user} = useUser();
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const job = useQuery(api.scrapingJobs.getJobBySnapshotId, {
    snapshotId: id || "skip",
    userId: user?.id || "skip"
  });
  
const data = job?.seoReport as InvestorDashboardType | any;


  if (!job || job === undefined) {
    return <Loader2Icon className="w-4 h-4 animate-spin" />;
  }

  if (!job?.seoReport) {
    return <div>No report available</div>;
  }


  return (
  <InvestorDashboard data={data} id={id} user={user}/>
  );
}
export default Page;