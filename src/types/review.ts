export type ReviewGrade = "A" | "B" | "C" | "D" | "F";

export type MissionReview = {
  id: string;
  forecastAccuracy: number;
  executionGrade: ReviewGrade;
  policyViolations: number;
  forecastBias: "OPTIMISTIC" | "PESSIMISTIC" | "BALANCED";
  strongestSignal: string;
  weakestSignal: string;
  recommendedImprovement: string;
  createdAt: string;
};
