export type EvidenceType =
  | "RULE"
  | "INPUT"
  | "HISTORY"
  | "CALIBRATION"
  | "FORECAST";

export type EvidenceDirection = "SUPPORTS" | "WEAKENS" | "NEUTRAL";

export type EvidenceItem = {
  id: string;
  type: EvidenceType;
  label: string;
  detail: string;
  direction: EvidenceDirection;
  confidence: number;
  freshness: number;
  weight: number;
  contribution: number;
};

export type EvidenceSummary = {
  items: EvidenceItem[];
  supportScore: number;
  riskScore: number;
  netEvidenceScore: number;
};
