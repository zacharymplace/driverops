export type RecommendationStatus = "GO" | "PREPARE" | "WAIT" | "STAND_DOWN";

export type DriverRules = {
  minimumNetPerHour: number;
  minimumNetPerMile: number;
  targetDailyNet: number;
  maxFuelPricePerGallon: number;
  preferredStartHour: number;
  latestStartHour: number;
};

export type RuleInput = {
  estimatedNetPerHour: number;
  estimatedNetPerMile: number;
  estimatedDailyNet: number;
  fuelPricePerGallon: number;
  currentHour: number;
};

export type RuleCheck = {
  label: string;
  actual: string;
  threshold: string;
  passed: boolean;
};

export type RuleDecision = {
  status: RecommendationStatus;
  confidence: number;
  expectedNet: number;
  recommendedStart: string;
  reasons: string[];
  checks: RuleCheck[];
};
