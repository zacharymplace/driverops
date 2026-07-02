import type { ActionOptionType } from "@/types/actionOptions";

export type ForecastCalibrationRecord = {
  id: string;
  optionType: ActionOptionType;
  forecastExpectedNet: number;
  actualNet: number;
  error: number;
  absoluteError: number;
  percentError: number;
  createdAt: string;
};

export type ForecastCalibrationSummary = {
  count: number;
  averageError: number;
  averageAbsoluteError: number;
  bias: "OPTIMISTIC" | "PESSIMISTIC" | "BALANCED";
};
