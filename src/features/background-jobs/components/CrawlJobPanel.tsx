import { Play, Square, Activity } from "lucide-react";
import { useCrawlJob } from "../hook/useCrawlJob";

export default function CrawlJobPanel() {
  const { isRunning, isLoading, error, startJob, stopJob } = useCrawlJob();

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-white text-xl font-bold">Article Crawl Job</h2>
          <p className="text-slate-400 text-sm mt-1">
            Manage background crawl tasks
          </p>
        </div>
        <Activity className="w-8 h-8 text-slate-400" />
      </div>

      {/* Status */}
      <div className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Current Status</p>
            <p className="text-white text-lg font-semibold mt-1">
              {isRunning ? (
                <span className="text-green-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Running
                </span>
              ) : (
                <span className="text-gray-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Stopped
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={startJob}
          disabled={isRunning || isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            isRunning || isLoading
              ? "bg-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
          }`}
        >
          <Play className="w-4 h-4" />
          Start Crawl
        </button>

        <button
          onClick={stopJob}
          disabled={!isRunning || isLoading}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
            !isRunning || isLoading
              ? "bg-slate-700 text-slate-500 cursor-not-allowed"
              : "bg-red-600 text-white hover:bg-red-700 active:scale-95"
          }`}
        >
          <Square className="w-4 h-4" />
          Stop Crawl
        </button>
      </div>

      <p className="text-slate-400 text-xs mt-4">
        {isLoading ? "Processing..." : "Click Start to begin crawling articles"}
      </p>
    </div>
  );
}
