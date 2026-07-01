export type RecommendationSource = {
  source: "RULES_INPUTS" | "SHIFT_HISTORY" | "HYBRID";
  rulesConfigured: boolean;
  inputsConfigured: boolean;
  shiftHistoryCount: number;
  description: string;
};
