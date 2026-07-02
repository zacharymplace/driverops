export type LearningAdjustment = {
  confidenceMultiplier: number;
  expectedNetMultiplier: number;
  note: string;
};

export type LearningSummary = {
  calibrationCount: number;
  averageError: number;
  averageAbsoluteError: number;
  bias: "OPTIMISTIC" | "PESSIMISTIC" | "BALANCED";
  adjustment: LearningAdjustment;
};
