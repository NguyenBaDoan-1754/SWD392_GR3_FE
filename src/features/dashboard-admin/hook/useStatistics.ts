import { useState, useEffect } from "react";
import statisticsApi from "../../../api/statistics.api";

interface StatsData {
  users: string;
  stocks: string;
  sources: string;
  industries: string;
  articles: string;
}

interface LoadingState {
  users: boolean;
  stocks: boolean;
  sources: boolean;
  industries: boolean;
  articles: boolean;
}

export const useStatistics = () => {
  const [stats, setStats] = useState<StatsData>({
    users: "0",
    stocks: "0",
    sources: "0",
    industries: "0",
    articles: "0",
  });

  const [loading, setLoading] = useState<LoadingState>({
    users: true,
    stocks: true,
    sources: true,
    industries: true,
    articles: true,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError(null);
        const result = await statisticsApi.getStatistics();

        setStats({
          users: String(result.users),
          stocks: String(result.stocks),
          sources: String(result.sources),
          industries: String(result.industries),
          articles: String(result.articles),
        });

        setLoading({
          users: false,
          stocks: false,
          sources: false,
          industries: false,
          articles: false,
        });
      } catch (err) {
        console.error("Error fetching statistics:", err);
        setError("Failed to load statistics");
        setLoading({
          users: false,
          stocks: false,
          sources: false,
          industries: false,
          articles: false,
        });
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

export default useStatistics;
