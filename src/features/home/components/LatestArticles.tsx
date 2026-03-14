import { motion } from "motion/react";
import { Newspaper, ChevronRight, Clock, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getArticles } from "../../../api/article.api";
import type { Article } from "../../../api/article.api";
import ArticleModal from "../../articles/components/ArticleModal";

export default function LatestArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles(1, "desc");
        setArticles(data.articles.slice(0, 4)); // Get top 4
      } catch (error) {
        console.error("Failed to fetch articles", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);
  return (
    <div className="w-full mt-12 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="bg-blue-500/10 text-blue-400 p-2 rounded-lg">
            <Newspaper size={20} />
          </span>
          Điểm Tin Mới Nhất
        </h2>
        <button
          onClick={() => {
            if (localStorage.getItem("authToken")) {
              navigate("/news");
            } else {
              navigate("/login");
            }
          }}
          className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 group bg-transparent border-none cursor-pointer"
        >
          Đọc tất cả
          <ChevronRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <p className="text-slate-400 p-4">Đang tải tin tức...</p>
        ) : articles.length > 0 ? (
          articles.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group cursor-pointer flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition-all shadow-sm hover:shadow-xl hover:shadow-blue-900/10"
              onClick={() => {
                setSelectedArticleId(article.id);
                setIsModalOpen(true);
              }}
            >
              {/* Thumbnail */}
              <div className="relative w-full sm:w-1/3 aspect-video sm:aspect-square overflow-hidden rounded-xl flex-shrink-0 bg-slate-800 flex items-center justify-center">
                <Newspaper className="w-12 h-12 text-slate-600" />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <p className="text-blue-400 text-xs font-semibold mb-2 uppercase tracking-wider">
                    {article.source}
                  </p>
                  <h3 className="text-slate-100 font-bold text-base leading-snug group-hover:text-blue-300 transition-colors line-clamp-2 mb-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800/60 text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} />- views
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-slate-400 p-4">Chưa có bài báo nào.</p>
        )}
      </div>

      {selectedArticleId && (
        <ArticleModal
          articleId={selectedArticleId}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedArticleId(null);
          }}
        />
      )}
    </div>
  );
}
