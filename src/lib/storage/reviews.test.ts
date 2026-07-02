import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { addMissionReview, loadMissionReviews } from "./reviews";

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

test("addMissionReview persists mission reviews", () => {
  addMissionReview({
    id: "review-1",
    forecastAccuracy: 95,
    executionGrade: "A",
    policyViolations: 0,
    forecastBias: "BALANCED",
    strongestSignal: "Rule checks",
    weakestSignal: "No negative signal detected",
    recommendedImprovement: "Keep current assumptions.",
    createdAt: new Date().toISOString(),
  });

  assert.equal(loadMissionReviews().length, 1);
});
