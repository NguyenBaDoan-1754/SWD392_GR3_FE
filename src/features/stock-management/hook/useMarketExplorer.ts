import { useEffect, useMemo, useRef, useState } from "react";
import {
  getStockIntradayChart,
  type MarketSession,
  type StockIntradayCandle,
} from "../../../api/market.api";

type TradingSession = Exclude<MarketSession, "all">;

export const POPULAR_STOCK_SYMBOLS = [
  "FPT",
  "HPG",
  "VCB",
  "VIC",
  "VHM",
  "VNM",
  "MBB",
  "TCB",
  "SSI",
  "ACB",
  "MSN",
  "MWG",
];

export interface MarketChartCandle extends StockIntradayCandle {
  session: TradingSession;
  timeLabel: string;
  changeValue: number;
  changePercent: number;
  isUp: boolean;
}

export interface MarketSessionSummary {
  key: MarketSession;
  label: string;
  candlesCount: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  changeValue: number;
  changePercent: number;
  firstTime: string;
  lastTime: string;
}

const MORNING_END_MINUTES = 11 * 60 + 30;
const MAX_LOOKBACK_DAYS = 21;
const MAX_NEAREST_DATE_DISTANCE = 7;

const normalizeSymbol = (value: string) =>
  value.toUpperCase().replace(/\s+/g, "").trim();

const toDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const shiftDate = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const getMinutesFromTimestamp = (timestamp: string) => {
  const timePart = timestamp.slice(11, 16);
  const [hours, minutes] = timePart.split(":").map(Number);
  return hours * 60 + minutes;
};

const getSessionFromTimestamp = (timestamp: string): TradingSession => {
  const minutes = getMinutesFromTimestamp(timestamp);
  return minutes <= MORNING_END_MINUTES ? "morning" : "afternoon";
};

const getTimeLabel = (timestamp: string) => timestamp.slice(11, 16);

const summarizeSession = (
  key: MarketSession,
  label: string,
  candles: MarketChartCandle[],
): MarketSessionSummary | null => {
  if (!candles.length) return null;

  const first = candles[0];
  const last = candles[candles.length - 1];

  const high = candles.reduce(
    (maxValue, candle) => Math.max(maxValue, candle.high),
    first.high,
  );
  const low = candles.reduce(
    (minValue, candle) => Math.min(minValue, candle.low),
    first.low,
  );
  const volume = candles.reduce((sum, candle) => sum + candle.volume, 0);
  const changeValue = last.close - first.open;
  const changePercent = first.open > 0 ? (changeValue / first.open) * 100 : 0;

  return {
    key,
    label,
    candlesCount: candles.length,
    open: first.open,
    high,
    low,
    close: last.close,
    volume,
    changeValue,
    changePercent,
    firstTime: first.time,
    lastTime: last.time,
  };
};

