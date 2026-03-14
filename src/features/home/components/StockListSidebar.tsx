import { motion } from "motion/react";
import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStockPrices } from "../../../api/stockPrice.api";
import type { StockPrice } from "../../../api/stockPrice.api";

interface SidebarStock {
  rank: number;
  symbol: string;
  name: string;
  price: string;
  change: string;
  value: string;
}

export default function StockListSidebar() {
  const [stockList, setStockList] = useState<SidebarStock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const data = await getStockPrices(1, undefined, undefined, undefined);
        let uniqueMap = new Map<string, StockPrice>();
        for (let item of data.stockPrices) {
          if (!uniqueMap.has(item.tickerSymbol)) {
            uniqueMap.set(item.tickerSymbol, item);
          }
        }

        const topStocks = Array.from(uniqueMap.values())
          .slice(0, 15)
          .map((s, index) => {
            const changeVal =
              s.open > 0 ? ((s.close - s.open) / s.open) * 100 : 0;
            const absoluteChange = Math.abs(changeVal).toFixed(2);
            return {
              rank: index + 1,
              symbol: s.tickerSymbol,
              name: s.tickerSymbol,
              price: (s.close / 1000).toFixed(2) + "K",
              change:
                changeVal >= 0 ? `+${absoluteChange}%` : `-${absoluteChange}%`,
              value: (s.volume / 1000000).toFixed(1) + "M",
            };
          });

        if (topStocks.length === 0) {
          setStockList([
            {
              rank: 1,
              name: "Vingroup",
              symbol: "VIC",
              price: "45.20K",
              change: "+1.2%",
              value: "50B",
            },
            {
              rank: 2,
              name: "Techcombank",
              symbol: "TCB",
              price: "32.10K",
              change: "+2.4%",
              value: "40B",
            },
          ]);
        } else {
          setStockList(topStocks);
        }
      } catch (error) {
        console.error("Failed to fetch stock prices for sidebar", error);
        setStockList([
          {
            rank: 1,
            name: "Vingroup",
            symbol: "VIC",
            price: "45.20K",
            change: "+1.2%",
            value: "50B",
          },
          {
            rank: 2,
            name: "Techcombank",
            symbol: "TCB",
            price: "32.10K",
            change: "+2.4%",
            value: "40B",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStocks();
  }, []);

  return (
    <div className="w-full h-full bg-slate-900 border-l border-slate-800 p-5 hidden xl:flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">
          Bộ Sưu Tập
        </h2>
        <div className="flex gap-2">
          <button className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700">
            <Search size={16} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700">
            <Filter size={16} />
          </button>
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 uppercase pb-2 border-b border-slate-800">
        <div className="col-span-1 text-center">#</div>
        <div className="col-span-5">Cổ Phiếu</div>
        <div className="col-span-3 text-right">Thị Giá</div>
        <div className="col-span-3 text-right">KL Giao Dịch</div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto mt-2 pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="text-center text-slate-500 mt-10">Đang tải...</div>
        ) : (
          stockList.map((stock, i) => (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              whileHover={{ backgroundColor: "rgba(30, 41, 59, 1)" }}
              className="grid grid-cols-12 gap-2 items-center py-3 border-b border-slate-800/50 cursor-pointer rounded-lg px-1 transition-colors group"
            >
              <div className="col-span-1 text-center text-slate-500 font-medium text-sm group-hover:text-white transition-colors">
                {stock.rank}
              </div>
              <div className="col-span-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs ring-1 ring-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-400 transition-all">
                  {stock.symbol[0]}
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-semibold text-sm leading-tight group-hover:text-indigo-300 transition-colors uppercase">
                    {stock.symbol}
                  </span>
                  <span className="text-slate-500 text-xs truncate max-w-[60px]">
                    {stock.name}
                  </span>
                </div>
              </div>
              <div className="col-span-3 flex flex-col items-end">
                <span className="text-white font-medium text-sm">
                  {stock.price}
                </span>
                <span
                  className={`text-xs font-bold ${stock.change.startsWith("+") ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {stock.change}
                </span>
              </div>
              <div className="col-span-4 text-right text-slate-300 text-sm font-medium">
                {stock.value}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <button
        onClick={() => {
          if (localStorage.getItem("authToken")) {
            navigate("/market");
          } else {
            navigate("/login");
          }
        }}
        className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg transition-colors border border-slate-700"
      >
        Xem toàn bộ thị trường
      </button>
    </div>
  );
}
