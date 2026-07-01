import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { getRecommendationSource } from "./source";

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

test("getRecommendationSource reports rules and inputs before shift history", () => {
  const source = getRecommendationSource();

  assert.equal(source.source, "RULES_INPUTS");
  assert.equal(source.shiftHistoryCount, 0);
});

test("getRecommendationSource reports shift history when closed shifts exist", () => {
  localStorage.setItem(
    "driverops.shifts",
    JSON.stringify([
      {
        id: "shift-1",
        status: "CLOSED",
        startedAt: new Date().toISOString(),
        platform: "Uber",
      },
    ])
  );

  const source = getRecommendationSource();

  assert.equal(source.source, "SHIFT_HISTORY");
  assert.equal(source.shiftHistoryCount, 1);
});

test("getRecommendationSource reports hybrid after enough closed shifts", () => {
  localStorage.setItem(
    "driverops.shifts",
    JSON.stringify(
      Array.from({ length: 5 }, (_, index) => ({
        id: `shift-${index}`,
        status: "CLOSED",
        startedAt: new Date().toISOString(),
        platform: "Uber",
      }))
    )
  );

  const source = getRecommendationSource();

  assert.equal(source.source, "HYBRID");
  assert.equal(source.shiftHistoryCount, 5);
});
