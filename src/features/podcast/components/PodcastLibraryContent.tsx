import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Headphones,
  Loader2,
  MessageSquareText,
  Pause,
  Play,
  RefreshCw,
  Search,
  Sparkles,
  Square,
  Volume2,
} from "lucide-react";
import {
  getPodcastLogs,
  type PodcastLogItem,
} from "../../../api/podcast.api";

type PodcastAudience = "user" | "admin";
type PodcastFilter = "all" | "morning" | "afternoon";
type SpeechLanguage = "vi" | "en";

interface PodcastLibraryContentProps {
  audience: PodcastAudience;
}

interface PodcastEntry extends PodcastLogItem {
  id: string;
  title: string;
  subtitle: string;
  createdDateLabel: string;
  isoDate: string;
  hasAudio: boolean;
}

const languageOptions: Array<{ value: SpeechLanguage; label: string }> = [
  { value: "vi", label: "Tiếng Việt" },
  { value: "en", label: "English" },
];

function normalizeText(value?: string | null) {
  return value?.trim() || "";
}

function padDatePart(value: number) {
  return value.toString().padStart(2, "0");
}

function normalizeDateValue(value: unknown) {
  if (typeof value === "string") {
    const trimmed = value.trim();

    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      return trimmed;
    }

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      return `${parsed.getFullYear()}-${padDatePart(parsed.getMonth() + 1)}-${padDatePart(parsed.getDate())}`;
    }

    return "";
  }

  if (
    Array.isArray(value) &&
    value.length >= 3 &&
    typeof value[0] === "number" &&
    typeof value[1] === "number" &&
    typeof value[2] === "number"
  ) {
    return `${value[0]}-${padDatePart(value[1])}-${padDatePart(value[2])}`;
  }

  return "";
}

function formatDateLabel(date?: unknown) {
  const normalizedDate = normalizeDateValue(date);

  if (!normalizedDate) {
    return "Chưa rõ ngày";
  }

  const parsed = new Date(`${normalizedDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return "Chưa rõ ngày";
  }

  return new Intl.DateTimeFormat("vi-VN").format(parsed);
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trim()}...`;
}

function getSessionLabel(session?: string) {
  const normalized = session?.toLowerCase();

  if (normalized === "morning") {
    return "Phiên sáng";
  }

  if (normalized === "afternoon") {
    return "Phiên chiều";
  }

  return session || "Podcast";
}

function buildEntries(items: PodcastLogItem[]): PodcastEntry[] {
  const sessionOrder: Record<string, number> = {
    afternoon: 0,
    morning: 1,
  };

  return items
    .map((item, index) => {
      const isoDate = normalizeDateValue(item.date);
      const sessionLabel = getSessionLabel(item.session);
      const dateLabel = formatDateLabel(item.date);

      return {
        ...item,
        id: `${isoDate || "unknown"}-${item.session || "podcast"}-${index}`,
        title: truncate(`${sessionLabel} • ${dateLabel}`, 72),
        subtitle: `${sessionLabel} • ${dateLabel} • ${item.status}`,
        createdDateLabel: dateLabel,
        isoDate,
        hasAudio: Boolean(normalizeText(item.audioUrl)),
      };
    })
    .sort((left, right) => {
      if (left.isoDate === right.isoDate) {
        return (
          (sessionOrder[left.session?.toLowerCase()] ?? 9) -
          (sessionOrder[right.session?.toLowerCase()] ?? 9)
        );
      }

      return right.isoDate.localeCompare(left.isoDate);
    });
}

function getPageCopy(audience: PodcastAudience) {
  if (audience === "admin") {
    return {
      badge: "Kho podcast",
      title: "Nghe lại podcast đã tạo cho quản trị viên",
      description:
        "Theo dõi podcast theo từng ngày và từng phiên để mở nhanh nội dung âm thanh ngay trên giao diện quản trị.",
    };
  }

  return {
    badge: "Podcast của bạn",
    title: "Nghe lại các podcast thị trường đã được tạo",
    description:
      "Chọn từng podcast để nghe ngay trên trang, lọc theo phiên sáng hoặc chiều và xem thông tin tương ứng.",
  };
}

function findNearestAvailableDate(targetDate: string, items: PodcastEntry[]) {
  const targetTime = new Date(`${targetDate}T00:00:00`).getTime();

  if (Number.isNaN(targetTime)) {
    return null;
  }

  let bestDate: string | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (const item of items) {
    if (!item.isoDate) {
      continue;
    }

    const currentTime = new Date(`${item.isoDate}T00:00:00`).getTime();
    if (Number.isNaN(currentTime)) {
      continue;
    }

    const distance = Math.abs(currentTime - targetTime);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestDate = item.isoDate;
    }
  }

  return bestDate;
}