export interface UseMarketExplorerReturn {
  symbolInput: string;
  quickSymbols: string[];
  selectedSymbol: string;
  selectedDate: string;
  dateNotice: string | null;
  selectedSession: MarketSession;
  loadingBootstrap: boolean;
  loadingChart: boolean;
  error: string | null;
  candles: MarketChartCandle[];
  visibleCandles: MarketChartCandle[];
  selectedCandle: MarketChartCandle | null;
  morningSummary: MarketSessionSummary | null;
  afternoonSummary: MarketSessionSummary | null;
  allDaySummary: MarketSessionSummary | null;
  setSymbolInput: (value: string) => void;
  applySymbol: () => void;
  pickQuickSymbol: (symbol: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedSession: (session: MarketSession) => void;
  selectCandle: (time: string) => void;
  refresh: () => Promise<void>;
}

export const useMarketExplorer = (): UseMarketExplorerReturn => {
  const [symbolInput, setSymbolInputState] = useState("");
  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [dateNotice, setDateNotice] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<MarketSession>("all");
  const [candles, setCandles] = useState<MarketChartCandle[]>([]);
  const [selectedCandleTime, setSelectedCandleTime] = useState<string | null>(
    null,
  );
  const [loadingBootstrap, setLoadingBootstrap] = useState(false);
  const [loadingChart, setLoadingChart] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestIdRef = useRef(0);
  const lastLoadedKeyRef = useRef("");
  const bootstrappingSymbolRef = useRef<string | null>(null);

  const setSymbolInput = (value: string) => {
    setSymbolInputState(normalizeSymbol(value));
  };

  const hydrateCandles = (items: StockIntradayCandle[]) =>
    items.map((item) => {
      const changeValue = item.close - item.open;
      const changePercent = item.open > 0 ? (changeValue / item.open) * 100 : 0;

      return {
        ...item,
        session: getSessionFromTimestamp(item.time),
        timeLabel: getTimeLabel(item.time),
        changeValue,
        changePercent,
        isUp: changeValue >= 0,
      };
    });

  const commitChartData = (
    symbol: string,
    date: string,
    items: StockIntradayCandle[],
  ) => {
    const hydrated = hydrateCandles(items);
    setCandles(hydrated);
    setSelectedCandleTime(hydrated[hydrated.length - 1]?.time ?? null);
    lastLoadedKeyRef.current = `${symbol}|${date}`;
  };

  const findNearestAvailableDate = async (
    symbol: string,
    anchorDate: string,
    requestId: number,
  ) => {
    const anchor = new Date(`${anchorDate}T00:00:00`);

    for (let offset = 1; offset <= MAX_NEAREST_DATE_DISTANCE; offset += 1) {
      const previousDate = toDateInputValue(shiftDate(anchor, -offset));
      const previousResult = await getStockIntradayChart(symbol, previousDate);

      if (requestId !== requestIdRef.current) return null;

      if (previousResult.length > 0) {
        return { date: previousDate, items: previousResult };
      }

      const nextDate = toDateInputValue(shiftDate(anchor, offset));
      const nextResult = await getStockIntradayChart(symbol, nextDate);

      if (requestId !== requestIdRef.current) return null;

      if (nextResult.length > 0) {
        return { date: nextDate, items: nextResult };
      }
    }

    return null;
  };

  const loadChartForDate = async (symbol: string, date: string) => {
    const requestId = ++requestIdRef.current;

    try {
      setLoadingChart(true);
      setError(null);
      setDateNotice(null);

      const result = await getStockIntradayChart(symbol, date);

      if (requestId !== requestIdRef.current) return;

      if (result.length === 0) {
        const nearestData = await findNearestAvailableDate(symbol, date, requestId);

        if (requestId !== requestIdRef.current) return;

        if (nearestData) {
          setSelectedDate(nearestData.date);
          setDateNotice(
            `Ngay ${date} chua co du lieu. Da chuyen sang ngay gan nhat la ${nearestData.date}.`,
          );
          commitChartData(symbol, nearestData.date, nearestData.items);
          return;
        }

        setCandles([]);
        setSelectedCandleTime(null);
        lastLoadedKeyRef.current = "";
        setDateNotice(`Ngay ${date} hien chua co du lieu giao dich.`);
        return;
      }

      commitChartData(symbol, date, result);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;

      console.error("Failed to load stock chart:", loadError);
      setCandles([]);
      setSelectedCandleTime(null);
      lastLoadedKeyRef.current = "";
      setDateNotice(null);
      setError("Khong tai duoc du lieu bieu do nen.");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoadingChart(false);
      }
    }
  };

  const bootstrapLatestDate = async (symbol: string) => {
    const requestId = ++requestIdRef.current;
    bootstrappingSymbolRef.current = symbol;

    try {
      setLoadingBootstrap(true);
      setError(null);
      setDateNotice(null);
      setCandles([]);
      setSelectedCandleTime(null);
      setSelectedDate("");
      lastLoadedKeyRef.current = "";

      let cursor = new Date();

      for (let index = 0; index < MAX_LOOKBACK_DAYS; index += 1) {
        const date = toDateInputValue(cursor);
        const result = await getStockIntradayChart(symbol, date);

        if (requestId !== requestIdRef.current) return;

        if (result.length > 0) {
          setSelectedDate(date);
          commitChartData(symbol, date, result);
          return;
        }

        cursor = shiftDate(cursor, -1);
      }

      if (requestId !== requestIdRef.current) return;

      setError(`Khong tim thay du lieu gan day cho ma ${symbol}.`);
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return;

      console.error("Failed to discover latest trading date:", loadError);
      setError("Khong the do ngay giao dich moi nhat tu API hien co.");
    } finally {
      if (requestId === requestIdRef.current) {
        setLoadingBootstrap(false);

        if (bootstrappingSymbolRef.current === symbol) {
          bootstrappingSymbolRef.current = null;
        }
      }
    }
  };

