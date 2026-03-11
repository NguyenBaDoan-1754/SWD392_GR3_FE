import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users } from "lucide-react";
import { useUsersChartData } from "../../hook/useUsersChartData";

interface UsersChartProps {
  value: string;
  loading: boolean;
}

export default function UsersChart({ value, loading }: UsersChartProps) {
  const { data } = useUsersChartData();

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-slate-400 text-sm">Total Users</p>
          <p className="text-3xl font-bold text-white mt-2">
            {loading ? "..." : value}
          </p>
        </div>
        <Users className="w-10 h-10 text-blue-400" />
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
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
          <Bar dataKey="users" fill="#3B82F6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
