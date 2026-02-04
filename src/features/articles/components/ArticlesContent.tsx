import { Search, Filter } from "lucide-react";
import ArticleCard from "./ArticleCard";

export default function ArticlesContent() {
  const articles = [
    {
      id: 1,
      title: "FPT Corporation Reports Strong Q4 Earnings",
      source: "VnExpress",
      ticker: "FPT",
      date: "2 days ago",
      sentiment: "Bullish" as const,
      excerpt: "FPT announced robust financial results...",
    },
    {
      id: 2,
      title: "Vinamilk Expands International Operations",
      source: "CafeF",
      ticker: "VNM",
      date: "3 days ago",
      sentiment: "Bullish" as const,
      excerpt: "Vinamilk plans to expand its global presence...",
    },
    {
      id: 3,
      title: "Banking Sector Shows Resilience in Market Downturn",
      source: "Reuters",
      ticker: "MBB",
      date: "1 week ago",
      sentiment: "Neutral" as const,
      excerpt: "Banks maintain stability despite market challenges...",
    },
  ];

  return (
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-8 py-6">
        <h1 className="text-white text-3xl font-bold">Articles & Mentions</h1>
        <p className="text-slate-400 mt-1">
          Track and monitor AI-analyzed research and news mentions
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 hover:border-slate-600 transition-colors">
            <Filter className="w-5 h-5" />
            Archive
          </button>
          <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 hover:border-slate-600 transition-colors">
            <Filter className="w-5 h-5" />
            Sector
          </button>
          <button className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 hover:border-slate-600 transition-colors">
            <Filter className="w-5 h-5" />
            Trading Sentiment
          </button>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} {...article} />
          ))}
        </div>
      </div>
    </main>
  );
}
