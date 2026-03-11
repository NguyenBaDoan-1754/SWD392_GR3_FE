interface UserStatsCardProps {
  title: string;
  value: string;
}

export default function UserStatsCard({ title, value }: UserStatsCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <p className="text-slate-400 text-sm">{title}</p>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}
