import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { getDecisionSnapshot } from "./getDecisionSnapshot";

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

test("getDecisionSnapshot returns a recommendation headline", () => {
  const snapshot = getDecisionSnapshot();

  assert.equal(snapshot.recommendation.status, "GO");
  assert.equal(snapshot.headline, "Drive window is favorable.");
  assert.equal(snapshot.confidenceLabel, "High");
});

test("getDecisionSnapshot returns drivers and risks", () => {
  localStorage.setItem(
    "driverops.recommendationInputs",
    JSON.stringify({
      estimatedNetPerHour: 12,
      estimatedNetPerMile: 1.2,
      estimatedDailyNet: 100,
      marketDemandScore: 40,
      fuelPricePerGallon: 5,
    })
  );

  const snapshot = getDecisionSnapshot();

  assert.ok(snapshot.drivers.length > 0);
  assert.ok(snapshot.risks.length > 0);
});
