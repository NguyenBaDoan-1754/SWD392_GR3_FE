import StatsCard from "./StatsCard";
import LiveArticleFeed from "./LiveArticleFeed";
import { TrendingUp, Newspaper, Radio, MessageSquare } from "lucide-react";
import { useAuth } from "../../auth/hook/useAuth";

export default function MainContent() {
  const { user } = useAuth();
  const stats = [
    {
      title: "Total Stocks",
      subtitle: "Tracked",
      value: "8",
      change: "+2 this week",
      icon: TrendingUp,
    },
    {
      title: "Daily Articles",
      subtitle: "Scanned",
      value: "6",
      change: "+12 today",
      icon: Newspaper,
      changeColor: "text-green-500",
    },
    {
      title: "Podcasts",
      subtitle: "Generated",
      value: "3",
      change: "+1 today",
      icon: Radio,
      changeColor: "text-green-500",
    },
    {
      title: "Active Mentions",
      subtitle: "",
      value: "7",
      change: "",
      icon: MessageSquare,
    },
  ];

  return (
    <main className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-8 py-6">
        <h1 className="text-white text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          {user?.role === "admin" || user?.roles?.includes("admin")
            ? "Real-time monitoring of stock news and AI-generated podcasts"
            : "Latest stock news and market insights"}
        </p>
      </div>

      {/* Content */}
      <div className="p-8">
        {/* Stats Grid - Only for Admin */}
        {(user?.role === "admin" || user?.roles?.includes("admin")) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatsCard key={index} {...stat} />
            ))}
          </div>
        )}

        {/* Live Article Feed */}
        <LiveArticleFeed />
      </div>
    </main>
  );
}
