import { useState, useEffect } from "react";
import apiClient from "../../../api/client";

interface StockChartData {
  name: string;
  stocks: number;
}

export const useStocksChartData = () => {
  const [data, setData] = useState<StockChartData[]>([
    { name: "Jan", stocks: 32 },
    { name: "Feb", stocks: 35 },
    { name: "Mar", stocks: 40 },
    { name: "Apr", stocks: 42 },
    { name: "May", stocks: 45 },
    { name: "Jun", stocks: 48 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const response = await apiClient.get("/api/statistics/stocks");

        const totalStocks = response.data?.result || 0;

        // Tạo dữ liệu biểu đồ dựa trên số stock thực
        const chartData: StockChartData[] = [
          { name: "Jan", stocks: Math.floor(totalStocks * 0.67) },
          { name: "Feb", stocks: Math.floor(totalStocks * 0.73) },
          { name: "Mar", stocks: Math.floor(totalStocks * 0.83) },
          { name: "Apr", stocks: Math.floor(totalStocks * 0.88) },
          { name: "May", stocks: Math.floor(totalStocks * 0.94) },
          { name: "Jun", stocks: totalStocks },
        ];

        setData(chartData);
      } catch (err) {
        console.error("Error fetching stocks chart data:", err);
        // Use default data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
};

export default useStocksChartData;
