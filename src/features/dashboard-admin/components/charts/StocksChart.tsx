import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useStocksChartData } from "../../hook/useStocksChartData";

interface StocksChartProps {
  value: string;
  loading: boolean;
}

export default function StocksChart({ value, loading }: StocksChartProps) {
  const { data } = useStocksChartData();

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-slate-400 text-sm">Total Stocks</p>
          <p className="text-3xl font-bold text-white mt-2">
            {loading ? "..." : value}
          </p>
        </div>
        <TrendingUp className="w-10 h-10 text-green-400" />
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
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
          <Line
            type="monotone"
            dataKey="stocks"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ fill: "#10B981", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
