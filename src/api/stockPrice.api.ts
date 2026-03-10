import apiClient from "./client";

export interface StockPrice {
  tickerSymbol: string;
  tradingDate: string; // ISO date
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface StockPricesResponse {
  code: number;
  message: string;
  result: {
    items: StockPrice[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
}

export const getStockPrices = async (
  page: number = 1,
  tickerSymbol?: string,
  startDate?: string,
  endDate?: string,
): Promise<{
  stockPrices: StockPrice[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
}> => {
  try {
    const response = await apiClient.get<StockPricesResponse>("/api/stock-prices", {
      params: {
        page: page - 1,
        tickerSymbol: tickerSymbol || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      },
    });

    const items = response.data?.result?.items;
    const result = response.data?.result;

    if (!items || !Array.isArray(items)) {
      return {
        stockPrices: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: page,
      };
    }

    return {
      stockPrices: items,
      totalPages: result?.totalPages || 0,
      totalElements: result?.totalElements || 0,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching stock prices:", error);
    throw error;
  }
};
