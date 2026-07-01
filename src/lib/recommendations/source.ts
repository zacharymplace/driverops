import { loadShifts } from "@/engine/shift";
import { loadRecommendationInputs } from "@/lib/storage/recommendationInputs";
import { loadDriverRules } from "@/lib/storage/rules";
import { DEFAULT_RECOMMENDATION_INPUTS } from "@/lib/recommendations/defaultInputs";
import { DEFAULT_DRIVER_RULES } from "@/lib/rules/defaultRules";
import type { RecommendationSource } from "@/types/recommendationSource";

function differsFromDefault<T extends object>(value: T, defaults: T) {
  return Object.entries(value).some(([key, current]) => {
    return current !== defaults[key as keyof T];
  });
}

export function getRecommendationSource(): RecommendationSource {
  const rules = loadDriverRules();
  const inputs = loadRecommendationInputs();
  const closedShifts = loadShifts().filter((shift) => shift.status === "CLOSED");

  const rulesConfigured = differsFromDefault(rules, DEFAULT_DRIVER_RULES);
  const inputsConfigured = differsFromDefault(inputs, DEFAULT_RECOMMENDATION_INPUTS);
  const shiftHistoryCount = closedShifts.length;

  if (shiftHistoryCount >= 5) {
    return {
      source: "HYBRID",
      rulesConfigured,
      inputsConfigured,
      shiftHistoryCount,
      description:
        "Recommendation is using configured rules, current inputs, and early shift history.",
    };
  }

  if (shiftHistoryCount > 0) {
    return {
      source: "SHIFT_HISTORY",
      rulesConfigured,
      inputsConfigured,
      shiftHistoryCount,
      description:
        "Recommendation is starting to incorporate saved shift history, but more shifts are needed before confidence is high.",
    };
  }

  return {
    source: "RULES_INPUTS",
    rulesConfigured,
    inputsConfigured,
    shiftHistoryCount,
    description:
      "Recommendation is currently based on configured rules and editable market inputs. Shift history has not meaningfully accumulated yet.",
  };
}
