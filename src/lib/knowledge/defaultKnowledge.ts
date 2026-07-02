import type { KnowledgeItem } from "@/types/knowledge";

export const DEFAULT_KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: "weekday-evening-demand",
    type: "DEMAND_PATTERN",
    label: "Weekday Evening Demand",
    detail: "Evening demand can outperform midday if local commute and dinner activity are active.",
    confidence: "MEDIUM",
    source: "default",
    evidenceCount: 0,
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "fuel-price-sensitivity",
    type: "COST_ASSUMPTION",
    label: "Fuel Price Sensitivity",
    detail: "Higher fuel prices reduce effective net per mile and should lower confidence when margins are thin.",
    confidence: "HIGH",
    source: "default",
    evidenceCount: 0,
    updatedAt: new Date(0).toISOString(),
  },
  {
    id: "history-threshold",
    type: "FORECAST_LEARNING",
    label: "History Threshold",
    detail: "Shift history should not override manual estimates until enough closed shifts exist.",
    confidence: "HIGH",
    source: "default",
    evidenceCount: 0,
    updatedAt: new Date(0).toISOString(),
  },
];
