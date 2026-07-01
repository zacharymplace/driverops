import assert from "node:assert/strict";
import { test } from "node:test";

const vehicle = {
  monthlyPayment: 460,
  monthlyInsurance: 180,
  mpg: 50,
  fuelPricePerGallon: 4,
  maintenancePerMile: 0.085,
  depreciationPerMile: 0.12,
  taxReserveRate: 0.22,
};

test("scoreShift calculates positive net margin", async () => {
  const { scoreShift } = await import("./scoreShift.ts");

  const result = scoreShift(vehicle, {
    grossEarned: 120,
    milesDriven: 78,
    hoursOnline: 4,
    fuelSpent: 12,
    otherExpenses: 0,
  });

  assert.equal(result.taxReserve, 26.4);
  assert.equal(Number(result.vehicleReserve.toFixed(2)), 15.99);
  assert.equal(Number(result.netProfit.toFixed(2)), 65.61);
  assert.equal(Number(result.netPerHour.toFixed(2)), 16.4);
  assert.equal(Number(result.netPerMile.toFixed(2)), 0.84);
});
