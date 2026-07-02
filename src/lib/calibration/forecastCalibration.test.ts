import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createCalibrationRecord,
  summarizeCalibration,
} from "./forecastCalibration";
import type { Forecast } from "@/types/forecast";

const forecast: Forecast = {
  optionType: "DRIVE_NOW",
  label: "Drive Now",
  expectedNet: 100,
  expectedDurationHours: 4,
  expectedNetPerHour: 25,
  confidence: 80,
  vehicleWear: 16,
  rationale: [],
};

test("createCalibrationRecord compares forecast to actual net", () => {
  const record = createCalibrationRecord({
    forecast,
    actualNet: 85,
  });

  assert.equal(record.forecastExpectedNet, 100);
  assert.equal(record.actualNet, 85);
  assert.equal(record.error, -15);
  assert.equal(record.absoluteError, 15);
  assert.equal(record.percentError, -15);
});

test("summarizeCalibration returns balanced summary without records", () => {
  const summary = summarizeCalibration([]);

  assert.equal(summary.count, 0);
  assert.equal(summary.bias, "BALANCED");
});

test("summarizeCalibration detects optimistic forecasts", () => {
  const summary = summarizeCalibration([
    {
      id: "1",
      optionType: "DRIVE_NOW",
      forecastExpectedNet: 100,
      actualNet: 80,
      error: -20,
      absoluteError: 20,
      percentError: -20,
      createdAt: new Date().toISOString(),
    },
  ]);

  assert.equal(summary.bias, "OPTIMISTIC");
});
