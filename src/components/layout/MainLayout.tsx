import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  MessageSquare,
  LogOut,
  LogIn,
  User,
  TrendingUp,
  Newspaper,
} from "lucide-react";
import { useAuth } from "../../features/auth/hook/useAuth";
import { clearAuthRelatedStorage } from "../../lib/auth-session";
import { useNavigate } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { pathname } = useLocation();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    clearAuthRelatedStorage();
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden relative">
      {/* Spacer to keep main content from going under the collapsed sidebar */}
      <div className="w-20 flex-shrink-0 hidden sm:block z-0"></div>

      {/* Global Sidebar (Hover expandable, floating) */}
      <nav
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`absolute top-0 left-0 bottom-0 ${isExpanded ? "w-64 shadow-2xl" : "w-20"} flex-shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col py-6 transition-all duration-300 ease-in-out z-50`}
      >
        {/* Logo/Brand */}
        <Link
          to="/"
          className={`flex items-center gap-3 mb-8 ${isExpanded ? "px-6" : "px-0 justify-center"} group`}
        >
          <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 flex-shrink-0">
            S
          </div>
          {isExpanded && (
            <span className="font-bold text-lg text-white tracking-wide whitespace-nowrap overflow-hidden">
              StockAgent
            </span>
          )}
        </Link>

        {/* Main Navigation */}
        <div className="flex-1 flex flex-col gap-2 px-3">
          <Link
            to="/"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
              pathname === "/"
                ? "bg-slate-800 text-white shadow-sm font-medium"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            } ${!isExpanded && "justify-center"}`}
            title="Trang Chủ"
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span>Trang Chủ</span>}
          </Link>
          <Link
            to="/chat"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
              pathname.startsWith("/chat")
                ? "bg-slate-800 text-white shadow-sm font-medium"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            } ${!isExpanded && "justify-center"}`}
            title="Tin Nhắn"
          >
            <MessageSquare className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span>Tin Nhắn</span>}
          </Link>
          <Link
            to="/stocks"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
              pathname.startsWith("/stocks")
                ? "bg-slate-800 text-white shadow-sm font-medium"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            } ${!isExpanded && "justify-center"}`}
            title="Thị Trường"
          >
            <TrendingUp className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span>Thị Trường</span>}
          </Link>
          <Link
            to="/articles"
            className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
              pathname.startsWith("/articles")
                ? "bg-slate-800 text-white shadow-sm font-medium"
                : "text-slate-400 hover:text-white hover:bg-slate-800/50"
            } ${!isExpanded && "justify-center"}`}
            title="Tin Tức"
          >
            <Newspaper className="w-5 h-5 flex-shrink-0" />
            {isExpanded && <span>Tin Tức</span>}
          </Link>
        </div>

        {/* Auth Section at the bottom of sidebar */}
        <div className="mt-auto px-3 pt-6 border-t border-slate-800/50">
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <div
                className={`flex items-center gap-3 py-3 rounded-xl cursor-default ${isExpanded ? "px-3 bg-slate-800/30" : "justify-center"}`}
                title={user?.name || user?.email || "Profile"}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center flex-shrink-0 ring-2 ring-indigo-500/20">
                  <User className="w-4 h-4 text-white" />
                </div>
                {isExpanded && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-slate-200 truncate">
                      {user?.name || "Người dùng"}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      {user?.email || "Profile"}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className={`flex items-center gap-3 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all ${isExpanded ? "px-4" : "justify-center"}`}
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="text-sm font-medium">Đăng xuất</span>
                )}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className={`flex items-center gap-3 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-lg shadow-indigo-600/20 ${isExpanded ? "px-4" : "justify-center mx-1"}`}
              title="Đăng Nhập"
            >
              <LogIn className="w-5 h-5 flex-shrink-0" />
              {isExpanded && (
                <span className="text-sm font-bold">Đăng Nhập</span>
              )}
            </Link>
          )}
        </div>
      </nav>

      <main className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
