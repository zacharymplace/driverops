import assert from "node:assert/strict";
import { test } from "node:test";

import { validateShiftCloseout } from "./shiftCloseout";

test("validateShiftCloseout accepts valid closeout input", () => {
  const result = validateShiftCloseout({
    grossEarned: 120,
    milesDriven: 78,
    hoursOnline: 4,
    fuelSpent: 12,
    otherExpenses: 0,
  });

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test("validateShiftCloseout rejects empty closeout input", () => {
  const result = validateShiftCloseout({
    grossEarned: 0,
    milesDriven: 0,
    hoursOnline: 0,
    otherExpenses: 0,
  });

  assert.equal(result.valid, false);
  assert.equal(result.errors.length, 3);
});

test("validateShiftCloseout rejects negative expenses", () => {
  const result = validateShiftCloseout({
    grossEarned: 100,
    milesDriven: 20,
    hoursOnline: 2,
    fuelSpent: -1,
    otherExpenses: -5,
  });

  assert.equal(result.valid, false);
  assert.ok(result.errors.includes("Fuel spent cannot be negative."));
  assert.ok(result.errors.includes("Other expenses cannot be negative."));
});
