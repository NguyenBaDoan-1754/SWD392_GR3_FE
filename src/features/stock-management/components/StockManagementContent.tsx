import { useMemo } from "react";
import { Search, RefreshCw } from "lucide-react";
import { useStockPrices } from "../hook/useStockPrices";
import Pagination from "../../articles/components/Pagination";

export default function StockManagementContent() {
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

  const handleResetFilters = () => {
    setTickerFilter("");
    setStartDate("");
    setEndDate("");
    refresh();
  };

  const displayCount = useMemo(() => stockPrices.length, [stockPrices]);

  return (
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-8 py-6">
        <h1 className="text-white text-3xl font-bold">Stock Management</h1>
        <p className="text-slate-400 mt-1">
          View stock price history fetched from the backend.
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
            <input
              value={tickerFilter}
              onChange={(e) => setTickerFilter(e.target.value)}
              placeholder="Ticker symbol (e.g., AAPL)"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            placeholder="Start date"
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
            placeholder="End date"
          />

          <button
            onClick={handleResetFilters}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-300 hover:border-slate-600 hover:text-white transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            Reset filters
          </button>
        </div>

        {/* Table */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-400">Loading stock prices...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-red-400">{error}</p>
            </div>
          ) : stockPrices.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-slate-400">No stock prices found.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-slate-900">
                    <tr>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Ticker
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Open
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        High
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Low
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Close
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Volume
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockPrices.map((price) => (
                      <tr
                        key={`${price.tickerSymbol}-${price.tradingDate}`}
                        className="border-t border-slate-700 hover:bg-slate-900"
                      >
                        <td className="px-6 py-4 text-slate-200 whitespace-nowrap">
                          {new Date(price.tradingDate).toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-6 py-4 text-slate-200 whitespace-nowrap">
                          {price.tickerSymbol.toUpperCase()}
                        </td>
                        <td className="px-6 py-4 text-slate-200 whitespace-nowrap">
                          {price.open.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-slate-200 whitespace-nowrap">
                          {price.high.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-slate-200 whitespace-nowrap">
                          {price.low.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-slate-200 whitespace-nowrap">
                          {price.close.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-slate-200 whitespace-nowrap">
                          {price.volume.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-6 py-5 border-t border-slate-700">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="text-slate-400 text-sm">
                    Showing {displayCount} of {totalElements} results
                  </div>
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                    loading={loading}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
