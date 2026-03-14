import { motion } from "motion/react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStockPrices } from "../../../api/stockPrice.api";
import type { StockPrice } from "../../../api/stockPrice.api";

interface TrendStock {
  id: string;
  name: string;
  price: string;
  change: string;
  isUp: boolean;
  volume: string;
}

export default function TrendingStocks() {
  const [trendData, setTrendData] = useState<TrendStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await getStockPrices(1, undefined, undefined, undefined);
        // Map top 6 unique stocks
        let uniqueMap = new Map<string, StockPrice>();
        for (let item of data.stockPrices) {
          if (!uniqueMap.has(item.tickerSymbol)) {
            uniqueMap.set(item.tickerSymbol, item);
          }
        }

        const topStocks = Array.from(uniqueMap.values())
          .slice(0, 6)
          .map((s) => {
            const changeVal =
              s.open > 0 ? ((s.close - s.open) / s.open) * 100 : 0;
            const absoluteChange = Math.abs(changeVal).toFixed(2);
            return {
              id: s.tickerSymbol,
              name: s.tickerSymbol, // We don't have full name in API
              price: (s.close / 1000).toFixed(2) + "K",
              change:
                changeVal >= 0 ? `+${absoluteChange}%` : `-${absoluteChange}%`,
              isUp: changeVal >= 0,
              volume: (s.volume / 1000000).toFixed(1) + "M",
            };
          });

        // Use mock data if API is empty
        if (topStocks.length === 0) {
          setTrendData([
            {
              id: "AAPL",
              name: "Apple Inc.",
              price: "$182.52",
              change: "+1.2%",
              isUp: true,
              volume: "12M",
            },
            {
              id: "MSFT",
              name: "Microsoft",
              price: "$405.30",
              change: "+2.4%",
              isUp: true,
              volume: "18M",
            },
            {
              id: "TSLA",
              name: "Tesla",
              price: "$175.22",
              change: "-0.5%",
              isUp: false,
              volume: "35M",
            },
          ]);
        } else {
          setTrendData(topStocks);
        }
      } catch (error) {
        console.error("Failed to fetch stock prices", error);
        // Fallback
        setTrendData([
          {
            id: "AAPL",
            name: "Apple Inc.",
            price: "$182.52",
            change: "+1.2%",
            isUp: true,
            volume: "12M",
          },
          {
            id: "MSFT",
            name: "Microsoft",
            price: "$405.30",
            change: "+2.4%",
            isUp: true,
            volume: "18M",
          },
          {
            id: "TSLA",
            name: "Tesla",
            price: "$175.22",
            change: "-0.5%",
            isUp: false,
            volume: "35M",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStocks();
  }, []);
  return (
    <div className="w-full mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span className="bg-indigo-500/10 text-indigo-400 p-2 rounded-lg">
            <TrendingUp size={20} />
          </span>
          Cổ Phiếu Thịnh Hành
        </h2>
        <button
          onClick={() => {
            if (localStorage.getItem("authToken")) {
              navigate("/market");
            } else {
              navigate("/login");
            }
          }}
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors bg-transparent border-none cursor-pointer"
        >
          Xem tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <p className="text-slate-400 p-4">Đang tải biểu đồ...</p>
        ) : (
          trendData.map((stock, i) => (
            <motion.div
              key={stock.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group relative bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-5 rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Glossy overlay effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-indigo-500/10 transition-colors"></div>

              <div className="flex justify-between items-start z-10 relative">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300 border border-slate-700/50 group-hover:bg-indigo-900/40 group-hover:text-indigo-300 group-hover:border-indigo-500/30 transition-all">
                      {stock.id[0]}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{stock.id}</h3>
                      <p className="text-slate-500 text-xs truncate max-w-[100px]">
                        {stock.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{stock.price}</p>
                  <div
                    className={`flex items-center justify-end gap-1 text-sm font-medium ${stock.isUp ? "text-emerald-400" : "text-rose-400"}`}
                  >
                    {stock.isUp ? (
                      <TrendingUp size={14} />
                    ) : (
                      <TrendingDown size={14} />
                    )}
                    <span>{stock.change}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex justify-between text-xs font-medium z-10 relative">
                <span className="text-slate-500">Vol {stock.volume}</span>
                <span className="text-slate-500 group-hover:text-indigo-400 transition-colors">
                  Biểu đồ
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
