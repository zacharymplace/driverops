import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { addCalibrationRecord } from "@/lib/storage/calibration";
import { getLearningAdjustment, getLearningSummary } from "./learningEngine";

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

test("getLearningAdjustment waits for enough calibration records", () => {
  const adjustment = getLearningAdjustment({
    count: 2,
    averageError: -20,
    averageAbsoluteError: 20,
    bias: "OPTIMISTIC",
  });

  assert.equal(adjustment.confidenceMultiplier, 1);
  assert.equal(adjustment.expectedNetMultiplier, 1);
});

test("getLearningAdjustment reduces optimistic forecasts", () => {
  const adjustment = getLearningAdjustment({
    count: 3,
    averageError: -20,
    averageAbsoluteError: 20,
    bias: "OPTIMISTIC",
  });

  assert.equal(adjustment.confidenceMultiplier, 0.92);
  assert.equal(adjustment.expectedNetMultiplier, 0.95);
});

test("getLearningSummary summarizes stored calibration records", () => {
  for (let i = 0; i < 3; i += 1) {
    addCalibrationRecord({
      id: `record-${i}`,
      optionType: "DRIVE_NOW",
      forecastExpectedNet: 100,
      actualNet: 80,
      error: -20,
      absoluteError: 20,
      percentError: -20,
      createdAt: new Date().toISOString(),
    });
  }

  const summary = getLearningSummary();

  assert.equal(summary.calibrationCount, 3);
  assert.equal(summary.bias, "OPTIMISTIC");
  assert.equal(summary.adjustment.expectedNetMultiplier, 0.95);
});
