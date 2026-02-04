import { Calendar, Download, Edit } from "lucide-react";

interface PodcastScript {
  id: number;
  stock: string;
  title: string;
  generatedDate: string;
  lastModified: string;
  status: "Draft" | "Published" | "Scheduled";
  duration: string;
}

const podcasts: PodcastScript[] = [
  {
    id: 1,
    stock: "AAPL",
    title: "Apple Q4 Performance Analysis",
    generatedDate: "2 days ago",
    lastModified: "1 day ago",
    status: "Published",
    duration: "12:34",
  },
  {
    id: 2,
    stock: "TSLA",
    title: "Tesla Market Updates",
    generatedDate: "3 days ago",
    lastModified: "2 days ago",
    status: "Published",
    duration: "15:22",
  },
  {
    id: 3,
    stock: "MSFT",
    title: "Microsoft Cloud Strategy",
    generatedDate: "1 day ago",
    lastModified: "1 day ago",
    status: "Draft",
    duration: "10:45",
  },
  {
    id: 4,
    stock: "GOOGL",
    title: "Alphabet AI Initiatives",
    generatedDate: "4 days ago",
    lastModified: "3 days ago",
    status: "Scheduled",
    duration: "14:18",
  },
  {
    id: 5,
    stock: "AMZN",
    title: "Amazon Retail Growth",
    generatedDate: "5 days ago",
    lastModified: "2 days ago",
    status: "Published",
    duration: "13:56",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Published":
      return "bg-green-900 text-green-300";
    case "Draft":
      return "bg-slate-700 text-slate-300";
    case "Scheduled":
      return "bg-blue-900 text-blue-300";
    default:
      return "bg-slate-700 text-slate-300";
  }
};

export default function PodcastTable() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-700 border-b border-slate-600">
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Stock
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Title
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Generated Date
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Last Modified
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Duration
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Status
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {podcasts.map((podcast) => (
            <tr
              key={podcast.id}
              className="border-b border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <td className="px-6 py-4 text-white font-bold text-sm font-mono">
                {podcast.stock}
              </td>
              <td className="px-6 py-4 text-slate-200 text-sm">
                {podcast.title}
              </td>
              <td className="px-6 py-4 text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {podcast.generatedDate}
                </div>
              </td>
              <td className="px-6 py-4 text-slate-400 text-sm">
                {podcast.lastModified}
              </td>
              <td className="px-6 py-4 text-white text-sm font-mono">
                {podcast.duration}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(
                    podcast.status,
                  )}`}
                >
                  {podcast.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-600 rounded transition-colors text-slate-300 hover:text-white">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-slate-600 rounded transition-colors text-slate-300 hover:text-white">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
