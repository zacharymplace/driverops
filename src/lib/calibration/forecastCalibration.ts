import type {
  ForecastCalibrationRecord,
  ForecastCalibrationSummary,
} from "@/types/calibration";
import type { Forecast } from "@/types/forecast";

export function createCalibrationRecord({
  forecast,
  actualNet,
}: {
  forecast: Forecast;
  actualNet: number;
}): ForecastCalibrationRecord {
  const error = actualNet - forecast.expectedNet;
  const absoluteError = Math.abs(error);
  const percentError =
    forecast.expectedNet !== 0 ? (error / forecast.expectedNet) * 100 : 0;

  return {
    id: crypto.randomUUID(),
    optionType: forecast.optionType,
    forecastExpectedNet: forecast.expectedNet,
    actualNet,
    error,
    absoluteError,
    percentError,
    createdAt: new Date().toISOString(),
  };
}

export function summarizeCalibration(
  records: ForecastCalibrationRecord[]
): ForecastCalibrationSummary {
  if (records.length === 0) {
    return {
      count: 0,
      averageError: 0,
      averageAbsoluteError: 0,
      bias: "BALANCED",
    };
  }

  const averageError =
    records.reduce((sum, record) => sum + record.error, 0) / records.length;

  const averageAbsoluteError =
    records.reduce((sum, record) => sum + record.absoluteError, 0) /
    records.length;

  return {
    count: records.length,
    averageError,
    averageAbsoluteError,
    bias:
      averageError > 5
        ? "PESSIMISTIC"
        : averageError < -5
          ? "OPTIMISTIC"
          : "BALANCED",
  };
}
