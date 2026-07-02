import type { ActionOptionType } from "@/types/actionOptions";

export type Forecast = {
  optionType: ActionOptionType;
  label: string;
  expectedNet: number;
  expectedDurationHours: number;
  expectedNetPerHour: number;
  confidence: number;
  vehicleWear: number;
  rationale: string[];
};

export type ForecastSet = {
  recommended: Forecast;
  forecasts: Forecast[];
};
