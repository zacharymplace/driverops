import { getDriveRecommendation } from "@/lib/recommendations/getDriveRecommendation";
import { getRecommendationSource } from "@/lib/recommendations/source";
import type { DecisionDriver, DecisionRisk, DecisionSnapshot } from "@/types/decision";

function getConfidenceLabel(confidence: number) {
  if (confidence >= 80) return "High";
  if (confidence >= 60) return "Medium";
  if (confidence >= 40) return "Low";
  return "Very Low";
}

export function getDecisionSnapshot(): DecisionSnapshot {
  const recommendation = getDriveRecommendation();
  const source = getRecommendationSource();

  const drivers: DecisionDriver[] = recommendation.checks
    .filter((check) => check.passed)
    .slice(0, 3)
    .map((check) => ({
      label: check.label,
      detail: `${check.actual} vs ${check.threshold}`,
    }));

  const risks: DecisionRisk[] = recommendation.checks
    .filter((check) => !check.passed)
    .slice(0, 3)
    .map((check) => ({
      label: check.label,
      detail: `${check.actual} vs ${check.threshold}`,
    }));

  return {
    recommendation,
    headline:
      recommendation.status === "GO"
        ? "Drive window is favorable."
        : recommendation.status === "PREPARE"
          ? "Prepare to drive soon."
          : recommendation.status === "WAIT"
            ? "Wait for a better window."
            : "Stand down for now.",
    sourceLabel: source.source,
    confidenceLabel: getConfidenceLabel(recommendation.confidence),
    drivers,
    risks,
  };
}
