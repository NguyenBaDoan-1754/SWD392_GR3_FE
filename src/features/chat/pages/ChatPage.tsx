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
import MainLayout from "../../../components/layout/MainLayout";

interface Conversation {
  id: string;
  title: string;
  timestamp: Date;
  messages: any[];
}

// Prefix cho các key lưu trữ
const CONVS_KEY_PREFIX = "chat_convs_";
const ACTIVE_KEY_PREFIX = "chat_active_";

export default function ChatPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Xác định key lưu trữ dựa trên email người dùng (hoặc 'guest')
  const userIdentifier = user?.email || "guest";
  const STORAGE_KEY_CONVERSATIONS = `${CONVS_KEY_PREFIX}${userIdentifier}`;
  const STORAGE_KEY_ACTIVE_CONVERSATION = `${ACTIVE_KEY_PREFIX}${userIdentifier}`;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  );

  const { messages, isLoading, error, sendMessage, setMessages } = useChat(
    activeConversation?.messages || [],
  );

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // Load data khi userIdentifier thay đổi
  useEffect(() => {
    if (authLoading) return;

    try {
      const rawConvs = localStorage.getItem(STORAGE_KEY_CONVERSATIONS);
      const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_CONVERSATION);

      let loadedConvs: Conversation[] = [];
      if (rawConvs) {
        const parsed = JSON.parse(rawConvs);
        loadedConvs = Array.isArray(parsed)
          ? parsed.map((c: any) => ({
              ...c,
              timestamp: new Date(c.timestamp),
            }))
          : [];
      }

      setConversations(loadedConvs);
      setActiveConversationId(activeId);

      const activeConv = loadedConvs.find((c) => c.id === activeId);
      setMessages(activeConv ? activeConv.messages : []);
      setIsInitialLoadDone(true);
    } catch (e) {
      console.error("Error loading user chat history:", e);
      setConversations([]);
      setActiveConversationId(null);
      setMessages([]);
      setIsInitialLoadDone(true);
    }
  }, [userIdentifier, authLoading, setMessages]);

  // Sync active conversation messages and save to localStorage
  useEffect(() => {
    if (!isInitialLoadDone) return;

    if (activeConversationId && messages.length > 0) {
      setConversations((prev) => {
        const index = prev.findIndex((c) => c.id === activeConversationId);
        if (index === -1) return prev;

        const updated = [...prev];
        const current = updated[index];

        let newTitle = current.title;
        if (current.messages.length === 0 && messages.length > 0) {
          const firstMsg = messages[0].content;
          newTitle =
            firstMsg.substring(0, 40) + (firstMsg.length > 40 ? "..." : "");
        }

        updated[index] = {
          ...current,
          messages,
          title: newTitle,
          timestamp: new Date(),
        };

        if (index > 0) {
          const [item] = updated.splice(index, 1);
          updated.unshift(item);
        }

        return updated;
      });
    } else if (!activeConversationId && messages.length > 0) {
      const newId = Date.now().toString();
      const firstMsgText = messages[0].content;
      const newConv: Conversation = {
        id: newId,
        title:
          firstMsgText.substring(0, 40) +
          (firstMsgText.length > 40 ? "..." : ""),
        timestamp: new Date(),
        messages: messages,
      };
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newId);
      localStorage.setItem(STORAGE_KEY_ACTIVE_CONVERSATION, newId);
    }
  }, [
    messages,
    activeConversationId,
    isInitialLoadDone,
    STORAGE_KEY_ACTIVE_CONVERSATION,
  ]);

  // Persistent save
  useEffect(() => {
    if (isInitialLoadDone) {
      localStorage.setItem(
        STORAGE_KEY_CONVERSATIONS,
        JSON.stringify(conversations),
      );
    }
  }, [conversations, isInitialLoadDone, STORAGE_KEY_CONVERSATIONS]);

  const handleNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
    localStorage.removeItem(STORAGE_KEY_ACTIVE_CONVERSATION);
    setSidebarOpen(false);
  };

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) {
      setActiveConversationId(id);
      setMessages(conv.messages);
      localStorage.setItem(STORAGE_KEY_ACTIVE_CONVERSATION, id);
      setSidebarOpen(false);
    }
  };

  const handleExampleClick = (example: string) => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }
    sendMessage(example);
  };

  return (
    <MainLayout>
      <div
        className="flex h-full"
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
            if (
              window.confirm(
                "Bạn có chắc chắn muốn xóa tất cả lịch sử trò chuyện của tài khoản này?",
              )
            ) {
              setConversations([]);
              setMessages([]);
              setActiveConversationId(null);
              localStorage.removeItem(STORAGE_KEY_CONVERSATIONS);
              localStorage.removeItem(STORAGE_KEY_ACTIVE_CONVERSATION);
            }
          }}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          isAuthenticated={isAuthenticated}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-slate-900/50 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <Settings className="w-5 h-5" />
              </button>
              <h1 className="text-white text-lg font-semibold">AI STOCK</h1>
            </div>
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
    </MainLayout>
  );
}
