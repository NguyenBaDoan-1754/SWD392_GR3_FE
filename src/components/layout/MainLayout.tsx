import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Headphones,
  Home,
  LogIn,
  LogOut,
  MessageSquare,
  Newspaper,
  TrendingUp,
  User,
} from "lucide-react";
import { useAuth } from "../../features/auth/hook/useAuth";
import { useUserProfile } from "../../features/dashboard-admin/hook/useUserProfile";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { pathname } = useLocation();
  const { isAuthenticated, user: authUser, logout } = useAuth();
  const { userProfile } = useUserProfile();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const displayUser = userProfile || {
    name: authUser?.name || "Người dùng",
    email: authUser?.email || "Profile",
  };

  const navItems = [
    {
      href: "/",
      label: "Trang chủ",
      icon: Home,
      isActive: pathname === "/",
    },
    {
      href: "/chat",
      label: "Tin nhắn",
      icon: MessageSquare,
      isActive: pathname.startsWith("/chat"),
    },
    {
      href: "/market",
      label: "Thị trường",
      icon: TrendingUp,
      isActive: pathname.startsWith("/market"),
    },
    {
      href: "/podcasts",
      label: "Podcast",
      icon: Headphones,
      isActive: pathname.startsWith("/podcasts"),
    },
    {
      href: "/news",
      label: "Tin tức",
      icon: Newspaper,
      isActive: pathname.startsWith("/news"),
    },
  ];

  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-950 text-slate-200">
      <nav
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`relative ${isExpanded ? "w-64 shadow-2xl" : "w-20"} z-40 flex flex-shrink-0 flex-col border-r border-slate-800 bg-slate-900 py-6 transition-[width,box-shadow] duration-300 ease-in-out`}
      >
        <Link
          to="/"
          className={`group mb-8 flex items-center gap-3 ${
            isExpanded ? "px-6" : "justify-center px-0"
          }`}
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white shadow-lg shadow-indigo-600/20 transition-colors group-hover:bg-indigo-500">
            S
          </div>
          {isExpanded && (
            <span className="overflow-hidden whitespace-nowrap text-lg font-bold tracking-wide text-white">
              StockAgent
            </span>
          )}
        </Link>

        <div className="flex flex-1 flex-col gap-2 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                title={item.label}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 transition-all ${
                  item.isActive
                    ? "bg-slate-800 font-medium text-white shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                } ${!isExpanded ? "justify-center" : ""}`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isExpanded && <span>{item.label}</span>}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto border-t border-slate-800/50 px-3 pt-6">
          {isAuthenticated ? (
            <div className="flex flex-col gap-2">
              <Link
                to="/profile"
                title={displayUser?.name || "Profile"}
                className={`flex items-center gap-3 rounded-xl py-3 transition-colors hover:bg-slate-800 ${
                  isExpanded ? "px-3" : "justify-center"
                }`}
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 ring-2 ring-indigo-500/20">
                  <User className="h-4 w-4 text-white" />
                </div>
                {isExpanded && (
                  <div className="min-w-0 flex flex-col">
                    <span className="truncate text-sm font-semibold text-slate-200">
                      {displayUser?.name}
                    </span>
                    <span className="truncate text-xs text-slate-500">
                      {displayUser?.email}
                    </span>
                  </div>
                )}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                title="Đăng xuất"
                className={`flex items-center gap-3 rounded-xl py-3 text-slate-400 transition-all hover:bg-rose-500/10 hover:text-rose-400 ${
                  isExpanded ? "px-4" : "justify-center"
                }`}
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {isExpanded && (
                  <span className="text-sm font-medium">Đăng xuất</span>
                )}
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              title="Đăng nhập"
              className={`flex items-center gap-3 rounded-xl bg-indigo-600 py-3 text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 ${
                isExpanded ? "px-4" : "mx-1 justify-center"
              }`}
            >
              <LogIn className="h-5 w-5 flex-shrink-0" />
              {isExpanded && <span className="text-sm font-bold">Đăng nhập</span>}
            </Link>
          )}
        </div>
      </nav>

      <main className="relative min-w-0 flex-1 overflow-hidden">
        <div className="custom-scrollbar h-full overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
