export type ExperimentStatus = "DRAFT" | "RUNNING" | "PROMOTED" | "REJECTED";

export type ExperimentVariant = {
  id: string;
  label: string;
  description: string;
};

export type Experiment = {
  id: string;
  title: string;
  hypothesis: string;
  control: ExperimentVariant;
  candidate: ExperimentVariant;
  status: ExperimentStatus;
  createdAt: string;
};

export type ExperimentResult = {
  experimentId: string;
  variantId: string;
  netProfit: number;
  forecastError: number;
  policyViolations: number;
  confidence: number;
};

export type ExperimentEvaluation = {
  experimentId: string;
  winner: "CONTROL" | "CANDIDATE" | "INCONCLUSIVE";
  netProfitDelta: number;
  forecastErrorDelta: number;
  policyViolationDelta: number;
  recommendation: "PROMOTE" | "REJECT" | "KEEP_TESTING";
  rationale: string[];
};
