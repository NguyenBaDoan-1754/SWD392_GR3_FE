import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-slate-800 bg-slate-950 px-4 py-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex gap-3 items-end">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Message AI Stock..."
            className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:border focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.4)] disabled:opacity-50 placeholder-slate-500 text-sm md:text-base transition-all"
          />
          <motion.button
            type="submit"
            disabled={isLoading || !input.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white rounded-lg p-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </div>
    </form>
  );
}
