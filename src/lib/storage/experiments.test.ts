import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import {
  loadExperimentResults,
  loadExperiments,
  saveExperimentResults,
  saveExperiments,
} from "./experiments";

class LocalStorageMock {
  private store = new Map<string, string>();

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
}

beforeEach(() => {
  const localStorage = new LocalStorageMock();

  Object.defineProperty(globalThis, "localStorage", {
    value: localStorage,
    configurable: true,
  });

  Object.defineProperty(globalThis, "window", {
    value: {
      localStorage,
      dispatchEvent: () => true,
    },
    configurable: true,
  });
});

test("saveExperiments persists experiments", () => {
  saveExperiments([
    {
      id: "experiment-1",
      title: "Test",
      hypothesis: "Testing",
      control: { id: "control", label: "Control", description: "Control" },
      candidate: { id: "candidate", label: "Candidate", description: "Candidate" },
      status: "RUNNING",
      createdAt: new Date().toISOString(),
    },
  ]);

  assert.equal(loadExperiments().length, 1);
});

test("saveExperimentResults persists results", () => {
  saveExperimentResults([
    {
      experimentId: "experiment-1",
      variantId: "control",
      netProfit: 100,
      forecastError: 10,
      policyViolations: 0,
      confidence: 80,
    },
  ]);

  assert.equal(loadExperimentResults().length, 1);
});
