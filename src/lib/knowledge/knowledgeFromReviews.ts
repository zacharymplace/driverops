import { loadMissionReviews } from "@/lib/storage/reviews";
import { upsertKnowledgeItem } from "@/lib/storage/knowledge";
import type { KnowledgeItem } from "@/types/knowledge";

export function createKnowledgeFromReviews(): KnowledgeItem[] {
  const reviews = loadMissionReviews();

  if (reviews.length === 0) return [];

  const optimisticCount = reviews.filter(
    (review) => review.forecastBias === "OPTIMISTIC"
  ).length;

  const balancedCount = reviews.filter(
    (review) => review.forecastBias === "BALANCED"
  ).length;

  const items: KnowledgeItem[] = [];

  if (optimisticCount >= 2) {
    items.push({
      id: "review-forecast-optimism",
      type: "FORECAST_LEARNING",
      label: "Forecast Optimism",
      detail:
        "Recent mission reviews show optimistic forecast bias. Expected net assumptions should be treated cautiously.",
      confidence: optimisticCount >= 4 ? "HIGH" : "MEDIUM",
      source: "mission-reviews",
      evidenceCount: optimisticCount,
      updatedAt: new Date().toISOString(),
    });
  }

  if (balancedCount >= 3) {
    items.push({
      id: "review-forecast-balance",
      type: "FORECAST_LEARNING",
      label: "Forecast Balance",
      detail:
        "Recent mission reviews show balanced forecasts. Current assumptions appear stable.",
      confidence: balancedCount >= 5 ? "HIGH" : "MEDIUM",
      source: "mission-reviews",
      evidenceCount: balancedCount,
      updatedAt: new Date().toISOString(),
    });
  }

  for (const item of items) {
    upsertKnowledgeItem(item);
  }

  return items;
}
