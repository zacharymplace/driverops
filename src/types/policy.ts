export type PolicySeverity = "BLOCKER" | "WARNING";

export type PolicyRule = {
  id: string;
  label: string;
  severity: PolicySeverity;
  description: string;
};

export type PolicyContext = {
  projectedNetPerHour: number;
  projectedHours: number;
  confidence: number;
  taxReserveRate: number;
  vehicleCostPerMile: number;
  projectedNetPerMile: number;
};

export type PolicyViolation = {
  ruleId: string;
  label: string;
  severity: PolicySeverity;
  detail: string;
};

export type PolicyResult = {
  allowed: boolean;
  violations: PolicyViolation[];
};
