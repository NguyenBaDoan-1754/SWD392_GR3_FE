import { MessageCircle, Bot } from "lucide-react";

interface ChatMessageProps {
  type: "user" | "assistant";
  content: string;
}

export default function ChatMessage({ type, content }: ChatMessageProps) {
  const isUser = type === "user";

  return (
    <div
      className={`flex gap-4 mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mt-1">
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div className={`flex-1 max-w-2xl ${isUser ? "text-right" : ""}`}>
        <div
          className={`inline-block rounded-lg px-4 py-3 ${
            isUser
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {content
              .replace(/\\n/g, "\n")
              .split("\n")
              .map((line, i, arr) => (
                <span key={i} style={{ display: "block" }}>
                  {line}
                  {i < arr.length - 1 && <br />}
                </span>
              ))}
          </p>
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center mt-1">
          <MessageCircle className="w-5 h-5 text-slate-200" />
        </div>
      )}
    </div>
  );
}
