import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { createKnowledgeFromReviews } from "./knowledgeFromReviews";
import { addMissionReview } from "@/lib/storage/reviews";

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

test("createKnowledgeFromReviews creates knowledge from repeated optimistic bias", () => {
  for (let i = 0; i < 2; i += 1) {
    addMissionReview({
      id: `review-${i}`,
      forecastAccuracy: 70,
      executionGrade: "C",
      policyViolations: 0,
      forecastBias: "OPTIMISTIC",
      strongestSignal: "Demand",
      weakestSignal: "Fuel",
      recommendedImprovement: "Reduce assumptions.",
      createdAt: new Date().toISOString(),
    });
  }

  const items = createKnowledgeFromReviews();

  assert.equal(items.length, 1);
  assert.equal(items[0].id, "review-forecast-optimism");
});
