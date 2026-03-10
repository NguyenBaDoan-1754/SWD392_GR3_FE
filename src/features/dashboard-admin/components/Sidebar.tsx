import {
  BarChart3,
  Users,
  Settings,
  LogOut,
  User,
  ChevronDown,
  Activity,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUserProfile } from "../hook/useUserProfile";
import { useAuth } from "../../auth/hook/useAuth";
import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile, isLoading } = useUserProfile();
  const { user: tokenUser, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
    { icon: Activity, label: "Background Jobs", href: "/background-jobs" },
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
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">StockCast AI</h1>
            <p className="text-slate-400 text-xs">Admin Panel</p>
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
        {isLoading ? (
          <div className="text-slate-400 text-xs">Loading...</div>
        ) : userProfile ? (
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left">
                <p className="text-white text-sm font-medium">
                  {userProfile.name}
                </p>
                <p className="text-slate-400 text-xs">{userProfile.email}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${showProfileMenu ? "transform rotate-180" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden z-10">
                <Link
                  to="/profile"
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-t border-slate-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}

            {/* Debug info */}
            {(tokenUser?.role || tokenUser?.roles) && (
              <p className="text-yellow-400 text-xs mt-2">
                Token:{" "}
                {Array.isArray(tokenUser?.roles)
                  ? tokenUser.roles.join(", ")
                  : tokenUser?.role}
              </p>
            )}
          </div>
        ) : (
          <div className="text-slate-400 text-xs">Error loading profile</div>
        )}
      </div>
    </aside>
  );
}
