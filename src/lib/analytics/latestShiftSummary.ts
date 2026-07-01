import { getActiveShift, getLatestClosedShift } from "@/engine/shift";

export function getLatestShiftSummary() {
  const activeShift = getActiveShift();
  const latestClosedShift = getLatestClosedShift();

  return {
    activeShift,
    latestClosedShift,
  };
}
