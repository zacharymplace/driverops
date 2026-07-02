import type { RuleDecision } from "@/types/rules";

export type DecisionSnapshot = {
  recommendation: RuleDecision;
  headline: string;
  sourceLabel: string;
  confidenceLabel: string;
};
