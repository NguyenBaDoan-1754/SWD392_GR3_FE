import { useState } from "react";
import { Search, Newspaper, Clock, ChevronRight, Tag } from "lucide-react";
import { useArticles } from "../hook/useArticles";
import Pagination from "./Pagination";
import ArticleModal from "./ArticleModal";
import { motion } from "motion/react";

const sentimentColor = {
  Bullish: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Bearish: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Neutral: "bg-slate-700/50 text-slate-400 border-slate-600/30",
};

export default function UserNewsContent() {
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

  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-full bg-slate-950 py-8 px-6 md:px-10">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <Newspaper className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Tin Tức Chứng Khoán</h1>
            <p className="text-slate-400 text-sm">Cập nhật tin tức và phân tích thị trường mới nhất</p>
          </div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-8 flex flex-wrap gap-3 items-center"
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>
        <button
          onClick={() => setSort(sort === "desc" ? "asc" : "desc")}
          className={`flex items-center gap-2 border rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
            sort === "desc"
              ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
              : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
          }`}
        >
          <Clock className="w-4 h-4" />
          {sort === "desc" ? "Mới nhất" : "Cũ nhất"}
        </button>
      </motion.div>

      {/* Articles */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse flex gap-4">
              <div className="w-24 h-24 bg-slate-800 rounded-xl flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-3 bg-slate-800 rounded w-1/4" />
                <div className="h-5 bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-800 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
            <Newspaper className="w-7 h-7 text-rose-400 opacity-50" />
          </div>
          <p className="text-rose-400 font-medium">Không thể tải tin tức</p>
        </div>
      ) : !articles || articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Newspaper className="w-7 h-7 text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium">Chưa có bài viết nào</p>
          <p className="text-slate-600 text-sm mt-1">Hãy quay lại sau nhé!</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-8">
            {articles.map((article, i) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ x: 4 }}
                onClick={() => { setSelectedArticleId(article.id); setIsModalOpen(true); }}
                className="group flex gap-5 bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl p-5 cursor-pointer transition-all hover:shadow-xl hover:shadow-blue-950/30"
              >
                {/* Thumbnail */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-slate-800 flex items-center justify-center group-hover:from-blue-500/20 group-hover:to-indigo-500/20 transition-all">
                  <Newspaper className="w-8 h-8 text-blue-400/50 group-hover:text-blue-400 transition-colors" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-lg border ${sentimentColor[article.sentiment]}`}>
                      <Tag className="w-3 h-3" />
                      {article.sentiment}
                    </span>
                    <span className="text-slate-500 text-xs font-medium">{article.source}</span>
                  </div>
                  <h3 className="text-slate-100 font-semibold text-base leading-snug group-hover:text-blue-300 transition-colors line-clamp-2 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-1 mb-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{article.date}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-blue-400/60 group-hover:text-blue-400 transition-colors font-medium">
                      Đọc tiếp <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

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

      {/* Modal */}
      {selectedArticleId && (
        <ArticleModal
          articleId={selectedArticleId}
          isOpen={isModalOpen}
          onClose={() => { setIsModalOpen(false); setSelectedArticleId(null); }}
        />
      )}
    </div>
  );
}
