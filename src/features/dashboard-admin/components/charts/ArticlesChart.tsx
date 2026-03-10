import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Newspaper } from "lucide-react";
import { useArticlesChartData } from "../../hook/useArticlesChartData";

interface ArticlesChartProps {
  value: string;
  loading: boolean;
}

export default function ArticlesChart({ value, loading }: ArticlesChartProps) {
  const { data } = useArticlesChartData();

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-slate-400 text-sm">Daily Articles</p>
          <p className="text-3xl font-bold text-white mt-2">
            {loading ? "..." : value}
          </p>
        </div>
        <Newspaper className="w-10 h-10 text-purple-400" />
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
            }}
            labelStyle={{ color: "#fff" }}
          />
          <Area
            type="monotone"
            dataKey="articles"
            stroke="#A78BFA"
            fill="#A78BFA"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
