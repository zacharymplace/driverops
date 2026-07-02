import { getActionOptions } from "@/lib/recommendations/actionOptions";
import type { Forecast, ForecastSet } from "@/types/forecast";

function scoreForecast(forecast: Forecast) {
  return forecast.expectedNet * (forecast.confidence / 100);
}

export function getForecastSet(): ForecastSet {
  const actionOptions = getActionOptions();

  const forecasts: Forecast[] = actionOptions.options.map((option) => {
    const expectedDurationHours =
      option.type === "DRIVE_NOW" ? 4 : option.type === "WAIT" ? 3.25 : 0;

    const vehicleWear =
      option.type === "STAND_DOWN" ? 0 : Math.round(option.expectedNet * 0.16);

    return {
      optionType: option.type,
      label: option.label,
      expectedNet: option.expectedNet,
      expectedDurationHours,
      expectedNetPerHour:
        expectedDurationHours > 0 ? option.expectedNet / expectedDurationHours : 0,
      confidence: option.confidence,
      vehicleWear,
      rationale: option.rationale,
    };
  });

  const ranked = forecasts.sort((a, b) => scoreForecast(b) - scoreForecast(a));

  return {
    recommended: ranked[0],
    forecasts: ranked,
  };
}
