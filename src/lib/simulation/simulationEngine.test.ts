import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { getSimulationSet, runSimulationScenario } from "./simulationEngine";

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

test("runSimulationScenario returns a policy-aware result", () => {
  const result = runSimulationScenario({
    id: "test",
    label: "Test",
    description: "Test scenario.",
    fuelPriceMultiplier: 1,
    demandMultiplier: 1,
    confidenceMultiplier: 1,
    vehicleCostMultiplier: 1,
  });

  assert.equal(result.scenarioId, "test");
  assert.ok(result.expectedNet >= 0);
  assert.equal(typeof result.policyAllowed, "boolean");
});

test("getSimulationSet returns baseline and default scenarios", () => {
  const result = getSimulationSet();

  assert.equal(result.baseline.scenarioId, "baseline");
  assert.ok(result.scenarios.length >= 4);
});

test("runSimulationScenario marks weak demand as risky or blocked", () => {
  const result = runSimulationScenario({
    id: "weak-demand",
    label: "Weak Demand",
    description: "Demand collapses.",
    fuelPriceMultiplier: 1,
    demandMultiplier: 0.2,
    confidenceMultiplier: 0.5,
    vehicleCostMultiplier: 1,
  });

  assert.notEqual(result.recommendation, "FAVORABLE");
});
