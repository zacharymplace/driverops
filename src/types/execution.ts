export type ExecutionPlan = {
  id: string;
  forecastOptionType: string;
  targetNet: number;
  targetNetPerHour: number;
  plannedDurationHours: number;
  stopLossNetPerHour: number;
  checkInEveryMinutes: number;
  createdAt: string;
};

export type ExecutionProgress = {
  planId: string;
  grossEarned: number;
  hoursElapsed: number;
  milesDriven: number;
  estimatedNet: number;
  estimatedNetPerHour: number;
};

export type ExecutionRecommendation = {
  status: "CONTINUE" | "CHECK" | "STOP";
  detail: string;
  varianceFromTarget: number;
};
