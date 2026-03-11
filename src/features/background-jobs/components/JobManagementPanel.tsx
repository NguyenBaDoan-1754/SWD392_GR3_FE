import { useState } from "react";
import {
  Play,
  Square,
  Network,
  Brain,
  FileText,
  Search,
  Scissors,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import backgroundJobApi from "../../../api/backgroundJob.api";

interface Job {
  name: string;
  icon: React.ReactNode;
  description: string;
  start: () => Promise<any>;
  stop: () => Promise<any>;
  getStatus: () => Promise<any>;
}

interface JobMetadata {
  isRunning: boolean;
  lastRun: string;
  processed: number;
  progress: number;
}

const STORAGE_KEY = "job_metadata";

// Get current time in "10 Mar 2026 19:30" format
const getCurrentTimestamp = () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.toLocaleString("en-US", { month: "short" });
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

const loadJobMetadata = (): Record<string, JobMetadata> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error("Error loading job metadata:", e);
  }
  return {};
};

const saveJobMetadata = (metadata: Record<string, JobMetadata>) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(metadata));
  } catch (e) {
    console.error("Error saving job metadata:", e);
  }
};

const jobs: Record<string, Job> = {
  crawlArticle: {
    name: "Crawl Article",
    icon: <Network className="w-5 h-5" />,
    description: "Web scraping and article collection",
    start: () => backgroundJobApi.startCrawlArticle(),
    stop: () => backgroundJobApi.stopCrawlArticle(),
    getStatus: () => backgroundJobApi.getCrawlArticleStatus(),
  },
  articleVector: {
    name: "Article Vector",
    icon: <Brain className="w-5 h-5" />,
    description: "Extract vector embeddings",
    start: () => backgroundJobApi.startArticleVector(),
    stop: () => backgroundJobApi.stopArticleVector(),
    getStatus: () => backgroundJobApi.getArticleVectorStatus(),
  },
  articleSaveFileMd: {
    name: "Article Save MD",
    icon: <FileText className="w-5 h-5" />,
    description: "Save articles as markdown files",
    start: () => backgroundJobApi.startArticleSaveFileMd(),
    stop: () => backgroundJobApi.stopArticleSaveFileMd(),
    getStatus: () => backgroundJobApi.getArticleSaveFileMdStatus(),
  },
  articleExtractTicker: {
    name: "Extract Ticker",
    icon: <Search className="w-5 h-5" />,
    description: "Extract stock ticker symbols",
    start: () => backgroundJobApi.startArticleExtractTicker(),
    stop: () => backgroundJobApi.stopArticleExtractTicker(),
    getStatus: () => backgroundJobApi.getArticleExtractTickerStatus(),
  },
  articleChunking: {
    name: "Article Chunking",
    icon: <Scissors className="w-5 h-5" />,
    description: "Split articles into chunks",
    start: () => backgroundJobApi.startArticleChunking(),
    stop: () => backgroundJobApi.stopArticleChunking(),
    getStatus: () => backgroundJobApi.getArticleChunkingStatus(),
  },
};

