/** Format seconds to MM:SS */
export function formatTOI(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Format seconds per game to MM:SS */
export function formatTOIPerGame(seconds: number | null): string {
  if (seconds == null) return "-";
  return formatTOI(Math.round(seconds));
}

/** Format percentage (0-100) to one decimal, e.g. "52.3" */
export function formatPct(value: number | null): string {
  if (value == null) return "-";
  return value.toFixed(1);
}

/** Format save percentage (0-1) to three decimals, e.g. ".921" */
export function formatSavePct(value: number | null): string {
  if (value == null) return "-";
  return value.toFixed(3).replace(/^0/, "");
}

/** Format +/- with explicit + sign for positive */
export function formatPlusMinus(value: number): string {
  if (value > 0) return `+${value}`;
  return value.toString();
}

/** Format a number, returning "-" for null */
export function formatNum(value: number | null, decimals = 0): string {
  if (value == null) return "-";
  return decimals > 0 ? value.toFixed(decimals) : value.toString();
}

/** Format GAA to two decimals */
export function formatGAA(value: number | null): string {
  if (value == null) return "-";
  return value.toFixed(2);
}
