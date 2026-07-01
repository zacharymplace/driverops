import assert from "node:assert/strict";
import { test } from "node:test";

import { DEFAULT_DRIVER_RULES } from "./defaultRules";
import { evaluateDriveRules } from "./evaluateDriveRules";

test("evaluateDriveRules returns GO when all thresholds clear", () => {
  const decision = evaluateDriveRules(DEFAULT_DRIVER_RULES, {
    estimatedNetPerHour: 32,
    estimatedNetPerMile: 1.4,
    estimatedDailyNet: 190,
    fuelPricePerGallon: 3.85,
    currentHour: 17,
  });

  assert.equal(decision.status, "GO");
  assert.equal(decision.confidence, 100);
});

test("evaluateDriveRules returns WAIT for mixed conditions", () => {
  const decision = evaluateDriveRules(DEFAULT_DRIVER_RULES, {
    estimatedNetPerHour: 26,
    estimatedNetPerMile: 0.8,
    estimatedDailyNet: 120,
    fuelPricePerGallon: 3.85,
    currentHour: 15,
  });

  assert.equal(decision.status, "WAIT");
  assert.equal(decision.confidence, 40);
});

test("evaluateDriveRules returns STAND_DOWN when economics fail", () => {
  const decision = evaluateDriveRules(DEFAULT_DRIVER_RULES, {
    estimatedNetPerHour: 12,
    estimatedNetPerMile: 0.4,
    estimatedDailyNet: 70,
    fuelPricePerGallon: 5,
    currentHour: 22,
  });

  assert.equal(decision.status, "STAND_DOWN");
  assert.equal(decision.confidence, 0);
});
