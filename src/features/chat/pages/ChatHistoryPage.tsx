import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Music, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { getMyAudios, type MyAudioResponse } from "../../../api/chat.api";
import { useAuth } from "../../auth/hook/useAuth";
import Sidebar from "../components/Sidebar";
import { clearAuthRelatedStorage } from "../../../lib/auth-session";

export default function ChatHistoryPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading } = useAuth();

  const [history, setHistory] = useState<MyAudioResponse[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // We mock a simple sidebar open state for mobile as in ChatPage
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) return; // ProtectedRoute will handle redirect

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

  return (
    <div
      className="flex h-screen overflow-hidden text-slate-200"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      {/* Sidebar - Reused from ChatPage */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={() => navigate("/chat")}
        conversations={[]} // Optional: we don't necessarily need to load local ones here or we can just keep them empty since it's history view
        isAuthenticated={isAuthenticated}
        user={user ? { email: user.email, name: user.name } : null}
        onLogin={() => navigate("/login")}
        onLogout={() => {
          clearAuthRelatedStorage();
          localStorage.removeItem("authToken");
          navigate("/login");
        }}
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
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-800/80 text-slate-300 text-sm font-semibold uppercase tracking-wider backdrop-blur-md">
                        <th className="p-4 w-16 text-center border-b border-slate-700">
                          STT
                        </th>
                        <th className="p-4 w-1/4 border-b border-slate-700">
                          Câu Hỏi
                        </th>
                        <th className="p-4 w-2/5 border-b border-slate-700">
                          Câu Trả Lời
                        </th>
                        <th className="p-4 w-64 border-b border-slate-700 text-center">
                          Âm Thanh
                        </th>
                        <th className="p-4 w-32 border-b border-slate-700 text-center">
                          Thao Tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {history.map((item, index) => (
                        <tr
                          key={index}
                          className="hover:bg-slate-800/40 transition-colors group"
                        >
                          <td className="p-4 text-center text-slate-500 font-medium">
                            {index + 1}
                          </td>
                          <td className="p-4">
                            <div
                              className="text-slate-200 line-clamp-3 group-hover:line-clamp-none transition-all duration-300"
                              title={item.myQuestion}
                            >
                              {item.myQuestion || "N/A"}
                            </div>
                          </td>
                          <td className="p-4">
                            <div
                              className="text-slate-400 text-sm line-clamp-3 group-hover:line-clamp-none transition-all duration-300"
                              title={item.ChatAnswer}
                            >
                              {item.ChatAnswer || "N/A"}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            {item.audioUrl ? (
                              <audio
                                controls
                                className="w-full h-10 rounded-full bg-slate-800 [&::-webkit-media-controls-enclosure]:bg-slate-800 [&::-webkit-media-controls-enclosure]:border [&::-webkit-media-controls-enclosure]:border-slate-700"
                                src={item.audioUrl}
                              />
                            ) : (
                              <span className="text-slate-600 italic text-sm">
                                Không có âm thanh
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            {item.audioUrl && (
                              <motion.a
                                href={item.audioUrl}
                                download
                                target="_blank"
                                rel="noreferrer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="inline-flex items-center gap-2 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-indigo-500/30 hover:border-indigo-500"
                              >
                                <Download className="w-4 h-4" />
                                Tải
                              </motion.a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
