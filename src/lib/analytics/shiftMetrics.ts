import { loadShifts } from "@/lib/storage/shifts";

export type ShiftMetrics = {
  weeklyProfit: number;
  weeklyTaxReserve: number;
  averageNetPerHour: number;
  averageNetPerMile: number;
  closedShiftCount: number;
};

export function getShiftMetrics(): ShiftMetrics {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const closed = loadShifts().filter(
    (shift) =>
      shift.status === "CLOSED" &&
      new Date(shift.startedAt).getTime() >= weekStart.getTime()
  );

  const weeklyProfit = closed.reduce(
    (sum, shift) => sum + (shift.netProfit ?? 0),
    0
  );

  const weeklyTaxReserve = closed.reduce(
    (sum, shift) => sum + (shift.taxReserve ?? 0),
    0
  );

  const averageNetPerHour =
    closed.length > 0
      ? closed.reduce((sum, shift) => sum + (shift.netPerHour ?? 0), 0) /
        closed.length
      : 0;

  const averageNetPerMile =
    closed.length > 0
      ? closed.reduce((sum, shift) => sum + (shift.netPerMile ?? 0), 0) /
        closed.length
      : 0;

  return {
    weeklyProfit,
    weeklyTaxReserve,
    averageNetPerHour,
    averageNetPerMile,
    closedShiftCount: closed.length,
  };
}
