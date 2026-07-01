import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { DEFAULT_RECOMMENDATION_INPUTS } from "@/lib/recommendations/defaultInputs";
import {
  loadRecommendationInputs,
  saveRecommendationInputs,
} from "./recommendationInputs";

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

test("loadRecommendationInputs returns defaults when none are saved", () => {
  assert.deepEqual(loadRecommendationInputs(), DEFAULT_RECOMMENDATION_INPUTS);
});

test("saveRecommendationInputs persists custom estimates", () => {
  saveRecommendationInputs({
    ...DEFAULT_RECOMMENDATION_INPUTS,
    estimatedNetPerHour: 34,
    estimatedDailyNet: 210,
  });

  const inputs = loadRecommendationInputs();

  assert.equal(inputs.estimatedNetPerHour, 34);
  assert.equal(inputs.estimatedDailyNet, 210);
});
