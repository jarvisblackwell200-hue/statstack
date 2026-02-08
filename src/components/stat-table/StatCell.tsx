"use client";

import { getPercentileColor, INVERTED_COLUMNS } from "./utils/percentiles";

interface StatCellProps {
  value: React.ReactNode;
  columnId: string;
  percentile: number | undefined;
}

export function StatCell({ value, columnId, percentile }: StatCellProps) {
  // Invert percentile for columns where lower is better
  const adjustedPercentile =
    percentile != null && INVERTED_COLUMNS.has(columnId)
      ? 100 - percentile
      : percentile;

  const bg = getPercentileColor(adjustedPercentile);

  return (
    <div
      className="font-tabular px-2 py-1 text-right"
      style={bg ? { background: bg } : undefined}
    >
      {value}
    </div>
  );
}
