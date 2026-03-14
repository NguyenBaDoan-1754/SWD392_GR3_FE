import { useEffect, useMemo, useState } from "react";
import type { StockPrice } from "../../../api/stockPrice.api";
import { getStockPrices } from "../../../api/stockPrice.api";

export interface UseStockPricesReturn {
  stockPrices: StockPrice[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  totalElements: number;
  tickerFilter: string;
  startDate: string;
  endDate: string;
  setPage: (page: number) => void;
  setTickerFilter: (ticker: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  refresh: () => void;
}

export const useStockPrices = (): UseStockPricesReturn => {
  const [allPrices, setAllPrices] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [tickerFilter, setTickerFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSetTickerFilter = (ticker: string) => {
    setPage(1);
    setTickerFilter(ticker);
  };

  const handleSetStartDate = (date: string) => {
    setPage(1);
    setStartDate(date);
  };

  const handleSetEndDate = (date: string) => {
    setPage(1);
    setEndDate(date);
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true);
        const result = await getStockPrices(
          page,
          tickerFilter,
          startDate,
          endDate,
        );
        setAllPrices(result.stockPrices);
        setTotalPages(result.totalPages);
        setTotalElements(result.totalElements);
        setError(null);
      } catch (err) {
        console.error("Failed to load stock prices:", err);
        setError("Failed to load stock prices");
        setAllPrices([]);
        setTotalPages(0);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [page, tickerFilter, startDate, endDate, refreshKey]);

  const stockPrices = useMemo(() => {
    // In case backend does not support filtering yet, we still support client-side filtering
    if (!tickerFilter.trim()) return allPrices;
    const q = tickerFilter.trim().toLowerCase();
    return allPrices.filter((p) => p.tickerSymbol.toLowerCase().includes(q));
  }, [allPrices, tickerFilter]);

  const refresh = () => setRefreshKey((k) => k + 1);

  return {
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
    setTickerFilter: handleSetTickerFilter,
    setStartDate: handleSetStartDate,
    setEndDate: handleSetEndDate,
    refresh,
  };
};
