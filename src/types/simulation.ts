export type SimulationScenario = {
  id: string;
  label: string;
  description: string;
  fuelPriceMultiplier: number;
  demandMultiplier: number;
  confidenceMultiplier: number;
  vehicleCostMultiplier: number;
};

export type SimulationResult = {
  scenarioId: string;
  label: string;
  expectedNet: number;
  expectedNetPerHour: number;
  confidence: number;
  policyAllowed: boolean;
  policyViolations: number;
  recommendation: "FAVORABLE" | "RISKY" | "BLOCKED";
  rationale: string[];
};

export type SimulationSet = {
  baseline: SimulationResult;
  scenarios: SimulationResult[];
};
