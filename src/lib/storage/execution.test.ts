import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import {
  clearExecutionPlan,
  loadExecutionPlan,
  saveExecutionPlan,
} from "./execution";

class LocalStorageMock {
  private store = new Map<string, string>();

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }

  removeItem(key: string) {
    this.store.delete(key);
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

test("saveExecutionPlan persists plan", () => {
  saveExecutionPlan({
    id: "plan-1",
    forecastOptionType: "DRIVE_NOW",
    targetNet: 120,
    targetNetPerHour: 30,
    plannedDurationHours: 4,
    stopLossNetPerHour: 21,
    checkInEveryMinutes: 30,
    createdAt: new Date().toISOString(),
  });

  assert.equal(loadExecutionPlan()?.id, "plan-1");
});

test("clearExecutionPlan removes saved plan", () => {
  saveExecutionPlan({
    id: "plan-1",
    forecastOptionType: "DRIVE_NOW",
    targetNet: 120,
    targetNetPerHour: 30,
    plannedDurationHours: 4,
    stopLossNetPerHour: 21,
    checkInEveryMinutes: 30,
    createdAt: new Date().toISOString(),
  });

  clearExecutionPlan();

  assert.equal(loadExecutionPlan(), null);
});
