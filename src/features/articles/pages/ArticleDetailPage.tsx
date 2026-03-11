import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Building2 } from "lucide-react";
import type { Article } from "../../../api/article.api";
import { getArticleById } from "../../../api/article.api";

export default function ArticleDetailPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        setError("No article ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getArticleById(articleId);
        setArticle(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article details");
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  return (
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Articles
        </button>
        <h1 className="text-white text-3xl font-bold">Article Details</h1>
      </div>

      {/* Content */}
      <div className="p-8 max-w-4xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400">Loading article...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-red-400">{error}</p>
          </div>
        ) : article ? (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8">
            {/* Title */}
            <h1 className="text-white text-3xl font-bold mb-6">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-slate-700">
              <div className="flex items-center gap-2 text-slate-400">
                <Building2 className="w-5 h-5" />
                <span>{article.source}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-5 h-5" />
                <span>{article.date}</span>
              </div>
              {article.ticker && article.ticker !== "---" && (
                <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded text-blue-400 text-sm font-medium">
                  {article.ticker}
                </div>
              )}
              {article.sentiment && (
                <div
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    article.sentiment === "Bullish"
                      ? "bg-green-500/20 border border-green-500/30 text-green-400"
                      : article.sentiment === "Bearish"
                        ? "bg-red-500/20 border border-red-500/30 text-red-400"
                        : "bg-slate-700 border border-slate-600 text-slate-300"
                  }`}
                >
                  {article.sentiment}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="text-slate-300 leading-relaxed mb-8">
              {article.content ? (
                <div className="space-y-4">
                  {article.content
                    .split("\n")
                    .map(
                      (paragraph, index) =>
                        paragraph.trim() && <p key={index}>{paragraph}</p>,
                    )}
                </div>
              ) : (
                <p>{article.excerpt}</p>
              )}
            </div>

            {/* Article URL */}
            {article.articleUrl && (
              <div className="mt-8 pt-8 border-t border-slate-700">
                <a
                  href={article.articleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  View Original Article
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-slate-400">Article not found</p>
          </div>
        )}
      </div>
    </main>
  );
}
