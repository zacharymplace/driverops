import type { RuleDecision } from "@/types/rules";

export type DecisionDriver = {
  label: string;
  detail: string;
};

export type DecisionRisk = {
  label: string;
  detail: string;
};

export type DecisionSnapshot = {
  recommendation: RuleDecision;
  headline: string;
  sourceLabel: string;
  confidenceLabel: string;
  drivers: DecisionDriver[];
  risks: DecisionRisk[];
};
