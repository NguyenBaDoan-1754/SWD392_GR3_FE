import { useMemo } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Clock3,
  RefreshCw,
  Sunrise,
  Sunset,
} from "lucide-react";
import { motion } from "motion/react";
import type { MarketSession } from "../../../api/market.api";
import CandlestickChart from "./CandlestickChart";
import {
  useMarketExplorer,
  type MarketSessionSummary,
} from "../hook/useMarketExplorer";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));

const formatTime = (value: string) => value.slice(11, 16);

const formatPrice = (value: number) =>
  value.toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

const formatVolume = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

const formatChange = (value: number) =>
  `${value >= 0 ? "+" : ""}${value.toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

const formatPercent = (value: number) =>
  `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const sessionMeta: Array<{
  key: MarketSession;
  label: string;
  description: string;
}> = [
  {
    key: "all",
    label: "Cả 2 phiên",
    description: "Mặc định gộp sáng và chiều",
  },
  {
    key: "morning",
    label: "Phiên sáng",
    description: "09:00 - 11:30",
  },
  {
    key: "afternoon",
    label: "Phiên chiều",
    description: "13:00 - 14:45",
  },
];

const getChangeTone = (value: number) =>
  value >= 0
    ? {
        badge: "bg-emerald-500/12 text-emerald-300 ring-1 ring-emerald-500/20",
        soft: "text-emerald-300",
        icon: ArrowUpRight,
      }
    : {
        badge: "bg-rose-500/12 text-rose-300 ring-1 ring-rose-500/20",
        soft: "text-rose-300",
        icon: ArrowDownRight,
      };

interface SummaryCardProps {
  summary: MarketSessionSummary | null;
  active: boolean;
  onClick: () => void;
}

