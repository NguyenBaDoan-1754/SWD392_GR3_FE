import apiClient from "./client";

interface Statistics {
  users: number;
  stocks: number;
  sources: number;
  industries: number;
  articles: number;
}

interface StatsChangeData {
  value: number;
  change?: string;
  changeColor?: string;
}

export const statisticsApi = {
  // Get all statistics
  async getStatistics(): Promise<Statistics> {
    try {
      const [usersRes, stocksRes, sourcesRes, industriesRes, articlesRes] =
        await Promise.all([
          apiClient
            .get("/api/statistics/users")
            .catch(() => ({ data: { count: 0, total: 0 } })),
          apiClient
            .get("/api/statistics/stocks")
            .catch(() => ({ data: { count: 0, total: 0 } })),
          apiClient
            .get("/api/statistics/sources")
            .catch(() => ({ data: { count: 0, total: 0 } })),
          apiClient
            .get("/api/statistics/industries")
            .catch(() => ({ data: { count: 0, total: 0 } })),
          apiClient
            .get("/api/statistics/articles")
            .catch(() => ({ data: { count: 0, total: 0 } })),
        ]);

      return {
        users:
          usersRes.data?.result ||
          usersRes.data?.count ||
          usersRes.data?.total ||
          0,
        stocks:
          stocksRes.data?.result ||
          stocksRes.data?.count ||
          stocksRes.data?.total ||
          0,
        sources:
          sourcesRes.data?.result ||
          sourcesRes.data?.count ||
          sourcesRes.data?.total ||
          0,
        industries:
          industriesRes.data?.result ||
          industriesRes.data?.count ||
          industriesRes.data?.total ||
          0,
        articles:
          articlesRes.data?.result ||
          articlesRes.data?.count ||
          articlesRes.data?.total ||
          0,
      };
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      // Return default values on error
      return {
        users: 0,
        stocks: 0,
        sources: 0,
        industries: 0,
        articles: 0,
      };
    }
  },

  // Get individual statistics
  async getUsersCount(): Promise<StatsChangeData> {
    const response = await apiClient.get("/api/statistics/users");
    return {
      value:
        response.data?.result ||
        response.data?.count ||
        response.data?.total ||
        0,
      change: response.data?.change || undefined,
    };
  },

  async getStocksCount(): Promise<StatsChangeData> {
    const response = await apiClient.get("/api/statistics/stocks");
    return {
      value:
        response.data?.result ||
        response.data?.count ||
        response.data?.total ||
        0,
      change: response.data?.change || undefined,
    };
  },

  async getSourcesCount(): Promise<StatsChangeData> {
    const response = await apiClient.get("/api/statistics/sources");
    return {
      value:
        response.data?.result ||
        response.data?.count ||
        response.data?.total ||
        0,
      change: response.data?.change || undefined,
    };
  },

  async getIndustriesCount(): Promise<StatsChangeData> {
    const response = await apiClient.get("/api/statistics/industries");
    return {
      value:
        response.data?.result ||
        response.data?.count ||
        response.data?.total ||
        0,
      change: response.data?.change || undefined,
    };
  },

  async getArticlesCount(): Promise<StatsChangeData> {
    const response = await apiClient.get("/api/statistics/articles");
    return {
      value:
        response.data?.result ||
        response.data?.count ||
        response.data?.total ||
        0,
      change: response.data?.change || undefined,
    };
  },

  // Get sources breakdown
  async getSourcesBreakdown(): Promise<any[]> {
    try {
      const response = await apiClient.get("/api/statistics/sources-breakdown");
      return response.data?.result || response.data?.data || [];
    } catch (error) {
      console.error("Failed to fetch sources breakdown:", error);
      return [];
    }
  },
};

export default statisticsApi;
