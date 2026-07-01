import assert from "node:assert/strict";
import { test } from "node:test";

import {
  createSampleClosedShifts,
  getSampleClosedShiftsStoragePayload,
} from "./sampleShifts";

test("createSampleClosedShifts creates closed shifts", () => {
  const shifts = createSampleClosedShifts(5);

  assert.equal(shifts.length, 5);
  assert.equal(shifts.every((shift) => shift.status === "CLOSED"), true);
  assert.equal(shifts.every((shift) => typeof shift.netProfit === "number"), true);
});

test("getSampleClosedShiftsStoragePayload returns JSON payload", () => {
  const payload = getSampleClosedShiftsStoragePayload(5);
  const parsed = JSON.parse(payload);

  assert.equal(parsed.length, 5);
  assert.equal(parsed[0].id, "sample-shift-1");
});
