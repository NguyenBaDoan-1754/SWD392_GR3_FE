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
    content: StockPrice[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface StockResponse {
  tickerSymbol: string;
}

export interface StockListResponse {
  code: number;
  message: string;
  result: StockResponse[];
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
    const tickerQuery = tickerSymbol?.trim();

    const response = await apiClient.get<StockPricesResponse>(
      "/api/stock-prices",
      {
        params: {
          page: page - 1,
          tickerSymbol: tickerQuery || undefined,
          ticker: tickerQuery || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      },
    );

    const items = response.data?.result?.content;
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

export const getListStock = async (): Promise<string[]> => {
  try {
    const response = await apiClient.get<StockListResponse>(
      "/api/stock/all",
    );

    const stocks = response.data?.result;

    if (!stocks || !Array.isArray(stocks)) {
      return [];
    }

    return stocks.map((stock) => stock.tickerSymbol);
  } catch (error) {
    console.error("Error fetching stock list:", error);
    throw error;
  }
};
