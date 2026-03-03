import {
  Plus,
  Menu,
  X,
  MessageSquare,
  Trash2,
  LogIn,
  LogOut,
  User,
  Pin,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

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
  const [pinnedConversations, setPinnedConversations] = useState<Set<string>>(
    new Set(),
  );
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
            <motion.button
              onClick={onToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* New Chat Button */}
          <motion.button
            onClick={onNewChat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="m-4 flex items-center justify-center gap-2 w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New chat</span>
          </motion.button>

          {/* Conversations with Pin List */}
          <div className="flex-1 overflow-y-auto px-2">
            {conversations.length > 0 ? (
              <div className="space-y-3">
                {/* Pinned Conversations */}
                {pinnedConversations.size > 0 && (
                  <div>
                    <p className="text-slate-400 font-semibold text-sm px-2 mb-2">
                      Pinned Conversations
                    </p>
                    <div className="space-y-2">
                      {conversations
                        .filter((conv) => pinnedConversations.has(conv.id))
                        .map((conv) => (
                          <motion.div
                            key={conv.id}
                            onClick={() => onSelectConversation?.(conv.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                            className="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700 cursor-pointer transition-colors flex items-start justify-between gap-2"
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
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPinnedConversations((prev) => {
                                  const next = new Set(prev);
                                  next.delete(conv.id);
                                  return next;
                                });
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex items-center justify-center size-8 rounded-full bg-indigo-600 hover:bg-indigo-500 flex-shrink-0 transition-colors"
                            >
                              <Pin className="size-4 text-white fill-white" />
                            </motion.button>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Chat History */}
                <div>
                  {pinnedConversations.size > 0 && (
                    <p className="text-slate-400 font-semibold text-sm px-2 mb-2">
                      Chat History
                    </p>
                  )}
                  <div className="space-y-2">
                    {conversations
                      .filter((conv) => !pinnedConversations.has(conv.id))
                      .map((conv) => (
                        <motion.div
                          key={conv.id}
                          onClick={() => onSelectConversation?.(conv.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                          className="group p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700 cursor-pointer transition-colors flex items-start justify-between gap-2"
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
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              setPinnedConversations((prev) => {
                                const next = new Set(prev);
                                next.add(conv.id);
                                return next;
                              });
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center size-8 rounded-full bg-slate-700 group-hover:bg-indigo-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Pin className="size-4 text-white" />
                          </motion.button>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
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
                <motion.button
                  onClick={onLogout}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="w-full text-slate-400 hover:text-red-400 text-sm py-2 hover:bg-slate-800 rounded transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.button
                onClick={onLogin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      {!isOpen && (
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="fixed bottom-6 left-6 lg:hidden z-40 bg-slate-800 text-white p-3 rounded-lg hover:bg-slate-700"
        >
          <Menu className="w-6 h-6" />
        </motion.button>
      )}
    </>
  );
}
