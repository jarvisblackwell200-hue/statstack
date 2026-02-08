/**
 * Pre-calculate percentile ranks for stat columns.
 * Returns a Map of columnId → Map of rowIndex → percentile (0–100).
 */
export function calculatePercentiles<T extends Record<string, unknown>>(
  rows: T[],
  columns: string[],
): Map<string, Map<number, number>> {
  const result = new Map<string, Map<number, number>>();

  for (const col of columns) {
    const values: { index: number; value: number }[] = [];
    for (let i = 0; i < rows.length; i++) {
      const val = rows[i][col];
      if (typeof val === "number" && !Number.isNaN(val)) {
        values.push({ index: i, value: val });
      }
    }

    if (values.length === 0) {
      result.set(col, new Map());
      continue;
    }

    // Sort ascending
    values.sort((a, b) => a.value - b.value);

    const percentileMap = new Map<number, number>();
    const n = values.length;

    for (let rank = 0; rank < n; rank++) {
      // percentile = rank / (n - 1) * 100, handle n=1
      const pct = n === 1 ? 50 : (rank / (n - 1)) * 100;
      percentileMap.set(values[rank].index, pct);
    }

    result.set(col, percentileMap);
  }

  return result;
}

/**
 * Get CSS background color based on percentile rank.
 * Returns a color-mix string for 5-tier gradient.
 */
export function getPercentileColor(percentile: number | undefined): string | undefined {
  if (percentile == null) return undefined;

  if (percentile >= 90) {
    return "color-mix(in srgb, var(--positive) 25%, transparent)";
  }
  if (percentile >= 70) {
    return "color-mix(in srgb, var(--positive) 12%, transparent)";
  }
  if (percentile >= 30) {
    return undefined; // neutral, no color
  }
  if (percentile >= 10) {
    return "color-mix(in srgb, var(--negative) 12%, transparent)";
  }
  // bottom 10%
  return "color-mix(in srgb, var(--negative) 25%, transparent)";
}

/** Which columns should invert their color scale (lower = better) */
export const INVERTED_COLUMNS = new Set([
  "pim",
  "giveaways",
  "goalsAgainstAvg",
  "goalsAgainst",
]);
