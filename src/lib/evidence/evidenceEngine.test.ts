import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { addCalibrationRecord } from "@/lib/storage/calibration";
import { getEvidenceSummary } from "./evidenceEngine";

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

test("getEvidenceSummary returns evidence items and scores", () => {
  const summary = getEvidenceSummary();

  assert.ok(summary.items.length > 0);
  assert.ok(summary.supportScore >= 0);
  assert.ok(summary.riskScore >= 0);
});

test("getEvidenceSummary includes calibration evidence", () => {
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

  const summary = getEvidenceSummary();
  const calibration = summary.items.find((item) => item.type === "CALIBRATION");

  assert.ok(calibration);
  assert.equal(calibration.direction, "WEAKENS");
});
