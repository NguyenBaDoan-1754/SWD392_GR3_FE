import {
  BarChart3,
  TrendingUp,
  BookOpen,
  Radio,
  Users,
  Settings,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: TrendingUp, label: "Stock Management", href: "/stock-management" },
    { icon: BookOpen, label: "Articles & Mentions", href: "/articles" },
    { icon: Radio, label: "Podcast Scripts", href: "/podcast-scripts" },
    { icon: Users, label: "Users", href: "/users" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">StockCast AI</h1>
            <p className="text-slate-400 text-xs">Podcast Platform</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
            A
          </div>
          <div className="flex-1">
            <p className="text-white text-sm font-medium">Admin User</p>
            <p className="text-slate-400 text-xs">admin@stockcast.ai</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
