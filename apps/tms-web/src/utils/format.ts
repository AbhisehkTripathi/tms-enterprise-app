/**
 * Formats a date for display.
 */
export function formatDate(value: Date | string): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formats a numeric rate for display.
 */
export function formatRate(value: string | number): string {
  const n = typeof value === "string" ? parseFloat(value) : value;
  return Number.isNaN(n) ? "—" : `$${n.toFixed(2)}`;
}
