import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../hook/useChat";
import { useAuth } from "../../auth/hook/useAuth";
import ChatWindow from "../components/ChatWindow";
import ChatInput from "../components/ChatInput";
import EmptyState from "../components/EmptyState";
import Sidebar from "../components/Sidebar";
import { Settings } from "lucide-react";
import { motion } from "motion/react";

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messages: any[];
}

export default function ChatPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const handleNewChat = () => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    if (messages.length > 0) {
      // Save current conversation
      const title =
        messages[0]?.content?.substring(0, 30) || "New conversation";
      setConversations([
        {
          id: Date.now().toString(),
          title,
          timestamp: new Date(),
          messages,
        },
        ...conversations,
      ]);
      clearMessages();
    }
    setSidebarOpen(false);
  };

  const handleExampleClick = (example: string) => {
    sendMessage(example);
  };

  return (
    <div
      className="flex h-screen"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      }}
    >
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        onClearAll={() => {
          setConversations([]);
          clearMessages();
        }}
        conversations={conversations}
        onSelectConversation={(id) => {
          // Load conversation
          const conv = conversations.find((c) => c.id === id);
          if (conv) {
            clearMessages();
            // In a real app, you would restore the messages here
          }
        }}
        isAuthenticated={isAuthenticated}
        user={user ? { email: user.email, name: user.name } : null}
        onLogin={() => setLoginModalOpen(true)}
        onLogout={() => {
          localStorage.removeItem("authToken");
          navigate("/login");
        }}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-white text-lg font-semibold">AI STOCK</h1>
          </div>
          {messages.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="text-slate-400 hover:text-white p-2 rounded hover:bg-slate-800 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 m-4 rounded">
            <p className="text-sm font-semibold">Error</p>
            <p className="text-xs">{error}</p>
          </div>
        )}

        {/* Chat Window or Empty State */}
        {messages.length === 0 ? (
          <EmptyState
            onExampleClick={handleExampleClick}
            isAuthenticated={isAuthenticated}
            onShowLoginModal={() => setLoginModalOpen(true)}
          />
        ) : (
          <ChatWindow messages={messages} isLoading={isLoading} />
        )}

        {/* Chat Input */}
        <ChatInput
          onSend={(msg) => {
            if (!isAuthenticated) {
              setLoginModalOpen(true);
              return;
            }
            sendMessage(msg);
          }}
          isLoading={isLoading}
        />
      </div>

      {/* Login Modal */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 rounded-lg p-6 w-full max-w-sm">
            <h3 className="text-white text-lg font-semibold mb-4">
              Bạn cần đăng nhập
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Vui lòng đăng nhập để sử dụng chat.
            </p>
            <div className="flex gap-2">
              <motion.button
                onClick={() => {
                  setLoginModalOpen(false);
                  navigate("/login");
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
              >
                Đăng nhập
              </motion.button>
              <motion.button
                onClick={() => setLoginModalOpen(false)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg"
              >
                Hủy
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
