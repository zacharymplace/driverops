import { getEvidenceSummary } from "@/lib/evidence/evidenceEngine";
import { getLearningSummary } from "@/lib/learning/learningEngine";
import { getPolicyResult } from "@/lib/policy/getPolicyResult";
import type { MissionReview, ReviewGrade } from "@/types/review";

function gradeFromAccuracy(accuracy: number): ReviewGrade {
  if (accuracy >= 90) return "A";
  if (accuracy >= 80) return "B";
  if (accuracy >= 70) return "C";
  if (accuracy >= 60) return "D";
  return "F";
}

function getForecastAccuracy({
  forecastExpectedNet,
  actualNet,
}: {
  forecastExpectedNet: number;
  actualNet: number;
}) {
  if (forecastExpectedNet <= 0) return actualNet <= 0 ? 100 : 0;

  const percentError = Math.abs(actualNet - forecastExpectedNet) / forecastExpectedNet;
  return Math.max(0, Math.round((1 - percentError) * 100));
}

export function createMissionReview({
  forecastExpectedNet,
  actualNet,
}: {
  forecastExpectedNet: number;
  actualNet: number;
}): MissionReview {
  const evidence = getEvidenceSummary();
  const learning = getLearningSummary();
  const policy = getPolicyResult();

  const forecastAccuracy = getForecastAccuracy({
    forecastExpectedNet,
    actualNet,
  });

  const strongestSignal =
    evidence.items
      .filter((item) => item.contribution > 0)
      .sort((a, b) => b.contribution - a.contribution)[0]?.label ??
    "No positive signal detected";

  const weakestSignal =
    evidence.items
      .filter((item) => item.contribution < 0)
      .sort((a, b) => a.contribution - b.contribution)[0]?.label ??
    "No negative signal detected";

  return {
    id: crypto.randomUUID(),
    forecastAccuracy,
    executionGrade: gradeFromAccuracy(forecastAccuracy),
    policyViolations: policy.violations.length,
    forecastBias: learning.bias,
    strongestSignal,
    weakestSignal,
    recommendedImprovement:
      learning.bias === "OPTIMISTIC"
        ? "Reduce expected net assumptions until forecast accuracy improves."
        : learning.bias === "PESSIMISTIC"
          ? "Slightly increase expected net assumptions if recent results remain stronger than forecasts."
          : "Keep current forecast assumptions and continue collecting mission outcomes.",
    createdAt: new Date().toISOString(),
  };
}
