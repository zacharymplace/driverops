import type { DriverRules } from "@/types/rules";

export const DEFAULT_DRIVER_RULES: DriverRules = {
  minimumNetPerHour: 25,
  minimumNetPerMile: 1,
  targetDailyNet: 165,
  maxFuelPricePerGallon: 4.25,
  preferredStartHour: 17,
  latestStartHour: 20,
};
