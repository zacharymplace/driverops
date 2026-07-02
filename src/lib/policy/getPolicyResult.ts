import { evaluatePolicy } from "@/lib/policy/evaluatePolicy";
import { getForecastSet } from "@/lib/recommendations/forecasts";
import { loadVehicleProfile } from "@/lib/storage/vehicleProfile";
import type { PolicyResult } from "@/types/policy";

export function getPolicyResult(): PolicyResult {
  const forecast = getForecastSet().recommended;
  const vehicle = loadVehicleProfile();

  return evaluatePolicy({
    projectedNetPerHour: forecast.expectedNetPerHour,
    projectedHours: forecast.expectedDurationHours,
    confidence: forecast.confidence,
    taxReserveRate: vehicle.taxReserveRate,
    vehicleCostPerMile: vehicle.maintenancePerMile + vehicle.depreciationPerMile,
    projectedNetPerMile:
      forecast.expectedDurationHours > 0
        ? forecast.expectedNet / Math.max(1, forecast.expectedDurationHours * 25)
        : 0,
  });
}
