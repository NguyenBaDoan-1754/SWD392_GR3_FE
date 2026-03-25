import {
  Headphones,
  History,
  Menu,
  MessageSquare,
  Pin,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

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
  activeConversationId?: string | null;
  onSelectConversation?: (id: string) => void;
  isAuthenticated?: boolean;
}

export default function Sidebar({
  isOpen,
  onToggle,
  onNewChat,
  onClearAll,
  conversations,
  activeConversationId,
  onSelectConversation,
  isAuthenticated = false,
}: SidebarProps) {
  const navigate = useNavigate();
  const [pinnedConversations, setPinnedConversations] = useState<Set<string>>(
    new Set(),
  );

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div
        className={`fixed h-full w-64 border-r border-slate-800 bg-slate-900 transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-50 lg:z-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 p-4">
            <h2 className="text-lg font-bold text-white">AI STOCK</h2>
            <motion.button
              onClick={onToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-slate-400 hover:text-white lg:hidden"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </div>

          <motion.button
            onClick={onNewChat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="m-4 flex w-auto items-center justify-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-white transition-colors hover:bg-slate-700"
          >
            <Plus className="h-5 w-5" />
            <span>New chat</span>
          </motion.button>

          <div className="flex-1 overflow-y-auto px-2">
            {conversations.length > 0 ? (
              <div className="space-y-3">
                {pinnedConversations.size > 0 && (
                  <div>
                    <p className="mb-2 px-2 text-sm font-semibold text-slate-400">
                      Đã ghim
                    </p>
                    <div className="space-y-2">
                      {conversations
                        .filter((conversation) =>
                          pinnedConversations.has(conversation.id),
                        )
                        .map((conversation) => (
                          <motion.div
                            key={conversation.id}
                            onClick={() =>
                              onSelectConversation?.(conversation.id)
                            }
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            }}
                            className={`flex cursor-pointer items-start justify-between gap-2 rounded-lg p-3 transition-colors ${
                              activeConversationId === conversation.id
                                ? "bg-indigo-600"
                                : "bg-slate-800/50 hover:bg-slate-700"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <p className="flex items-center gap-2 truncate text-sm text-slate-200">
                                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                                {conversation.title}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {conversation.timestamp.toLocaleDateString()}
                              </p>
                            </div>
                            <motion.button
                              onClick={(event) => {
                                event.stopPropagation();
                                setPinnedConversations((current) => {
                                  const next = new Set(current);
                                  next.delete(conversation.id);
                                  return next;
                                });
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 transition-colors hover:bg-indigo-500"
                            >
                              <Pin className="size-4 fill-white text-white" />
                            </motion.button>
                          </motion.div>
                        ))}
                    </div>
                  </div>
                )}

                <div>
                  {pinnedConversations.size > 0 && (
                    <p className="mb-2 px-2 text-sm font-semibold text-slate-400">
                      Lịch sử chat
                    </p>
                  )}
                  <div className="space-y-2">
                    {conversations
                      .filter(
                        (conversation) =>
                          !pinnedConversations.has(conversation.id),
                      )
                      .map((conversation) => (
                        <motion.div
                          key={conversation.id}
                          onClick={() =>
                            onSelectConversation?.(conversation.id)
                          }
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 10,
                          }}
                          className={`group flex cursor-pointer items-start justify-between gap-2 rounded-lg p-3 transition-colors ${
                            activeConversationId === conversation.id
                              ? "bg-indigo-600"
                              : "bg-slate-800/50 hover:bg-slate-700"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-2 truncate text-sm text-slate-200">
                              <MessageSquare className="h-4 w-4 flex-shrink-0" />
                              {conversation.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {conversation.timestamp.toLocaleDateString()}
                            </p>
                          </div>
                          <motion.button
                            onClick={(event) => {
                              event.stopPropagation();
                              setPinnedConversations((current) => {
                                const next = new Set(current);
                                next.add(conversation.id);
                                return next;
                              });
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex size-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 opacity-0 transition-all group-hover:bg-indigo-600 group-hover:opacity-100"
                          >
                            <Pin className="size-4 text-white" />
                          </motion.button>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-8 text-center text-sm text-slate-500">
                Chưa có cuộc trò chuyện nào
              </p>
            )}
          </div>

          <div className="space-y-3 border-t border-slate-800 p-4">
            {isAuthenticated && conversations.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex w-full items-center justify-center gap-2 rounded py-2 text-sm text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <Trash2 className="h-4 w-4" />
                Xóa tất cả
              </button>
            )}

            {isAuthenticated && (
              <motion.button
                onClick={() => navigate("/history")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-600/20 py-2 font-medium text-slate-300 transition-colors hover:border-indigo-500 hover:bg-indigo-600 hover:text-white"
              >
                <History className="h-4 w-4" />
                Lịch sử của tôi
              </motion.button>
            )}

            {isAuthenticated && (
              <motion.button
                onClick={() => navigate("/podcasts")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 py-2 font-medium text-slate-300 transition-colors hover:border-slate-500 hover:bg-slate-700 hover:text-white"
              >
                <Headphones className="h-4 w-4" />
                Podcast của tôi
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {!isOpen && (
        <motion.button
          onClick={onToggle}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="fixed bottom-6 left-6 z-40 rounded-lg bg-slate-800 p-3 text-white hover:bg-slate-700 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </motion.button>
      )}
    </>
  );
}
