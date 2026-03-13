import { useEffect, useState } from "react";
import { sendChatMessage } from "../../../api/chat.api";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  audioUrl?: string;
}

const STORAGE_KEY = "ai_stock_chat_messages";

const loadMessagesFromStorage = (): Message[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
};

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>(() =>
    loadMessagesFromStorage(),
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage({ question: content });

      const assistantText =
        response.answerText?.trim() ||
        response.answer?.trim() ||
        response.response?.trim() ||
        "Không có phản hồi từ hệ thống.";

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: assistantText,
        timestamp: new Date(),
        audioUrl: response.audioUrl,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat Error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    setMessages,
  };
};
