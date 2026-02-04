import { Search, Filter } from "lucide-react";
import ArticleCard from "./ArticleCard";
import Pagination from "./Pagination";
import { useArticles } from "../hook/useArticles";

export default function ArticlesContent() {
  const {
    articles,
    loading,
    error,
    page,
    sort,
    searchQuery,
    totalPages,
    setPage,
    setSort,
    setSearchQuery,
  } = useArticles();

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <button
            onClick={() => setSort(sort === "desc" ? "asc" : "desc")}
            className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 hover:border-slate-600 transition-colors"
          >
            <Filter className="w-5 h-5" />
            Trading Sentiment
          </button>
        </div>

        {/* Articles List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400">Loading articles...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : !articles || articles.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400">No articles found</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} {...article} />
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                loading={loading}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
