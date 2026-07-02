import assert from "node:assert/strict";
import { test } from "node:test";

import { parseRideshareCsv } from "./rideshareCsv";

test("parseRideshareCsv imports valid ride rows", () => {
  const rides = parseRideshareCsv(`completedAt,grossEarned,milesDriven,hoursOnline
2026-07-01,120,80,4`);

  assert.equal(rides.length, 1);
  assert.equal(rides[0].grossEarned, 120);
});
