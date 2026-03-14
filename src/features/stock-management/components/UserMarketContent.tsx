import { useMemo } from "react";
import {
  Search,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  BarChart2,
} from "lucide-react";
import { useStockPrices } from "../hook/useStockPrices";
import Pagination from "../../articles/components/Pagination";
import { motion } from "motion/react";

export default function UserMarketContent() {
  const {
    stockPrices,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    tickerFilter,
    startDate,
    endDate,
    setPage,
    setTickerFilter,
    setStartDate,
    setEndDate,
    refresh,
  } = useStockPrices();

  const displayCount = useMemo(
    () => stockPrices.slice(0, 15).length,
    [stockPrices],
  );
  const isInitialLoading = loading && stockPrices.length === 0;
  const isRefreshing = loading && stockPrices.length > 0;

  const handleResetFilters = () => {
    setTickerFilter("");
    setStartDate("");
    setEndDate("");
    refresh();
  };

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
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Thị Trường Chứng Khoán
            </h1>
            <p className="text-slate-400 text-sm">
              Theo dõi giá cổ phiếu theo thời gian thực
            </p>
          </div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center"
      >
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={tickerFilter}
            onChange={(e) => setTickerFilter(e.target.value)}
            placeholder="Tìm mã cổ phiếu..."
            className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
        />
        <span className="text-slate-600 text-sm">→</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none transition-colors"
        />
        <button
          onClick={handleResetFilters}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Đặt lại
        </button>
      </motion.div>

      {/* Stats bar */}
      <div className="text-slate-500 text-sm mb-4">
        {!error && (
          <span>
            Hiển thị{" "}
            <span className="text-slate-300 font-medium">{displayCount}</span> /{" "}
            <span className="text-slate-300 font-medium">{totalElements}</span>{" "}
            kết quả
          </span>
        )}
      </div>

      {/* Content */}
      {isInitialLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 animate-pulse"
            >
              <div className="h-4 bg-slate-800 rounded w-1/3 mb-3" />
              <div className="h-7 bg-slate-800 rounded w-1/2 mb-2" />
              <div className="h-4 bg-slate-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
            <TrendingDown className="w-7 h-7 text-rose-400" />
          </div>
          <p className="text-rose-400 font-medium mb-1">
            Không thể tải dữ liệu
          </p>
          <p className="text-slate-500 text-sm">{error}</p>
        </div>
      ) : stockPrices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <BarChart2 className="w-7 h-7 text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium">
            Không tìm thấy cổ phiếu nào
          </p>
          <p className="text-slate-600 text-sm mt-1">Hãy thử thay đổi bộ lọc</p>
        </div>
      ) : (
        <>
          <div className="relative mb-6">
            {isRefreshing && (
              <div className="absolute inset-0 z-10 rounded-2xl bg-slate-950/55 backdrop-blur-[1px] flex items-center justify-center">
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-slate-900/90 px-4 py-2 text-sm text-indigo-200 shadow-lg">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Đang cập nhật dữ liệu...
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stockPrices.slice(0, 15).map((price, i) => {
                const change =
                  price.open > 0
                    ? ((price.close - price.open) / price.open) * 100
                    : 0;
                const isUp = change >= 0;
                return (
                  <motion.div
                    key={`${price.tickerSymbol}-${price.tradingDate}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.35 }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="group bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 cursor-pointer transition-colors relative overflow-hidden"
                  >
                    {/* Glow effect */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl ${isUp ? "bg-emerald-500/3" : "bg-rose-500/3"}`}
                    />

                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-9 h-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-300 text-sm">
                            {price.tickerSymbol[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">
                              {price.tickerSymbol.toUpperCase()}
                            </p>
                            <p className="text-slate-500 text-xs">
                              {new Date(price.tradingDate).toLocaleDateString(
                                "vi-VN",
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${isUp ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}
                      >
                        {isUp ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {isUp ? "+" : ""}
                        {change.toFixed(2)}%
                      </div>
                    </div>

                    <p className="text-2xl font-bold text-white mb-3">
                      {(price.close / 1000).toFixed(2)}
                      <span className="text-sm font-normal text-slate-500 ml-1">
                        K
                      </span>
                    </p>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80">
                      {[
                        {
                          label: "Mở cửa",
                          value: (price.open / 1000).toFixed(1) + "K",
                        },
                        {
                          label: "Cao nhất",
                          value: (price.high / 1000).toFixed(1) + "K",
                        },
                        {
                          label: "KL",
                          value: (price.volume / 1000000).toFixed(1) + "M",
                        },
                      ].map((stat) => (
                        <div key={stat.label} className="text-center">
                          <p className="text-slate-500 text-xs mb-0.5">
                            {stat.label}
                          </p>
                          <p className="text-slate-300 text-xs font-medium">
                            {stat.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
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
    </div>
  );
}
