import { getLearningSummary } from "@/lib/learning/learningEngine";
import { getActionOptions } from "@/lib/recommendations/actionOptions";
import type { Forecast, ForecastSet } from "@/types/forecast";

function scoreForecast(forecast: Forecast) {
  return forecast.expectedNet * (forecast.confidence / 100);
}

function clampConfidence(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function getForecastSet(): ForecastSet {
  const actionOptions = getActionOptions();
  const learning = getLearningSummary();

  const forecasts: Forecast[] = actionOptions.options.map((option) => {
    const expectedDurationHours =
      option.type === "DRIVE_NOW" ? 4 : option.type === "WAIT" ? 3.25 : 0;

    const adjustedExpectedNet =
      option.expectedNet * learning.adjustment.expectedNetMultiplier;

    const vehicleWear =
      option.type === "STAND_DOWN" ? 0 : Math.round(adjustedExpectedNet * 0.16);

    return {
      optionType: option.type,
      label: option.label,
      expectedNet: Math.round(adjustedExpectedNet),
      expectedDurationHours,
      expectedNetPerHour:
        expectedDurationHours > 0 ? adjustedExpectedNet / expectedDurationHours : 0,
      confidence: clampConfidence(
        option.confidence * learning.adjustment.confidenceMultiplier
      ),
      vehicleWear,
      rationale: [...option.rationale, learning.adjustment.note],
    };
  });

  const ranked = forecasts.sort((a, b) => scoreForecast(b) - scoreForecast(a));

  return {
    recommended: ranked[0],
    forecasts: ranked,
  };
}
