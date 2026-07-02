import { summarizeCalibration } from "@/lib/calibration/forecastCalibration";
import { loadCalibrationRecords } from "@/lib/storage/calibration";
import type { LearningAdjustment, LearningSummary } from "@/types/learning";

export function getLearningAdjustment(summary: {
  count: number;
  averageError: number;
  averageAbsoluteError: number;
  bias: "OPTIMISTIC" | "PESSIMISTIC" | "BALANCED";
}): LearningAdjustment {
  if (summary.count < 3) {
    return {
      confidenceMultiplier: 1,
      expectedNetMultiplier: 1,
      note: "Not enough calibration history to adjust forecasts yet.",
    };
  }

  if (summary.bias === "OPTIMISTIC") {
    return {
      confidenceMultiplier: 0.92,
      expectedNetMultiplier: 0.95,
      note: "Forecasts have been optimistic. Reducing expected net and confidence.",
    };
  }

  if (summary.bias === "PESSIMISTIC") {
    return {
      confidenceMultiplier: 1.04,
      expectedNetMultiplier: 1.03,
      note: "Forecasts have been conservative. Slightly increasing expected net and confidence.",
    };
  }

  return {
    confidenceMultiplier: 1,
    expectedNetMultiplier: 1,
    note: "Forecasts are balanced. No adjustment needed.",
  };
}

export function getLearningSummary(): LearningSummary {
  const calibration = summarizeCalibration(loadCalibrationRecords());
  const adjustment = getLearningAdjustment(calibration);

  return {
    calibrationCount: calibration.count,
    averageError: calibration.averageError,
    averageAbsoluteError: calibration.averageAbsoluteError,
    bias: calibration.bias,
    adjustment,
  };
}
