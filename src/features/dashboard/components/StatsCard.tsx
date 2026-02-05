interface StatsCardProps {
  title: string;
  subtitle: string;
  value: string;
  change: string;
  icon: React.ComponentType<{ className?: string }>;
  changeColor?: string;
}

export default function StatsCard({
  title,
  subtitle,
  value,
  change,
  icon: Icon,
  changeColor = "text-slate-400",
}: StatsCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
        </div>
        <Icon className="w-5 h-5 text-slate-400" />
      </div>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      {change && <p className={`text-sm ${changeColor}`}>{change}</p>}
    </div>
  );
}
