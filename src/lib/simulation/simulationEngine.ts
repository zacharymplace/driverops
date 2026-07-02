import { evaluatePolicy } from "@/lib/policy/evaluatePolicy";
import { getForecastSet } from "@/lib/recommendations/forecasts";
import { loadVehicleProfile } from "@/lib/storage/vehicleProfile";
import { DEFAULT_SIMULATION_SCENARIOS } from "@/lib/simulation/defaultScenarios";
import type {
  SimulationResult,
  SimulationScenario,
  SimulationSet,
} from "@/types/simulation";

function clampConfidence(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function classifySimulation({
  policyAllowed,
  confidence,
}: {
  policyAllowed: boolean;
  confidence: number;
}): SimulationResult["recommendation"] {
  if (!policyAllowed) return "BLOCKED";
  if (confidence >= 70) return "FAVORABLE";
  return "RISKY";
}

export function runSimulationScenario(
  scenario: SimulationScenario
): SimulationResult {
  const forecast = getForecastSet().recommended;
  const vehicle = loadVehicleProfile();

  const expectedNet = Math.round(forecast.expectedNet * scenario.demandMultiplier);
  const expectedNetPerHour =
    forecast.expectedDurationHours > 0
      ? expectedNet / forecast.expectedDurationHours
      : 0;

  const confidence = clampConfidence(
    forecast.confidence * scenario.confidenceMultiplier
  );

  const vehicleCostPerMile =
    (vehicle.maintenancePerMile + vehicle.depreciationPerMile) *
    scenario.vehicleCostMultiplier;

  const projectedNetPerMile =
    forecast.expectedDurationHours > 0
      ? expectedNet / Math.max(1, forecast.expectedDurationHours * 25)
      : 0;

  const policy = evaluatePolicy({
    projectedNetPerHour: expectedNetPerHour,
    projectedHours: forecast.expectedDurationHours,
    confidence,
    taxReserveRate: vehicle.taxReserveRate,
    vehicleCostPerMile,
    projectedNetPerMile,
  });

  return {
    scenarioId: scenario.id,
    label: scenario.label,
    expectedNet,
    expectedNetPerHour,
    confidence,
    policyAllowed: policy.allowed,
    policyViolations: policy.violations.length,
    recommendation: classifySimulation({
      policyAllowed: policy.allowed,
      confidence,
    }),
    rationale: [
      scenario.description,
      `Expected net becomes $${expectedNet.toFixed(2)}.`,
      `Confidence becomes ${confidence}%.`,
      policy.allowed
        ? "Scenario passes policy validation."
        : "Scenario violates blocker policy.",
    ],
  };
}

export function getSimulationSet(): SimulationSet {
  const baseline = runSimulationScenario({
    id: "baseline",
    label: "Baseline",
    description: "Current forecast without scenario adjustments.",
    fuelPriceMultiplier: 1,
    demandMultiplier: 1,
    confidenceMultiplier: 1,
    vehicleCostMultiplier: 1,
  });

  return {
    baseline,
    scenarios: DEFAULT_SIMULATION_SCENARIOS.map(runSimulationScenario),
  };
}
