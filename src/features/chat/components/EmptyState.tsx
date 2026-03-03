import { Sparkles, Zap, MessageCircle, Lightbulb } from "lucide-react";

interface EmptyStateProps {
  onExampleClick?: (example: string) => void;
}

export default function EmptyState({ onExampleClick }: EmptyStateProps) {
  const examples = [
    {
      icon: Sparkles,
      title: "Explain quantum computing",
      description: "in simple terms",
    },
    {
      icon: Zap,
      title: "Got any creative ideas",
      description: "for a 10 year old's birthday?",
    },
    {
      icon: MessageCircle,
      title: "How do I make an HTTP",
      description: "request in Javascript?",
    },
    {
      icon: Lightbulb,
      title: "What are the most useful",
      description: "study techniques?",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full px-4 py-8">
      {/* Logo/Title */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">ChatGPT</h1>
        <p className="text-slate-400">Ask anything. Get answers instantly.</p>
      </div>

      {/* Examples Grid */}
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {examples.map((example, idx) => {
          const Icon = example.icon;
          return (
            <button
              key={idx}
              onClick={() => onExampleClick?.(example.title)}
              className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600 transition-colors text-left group"
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
            </button>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="mt-12 text-center text-xs text-slate-500 max-w-md">
        <p>
          ChatGPT can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
}
