import { loadDriverRules } from "@/lib/storage/rules";
import { loadVehicleProfile } from "@/lib/storage/vehicleProfile";
import { evaluateDriveRules } from "@/lib/rules/evaluateDriveRules";
import type { RuleDecision } from "@/types/rules";

export type DriveRecommendation = RuleDecision;

export function getDriveRecommendation(): DriveRecommendation {
  const rules = loadDriverRules();
  const vehicle = loadVehicleProfile();

  const currentHour = new Date().getHours();

  return evaluateDriveRules(rules, {
    estimatedNetPerHour: 26,
    estimatedNetPerMile: 1.05,
    estimatedDailyNet: rules.targetDailyNet,
    fuelPricePerGallon: vehicle.fuelPricePerGallon,
    currentHour,
  });
}
