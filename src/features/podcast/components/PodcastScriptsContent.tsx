import { Search, Plus } from "lucide-react";
import PodcastStatsCard from "./PodcastStatsCard";
import PodcastScriptCard from "./PodcastScriptCard";

export default function PodcastScriptsContent() {
  const stats = [
    {
      title: "Total Podcasts",
      value: "3",
      change: "",
    },
    {
      title: "Total Duration",
      value: "12",
      change: "m",
    },
    {
      title: "Avg. Duration",
      value: "4",
      change: "m",
    },
    {
      title: "This Week",
      value: "+3",
      change: "",
      isHighlight: true,
    },
  ];

  return (
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-3xl font-bold">Podcast Scripts</h1>
            <p className="text-slate-400 mt-1">
              Manage and edit AI-generated podcast scripts
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <PodcastStatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Search */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search podcast scripts..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Podcast Script Card */}
        <PodcastScriptCard />
      </div>
    </main>
  );
}
