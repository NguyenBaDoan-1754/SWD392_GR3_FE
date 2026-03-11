import UsersChart from "./charts/UsersChart";
import StocksChart from "./charts/StocksChart";
import ArticlesChart from "./charts/ArticlesChart";
import { useAuth } from "../../auth/hook/useAuth";
import { useStatistics } from "../hook/useStatistics";

export default function MainContent() {
  const { user } = useAuth();
  const { stats: statisticsData, loading } = useStatistics();

  return (
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-8 py-6">
        <h1 className="text-white text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          {user?.role === "admin" || user?.roles?.includes("admin")
            ? "Real-time monitoring of stock news and AI-generated content"
            : "Latest stock news and market insights"}
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <UsersChart value={statisticsData.users} loading={loading.users} />
          <StocksChart value={statisticsData.stocks} loading={loading.stocks} />
          <ArticlesChart
            value={statisticsData.articles}
            loading={loading.articles}
          />
        </div>
      </div>
    </main>
  );
}
