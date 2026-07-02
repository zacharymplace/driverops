import type {
  Experiment,
  ExperimentEvaluation,
  ExperimentResult,
} from "@/types/experiments";

function average(values: number[]) {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function createExperiment({
  title,
  hypothesis,
  control,
  candidate,
}: Omit<Experiment, "id" | "status" | "createdAt">): Experiment {
  return {
    id: crypto.randomUUID(),
    title,
    hypothesis,
    control,
    candidate,
    status: "DRAFT",
    createdAt: new Date().toISOString(),
  };
}

export function evaluateExperiment({
  experiment,
  results,
}: {
  experiment: Experiment;
  results: ExperimentResult[];
}): ExperimentEvaluation {
  const controlResults = results.filter(
    (result) => result.variantId === experiment.control.id
  );
  const candidateResults = results.filter(
    (result) => result.variantId === experiment.candidate.id
  );

  if (controlResults.length < 3 || candidateResults.length < 3) {
    return {
      experimentId: experiment.id,
      winner: "INCONCLUSIVE",
      netProfitDelta: 0,
      forecastErrorDelta: 0,
      policyViolationDelta: 0,
      recommendation: "KEEP_TESTING",
      rationale: ["Not enough results for both variants."],
    };
  }

  const controlProfit = average(controlResults.map((result) => result.netProfit));
  const candidateProfit = average(
    candidateResults.map((result) => result.netProfit)
  );

  const controlError = average(
    controlResults.map((result) => Math.abs(result.forecastError))
  );
  const candidateError = average(
    candidateResults.map((result) => Math.abs(result.forecastError))
  );

  const controlViolations = average(
    controlResults.map((result) => result.policyViolations)
  );
  const candidateViolations = average(
    candidateResults.map((result) => result.policyViolations)
  );

  const netProfitDelta = candidateProfit - controlProfit;
  const forecastErrorDelta = candidateError - controlError;
  const policyViolationDelta = candidateViolations - controlViolations;

  const candidateBetter =
    netProfitDelta > 5 && forecastErrorDelta <= 0 && policyViolationDelta <= 0;

  const candidateWorse =
    netProfitDelta < -5 || forecastErrorDelta > 10 || policyViolationDelta > 0;

  return {
    experimentId: experiment.id,
    winner: candidateBetter
      ? "CANDIDATE"
      : candidateWorse
        ? "CONTROL"
        : "INCONCLUSIVE",
    netProfitDelta,
    forecastErrorDelta,
    policyViolationDelta,
    recommendation: candidateBetter
      ? "PROMOTE"
      : candidateWorse
        ? "REJECT"
        : "KEEP_TESTING",
    rationale: [
      `Candidate net profit delta: $${netProfitDelta.toFixed(2)}.`,
      `Candidate forecast error delta: ${forecastErrorDelta.toFixed(2)}.`,
      `Candidate policy violation delta: ${policyViolationDelta.toFixed(2)}.`,
    ],
  };
}
