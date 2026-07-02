import { getDriveRecommendation } from "@/lib/recommendations/getDriveRecommendation";
import type { ActionOption, ActionOptionSet } from "@/types/actionOptions";

function scoreOption(option: ActionOption) {
  return option.expectedNet * (option.confidence / 100);
}

export function getActionOptions(): ActionOptionSet {
  const recommendation = getDriveRecommendation();

  const driveNow: ActionOption = {
    type: "DRIVE_NOW",
    label: "Drive Now",
    expectedNet: recommendation.expectedNet,
    confidence: recommendation.confidence,
    rationale: recommendation.reasons.slice(0, 3),
  };

  const wait: ActionOption = {
    type: "WAIT",
    label: "Wait 45 Minutes",
    expectedNet: Math.round(recommendation.expectedNet * 1.08),
    confidence: Math.max(0, recommendation.confidence - 6),
    rationale: [
      "Waiting may improve demand quality.",
      "This option assumes the preferred work window is approaching.",
      "Use this when confidence is below the drive-now threshold.",
    ],
  };

  const standDown: ActionOption = {
    type: "STAND_DOWN",
    label: "Stand Down",
    expectedNet: 0,
    confidence: recommendation.status === "STAND_DOWN" ? 95 : 50,
    rationale: [
      "Avoids vehicle wear and fuel exposure.",
      "Useful when expected net is below the operating threshold.",
      "Preserves time for a stronger work window.",
    ],
  };

  const options = [driveNow, wait, standDown].sort(
    (a, b) => scoreOption(b) - scoreOption(a)
  );

  return {
    recommended: options[0],
    options,
  };
}
