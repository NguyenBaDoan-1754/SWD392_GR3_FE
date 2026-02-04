import { Eye, TrendingUp, TrendingDown } from "lucide-react";

interface Stock {
  id: number;
  ticker: string;
  company: string;
  industry: string;
  price: number;
  change: number;
  mentions: number;
}

const stocks: Stock[] = [
  {
    id: 1,
    ticker: "AAPL",
    company: "Apple Inc.",
    industry: "Technology",
    price: 192.45,
    change: 2.34,
    mentions: 145,
  },
  {
    id: 2,
    ticker: "GOOGL",
    company: "Alphabet Inc.",
    industry: "Technology",
    price: 140.23,
    change: -1.23,
    mentions: 98,
  },
  {
    id: 3,
    ticker: "MSFT",
    company: "Microsoft Corp.",
    industry: "Technology",
    price: 415.67,
    change: 3.45,
    mentions: 176,
  },
  {
    id: 4,
    ticker: "TSLA",
    company: "Tesla Inc.",
    industry: "Automotive",
    price: 242.84,
    change: 1.56,
    mentions: 234,
  },
  {
    id: 5,
    ticker: "AMZN",
    company: "Amazon.com Inc.",
    industry: "Retail",
    price: 190.12,
    change: -2.34,
    mentions: 156,
  },
  {
    id: 6,
    ticker: "META",
    company: "Meta Platforms Inc.",
    industry: "Technology",
    price: 520.45,
    change: 4.56,
    mentions: 187,
  },
];

export default function StockTable() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-700 border-b border-slate-600">
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Ticker
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Company Name
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Industry
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Current Price
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Change
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Mentions
            </th>
            <th className="px-6 py-4 text-left text-slate-300 font-semibold text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr
              key={stock.id}
              className="border-b border-slate-700 hover:bg-slate-700 transition-colors"
            >
              <td className="px-6 py-4 text-white font-bold text-sm font-mono">
                {stock.ticker}
              </td>
              <td className="px-6 py-4 text-slate-200 text-sm">
                {stock.company}
              </td>
              <td className="px-6 py-4 text-slate-300 text-sm">
                {stock.industry}
              </td>
              <td className="px-6 py-4 text-white text-sm font-semibold">
                ${stock.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex items-center gap-2">
                  {stock.change >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={
                      stock.change >= 0 ? "text-green-500" : "text-red-500"
                    }
                  >
                    {stock.change >= 0 ? "+" : ""}
                    {stock.change.toFixed(2)}%
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-slate-200 text-sm">
                {stock.mentions}
              </td>
              <td className="px-6 py-4">
                <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors font-medium">
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
