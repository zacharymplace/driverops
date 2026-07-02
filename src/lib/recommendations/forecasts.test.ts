import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { addCalibrationRecord } from "@/lib/storage/calibration";
import { getForecastSet } from "./forecasts";

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

test("getForecastSet returns ranked forecasts", () => {
  const result = getForecastSet();

  assert.equal(result.forecasts.length, 3);
  assert.equal(result.forecasts[0], result.recommended);
});

test("getForecastSet includes expected duration and vehicle wear", () => {
  const result = getForecastSet();
  const driveNow = result.forecasts.find(
    (forecast) => forecast.optionType === "DRIVE_NOW"
  );

  assert.ok(driveNow);
  assert.equal(driveNow.expectedDurationHours, 4);
  assert.ok(driveNow.vehicleWear > 0);
});

test("getForecastSet applies optimistic calibration adjustment", () => {
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

  const result = getForecastSet();
  const driveNow = result.forecasts.find(
    (forecast) => forecast.optionType === "DRIVE_NOW"
  );

  assert.ok(driveNow);
  assert.ok(driveNow.expectedNet < 165);
  assert.ok(driveNow.confidence < 100);
  assert.ok(
    driveNow.rationale.includes(
      "Forecasts have been optimistic. Reducing expected net and confidence."
    )
  );
});