export const JobManagementPanel = () => {
  const [jobMetadata, setJobMetadata] = useState<Record<string, JobMetadata>>(
    () => {
      const stored = loadJobMetadata();
      // Initialize all jobs with default values if not in storage
      const initial: Record<string, JobMetadata> = {};
      Object.keys(jobs).forEach((jobId) => {
        initial[jobId] = stored[jobId] || {
          isRunning: false,
          lastRun: "Never",
          processed: 0,
          progress: 0,
        };
      });
      return initial;
    },
  );

  const [loadingJobs, setLoadingJobs] = useState<Record<string, boolean>>({});

  // Calculate stats
  const activeJobsCount = Object.values(jobMetadata).filter(
    (m) => m.isRunning,
  ).length;
  const stoppedJobsCount = Object.values(jobMetadata).filter(
    (m) => !m.isRunning,
  ).length;

  const startJob = async (jobId: string) => {
    const job = jobs[jobId];
    if (!job) return;

    setLoadingJobs((prev) => ({ ...prev, [jobId]: true }));

    try {
      await job.start();

      // Update metadata: set running, increment processed, update lastRun
      setJobMetadata((prev) => {
        const updated = {
          ...prev,
          [jobId]: {
            ...prev[jobId],
            isRunning: true,
            lastRun: getCurrentTimestamp(),
            processed: prev[jobId].processed + 1,
          },
        };
        saveJobMetadata(updated);
        return updated;
      });

      toast.success(`${job.name} started successfully`);
    } catch (error: any) {
      toast.error(
        `Failed to start ${job.name}: ${error?.response?.data?.message || error.message}`,
      );
    } finally {
      setLoadingJobs((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  const stopJob = async (jobId: string) => {
    const job = jobs[jobId];
    if (!job) return;

    setLoadingJobs((prev) => ({ ...prev, [jobId]: true }));

    try {
      await job.stop();

      // Update metadata: set stopped
      setJobMetadata((prev) => {
        const updated = {
          ...prev,
          [jobId]: {
            ...prev[jobId],
            isRunning: false,
          },
        };
        saveJobMetadata(updated);
        return updated;
      });

      toast.success(`${job.name} stopped successfully`);
    } catch (error: any) {
      toast.error(
        `Failed to stop ${job.name}: ${error?.response?.data?.message || error.message}`,
      );
    } finally {
      setLoadingJobs((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-6">Background Jobs</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
            <p className="text-slate-400 text-sm font-medium">Active Jobs</p>
            <p className="text-3xl font-bold text-green-400 mt-2">
              {activeJobsCount}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
            <p className="text-slate-400 text-sm font-medium">Stopped Jobs</p>
            <p className="text-3xl font-bold text-gray-300 mt-2">
              {stoppedJobsCount}
            </p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition-colors">
            <p className="text-slate-400 text-sm font-medium">Total Tasks</p>
            <p className="text-3xl font-bold text-blue-400 mt-2">
              {Object.keys(jobs).length}
            </p>
          </div>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(jobs).map(([jobId, job]) => {
          const metadata = jobMetadata[jobId] || {
            isRunning: false,
            lastRun: "Never",
            processed: 0,
            progress: 0,
          };
          const isRunning = metadata.isRunning;
          const isLoading = loadingJobs[jobId];

          return (
            <div
              key={jobId}
              className="group rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-slate-600"
            >
              {/* Header with Icon and Status Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-slate-700 rounded-lg text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                    {job.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {job.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {job.description}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <div
                  className={`ml-2 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    isRunning
                      ? "bg-green-900 text-green-200 border border-green-700"
                      : "bg-gray-900 text-gray-400 border border-gray-700"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isRunning ? "bg-green-500 animate-pulse" : "bg-gray-600"
                    }`}
                  />
                  {isRunning ? "Running" : "Stopped"}
                </div>
              </div>

              {/* Job Metadata */}
              <div className="space-y-3 mb-5 py-4 border-y border-slate-700">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Last Run</span>
                  <span className="text-white font-medium text-right">
                    {metadata.lastRun}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Processed</span>
                  <span className="text-white font-medium">
                    {metadata.processed.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress Bar (when running) */}
              {isRunning && metadata.progress > 0 && (
                <div className="mb-5">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-400">
                      Progress
                    </span>
                    <span className="text-xs font-bold text-green-400">
                      {metadata.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full transition-all duration-500 shadow-lg shadow-green-500/50"
                      style={{ width: `${metadata.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => startJob(jobId)}
                  disabled={isRunning || isLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-green-600/50"
                >
                  <Play size={16} />
                  Start
                </button>
                <button
                  onClick={() => stopJob(jobId)}
                  disabled={!isRunning || isLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:shadow-red-600/50"
                >
                  <Square size={16} />
                  Stop
                </button>
                <button
                  className="px-3 py-2.5 rounded-lg border border-slate-600 text-slate-400 hover:bg-slate-700 hover:border-slate-500 hover:text-slate-200 transition-all duration-200"
                  title="View Logs"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobManagementPanel;
