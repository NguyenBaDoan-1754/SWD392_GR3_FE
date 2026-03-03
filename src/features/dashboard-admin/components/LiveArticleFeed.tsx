import { Dot } from "lucide-react";

interface Article {
  id: number;
  title: string;
  source: string;
  time: string;
  stock: string;
  ticker: string;
  sentiment: "Bullish" | "Bearish" | "Neutral";
  score: number;
}

const articles: Article[] = [
  {
    id: 1,
    title: "FPT Corporation Reports Strong Q4 Earnings",
    source: "VnExpress",
    time: "just now",
    stock: "1 stock mentioned",
    ticker: "FPT",
    sentiment: "Bullish",
    score: 85,
  },
  {
    id: 2,
    title: "Vinamilk Expands International Operations",
    source: "CafeF",
    time: "14h ago",
    stock: "1 stock mentioned",
    ticker: "VNM",
    sentiment: "Bullish",
    score: 72,
  },
  {
    id: 3,
    title: "Banking Sector Shows Resilience in Market Downturn",
    source: "Reuters",
    time: "2h ago",
    stock: "5 stocks mentioned",
    ticker: "MBB",
    sentiment: "Neutral",
    score: 58,
  },
];

export default function LiveArticleFeed() {
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
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-xl font-bold">Live Article Feed</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-blue-500 text-sm font-medium">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-slate-700 border border-slate-600 rounded-lg p-4 hover:border-slate-500 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                  <span>{article.source}</span>
                  <Dot className="w-1 h-1" />
                  <span>{article.time}</span>
                  <Dot className="w-1 h-1" />
                  <span>{article.stock}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-slate-600 text-slate-200 px-3 py-1 rounded text-sm font-mono font-bold">
                    {article.ticker}
                  </span>
                  <span
                    className={`px-3 py-1 rounded text-sm font-semibold ${getSentimentColor(article.sentiment)}`}
                  >
                    {article.sentiment}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-xs mb-2">Score</p>
                <p className="text-white text-lg font-bold">{article.score}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
