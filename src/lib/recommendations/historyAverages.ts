import { loadShifts } from "@/engine/shift";
import type { RecommendationInputs } from "@/types/recommendationInputs";

export const MINIMUM_HISTORY_SHIFTS = 5;

export type ShiftHistoryAverages = {
  closedShiftCount: number;
  averageNetPerHour: number;
  averageNetPerMile: number;
  averageDailyNet: number;
};

export function getShiftHistoryAverages(): ShiftHistoryAverages {
  const closed = loadShifts().filter(
    (shift) =>
      shift.status === "CLOSED" &&
      typeof shift.netPerHour === "number" &&
      typeof shift.netPerMile === "number" &&
      typeof shift.netProfit === "number"
  );

  const closedShiftCount = closed.length;

  if (closedShiftCount === 0) {
    return {
      closedShiftCount,
      averageNetPerHour: 0,
      averageNetPerMile: 0,
      averageDailyNet: 0,
    };
  }

  return {
    closedShiftCount,
    averageNetPerHour:
      closed.reduce((sum, shift) => sum + (shift.netPerHour ?? 0), 0) /
      closedShiftCount,
    averageNetPerMile:
      closed.reduce((sum, shift) => sum + (shift.netPerMile ?? 0), 0) /
      closedShiftCount,
    averageDailyNet:
      closed.reduce((sum, shift) => sum + (shift.netProfit ?? 0), 0) /
      closedShiftCount,
  };
}

export function applyHistoryToRecommendationInputs(
  inputs: RecommendationInputs
): RecommendationInputs {
  const history = getShiftHistoryAverages();

  if (history.closedShiftCount < MINIMUM_HISTORY_SHIFTS) {
    return inputs;
  }

  return {
    ...inputs,
    estimatedNetPerHour: history.averageNetPerHour,
    estimatedNetPerMile: history.averageNetPerMile,
    estimatedDailyNet: history.averageDailyNet,
  };
}
