import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { DEFAULT_RECOMMENDATION_INPUTS } from "./defaultInputs";
import {
  applyHistoryToRecommendationInputs,
  getShiftHistoryAverages,
  MINIMUM_HISTORY_SHIFTS,
} from "./historyAverages";

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

function seedClosedShifts(count: number) {
  localStorage.setItem(
    "driverops.shifts",
    JSON.stringify(
      Array.from({ length: count }, (_, index) => ({
        id: `shift-${index}`,
        status: "CLOSED",
        startedAt: new Date().toISOString(),
        platform: "Uber",
        netProfit: 100 + index,
        netPerHour: 25 + index,
        netPerMile: 1 + index * 0.1,
      }))
    )
  );
}

test("getShiftHistoryAverages returns zero averages without closed shifts", () => {
  const history = getShiftHistoryAverages();

  assert.equal(history.closedShiftCount, 0);
  assert.equal(history.averageNetPerHour, 0);
  assert.equal(history.averageNetPerMile, 0);
  assert.equal(history.averageDailyNet, 0);
});

test("applyHistoryToRecommendationInputs keeps manual inputs before enough history", () => {
  seedClosedShifts(MINIMUM_HISTORY_SHIFTS - 1);

  const inputs = applyHistoryToRecommendationInputs(DEFAULT_RECOMMENDATION_INPUTS);

  assert.equal(inputs.estimatedNetPerHour, DEFAULT_RECOMMENDATION_INPUTS.estimatedNetPerHour);
  assert.equal(inputs.estimatedNetPerMile, DEFAULT_RECOMMENDATION_INPUTS.estimatedNetPerMile);
  assert.equal(inputs.estimatedDailyNet, DEFAULT_RECOMMENDATION_INPUTS.estimatedDailyNet);
});

test("applyHistoryToRecommendationInputs uses averages after enough history", () => {
  seedClosedShifts(MINIMUM_HISTORY_SHIFTS);

  const inputs = applyHistoryToRecommendationInputs(DEFAULT_RECOMMENDATION_INPUTS);

  assert.equal(inputs.estimatedNetPerHour, 27);
  assert.equal(inputs.estimatedNetPerMile, 1.2);
  assert.equal(inputs.estimatedDailyNet, 102);
});
