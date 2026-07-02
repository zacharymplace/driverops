import assert from "node:assert/strict";
import { test } from "node:test";

import { evaluatePolicy } from "./evaluatePolicy";

test("evaluatePolicy allows clean policy context", () => {
  const result = evaluatePolicy({
    projectedNetPerHour: 35,
    projectedHours: 4,
    confidence: 90,
    taxReserveRate: 0.3,
    vehicleCostPerMile: 0.45,
    projectedNetPerMile: 1.2,
  });

  assert.equal(result.allowed, true);
  assert.equal(result.violations.length, 0);
});

test("evaluatePolicy blocks below hourly floor", () => {
  const result = evaluatePolicy({
    projectedNetPerHour: 18,
    projectedHours: 4,
    confidence: 90,
    taxReserveRate: 0.3,
    vehicleCostPerMile: 0.45,
    projectedNetPerMile: 1.2,
  });

  assert.equal(result.allowed, false);
  assert.equal(result.violations[0].ruleId, "minimum-hourly-net");
});

test("evaluatePolicy warns on low confidence without blocking", () => {
  const result = evaluatePolicy({
    projectedNetPerHour: 35,
    projectedHours: 4,
    confidence: 55,
    taxReserveRate: 0.3,
    vehicleCostPerMile: 0.45,
    projectedNetPerMile: 1.2,
  });

  assert.equal(result.allowed, true);
  assert.equal(result.violations[0].severity, "WARNING");
});
