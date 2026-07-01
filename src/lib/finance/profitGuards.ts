export const MINIMUM_RELIABLE_SHIFT_MINUTES = 15;

export function getShiftDurationMinutes(startedAt: string, endedAt?: string): number {
  const end = endedAt ? new Date(endedAt).getTime() : Date.now();
  return Math.max(0, (end - new Date(startedAt).getTime()) / 1000 / 60);
}

export function isReliableHourlyRate(minutes: number): boolean {
  return minutes >= MINIMUM_RELIABLE_SHIFT_MINUTES;
}

export function formatMetric(value: number | undefined, options?: { money?: boolean }) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "—";
  return options?.money ? `$${value.toFixed(2)}` : value.toFixed(2);
}
