import {
  Plus,
  Menu,
  X,
  MessageSquare,
  Trash2,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { useState, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  onClearAll?: () => void;
  conversations: Array<{
    id: string;
    title: string;
    timestamp: Date;
  }>;
  onSelectConversation?: (id: string) => void;
  isAuthenticated?: boolean;
  user?: { email: string; name?: string } | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export default function Sidebar({
  isOpen,
  onToggle,
  onNewChat,
  onClearAll,
  conversations,
  onSelectConversation,
  isAuthenticated = false,
  user = null,
  onLogin,
  onLogout,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [localUser, setLocalUser] = useState<{
    email?: string;
    name?: string;
  } | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("userProfile");
      if (raw) {
        const parsed = JSON.parse(raw);
        setLocalUser(parsed);
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  const displayName =
    user?.name || localUser?.name || user?.email || localUser?.email || null;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative w-64 h-screen bg-slate-900 border-r border-slate-800 transition-transform duration-300 z-50 lg:z-0 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">AI STOCK</h2>
            <button
              onClick={onToggle}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="m-4 flex items-center justify-center gap-2 w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New chat</span>
          </button>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto px-3 space-y-2">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  onMouseEnter={() => setHoveredId(conv.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700 cursor-pointer transition-colors flex items-start justify-between gap-2"
                  onClick={() => onSelectConversation?.(conv.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 text-sm truncate flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 flex-shrink-0" />
                      {conv.title}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      {conv.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                  {hoveredId === conv.id && (
                    <button className="flex-shrink-0 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-slate-500 text-sm text-center mt-8">
                No conversations yet
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            {isAuthenticated && conversations.length > 0 && (
              <button
                onClick={onClearAll}
                className="w-full text-slate-400 hover:text-white text-sm py-2 hover:bg-slate-800 rounded transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </button>
            )}

            {/* User Info or Login Button */}
            {isAuthenticated && user ? (
              <>
                <div className="bg-slate-800 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  {displayName ? (
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {displayName}
                      </p>
                    </div>
                  ) : null}
                </div>
                <button
                  onClick={onLogout}
                  className="w-full text-slate-400 hover:text-red-400 text-sm py-2 hover:bg-slate-800 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={onLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed bottom-6 left-6 lg:hidden z-40 bg-slate-800 text-white p-3 rounded-lg hover:bg-slate-700"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}
    </>
  );
}
