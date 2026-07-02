import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { createMissionReview } from "./reviewEngine";

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

test("createMissionReview grades accurate forecasts highly", () => {
  const review = createMissionReview({
    forecastExpectedNet: 100,
    actualNet: 95,
  });

  assert.equal(review.forecastAccuracy, 95);
  assert.equal(review.executionGrade, "A");
  assert.ok(review.strongestSignal);
});

test("createMissionReview grades poor forecasts lower", () => {
  const review = createMissionReview({
    forecastExpectedNet: 100,
    actualNet: 55,
  });

  assert.equal(review.forecastAccuracy, 55);
  assert.equal(review.executionGrade, "F");
});
