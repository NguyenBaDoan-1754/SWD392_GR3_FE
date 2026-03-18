import apiClient from "./client";

export type MarketSession = "all" | "morning" | "afternoon";

export interface StockIntradayCandle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export const getStockIntradayChart = async (
  symbol: string,
  date: string,
): Promise<StockIntradayCandle[]> => {
  const response = await apiClient.get<ApiResponse<StockIntradayCandle[]>>(
    `/api/stock/${encodeURIComponent(symbol)}/chart`,
    {
      params: { date },
    },
  );

  return Array.isArray(response.data?.result) ? response.data.result : [];
};
