import { getLearningSummary } from "@/lib/learning/learningEngine";
import { getShiftHistoryAverages, MINIMUM_HISTORY_SHIFTS } from "@/lib/recommendations/historyAverages";
import { getDriveRecommendation } from "@/lib/recommendations/getDriveRecommendation";
import { loadRecommendationInputs } from "@/lib/storage/recommendationInputs";
import type { EvidenceDirection, EvidenceItem, EvidenceSummary } from "@/types/evidence";

function contribution({
  direction,
  confidence,
  freshness,
  weight,
}: {
  direction: EvidenceDirection;
  confidence: number;
  freshness: number;
  weight: number;
}) {
  const value = confidence * freshness * weight;

  if (direction === "SUPPORTS") return value;
  if (direction === "WEAKENS") return -value;
  return 0;
}

function createEvidenceItem(
  item: Omit<EvidenceItem, "id" | "contribution">
): EvidenceItem {
  const id = `${item.type.toLowerCase()}-${item.label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

  return {
    ...item,
    id,
    contribution: contribution(item),
  };
}

export function getEvidenceSummary(): EvidenceSummary {
  const recommendation = getDriveRecommendation();
  const inputs = loadRecommendationInputs();
  const history = getShiftHistoryAverages();
  const learning = getLearningSummary();

  const items: EvidenceItem[] = [];

  for (const check of recommendation.checks) {
    items.push(
      createEvidenceItem({
        type: "RULE",
        label: check.label,
        detail: `${check.actual} vs ${check.threshold}`,
        direction: check.passed ? "SUPPORTS" : "WEAKENS",
        confidence: check.passed ? 0.85 : 0.75,
        freshness: 1,
        weight: 1,
      })
    );
  }

  items.push(
    createEvidenceItem({
      type: "INPUT",
      label: "Market Demand",
      detail: `Manual demand score: ${inputs.marketDemandScore}/100`,
      direction:
        inputs.marketDemandScore >= 70
          ? "SUPPORTS"
          : inputs.marketDemandScore <= 40
            ? "WEAKENS"
            : "NEUTRAL",
      confidence: inputs.marketDemandScore / 100,
      freshness: 0.7,
      weight: 0.7,
    })
  );

  items.push(
    createEvidenceItem({
      type: "HISTORY",
      label: "Shift History",
      detail: `${history.closedShiftCount}/${MINIMUM_HISTORY_SHIFTS} closed shifts available`,
      direction:
        history.closedShiftCount >= MINIMUM_HISTORY_SHIFTS
          ? "SUPPORTS"
          : "NEUTRAL",
      confidence: Math.min(1, history.closedShiftCount / MINIMUM_HISTORY_SHIFTS),
      freshness: 0.9,
      weight: 0.9,
    })
  );

  items.push(
    createEvidenceItem({
      type: "CALIBRATION",
      label: "Forecast Bias",
      detail: `Bias: ${learning.bias}. ${learning.adjustment.note}`,
      direction:
        learning.bias === "BALANCED"
          ? "SUPPORTS"
          : learning.bias === "OPTIMISTIC"
            ? "WEAKENS"
            : "SUPPORTS",
      confidence: Math.min(1, learning.calibrationCount / 5),
      freshness: 0.85,
      weight: 0.8,
    })
  );

  const supportScore = items
    .filter((item) => item.contribution > 0)
    .reduce((sum, item) => sum + item.contribution, 0);

  const riskScore = Math.abs(
    items
      .filter((item) => item.contribution < 0)
      .reduce((sum, item) => sum + item.contribution, 0)
  );

  return {
    items,
    supportScore,
    riskScore,
    netEvidenceScore: supportScore - riskScore,
  };
}
