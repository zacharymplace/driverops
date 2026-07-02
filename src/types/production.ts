export type ProductionReadinessStatus = "READY" | "BLOCKED";

export type ProductionReadinessCheck = {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
};

export type ProductionReadinessReport = {
  status: ProductionReadinessStatus;
  checks: ProductionReadinessCheck[];
  blockers: ProductionReadinessCheck[];
};
