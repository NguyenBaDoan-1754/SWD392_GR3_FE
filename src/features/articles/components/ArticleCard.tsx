interface ArticleCardProps {
  title: string;
  source: string;
  ticker: string;
  date: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  excerpt: string;
}

export default function ArticleCard({
  title,
  source,
  ticker,
  date,
  sentiment,
  excerpt,
}: ArticleCardProps) {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Bullish":
        return "bg-green-900 text-green-300";
      case "Bearish":
        return "bg-red-900 text-red-300";
      case "Neutral":
        return "bg-amber-900 text-amber-300";
      default:
        return "bg-slate-700 text-slate-300";
    }
  };

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors cursor-pointer">
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
      <div className="flex items-center gap-3 pt-3 border-t border-slate-700">
        <span className="bg-slate-700 text-slate-200 px-3 py-1 rounded text-sm font-mono font-bold">
          {ticker}
        </span>
        <span
          className={`px-3 py-1 rounded text-sm font-semibold ${getSentimentColor(
            sentiment,
          )}`}
        >
          {sentiment}
        </span>
      </div>
    </div>
  );
}
