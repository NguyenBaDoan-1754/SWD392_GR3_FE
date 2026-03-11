import { useEffect, useState, useRef } from "react";
import { X, Calendar, Building2, User } from "lucide-react";
import type { Article } from "../../../api/article.api";
import { getArticleById } from "../../../api/article.api";

interface ArticleModalProps {
  articleId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ArticleModal({
  articleId,
  isOpen,
  onClose,
}: ArticleModalProps) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await getArticleById(articleId);
        setArticle(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId, isOpen]);

  // Handle scroll progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const scrollTop = element.scrollTop;
    const scrollHeight = element.scrollHeight - element.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    setScrollProgress(progress);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Scroll Progress Bar */}
        <div className="h-1 bg-slate-700">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 transition-all duration-200"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        {/* Header */}
        <div className="sticky top-0 bg-slate-900 border-b border-slate-700 px-8 py-6 flex items-center justify-between">
          <h2 className="text-white text-2xl font-bold">Article Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div
          className="p-8 overflow-y-auto flex-1"
          onScroll={handleScroll}
          ref={contentRef}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-400">Loading article...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          ) : article ? (
            <>
              {/* Title */}
              <h1 className="text-white text-2xl font-bold mb-6">
                {article.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-slate-700">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>{article.source}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{article.date}</span>
                </div>
                {article.author && (
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="text-slate-300 leading-relaxed mb-8 space-y-4">
                {article.contentBlocks && article.contentBlocks.length > 0 ? (
                  article.contentBlocks.map((block, index) => {
                    if (block.type === "image") {
                      return (
                        <div key={index} className="my-6">
                          <img
                            src={block.url}
                            alt="Article content"
                            className="max-w-full h-auto rounded-lg border border-slate-600"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        </div>
                      );
                    } else if (block.type === "heading") {
                      return (
                        <h2
                          key={index}
                          className="text-xl font-bold text-white mt-6 mb-3"
                        >
                          {block.text}
                        </h2>
                      );
                    } else {
                      return (
                        <p key={index} className="text-slate-300">
                          {block.text}
                        </p>
                      );
                    }
                  })
                ) : article.content ? (
                  article.content
                    .split("\n")
                    .map((paragraph, index) =>
                      paragraph.trim() ? <p key={index}>{paragraph}</p> : null,
                    )
                ) : (
                  <div className="text-slate-400">
                    <p>{article.excerpt}</p>
                    <p className="mt-2 text-sm text-yellow-200">
                      No content available yet. Run the background job in the
                      backend to fetch article details.
                    </p>
                  </div>
                )}
              </div>

              {/* View Original Link */}
              {article.articleUrl && (
                <div className="pt-8 border-t border-slate-700">
                  <a
                    href={article.articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
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
            </>
          ) : (
            <p className="text-slate-400">Article not found</p>
          )}
        </div>
      </div>
    </div>
  );
}
