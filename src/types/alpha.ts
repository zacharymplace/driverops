export type AlphaMilestoneStatus = "COMPLETE" | "INCOMPLETE";

export type AlphaMilestone = {
  id: string;
  label: string;
  target: number;
  actual: number;
  status: AlphaMilestoneStatus;
};

export type AlphaReadinessReport = {
  ready: boolean;
  score: number;
  milestones: AlphaMilestone[];
  nextAction: string;
};
