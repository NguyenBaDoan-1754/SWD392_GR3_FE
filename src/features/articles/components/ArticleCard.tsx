interface ArticleCardProps {
  title: string;
  source: string;
  ticker: string;
  date: string;
  excerpt: string;
  articleUrl?: string;
  onViewDetails?: (articleUrl: string) => void;
}

export default function ArticleCard({
  title,
  source,
  date,
  excerpt,
  articleUrl,
  onViewDetails,
}: ArticleCardProps) {
  const handleClick = () => {
    if (articleUrl && onViewDetails) {
      onViewDetails(articleUrl);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
          <p className="text-slate-400 text-sm mb-3">{excerpt}</p>
          <div className="flex items-center gap-4 text-slate-400 text-sm">
            <span>{source}</span>
            <span>•</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
