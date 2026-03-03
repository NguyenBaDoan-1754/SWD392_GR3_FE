import { Sparkles, Zap, MessageCircle, Lightbulb } from "lucide-react";
import { motion } from "motion/react";

interface EmptyStateProps {
  onExampleClick?: (example: string) => void;
}

export default function EmptyState({ onExampleClick }: EmptyStateProps) {
  const examples = [
    {
      icon: Sparkles,
      title: "Analyze AAPL stock",
      description: "recent performance and drivers",
    },
    {
      icon: Zap,
      title: "Predict VNINDEX trend",
      description: "short-term outlook",
    },
    {
      icon: MessageCircle,
      title: "Compare TSLA vs NVDA",
      description: "key metrics and sentiment",
    },
    {
      icon: Lightbulb,
      title: "Portfolio risk analysis",
      description: "identify concentration risks",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8">
      {/* Logo/Title with Glow */}
      <div className="text-center mb-12 relative">
        {/* Glow effect */}
        <div className="absolute inset-0 w-[300px] h-[300px] mx-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500/30 to-cyan-500/30 blur-3xl rounded-full z-0" />
        <h1
          className="text-5xl font-bold mb-2 relative z-10"
          style={{
            background: "linear-gradient(90deg, #38bdf8, #6366f1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          AI Stock
        </h1>
        <p className="text-slate-400">Ask anything. Get answers instantly.</p>
      </div>

      {/* Examples Grid */}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {examples.map((example, idx) => {
          const Icon = example.icon;
          return (
            <motion.button
              key={idx}
              onClick={() => onExampleClick?.(example.title)}
              whileHover={{ scale: 1.02, translateY: -6 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="p-4 rounded-[18px] bg-[rgba(255,255,255,0.04)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] transition-all duration-300 hover:border-[rgba(99,102,241,0.4)] hover:shadow-[0_10px_40px_rgba(99,102,241,0.2)] text-left group"
            >
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 text-slate-400 group-hover:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">
                    {example.title}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">
                    {example.description}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-12 text-center text-xs text-slate-500 max-w-md">
        <p>
          AI Stock may make mistakes. Verify important information before
          acting.
        </p>
      </div>
    </div>
  );
}
