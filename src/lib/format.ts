export function fmt(
  value: number | null | undefined,
  decimals = 0,
  fallback = "—",
): string {
  if (value == null) return fallback;
  return value.toFixed(decimals);
}

export function fmtSigned(value: number | null | undefined, decimals = 0): string {
  if (value == null) return "—";
  return (value >= 0 ? "+" : "") + value.toFixed(decimals);
}

/** Best-effort process-hour display — values may be hours or raw accumulator. */
export function fmtProcessHour(
  value: number | null | undefined,
  fallback = "—",
): string {
  if (value == null || !Number.isFinite(value)) return fallback;
  return value.toFixed(2);
}

export function seriesStats(series: (number | null)[]): {
  min: number | null;
  max: number | null;
  avg: number | null;
} {
  const vals = series.filter((v): v is number => v != null);
  if (!vals.length) return { min: null, max: null, avg: null };
  return {
    min: Math.min(...vals),
    max: Math.max(...vals),
    avg: vals.reduce((a, b) => a + b, 0) / vals.length,
  };
}
