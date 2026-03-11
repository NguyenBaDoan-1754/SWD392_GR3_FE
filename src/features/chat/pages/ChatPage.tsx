import { useEffect, useState } from "react";
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

const STORAGE_KEY_CONVERSATIONS = "ai_stock_conversations";
const STORAGE_KEY_ACTIVE_CONVERSATION = "ai_stock_active_conversation";

export default function ChatPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { messages, isLoading, error, sendMessage, clearMessages, setMessages } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
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
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title,
        timestamp: new Date(),
        messages,
      };

      const updatedConversations = [newConversation, ...conversations];
      setConversations(updatedConversations);
      localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(updatedConversations));
    }

    clearMessages();
    setActiveConversationId(null);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_CONVERSATION);
    setSidebarOpen(false);
  };

  const handleExampleClick = (example: string) => {
    sendMessage(example);
  };

  const loadConversationsFromStorage = () => {
    let loadedConversations: Conversation[] = [];

    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Convert timestamp strings to Date objects
          loadedConversations = parsed.map((conv: any) => ({
            ...conv,
            timestamp: conv.timestamp ? new Date(conv.timestamp) : new Date(),
          }));
          setConversations(loadedConversations);
        }
      }
    } catch {
      // ignore
    }

    try {
      const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_CONVERSATION);
      if (activeId) {
        const conv = loadedConversations.find((c) => c.id === activeId);
        if (conv) {
          setActiveConversationId(activeId);
          setMessages(conv.messages);
        }
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadConversationsFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONVERSATIONS, JSON.stringify(conversations));
    } catch {
      // ignore
    }
  }, [conversations]);

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
          localStorage.removeItem(STORAGE_KEY_CONVERSATIONS);
          localStorage.removeItem(STORAGE_KEY_ACTIVE_CONVERSATION);
        }}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          const conv = conversations.find((c) => c.id === id);
          if (conv) {
            setActiveConversationId(id);
            setMessages(conv.messages);
            localStorage.setItem(STORAGE_KEY_ACTIVE_CONVERSATION, id);
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
