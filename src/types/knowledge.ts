export type KnowledgeType =
  | "DEMAND_PATTERN"
  | "TIME_WINDOW"
  | "COST_ASSUMPTION"
  | "FORECAST_LEARNING"
  | "OPERATING_NOTE";

export type KnowledgeConfidence = "LOW" | "MEDIUM" | "HIGH";

export type KnowledgeItem = {
  id: string;
  type: KnowledgeType;
  label: string;
  detail: string;
  confidence: KnowledgeConfidence;
  source: string;
  evidenceCount: number;
  updatedAt: string;
};

export type KnowledgeSummary = {
  totalItems: number;
  highConfidenceItems: number;
  demandPatterns: number;
  costAssumptions: number;
  latestItem: KnowledgeItem | null;
};