async function fetchAllPodcastLogs(session?: string) {
  const collected: PodcastLogItem[] = [];
  const pageSize = 100;
  let currentPage = 0;
  let totalPages = 1;

  while (currentPage < totalPages) {
    const response = await getPodcastLogs({
      session,
      page: currentPage,
      size: pageSize,
    });

    if (
      response.code !== 200 ||
      !response.result ||
      !Array.isArray(response.result.podcastLogs)
    ) {
      throw new Error(response.message || "Không thể tải danh sách podcast.");
    }

    collected.push(...response.result.podcastLogs);
    totalPages = Math.max(response.result.totalPages || 1, 1);
    currentPage += 1;
  }

  return collected;
}

export default function PodcastLibraryContent({
  audience,
}: PodcastLibraryContentProps) {
  const [podcasts, setPodcasts] = useState<PodcastLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterMode, setFilterMode] = useState<PodcastFilter>("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [speechLanguage, setSpeechLanguage] =
    useState<SpeechLanguage>("vi");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingAutoPlayRef = useRef(false);

  const copy = getPageCopy(audience);
  const entries = useMemo(() => buildEntries(podcasts), [podcasts]);

  const nearestDate = useMemo(() => {
    if (!dateFilter || entries.length === 0) {
      return null;
    }

    return findNearestAvailableDate(dateFilter, entries);
  }, [dateFilter, entries]);

  const filteredEntries = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return entries.filter((entry) => {
      const matchesDate = !dateFilter || entry.isoDate === dateFilter;
      const matchesKeyword =
        !keyword ||
        entry.title.toLowerCase().includes(keyword) ||
        entry.subtitle.toLowerCase().includes(keyword) ||
        normalizeText(entry.session).toLowerCase().includes(keyword) ||
        normalizeText(entry.status).toLowerCase().includes(keyword) ||
        entry.createdDateLabel.toLowerCase().includes(keyword) ||
        entry.isoDate.toLowerCase().includes(keyword);

      return matchesDate && matchesKeyword;
    });
  }, [dateFilter, entries, searchKeyword]);

  const selectedEntry =
    filteredEntries.find((entry) => entry.id === selectedId) ||
    entries.find((entry) => entry.id === selectedId) ||
    null;

  const selectedLanguageLabel =
    languageOptions.find((item) => item.value === speechLanguage)?.label ||
    "Tiếng Việt";

  const dateNotice = useMemo(() => {
    if (!dateFilter) {
      return null;
    }

    if (filteredEntries.length > 0) {
      return null;
    }

    if (entries.length === 0) {
      return `Hiện chưa có podcast nào để nghe cho bộ lọc này.`;
    }

    if (nearestDate) {
      return `Ngày ${formatDateLabel(dateFilter)} hiện chưa có podcast khớp bộ lọc. Bạn có thể chuyển sang ngày gần nhất là ${formatDateLabel(nearestDate)}.`;
    }

    return `Ngày ${formatDateLabel(dateFilter)} hiện chưa có podcast để nghe.`;
  }, [dateFilter, entries.length, filteredEntries.length, nearestDate]);

  const stopPlayback = () => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsSpeaking(false);
  };

  const playSelectedAudio = async () => {
    if (!audioRef.current || !selectedEntry?.audioUrl) {
      setPlayerError("Podcast này chưa có đường dẫn âm thanh để phát.");
      return;
    }

    if (speechLanguage === "en") {
      setPlayerError(
        "Podcast hiện chỉ có bản ghi âm tiếng Việt để phát trực tiếp.",
      );
      return;
    }

    try {
      setPlayerError(null);
      await audioRef.current.play();
    } catch {
      setPlayerError(
        "Trình duyệt chưa thể phát podcast này. Bạn hãy bấm nghe lại một lần nữa.",
      );
    }
  };

  const fetchPodcasts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setPlayerError(null);
      stopPlayback();

      const fetchedPodcasts = await fetchAllPodcastLogs(
        filterMode === "all" ? undefined : filterMode,
      );

      setPodcasts(fetchedPodcasts);
    } catch (requestError: any) {
      setPodcasts([]);
      setError(
        requestError?.message ||
          "Đã có lỗi xảy ra khi tải danh sách podcast.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectEntry = (entry: PodcastEntry) => {
    setSelectedId(entry.id);
    setPlayerError(null);
    pendingAutoPlayRef.current = speechLanguage === "vi";
  };

  const handlePlayback = () => {
    if (!selectedEntry) {
      return;
    }

    if (!audioRef.current || !selectedEntry.audioUrl) {
      setPlayerError("Podcast này chưa có đường dẫn âm thanh để phát.");
      return;
    }

    if (speechLanguage === "en") {
      setPlayerError(
        "Podcast hiện chỉ có bản ghi âm tiếng Việt để phát trực tiếp.",
      );
      return;
    }

    if (audioRef.current.paused) {
      void playSelectedAudio();
      return;
    }

    audioRef.current.pause();
  };

  useEffect(() => {
    void fetchPodcasts();
  }, [filterMode]);

  useEffect(() => {
    if (filteredEntries.length === 0) {
      setSelectedId(null);
      stopPlayback();
      return;
    }

    if (!filteredEntries.some((entry) => entry.id === selectedId)) {
      setSelectedId(filteredEntries[0].id);
    }
  }, [filteredEntries, selectedId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    const onPlay = () => setIsSpeaking(true);
    const onPause = () => setIsSpeaking(false);
    const onEnded = () => setIsSpeaking(false);
    const onError = () => {
      setIsSpeaking(false);
      setPlayerError("Không thể mở file podcast từ đường dẫn hiện tại.");
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);

    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [selectedEntry?.id]);

  useEffect(() => {
    if (!selectedEntry?.id || !pendingAutoPlayRef.current) {
      return;
    }

    pendingAutoPlayRef.current = false;
    void playSelectedAudio();
  }, [selectedEntry?.id, speechLanguage]);

  useEffect(() => {
    setPlayerError(null);

    if (speechLanguage === "en") {
      stopPlayback();
    }
  }, [speechLanguage]);

  return (
    <section className="min-h-full bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-10 lg:py-10">
        <div className="rounded-[32px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.18),_transparent_35%),linear-gradient(180deg,_rgba(15,23,42,0.96),_rgba(2,6,23,0.96))] p-7">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/35 bg-indigo-500/10 px-4 py-1.5 text-sm font-semibold text-indigo-100">
            <Sparkles className="h-4 w-4" />
            {copy.badge}
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight text-white lg:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-300">
            {copy.description}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Tổng podcast
              </p>
              <p className="mt-3 text-3xl font-bold text-white">
                {entries.length}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                Có đường dẫn âm thanh
              </p>
              <p className="mt-3 text-3xl font-bold text-white">
                {entries.filter((entry) => entry.hasAudio).length}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr,0.95fr]">
          <div className="rounded-[28px] border border-slate-800 bg-slate-900/65 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                <input
                  value={searchKeyword}
                  onChange={(event) => setSearchKeyword(event.target.value)}
                  placeholder="Tìm theo ngày, phiên hoặc trạng thái..."
                  className="h-14 w-full rounded-2xl border border-slate-700 bg-slate-950/80 pl-12 pr-4 text-base text-white outline-none focus:border-indigo-400"
                />
              </div>

              <div className="relative min-w-[220px]">
                <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                  className="h-14 w-full rounded-2xl border border-slate-700 bg-slate-950/80 pl-11 pr-4 text-base text-white outline-none focus:border-indigo-400"
                />
              </div>

              <button
                type="button"
                onClick={() => void fetchPodcasts()}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/80 px-5 text-sm font-semibold text-slate-100 hover:border-indigo-400"
              >
                <RefreshCw className="h-4 w-4" />
                Làm mới
              </button>
            </div>

            {dateNotice && (
              <div className="mt-4 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 px-4 py-3 text-sm leading-7 text-indigo-100">
                {dateNotice}
                {nearestDate && (
                  <button
                    type="button"
                    onClick={() => setDateFilter(nearestDate)}
                    className="ml-3 inline-flex rounded-xl border border-indigo-400/35 px-3 py-1 font-semibold text-indigo-100 hover:bg-indigo-500/10"
                  >
                    Xem ngày {formatDateLabel(nearestDate)}
                  </button>
                )}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { value: "all" as PodcastFilter, label: "Tất cả" },
                { value: "morning" as PodcastFilter, label: "Phiên sáng" },
                { value: "afternoon" as PodcastFilter, label: "Phiên chiều" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilterMode(option.value)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    filterMode === option.value
                      ? "border-indigo-500 bg-indigo-500/15 text-white"
                      : "border-slate-700 bg-slate-950/50 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/45 p-3">
              {isLoading ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center gap-4 text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-300" />
                  <p>Đang tải danh sách podcast...</p>
                </div>
              ) : error ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-[24px] border border-rose-500/25 bg-rose-500/5 px-6 text-center">
                  <AlertCircle className="h-9 w-9 text-rose-300" />
                  <p className="text-lg font-semibold text-rose-200">
                    {error}
                  </p>
                </div>
              ) : filteredEntries.length === 0 ? (
                <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-slate-700 px-6 text-center">
                  <Headphones className="h-10 w-10 text-slate-500" />
                  <p className="text-lg font-semibold text-white">
                    Chưa tìm thấy podcast phù hợp
                  </p>
                  <p className="max-w-xl text-sm leading-7 text-slate-400">
                    {dateFilter
                      ? `Ngày ${formatDateLabel(dateFilter)} hiện chưa có podcast khớp với bộ lọc này.`
                      : "Hiện chưa có podcast nào để hiển thị."}
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredEntries.map((entry, index) => (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => handleSelectEntry(entry)}
                      className={`w-full rounded-[24px] border p-5 text-left ${
                        selectedEntry?.id === entry.id
                          ? "border-indigo-500 bg-indigo-500/10"
                          : "border-slate-800 bg-slate-950/70 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
                          Podcast #{filteredEntries.length - index}
                        </span>
                        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-400">
                          {entry.createdDateLabel}
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-semibold text-white">
                        {entry.title}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-300">
                        {entry.subtitle}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="rounded-[28px] border border-slate-800 bg-slate-900/65 p-6">
            {!selectedEntry ? (
              <div className="rounded-[24px] border border-dashed border-slate-700 bg-slate-950/45 p-8 text-center">
                <Volume2 className="mx-auto h-10 w-10 text-slate-500" />
                <p className="mt-4 text-lg font-semibold text-white">
                  Chọn một podcast để bắt đầu nghe
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="rounded-[24px] border border-slate-800 bg-slate-950/55 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                      {selectedEntry.createdDateLabel}
                    </span>
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                      {selectedLanguageLabel}
                    </span>
                    <span className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-300">
                      {isSpeaking ? "Đang phát" : "Sẵn sàng phát"}
                    </span>
                  </div>

                  <h3 className="mt-4 text-2xl font-semibold text-white">
                    {selectedEntry.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    {selectedEntry.subtitle}
                  </p>
                </div>

                <div className="rounded-[24px] border border-slate-800 bg-slate-950/55 p-5">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-400">
                    Ngôn ngữ đọc
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {languageOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSpeechLanguage(option.value)}
                        className={`rounded-2xl border px-4 py-2 text-sm font-semibold ${
                          speechLanguage === option.value
                            ? "border-indigo-500 bg-indigo-500/15 text-white"
                            : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-800 bg-slate-950/55 p-5">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handlePlayback}
                      className="inline-flex items-center gap-2 rounded-2xl border border-indigo-500/40 bg-indigo-500/15 px-4 py-2 text-sm font-semibold text-indigo-100 hover:bg-indigo-500/25"
                    >
                      {isSpeaking ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      {isSpeaking ? "Tạm dừng" : "Nghe podcast"}
                    </button>

                    <button
                      type="button"
                      onClick={stopPlayback}
                      className="inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 hover:border-slate-500"
                    >
                      <Square className="h-4 w-4" />
                      Dừng
                    </button>
                  </div>

                  {selectedEntry.audioUrl && (
                    <audio
                      key={selectedEntry.id}
                      ref={audioRef}
                      controls
                      preload="metadata"
                      className="mt-4 w-full rounded-2xl"
                      src={selectedEntry.audioUrl}
                    />
                  )}

                  {playerError && (
                    <div className="mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span>{playerError}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-[24px] border border-slate-800 bg-slate-950/55 p-5">
                  <p className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-slate-400">
                    <MessageSquareText className="h-4 w-4" />
                    Thông tin podcast
                  </p>
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-200">
                    Phiên: {getSessionLabel(selectedEntry.session)}
                    {"\n"}
                    Ngày: {selectedEntry.createdDateLabel}
                    {"\n"}
                    Trạng thái: {selectedEntry.status}
                  </p>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
