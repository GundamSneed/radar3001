export function describeHttpError(status: number, statusText: string): string {
  if (status === 429) return "Rate limited — try again in a moment";
  if (status >= 500) return "Service temporarily unavailable";
  return `Request failed (${status} ${statusText})`;
}
