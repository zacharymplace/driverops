import { DEFAULT_RECOMMENDATION_INPUTS } from "@/lib/recommendations/defaultInputs";
import type { RecommendationInputs } from "@/types/recommendationInputs";

const KEY = "driverops.recommendationInputs";

export function loadRecommendationInputs(): RecommendationInputs {
  if (typeof localStorage === "undefined") return DEFAULT_RECOMMENDATION_INPUTS;

  const raw = localStorage.getItem(KEY);
  if (!raw) return DEFAULT_RECOMMENDATION_INPUTS;

  try {
    return {
      ...DEFAULT_RECOMMENDATION_INPUTS,
      ...JSON.parse(raw),
    };
  } catch {
    return DEFAULT_RECOMMENDATION_INPUTS;
  }
}

export function saveRecommendationInputs(inputs: RecommendationInputs) {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(KEY, JSON.stringify(inputs));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("driverops:state-change"));
  }
}
