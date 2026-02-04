import { Play, Clock, Edit2 } from "lucide-react";

export default function PodcastScriptCard() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-white text-xl font-semibold mb-2">
            Daily Market Wrap: Tech Stocks Lead Rally
          </h3>
          <p className="text-slate-400 text-sm">
            Created by: John Doe • Feb 4, 2025, 02:00 PM
          </p>
        </div>
        <span className="bg-blue-900 text-blue-300 px-3 py-1 rounded text-sm font-semibold">
          Published
        </span>
      </div>

      {/* Player */}
      <div className="mb-6 bg-slate-700 rounded-lg p-4">
        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors">
            <Play className="w-6 h-6 text-white fill-white" />
          </button>
          <div className="flex-1">
            <div className="w-full bg-slate-600 rounded-full h-2"></div>
          </div>
          <span className="text-slate-300 text-sm font-mono">4:56</span>
        </div>
      </div>

      {/* Script Content */}
      <div className="mb-6">
        <h4 className="text-white font-semibold mb-3">Podcast Script</h4>
        <p className="text-slate-300 text-sm leading-relaxed">
          Good evening, investors. Today we're seeing a strong rally in
          technology stocks, with FPT Corporation leading the charge with an
          impressive 3.2% gain. The company's recent quarterly earnings exceeded
          analyst expectations, showcasing robust growth in their cloud
          computing and digital transformation services. Market sentiment
          remains bullish as trading volumes continue to surge.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-700">
        <button className="flex items-center gap-2 text-slate-300 hover:text-white px-4 py-2 rounded transition-colors">
          <Edit2 className="w-4 h-4" />
          Edit Script
        </button>
      </div>
    </div>
  );
}
