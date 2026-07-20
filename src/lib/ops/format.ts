export function formatGBP(value: number | null): string {
  if (value == null) return "—";
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `£${m >= 10 ? m.toFixed(1) : m.toFixed(2)}m`;
  }
  if (value >= 1_000) return `£${Math.round(value / 1_000)}k`;
  return `£${Math.round(value)}`;
}

export function formatGBPFull(value: number | null): string {
  if (value == null) return "value not published";
  return `£${value.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`;
}

export function formatDate(d: Date | string | null): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(d: Date | string): string {
  return new Date(d).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
