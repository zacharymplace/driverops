import assert from "node:assert/strict";
import { test } from "node:test";

import { createExperiment, evaluateExperiment } from "./experimentEngine";

const experiment = {
  id: "experiment-1",
  title: "Higher confidence threshold",
  hypothesis: "A higher confidence threshold improves outcomes.",
  control: {
    id: "control",
    label: "Current Policy",
    description: "Current confidence threshold.",
  },
  candidate: {
    id: "candidate",
    label: "Higher Confidence Policy",
    description: "Require higher confidence before recommending GO.",
  },
  status: "RUNNING" as const,
  createdAt: new Date().toISOString(),
};

test("createExperiment creates a draft experiment", () => {
  const created = createExperiment({
    title: "Test Policy",
    hypothesis: "Candidate improves net profit.",
    control: experiment.control,
    candidate: experiment.candidate,
  });

  assert.equal(created.status, "DRAFT");
  assert.equal(created.title, "Test Policy");
  assert.ok(created.id);
});

test("evaluateExperiment keeps testing with insufficient data", () => {
  const evaluation = evaluateExperiment({
    experiment,
    results: [],
  });

  assert.equal(evaluation.winner, "INCONCLUSIVE");
  assert.equal(evaluation.recommendation, "KEEP_TESTING");
});

test("evaluateExperiment promotes better candidate", () => {
  const evaluation = evaluateExperiment({
    experiment,
    results: [
      { experimentId: "experiment-1", variantId: "control", netProfit: 100, forecastError: 15, policyViolations: 0, confidence: 80 },
      { experimentId: "experiment-1", variantId: "control", netProfit: 102, forecastError: 14, policyViolations: 0, confidence: 80 },
      { experimentId: "experiment-1", variantId: "control", netProfit: 98, forecastError: 16, policyViolations: 0, confidence: 80 },
      { experimentId: "experiment-1", variantId: "candidate", netProfit: 112, forecastError: 10, policyViolations: 0, confidence: 85 },
      { experimentId: "experiment-1", variantId: "candidate", netProfit: 114, forecastError: 9, policyViolations: 0, confidence: 85 },
      { experimentId: "experiment-1", variantId: "candidate", netProfit: 116, forecastError: 8, policyViolations: 0, confidence: 85 },
    ],
  });

  assert.equal(evaluation.winner, "CANDIDATE");
  assert.equal(evaluation.recommendation, "PROMOTE");
});

test("evaluateExperiment rejects worse candidate", () => {
  const evaluation = evaluateExperiment({
    experiment,
    results: [
      { experimentId: "experiment-1", variantId: "control", netProfit: 100, forecastError: 10, policyViolations: 0, confidence: 80 },
      { experimentId: "experiment-1", variantId: "control", netProfit: 102, forecastError: 10, policyViolations: 0, confidence: 80 },
      { experimentId: "experiment-1", variantId: "control", netProfit: 98, forecastError: 10, policyViolations: 0, confidence: 80 },
      { experimentId: "experiment-1", variantId: "candidate", netProfit: 90, forecastError: 22, policyViolations: 1, confidence: 85 },
      { experimentId: "experiment-1", variantId: "candidate", netProfit: 91, forecastError: 23, policyViolations: 1, confidence: 85 },
      { experimentId: "experiment-1", variantId: "candidate", netProfit: 89, forecastError: 24, policyViolations: 1, confidence: 85 },
    ],
  });

  assert.equal(evaluation.winner, "CONTROL");
  assert.equal(evaluation.recommendation, "REJECT");
});
