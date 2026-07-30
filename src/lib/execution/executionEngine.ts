import { getForecastSet } from "@/lib/recommendations/forecasts";
import { loadVehicleProfile } from "@/lib/storage/vehicleProfile";
import type {
  ExecutionPlan,
  ExecutionProgress,
  ExecutionRecommendation,
} from "@/types/execution";

export function createExecutionPlan(): ExecutionPlan {
  const forecast = getForecastSet().recommended;

  return {
    id: crypto.randomUUID(),
    forecastOptionType: forecast.optionType,
    targetNet: forecast.expectedNet,
    targetNetPerHour: forecast.expectedNetPerHour,
    plannedDurationHours: forecast.expectedDurationHours,
    stopLossNetPerHour: Math.max(15, forecast.expectedNetPerHour * 0.7),
    checkInEveryMinutes: 30,
    createdAt: new Date().toISOString(),
  };
}

export function calculateExecutionProgress({
  plan,
  grossEarned,
  hoursElapsed,
  milesDriven,
}: {
  plan: ExecutionPlan;
  grossEarned: number;
  hoursElapsed: number;
  milesDriven: number;
}): ExecutionProgress {
  const vehicle = loadVehicleProfile();
  const fuelCost =
    vehicle.mpg > 0
      ? (milesDriven / vehicle.mpg) * vehicle.fuelPricePerGallon
      : 0;

  const vehicleCost =
    milesDriven * (vehicle.maintenancePerMile + vehicle.depreciationPerMile);

  const estimatedNet = grossEarned - fuelCost - vehicleCost;
  const estimatedNetPerHour =
    hoursElapsed > 0 ? estimatedNet / hoursElapsed : 0;

  return {
    planId: plan.id,
    grossEarned,
    hoursElapsed,
    milesDriven,
    estimatedNet,
    estimatedNetPerHour,
  };
}

export function evaluateExecutionProgress({
  plan,
  progress,
}: {
  plan: ExecutionPlan;
  progress: ExecutionProgress;
}): ExecutionRecommendation {
  const varianceFromTarget =
    progress.estimatedNetPerHour - plan.targetNetPerHour;

  if (progress.estimatedNetPerHour < plan.stopLossNetPerHour) {
    return {
      status: "STOP",
      detail: `Estimated net/hour is below stop-loss floor of $${plan.stopLossNetPerHour.toFixed(
        2
      )}.`,
      varianceFromTarget,
    };
  }

  if (varianceFromTarget < -5) {
    return {
      status: "CHECK",
      detail: "Performance is below target. Re-check demand and consider ending early.",
      varianceFromTarget,
    };
  }

  return {
    status: "CONTINUE",
    detail: "Execution is tracking within the planned range.",
    varianceFromTarget,
  };
}
