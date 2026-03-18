import { useEffect, useMemo, useRef, useState } from "react";
import type { MarketChartCandle } from "../hook/useMarketExplorer";

interface CandlestickChartProps {
  candles: MarketChartCandle[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

const CHART_HEIGHT = 360;

const formatPrice = (value: number) =>
  value.toLocaleString("vi-VN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

export default function CandlestickChart({
  candles,
  selectedTime,
  onSelect,
}: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [hoveredTime, setHoveredTime] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return undefined;

    const updateWidth = () => {
      setWidth(container.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect.width ?? container.clientWidth;
      setWidth(nextWidth);
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const chartModel = useMemo(() => {
    if (!candles.length || width === 0) return null;

    const padding = { top: 24, right: 68, bottom: 40, left: 22 };
    const plotWidth = Math.max(width - padding.left - padding.right, 80);
    const plotHeight = CHART_HEIGHT - padding.top - padding.bottom;
    const minLow = Math.min(...candles.map((candle) => candle.low));
    const maxHigh = Math.max(...candles.map((candle) => candle.high));
    const pricePadding = Math.max((maxHigh - minLow) * 0.08, maxHigh * 0.002, 1);
    const domainMin = Math.max(minLow - pricePadding, 0);
    const domainMax = maxHigh + pricePadding;
    const domainRange = Math.max(domainMax - domainMin, 1);
    const candleStep = plotWidth / candles.length;
    const candleWidth = Math.max(
      Math.min(candleStep * 0.55, 24),
      Math.min(8, candleStep - 2),
    );
    const dividerIndex = candles.findIndex(
      (candle) => candle.session === "afternoon",
    );

    const scaleY = (price: number) =>
      padding.top + ((domainMax - price) / domainRange) * plotHeight;
    const scaleX = (index: number) => padding.left + candleStep * index;

    return {
      padding,
      plotWidth,
      plotHeight,
      domainMin,
      domainMax,
      candleStep,
      candleWidth,
      dividerIndex,
      scaleX,
      scaleY,
    };
  }, [candles, width]);

  if (!candles.length) {
    return (
      <div className="flex h-[360px] items-center justify-center rounded-3xl border border-slate-800/80 bg-slate-950/60 text-sm text-slate-500">
        Chọn dữ liệu để hiển thị biểu đồ nến.
      </div>
    );
  }

  const activeTime = hoveredTime ?? selectedTime;

  if (!chartModel) {
    return <div ref={containerRef} className="h-[360px] w-full" />;
  }

  const tickCount = 5;
  const yTicks = Array.from({ length: tickCount }, (_, index) => {
    const ratio = index / (tickCount - 1);
    const value =
      chartModel.domainMax -
      (chartModel.domainMax - chartModel.domainMin) * ratio;

    return {
      value,
      y: chartModel.padding.top + chartModel.plotHeight * ratio,
    };
  });

  const xLabelStep = Math.max(Math.ceil(candles.length / 6), 1);
  const xTickIndexes = candles.reduce<number[]>((indexes, _, index) => {
    const isBoundary = index === 0 || index === candles.length - 1;
    const isStep = index % xLabelStep === 0;

    if (isBoundary || isStep) {
      indexes.push(index);
    }

    return indexes;
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <svg
        viewBox={`0 0 ${Math.max(width, 320)} ${CHART_HEIGHT}`}
        className="h-[360px] w-full"
        role="img"
        aria-label="Biểu đồ nến cổ phiếu"
      >
        <defs>
          <linearGradient id="chartBg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(15, 23, 42, 0.9)" />
            <stop offset="100%" stopColor="rgba(2, 6, 23, 0.45)" />
          </linearGradient>
        </defs>

        <rect
          x={0}
          y={0}
          width={Math.max(width, 320)}
          height={CHART_HEIGHT}
          rx={24}
          fill="url(#chartBg)"
        />

        {yTicks.map((tick) => (
          <g key={tick.y}>
            <line
              x1={chartModel.padding.left}
              x2={Math.max(width, 320) - chartModel.padding.right}
              y1={tick.y}
              y2={tick.y}
              stroke="rgba(148, 163, 184, 0.12)"
              strokeDasharray="4 6"
            />
            <text
              x={Math.max(width, 320) - chartModel.padding.right + 10}
              y={tick.y + 4}
              fill="#94a3b8"
              fontSize="11"
            >
              {formatPrice(tick.value)}
            </text>
          </g>
        ))}

        {chartModel.dividerIndex > 0 && (
          <>
            <line
              x1={chartModel.scaleX(chartModel.dividerIndex)}
              x2={chartModel.scaleX(chartModel.dividerIndex)}
              y1={chartModel.padding.top}
              y2={chartModel.padding.top + chartModel.plotHeight}
              stroke="rgba(250, 204, 21, 0.25)"
              strokeDasharray="5 6"
            />
            <text
              x={chartModel.scaleX(chartModel.dividerIndex) + 8}
              y={chartModel.padding.top + 14}
              fill="#facc15"
              fontSize="11"
            >
              Nghỉ trưa
            </text>
          </>
        )}

        {candles.map((candle, index) => {
          const x = chartModel.scaleX(index) + chartModel.candleStep / 2;
          const wickTop = chartModel.scaleY(candle.high);
          const wickBottom = chartModel.scaleY(candle.low);
          const openY = chartModel.scaleY(candle.open);
          const closeY = chartModel.scaleY(candle.close);
          const bodyY = Math.min(openY, closeY);
          const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
          const isSelected = candle.time === activeTime;
          const fill = candle.isUp ? "#34d399" : "#fb7185";
          const stroke = candle.isUp ? "#10b981" : "#f43f5e";

          return (
            <g
              key={candle.time}
              onMouseEnter={() => setHoveredTime(candle.time)}
              onMouseLeave={() => setHoveredTime(null)}
              onClick={() => onSelect(candle.time)}
              className="cursor-pointer"
            >
              <rect
                x={x - chartModel.candleStep / 2}
                y={chartModel.padding.top}
                width={chartModel.candleStep}
                height={chartModel.plotHeight}
                fill="transparent"
              />
              <line
                x1={x}
                x2={x}
                y1={wickTop}
                y2={wickBottom}
                stroke={stroke}
                strokeOpacity={isSelected ? 1 : 0.72}
                strokeWidth={isSelected ? 2.1 : 1.2}
              />
              <rect
                x={x - chartModel.candleWidth / 2}
                y={bodyY}
                width={chartModel.candleWidth}
                height={bodyHeight}
                rx={3}
                fill={fill}
                fillOpacity={isSelected ? 0.96 : 0.78}
                stroke={isSelected ? "#ffffff" : stroke}
                strokeOpacity={isSelected ? 0.85 : 0.35}
                strokeWidth={isSelected ? 1.2 : 0.8}
              />
            </g>
          );
        })}

        {activeTime &&
          candles.map((candle, index) => {
            if (candle.time !== activeTime) return null;

            const x = chartModel.scaleX(index) + chartModel.candleStep / 2;

            return (
              <line
                key={`active-${candle.time}`}
                x1={x}
                x2={x}
                y1={chartModel.padding.top}
                y2={chartModel.padding.top + chartModel.plotHeight}
                stroke="rgba(255,255,255,0.18)"
                strokeDasharray="4 6"
              />
            );
          })}

        {xTickIndexes.map((index) => {
          const candle = candles[index];
          const x = chartModel.scaleX(index) + chartModel.candleStep / 2;

          return (
            <text
              key={`${candle.time}-label`}
              x={x}
              y={CHART_HEIGHT - 12}
              fill="#94a3b8"
              fontSize="11"
              textAnchor="middle"
            >
              {candle.timeLabel}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
