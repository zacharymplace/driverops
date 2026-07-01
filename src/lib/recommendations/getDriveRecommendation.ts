import { evaluateDriveRules } from "@/lib/rules/evaluateDriveRules";
import { applyHistoryToRecommendationInputs } from "@/lib/recommendations/historyAverages";
import { loadRecommendationInputs } from "@/lib/storage/recommendationInputs";
import { loadDriverRules } from "@/lib/storage/rules";
import { loadVehicleProfile } from "@/lib/storage/vehicleProfile";
import type { RuleDecision } from "@/types/rules";

export type DriveRecommendation = RuleDecision;

export function getDriveRecommendation(): DriveRecommendation {
  const rules = loadDriverRules();
  const vehicle = loadVehicleProfile();
  const inputs = applyHistoryToRecommendationInputs(loadRecommendationInputs());

  const currentHour = new Date().getHours();

  return evaluateDriveRules(rules, {
    estimatedNetPerHour: inputs.estimatedNetPerHour,
    estimatedNetPerMile: inputs.estimatedNetPerMile,
    estimatedDailyNet: inputs.estimatedDailyNet,
    fuelPricePerGallon:
      inputs.fuelPricePerGallon || vehicle.fuelPricePerGallon,
    currentHour,
  });
}
