export type PrelaunchCheckStatus = "PASS" | "MISSING" | "NEEDS_REVIEW";

export type PrelaunchCheck = {
  id: string;
  label: string;
  detail: string;
  status: PrelaunchCheckStatus;
};

export type PrelaunchReadiness = {
  ready: boolean;
  score: number;
  checks: PrelaunchCheck[];
  recommendation: string;
};
