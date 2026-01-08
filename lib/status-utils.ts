import {
  BarChart3,
  CheckCircle,
  Clock,
  HardDriveDownload,
  XCircle,
} from "lucide-react";

export function getSpinnerColor(status: string): string {
  const statusConfig = {
    pending: "text-yellow-600 dark:text-yellow-400",

    running: "text-blue-600 dark:text-blue-400", // legacy
    scraping: "text-blue-600 dark:text-blue-400",
    scraped: "text-cyan-600 dark:text-cyan-400",

    analyzing: "text-purple-600 dark:text-purple-400",
    merging: "text-indigo-600 dark:text-indigo-400",

    completed: "text-green-600 dark:text-green-400",
    failed: "text-red-600 dark:text-red-400",
  };

  return (
    statusConfig[status as keyof typeof statusConfig] ||
    "text-muted-foreground"
  );
}

export function getProgressPercentage(status: string | undefined): string {
  const progressMap = {
    pending: "0%",

    running: "20%", // legacy
    scraping: "20%",
    scraped: "40%",

    analyzing: "70%",
    merging: "90%",

    completed: "100%",
    failed: "Error",
  };

  return progressMap[status as keyof typeof progressMap] || "0%";
}

export function getProgressBarStyle(status: string | undefined): string {
  const styleMap = {
    pending: "w-0 bg-yellow-500",

    running: "w-1/5 bg-blue-500", // legacy
    scraping: "w-1/5 bg-blue-500",
    scraped: "w-2/5 bg-cyan-500",

    analyzing: "w-3/4 bg-purple-500",
    merging: "w-[90%] bg-indigo-500",

    completed: "w-full bg-green-500",
    failed: "w-full bg-red-500",
  };

  return styleMap[status as keyof typeof styleMap] || "w-0 bg-gray-500";
}

export function getReportTitle(status: string | undefined): string {
  switch (status) {
    case "completed":
      return "Report Ready!";
    case "failed":
      return "Report Failed";
    default:
      return "Generating Report";
  }
}

export function getStatusMessage(status: string | undefined): string {
  switch (status) {
    case "pending":
      return "Your report is queued and will start shortly.";

    case "running": // legacy
    case "scraping":
      return "We’re scraping data from search engines.";

    case "scraped":
      return "Data collection completed. Preparing analysis.";

    case "analyzing":
      return "AI models are analyzing the data and generating insights.";

    case "merging":
      return "Finalizing results and merging AI outputs.";

    case "completed":
      return "Your report is ready! You can now view and download it.";

    case "failed":
      return "There was an error processing your report. Please try again.";

    default:
      return "Unknown status";
  }
}
export function getStatusConfig(status: string | undefined) {
  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Pending",
      variant: "secondary" as const,
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800 dark:hover:bg-yellow-900/30",
    },

    running: {
      icon: HardDriveDownload,
      label: "Scraping",
      variant: "secondary" as const,
      className:
        "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/30",
    },
    scraping: {
      icon: HardDriveDownload,
      label: "Scraping",
      variant: "secondary" as const,
      className:
        "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900/30",
    },
    scraped: {
      icon: HardDriveDownload,
      label: "Scraped",
      variant: "secondary" as const,
      className:
        "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800 dark:hover:bg-cyan-900/30",
    },

    analyzing: {
      icon: BarChart3,
      label: "Analyzing",
      variant: "secondary" as const,
      className:
        "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900/30",
    },
    merging: {
      icon: BarChart3,
      label: "Finalizing",
      variant: "secondary" as const,
      className:
        "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-900/30",
    },

    completed: {
      icon: CheckCircle,
      label: "Completed",
      variant: "default" as const,
      className:
        "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800 dark:hover:bg-green-900/30",
    },

    failed: {
      icon: XCircle,
      label: "Failed",
      variant: "destructive" as const,
      className:
        "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900/30",
    },
  };

  // ADD THIS RETURN STATEMENT AND DEFAULT FALLBACK:
  return (
    statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  );
}