function SessionSummaryCard({ summary, active, onClick }: SummaryCardProps) {
  if (!summary) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/40 p-4 text-sm text-slate-500">
        Chưa có dữ liệu cho phiên này.
      </div>
    );
  }

  const tone = getChangeTone(summary.changeValue);
  const ToneIcon = tone.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-3xl border p-4 text-left transition-all ${
        active
          ? "border-indigo-400/50 bg-indigo-500/10 shadow-[0_0_0_1px_rgba(129,140,248,0.15)]"
          : "border-slate-800 bg-slate-950/55 hover:border-slate-700 hover:bg-slate-950"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-white">{summary.label}</p>
          <p className="mt-1 text-xs text-slate-400">
            {formatTime(summary.firstTime)} - {formatTime(summary.lastTime)}
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${tone.badge}`}
        >
          <ToneIcon className="h-3.5 w-3.5" />
          {formatPercent(summary.changePercent)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-500">Mở / Đóng</p>
          <p className="mt-1 font-medium text-slate-100">
            {formatPrice(summary.open)} / {formatPrice(summary.close)}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Khối lượng</p>
          <p className="mt-1 font-medium text-slate-100">
            {formatVolume(summary.volume)}
          </p>
        </div>
      </div>
    </button>
  );
}

export default function UserMarketContent() {
  const {
    symbolInput,
    quickSymbols,
    selectedSymbol,
    selectedDate,
    dateNotice,
    selectedSession,
    loadingBootstrap,
    loadingChart,
    error,
    candles,
    visibleCandles,
    selectedCandle,
    morningSummary,
    afternoonSummary,
    allDaySummary,
    setSymbolInput,
    applySymbol,
    pickQuickSymbol,
    setSelectedDate,
    setSelectedSession,
    selectCandle,
    refresh,
  } = useMarketExplorer();

  const selectedSummary = useMemo(() => {
    if (selectedSession === "morning") return morningSummary;
    if (selectedSession === "afternoon") return afternoonSummary;
    return allDaySummary;
  }, [allDaySummary, afternoonSummary, morningSummary, selectedSession]);

  const selectedTone = getChangeTone(selectedCandle?.changeValue ?? 0);
  const SelectedToneIcon = selectedTone.icon;
  const hasSelection = Boolean(selectedSymbol);
  const hasChartData = visibleCandles.length > 0;
  const isBusy = loadingBootstrap || loadingChart;

  return (
    <div className="min-h-full bg-[#020617] px-5 py-8 md:px-8 xl:px-10">
      <div className="mx-auto max-w-[1480px]">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-8 rounded-[32px] border border-slate-800/90 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_36%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.94))] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.5)]"
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-200">
                <BarChart3 className="h-3.5 w-3.5" />
                Theo dõi thị trường
              </div>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                Theo dõi giá cổ phiếu bằng biểu đồ nến theo từng phiên
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Chọn mã cổ phiếu bạn quan tâm để xem diễn biến giá trong ngày.
                Hệ thống sẽ ưu tiên hiển thị ngày giao dịch gần nhất, mặc định
                xem cả phiên sáng và chiều, và bạn có thể bấm vào từng cây nến
                để xem thông tin chi tiết.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[520px]">
              {[
                "1. Chọn mã cổ phiếu bạn quan tâm",
                "2. Xem nhanh ngày giao dịch gần nhất",
                "3. Bấm nến để xem giá chi tiết",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/55 px-4 py-3 text-sm text-slate-200"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mb-6 rounded-[28px] border border-slate-800/90 bg-slate-900/70 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.35)]"
        >
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_220px_auto]">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-200">
                Chọn cổ phiếu
              </span>
              <div className="flex flex-col gap-3 xl:flex-row">
                <div className="relative flex-1">
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <select
                    value={selectedSymbol}
                    onChange={(event) => {
                      if (event.target.value) {
                        pickQuickSymbol(event.target.value);
                      }
                    }}
                    className="h-14 w-full rounded-2xl border border-slate-700 bg-slate-950/70 pr-11 pl-4 text-sm text-white outline-none transition focus:border-indigo-400 appearance-none cursor-pointer"
                  >
                    <option value="">Chọn mã cổ phiếu từ danh sách</option>
                    {quickSymbols.map((symbol) => (
                      <option key={symbol} value={symbol}>
                        {symbol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <span className="text-xs text-slate-500">
                {selectedSymbol
                  ? `Đang xem mã ${selectedSymbol}. Có thể chọn mã khác từ dropdown hoặc tự nhập.`
                  : "Chọn mã từ dropdown hoặc tự nhập mã chứng khoán."}
              </span>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-200">Ngày</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                disabled={!hasSelection}
                className="h-14 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 text-sm text-slate-100 outline-none transition disabled:cursor-not-allowed disabled:opacity-60 focus:border-indigo-400"
                style={{
                  colorScheme: 'dark',
                }}
              />
              <span className="text-xs text-slate-500">
                {loadingBootstrap
                  ? "Đang dò ngày giao dịch mới nhất từ API chart..."
                  : selectedDate
                    ? `Ngày hiện tại: ${formatDate(selectedDate)}`
                    : "Sau khi chọn mã, frontend sẽ tự dò ngày mới nhất có dữ liệu."}
              </span>
              {dateNotice && (
                <span className="text-xs text-amber-300">{dateNotice}</span>
              )}
            </label>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-200">
                Hành động nhanh
              </span>
              <button
                type="button"
                onClick={() => void refresh()}
                disabled={!hasSelection}
                className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl border border-slate-700 bg-slate-950/70 px-4 text-sm font-medium text-slate-100 transition hover:border-slate-600 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isBusy ? "animate-spin" : ""}`}
                />
                Làm mới dữ liệu
              </button>
              <div className="rounded-2xl border border-slate-800/80 bg-slate-950/55 px-4 py-3 text-xs leading-5 text-slate-400">
                Nếu không chọn phiên, biểu đồ sẽ hiển thị cả sáng và chiều như
                yêu cầu.
              </div>
            </div>
          </div>
        </motion.section>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_390px]"
        >
          <section className="rounded-[30px] border border-slate-800/90 bg-slate-900/70 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.32)]">
            <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-1 text-xs text-slate-300 ring-1 ring-slate-800">
                  <Clock3 className="h-3.5 w-3.5" />
                  {hasSelection && selectedDate
                    ? `${selectedSymbol} • ${formatDate(selectedDate)}`
                    : "Hãy bấm chọn mã cổ phiếu"}
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  {hasSelection
                    ? `${selectedSymbol} - Biểu đồ nến intraday`
                    : "Biểu đồ nến"}
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  {hasSelection
                    ? "Bấm vào từng cây nến để cập nhật giá chi tiết ở panel bên phải."
                    : "Khi bấm chọn mã, frontend sẽ tự tìm ngày gần nhất rồi hiển thị chart nến theo phiên."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {sessionMeta.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    disabled={!candles.length}
                    onClick={() => setSelectedSession(item.key)}
                    className={`min-w-[145px] rounded-2xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
                      selectedSession === item.key
                        ? "border-indigo-400/50 bg-indigo-500/12"
                        : "border-slate-800 bg-slate-950/55 hover:border-slate-700"
                    }`}
                  >
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {item.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {!hasSelection ? (
              <div className="rounded-[28px] border border-dashed border-slate-800 bg-slate-950/45 px-6 py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/12 text-indigo-300">
                  <BarChart3 className="h-7 w-7" />
                </div>
                <p className="text-lg font-medium text-white">
                  Chọn một mã cổ phiếu để bắt đầu xem dữ liệu
                </p>
                <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">
                  Bạn có thể bấm nhanh các mã gợi ý hoặc tự nhập mã. Sau đó
                  frontend sẽ tự dò ngày mới nhất từ API chart đang có của BE.
                </p>
              </div>
            ) : loadingBootstrap ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/8 px-4 py-3 text-sm text-indigo-100">
                  Đang dò ngày giao dịch mới nhất cho mã {selectedSymbol}...
                </div>
                <div className="grid gap-3 md:grid-cols-3">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="h-24 animate-pulse rounded-2xl border border-slate-800 bg-slate-950/55"
                    />
                  ))}
                </div>
                <div className="h-[360px] animate-pulse rounded-[28px] border border-slate-800 bg-slate-950/55" />
              </div>
            ) : loadingChart ? (
              <div className="space-y-4">
                <div className="grid gap-3 md:grid-cols-3">
                  {[...Array(3)].map((_, index) => (
                    <div
                      key={index}
                      className="h-24 animate-pulse rounded-2xl border border-slate-800 bg-slate-950/55"
                    />
                  ))}
                </div>
                <div className="h-[360px] animate-pulse rounded-[28px] border border-slate-800 bg-slate-950/55" />
              </div>
            ) : error ? (
              <div className="rounded-[28px] border border-rose-500/20 bg-rose-500/8 px-6 py-14 text-center">
                <p className="text-lg font-medium text-rose-200">{error}</p>
                <p className="mt-2 text-sm text-rose-100/80">
                  Kiểm tra lại mã hoặc thử làm mới dữ liệu.
                </p>
              </div>
            ) : !hasChartData ? (
              <div className="rounded-[28px] border border-dashed border-slate-800 bg-slate-950/45 px-6 py-14 text-center">
                <p className="text-lg font-medium text-white">
                  Chưa có dữ liệu trong ngày đã chọn
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Hãy đổi sang ngày khác hoặc bấm làm mới để frontend dò lại
                  ngày mới nhất cho mã này.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    {
                      label: "Biên độ ngày",
                      value: selectedSummary
                        ? `${formatPrice(selectedSummary.low)} - ${formatPrice(
                            selectedSummary.high,
                          )}`
                        : "--",
                    },
                    {
                      label: "Khối lượng",
                      value: selectedSummary
                        ? formatVolume(selectedSummary.volume)
                        : "--",
                    },
                    {
                      label: "Số cây nến",
                      value: selectedSummary
                        ? String(selectedSummary.candlesCount)
                        : "--",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-800 bg-slate-950/55 px-4 py-4"
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <CandlestickChart
                  candles={visibleCandles}
                  selectedTime={selectedCandle?.time ?? null}
                  onSelect={selectCandle}
                />

                <div className="grid gap-3 md:grid-cols-2">
                  <SessionSummaryCard
                    summary={morningSummary}
                    active={selectedSession === "morning"}
                    onClick={() => setSelectedSession("morning")}
                  />
                  <SessionSummaryCard
                    summary={afternoonSummary}
                    active={selectedSession === "afternoon"}
                    onClick={() => setSelectedSession("afternoon")}
                  />
                </div>
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <section className="rounded-[30px] border border-slate-800/90 bg-slate-900/70 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.32)]">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Chi tiết đang xem
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-white">
                    {selectedCandle
                      ? `${formatTime(selectedCandle.time)} • ${
                          selectedCandle.session === "morning"
                            ? "Phiên sáng"
                            : "Phiên chiều"
                        }`
                      : "Chọn một cây nến"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedDate ? formatDate(selectedDate) : "--"}
                  </p>
                </div>

                {selectedCandle && (
                  <div
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${selectedTone.badge}`}
                  >
                    <SelectedToneIcon className="h-3.5 w-3.5" />
                    {formatPercent(selectedCandle.changePercent)}
                  </div>
                )}
              </div>

              {selectedCandle ? (
                <>
                  <div className="mb-4 rounded-3xl border border-slate-800 bg-slate-950/55 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                          Giá đóng gần nhất
                        </p>
                        <p className="mt-2 text-3xl font-semibold text-white">
                          {formatPrice(selectedCandle.close)}
                        </p>
                      </div>
                      <div
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${selectedTone.badge}`}
                      >
                        <SelectedToneIcon className="h-3.5 w-3.5" />
                        {formatChange(selectedCandle.changeValue)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Mở cửa", value: formatPrice(selectedCandle.open) },
                      { label: "Cao nhất", value: formatPrice(selectedCandle.high) },
                      { label: "Thấp nhất", value: formatPrice(selectedCandle.low) },
                      { label: "Đóng cửa", value: formatPrice(selectedCandle.close) },
                      { label: "Khối lượng", value: formatVolume(selectedCandle.volume) },
                      {
                        label: "Biến động",
                        value: formatPercent(selectedCandle.changePercent),
                        tone: selectedTone.soft,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-slate-800 bg-slate-950/55 px-4 py-4"
                      >
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                          {item.label}
                        </p>
                        <p
                          className={`mt-2 text-base font-semibold ${
                            item.tone ?? "text-white"
                          }`}
                        >
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/45 px-5 py-10 text-center text-sm leading-6 text-slate-400">
                  Khi có dữ liệu, bạn có thể bấm vào từng cây nến để xem giá
                  chi tiết cho đúng mốc thời gian của phiên.
                </div>
              )}
            </section>

            <section className="rounded-[30px] border border-slate-800/90 bg-slate-900/70 p-5 shadow-[0_20px_60px_rgba(2,6,23,0.32)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    Tổng quan phiên
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-white">
                    {selectedSummary?.label ?? "Chưa có dữ liệu"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedDate ? formatDate(selectedDate) : "--"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="rounded-full bg-amber-500/10 p-2 text-amber-300">
                    <Sunrise className="h-4 w-4" />
                  </div>
                  <div className="rounded-full bg-cyan-500/10 p-2 text-cyan-300">
                    <Sunset className="h-4 w-4" />
                  </div>
                </div>
              </div>

              {selectedSummary ? (
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/55 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                      Khoảng thời gian
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {formatTime(selectedSummary.firstTime)} -{" "}
                      {formatTime(selectedSummary.lastTime)}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {selectedDate ? formatDate(selectedDate) : "--"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      {
                        label: "Mở phiên",
                        value: formatPrice(selectedSummary.open),
                      },
                      {
                        label: "Đóng phiên",
                        value: formatPrice(selectedSummary.close),
                      },
                      {
                        label: "Đỉnh phiên",
                        value: formatPrice(selectedSummary.high),
                      },
                      {
                        label: "Đáy phiên",
                        value: formatPrice(selectedSummary.low),
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-slate-800 bg-slate-950/55 px-4 py-4"
                      >
                        <p className="text-xs uppercase tracking-[0.14em] text-slate-500">
                          {item.label}
                        </p>
                        <p className="mt-2 text-base font-semibold text-white">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-3xl border border-slate-800 bg-slate-950/55 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                          Tăng / giảm
                        </p>
                        <p
                          className={`mt-2 text-lg font-semibold ${
                            getChangeTone(selectedSummary.changeValue).soft
                          }`}
                        >
                          {formatChange(selectedSummary.changeValue)} (
                          {formatPercent(selectedSummary.changePercent)})
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                          Khối lượng
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          {formatVolume(selectedSummary.volume)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-800 bg-slate-950/45 px-5 py-10 text-center text-sm leading-6 text-slate-400">
                  Chọn mã cổ phiếu và ngày để xem tổng quan giá của từng phiên.
                </div>
              )}
            </section>
          </aside>
        </motion.div>
      </div>
    </div>
  );
}
