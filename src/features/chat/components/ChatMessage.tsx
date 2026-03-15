import {
  MessageCircle,
  Bot,
  Play,
  Pause,
  RotateCcw,
  Volume2,
} from "lucide-react";
import { useRef, useState, useEffect } from "react";

const PLAYED_AUDIO_IDS_KEY = "played_chat_audio_message_ids";

const getPlayedAudioIds = (): string[] => {
  try {
    const raw = sessionStorage.getItem(PLAYED_AUDIO_IDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const markAudioAsPlayed = (messageId: string) => {
  try {
    const ids = getPlayedAudioIds();
    if (!ids.includes(messageId)) {
      sessionStorage.setItem(
        PLAYED_AUDIO_IDS_KEY,
        JSON.stringify([...ids, messageId]),
      );
    }
  } catch {
    // ignore
  }
};

const hasPlayedAudio = (messageId: string) => {
  return getPlayedAudioIds().includes(messageId);
};

const formatTime = (s: number) => {
  if (!Number.isFinite(s)) return "00:00";
  const m = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
};

interface ChatMessageProps {
  messageId: string;
  type: "user" | "assistant";
  content: string;
  audioUrl?: string;
  shouldAutoPlay?: boolean;
}

export default function ChatMessage({
  messageId,
  type,
  content,
  audioUrl,
  shouldAutoPlay = false,
}: ChatMessageProps) {
  const isUser = type === "user";

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => setIsPlaying(false);
    const onPause = () => setIsPlaying(false);
    const onPlay = () => setIsPlaying(true);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("play", onPlay);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("play", onPlay);
    };
  }, [audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audioUrl || !audio || !shouldAutoPlay || isUser) return;
    if (hasPlayedAudio(messageId)) return;

    // Đánh dấu trước để tránh quay lại trang rồi auto-play lại hàng loạt
    markAudioAsPlayed(messageId);

    const tryAutoPlay = async () => {
      try {
        await audio.play();
      } catch {
        // Browser có thể chặn auto-play, user vẫn bấm Play thủ công được
      }
    };

    void tryAutoPlay();
  }, [audioUrl, shouldAutoPlay, messageId, isUser]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        // ignore
      }
    } else {
      audio.pause();
    }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Number(e.target.value);
    audio.currentTime = next;
    setCurrentTime(next);
  };

  const rewind10s = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

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

          {!isUser && audioUrl && (
            <div className="mt-3 rounded-xl border border-slate-600/50 bg-slate-900/60 p-3 backdrop-blur">
              <audio ref={audioRef} src={audioUrl} preload="metadata" />
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-cyan-300" />
                <span className="text-xs uppercase tracking-wider text-cyan-300">
                  Podcast
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-cyan-500 text-slate-900 flex items-center justify-center hover:scale-105 transition"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                  )}
                </button>

                <button
                  onClick={rewind10s}
                  className="w-8 h-8 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center hover:bg-slate-600 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <div className="flex-1">
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={seek}
                    className="w-full accent-cyan-400"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 flex gap-1 h-3 items-end">
                {[...Array(16)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded bg-cyan-300/80 ${
                      isPlaying ? "animate-pulse" : ""
                    }`}
                    style={{
                      height: `${(i % 5) + 4}px`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
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
