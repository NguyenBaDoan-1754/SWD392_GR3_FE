import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Music,
  Loader2,
  MessageSquare,
  Bot,
  Volume2,
  Eye,
  X,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { getMyAudios, type MyAudioResponse } from "../../../api/chat.api";
import { useAuth } from "../../auth/hook/useAuth";
import Sidebar from "../components/Sidebar";

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messages: any[];
}

function renderBoldMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={`bold-${index}`}>{part.slice(2, -2)}</strong>;
    }

    return <span key={`text-${index}`}>{part}</span>;
  });
}

export default function ChatHistoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();

  const [history, setHistory] = useState<MyAudioResponse[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<{
    item: MyAudioResponse;
    index: number;
  } | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const userIdentifier = user?.email || "guest";
  const STORAGE_KEY_CONVERSATIONS = `chat_convs_${userIdentifier}`;
  const STORAGE_KEY_ACTIVE_CONVERSATION = `chat_active_${userIdentifier}`;

  useEffect(() => {
    if (isLoading) return;

    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
      if (raw) {
        const parsed = JSON.parse(raw);
        setConversations(
          Array.isArray(parsed)
            ? parsed.map((c: any) => ({
                ...c,
                timestamp: new Date(c.timestamp),
              }))
            : [],
        );
      }
    } catch (e) {
      console.error("Error loading conversations in history page:", e);
    }
  }, [userIdentifier, isLoading, STORAGE_KEY_CONVERSATIONS]);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return;

    const fetchHistory = async () => {
      try {
        setIsLoadingHistory(true);
        const data = await getMyAudios();
        if (data.code === 200 && data.result) {
          setHistory(data.result);
        } else {
          setError(data.message || "Failed to load chat history");
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoadingHistory(false);
      }
    };

    fetchHistory();
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    if (!selectedEntry) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedEntry(null);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedEntry]);

  return (
    <div
      className="flex h-screen overflow-hidden text-slate-200"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={() => navigate("/chat")}
        onClearAll={() => {
          if (
            window.confirm(
              "Bạn có chắc chắn muốn xóa tất cả lịch sử trò chuyện của tài khoản này?",
            )
          ) {
            setConversations([]);
            localStorage.removeItem(STORAGE_KEY_CONVERSATIONS);
            localStorage.removeItem(STORAGE_KEY_ACTIVE_CONVERSATION);
          }
        }}
        conversations={conversations}
        onSelectConversation={(id) => {
          localStorage.setItem(STORAGE_KEY_ACTIVE_CONVERSATION, id);
          navigate("/chat");
        }}
        isAuthenticated={isAuthenticated}
        user={user ? { email: user.email, name: user.name } : null}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-4 flex items-center gap-4">
          <motion.button
            onClick={() => navigate("/chat")}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-white text-xl font-bold">
            Lịch Sử Trò Chuyện & Âm Thanh
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {isLoadingHistory ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-slate-400">Đang tải lịch sử...</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/40 border border-red-700/50 text-red-200 px-6 py-4 rounded-xl flex items-center justify-center">
                <p>Lỗi: {error}</p>
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                <Music className="w-12 h-12 text-slate-600 mb-4" />
                <p className="text-slate-400 text-lg">
                  Bạn chưa có lịch sử trò chuyện nào.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4 backdrop-blur-sm sm:max-w-xs">
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
                      Tổng lịch sử
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                        <MessageSquare className="w-5 h-5" />
                      </span>
                      <p className="text-2xl font-bold text-white">
                        {history.length}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {history.map((item, index) => (
                    <motion.div
                      key={`${item.myQuestion}-${index}`}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.04, 0.24) }}
                      className="relative overflow-hidden rounded-2xl border border-slate-700/70 bg-gradient-to-br from-slate-900/85 via-slate-900/70 to-slate-800/80 p-5 shadow-xl"
                    >
                      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl" />

                      <div className="relative flex items-start justify-between gap-3 mb-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-200">
                          <Sparkles className="w-3.5 h-3.5" />
                          Lịch sử #{index + 1}
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-cyan-500/15 px-3 py-1 text-xs text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-200" />
                          </span>
                          <Volume2 className="w-3.5 h-3.5" />
                          Audio sẵn sàng
                        </div>
                      </div>

                      <div className="relative space-y-4">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5" />
                            Câu hỏi
                          </p>
                          <p className="text-slate-100 line-clamp-2 leading-relaxed">
                            {item.myQuestion || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                            <Bot className="w-3.5 h-3.5" />
                            Câu trả lời
                          </p>
                          <p className="text-slate-300 text-sm line-clamp-2 leading-relaxed">
                            {item.ChatAnswer || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="relative mt-5 flex items-center justify-between gap-3">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setSelectedEntry({ item, index })}
                          className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/50 bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-500/35 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Xem chi tiết
                        </motion.button>

                        {item.audioUrl ? (
                          <motion.a
                            href={item.audioUrl}
                            download
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-3.5 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-500/25 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            Tải âm thanh
                          </motion.a>
                        ) : (
                          <span className="text-xs text-slate-500 italic">
                            Chưa có audio để tải
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {selectedEntry && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm p-4 flex items-center justify-center"
          onClick={() => setSelectedEntry(null)}
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl max-h-[88vh] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-700 px-6 py-4 bg-slate-900/95">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">
                  Chi tiết lịch sử
                </p>
                <h2 className="text-lg font-semibold text-white mt-1">
                  Hội thoại #{selectedEntry.index + 1}
                </h2>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6 max-h-[calc(88vh-70px)]">
              <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
                <p className="text-xs uppercase tracking-wider text-indigo-300 mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Câu hỏi đầy đủ
                </p>
                <p className="text-slate-100 whitespace-pre-wrap leading-relaxed">
                  {selectedEntry.item.myQuestion || "N/A"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
                <p className="text-xs uppercase tracking-wider text-emerald-300 mb-2 flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5" />
                  Câu trả lời đầy đủ
                </p>
                <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedEntry.item.ChatAnswer
                    ? renderBoldMarkdown(selectedEntry.item.ChatAnswer)
                    : "N/A"}
                </p>
              </div>

              <div className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
                <p className="text-xs uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  Âm thanh
                </p>

                {selectedEntry.item.audioUrl ? (
                  <div className="space-y-4">
                    <audio
                      controls
                      className="w-full h-11 rounded-full bg-slate-800 [&::-webkit-media-controls-enclosure]:bg-slate-800 [&::-webkit-media-controls-enclosure]:border [&::-webkit-media-controls-enclosure]:border-slate-700"
                      src={selectedEntry.item.audioUrl}
                    />
                    <a
                      href={selectedEntry.item.audioUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/40 bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-500/35 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Tải âm thanh
                    </a>
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Không có âm thanh</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
