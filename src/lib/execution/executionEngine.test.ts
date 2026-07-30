import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import {
  calculateExecutionProgress,
  createExecutionPlan,
  evaluateExecutionProgress,
} from "./executionEngine";

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

test("createExecutionPlan creates plan from recommended forecast", () => {
  const plan = createExecutionPlan();

  assert.ok(plan.id);
  assert.ok(plan.targetNet >= 0);
  assert.ok(plan.checkInEveryMinutes > 0);
});

test("calculateExecutionProgress estimates live net", () => {
  const plan = createExecutionPlan();
  const progress = calculateExecutionProgress({
    plan,
    grossEarned: 100,
    hoursElapsed: 2,
    milesDriven: 40,
  });

  assert.equal(progress.planId, plan.id);
  assert.equal(progress.estimatedNet, 89);
  assert.equal(progress.estimatedNetPerHour, 44.5);
});

test("evaluateExecutionProgress recommends stop below stop-loss", () => {
  const plan = {
    ...createExecutionPlan(),
    targetNetPerHour: 40,
    stopLossNetPerHour: 25,
  };

  const progress = {
    planId: plan.id,
    grossEarned: 10,
    hoursElapsed: 2,
    milesDriven: 20,
    estimatedNet: 10,
    estimatedNetPerHour: 5,
  };

  const recommendation = evaluateExecutionProgress({ plan, progress });

  assert.equal(recommendation.status, "STOP");
});