  useEffect(() => {
    if (!selectedSymbol) {
      setSelectedDate("");
      setDateNotice(null);
      setCandles([]);
      setSelectedCandleTime(null);
      setSelectedSession("all");
      setError(null);
      lastLoadedKeyRef.current = "";
      bootstrappingSymbolRef.current = null;
      return;
    }

    setSelectedSession("all");
    void bootstrapLatestDate(selectedSymbol);
  }, [selectedSymbol]);

  useEffect(() => {
    if (!selectedSymbol || !selectedDate) return;
    if (bootstrappingSymbolRef.current === selectedSymbol) return;

    const requestKey = `${selectedSymbol}|${selectedDate}`;
    if (lastLoadedKeyRef.current === requestKey) return;

    void loadChartForDate(selectedSymbol, selectedDate);
  }, [selectedDate, selectedSymbol]);

  const visibleCandles = useMemo(() => {
    if (selectedSession === "all") return candles;
    return candles.filter((candle) => candle.session === selectedSession);
  }, [candles, selectedSession]);

  useEffect(() => {
    if (!visibleCandles.length) {
      setSelectedCandleTime(null);
      return;
    }

    const selectedStillExists = visibleCandles.some(
      (candle) => candle.time === selectedCandleTime,
    );

    if (!selectedStillExists) {
      setSelectedCandleTime(visibleCandles[visibleCandles.length - 1]?.time ?? null);
    }
  }, [selectedCandleTime, visibleCandles]);

  const selectedCandle = useMemo(() => {
    if (!selectedCandleTime) {
      return visibleCandles[visibleCandles.length - 1] ?? null;
    }

    return (
      visibleCandles.find((candle) => candle.time === selectedCandleTime) ??
      visibleCandles[visibleCandles.length - 1] ??
      null
    );
  }, [selectedCandleTime, visibleCandles]);

  const morningSummary = useMemo(
    () =>
      summarizeSession(
        "morning",
        "Phien sang",
        candles.filter((candle) => candle.session === "morning"),
      ),
    [candles],
  );

  const afternoonSummary = useMemo(
    () =>
      summarizeSession(
        "afternoon",
        "Phien chieu",
        candles.filter((candle) => candle.session === "afternoon"),
      ),
    [candles],
  );

  const allDaySummary = useMemo(
    () => summarizeSession("all", "Ca ngay", candles),
    [candles],
  );

  const applySymbol = () => {
    const normalized = normalizeSymbol(symbolInput);

    if (!normalized) return;

    setSymbolInputState(normalized);

    if (normalized === selectedSymbol) {
      void bootstrapLatestDate(normalized);
      return;
    }

    setSelectedSymbol(normalized);
  };

  const pickQuickSymbol = (symbol: string) => {
    const normalized = normalizeSymbol(symbol);
    setSymbolInputState(normalized);

    if (normalized === selectedSymbol) {
      void bootstrapLatestDate(normalized);
      return;
    }

    setSelectedSymbol(normalized);
  };

  const refresh = async () => {
    if (!selectedSymbol) return;

    if (!selectedDate) {
      await bootstrapLatestDate(selectedSymbol);
      return;
    }

    await loadChartForDate(selectedSymbol, selectedDate);
  };

  return {
    symbolInput,
    quickSymbols: POPULAR_STOCK_SYMBOLS,
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
    selectCandle: setSelectedCandleTime,
    refresh,
  };
};
