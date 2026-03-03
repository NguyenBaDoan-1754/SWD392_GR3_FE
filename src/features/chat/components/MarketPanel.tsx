import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface MarketPanelProps {
  isOpen?: boolean;
}

export default function MarketPanel({ isOpen = true }: MarketPanelProps) {
  const marketData: MarketData[] = [
    { symbol: "VNINDEX", price: 1245, change: 15, changePercent: 1.2 },
    { symbol: "AAPL", price: 192.3, change: -0.8, changePercent: -0.4 },
    { symbol: "NVDA", price: 865, change: 18, changePercent: 2.1 },
    { symbol: "TSLA", price: 245.5, change: -3.5, changePercent: -1.4 },
    { symbol: "GOOGL", price: 140.2, change: 2.1, changePercent: 1.5 },
  ];

  if (!isOpen) return null;

  return (
    <div className="hidden lg:flex flex-col w-80 bg-[rgba(255,255,255,0.03)] border-l border-[rgba(255,255,255,0.05)] px-4 py-6 overflow-y-auto">
      {/* Header */}
      <h2 className="text-white font-semibold text-lg mb-6">Market Watch</h2>

      {/* Market Items */}
      <div className="space-y-3">
        {marketData.map((item) => {
          const isPositive = item.changePercent >= 0;
          return (
            <div
              key={item.symbol}
              className="bg-[rgba(255,255,255,0.04)] backdrop-blur-sm border border-[rgba(255,255,255,0.08)] rounded-[12px] p-3 hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(99,102,241,0.3)] transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium text-sm">
                  {item.symbol}
                </span>
                <div className="flex items-center gap-1">
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      isPositive ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {item.changePercent.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="text-slate-300 text-sm">
                ${item.price.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-[rgba(255,255,255,0.05)] text-xs text-slate-500">
        <p>Data delayed by 15 mins</p>
      </div>
    </div>
  );
}
