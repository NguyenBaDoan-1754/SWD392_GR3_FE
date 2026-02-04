interface PodcastStatsCardProps {
  title: string;
  value: string;
  change?: string;
  isHighlight?: boolean;
}

export default function PodcastStatsCard({
  title,
  value,
  change,
  isHighlight = false,
}: PodcastStatsCardProps) {
  return (
    <div
      className={`rounded-lg p-6 border ${isHighlight ? "bg-green-900 border-green-700" : "bg-slate-800 border-slate-700"}`}
    >
      <p
        className={`text-sm ${isHighlight ? "text-green-300" : "text-slate-400"}`}
      >
        {title}
      </p>
      <div className="mt-2">
        <span className="text-3xl font-bold text-white">{value}</span>
        {change && (
          <span
            className={`text-sm ml-2 ${isHighlight ? "text-green-300" : "text-slate-400"}`}
          >
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
