import assert from "node:assert/strict";
import { test } from "node:test";

import { getProductionReadinessReport } from "./productionReadiness";

test("getProductionReadinessReport blocks incomplete env", () => {
  const report = getProductionReadinessReport({ NODE_ENV: "test" });

  assert.equal(report.status, "BLOCKED");
  assert.ok(report.blockers.length > 0);
});

test("getProductionReadinessReport allows complete local alpha env", () => {
  const report = getProductionReadinessReport({
    NODE_ENV: "test",
    NEXT_PUBLIC_DRIVEROPS_APP_ENV: "alpha",
    DRIVEROPS_STORAGE_BACKEND: "localStorage",
    DRIVEROPS_AUTH_REQUIRED: "true",
    DRIVEROPS_BACKUP_ENABLED: "true",
  });

  assert.equal(report.status, "READY");
});

test("getProductionReadinessReport requires database url for postgres", () => {
  const report = getProductionReadinessReport({
    NODE_ENV: "test",
    NEXT_PUBLIC_DRIVEROPS_APP_ENV: "alpha",
    DRIVEROPS_STORAGE_BACKEND: "postgres",
    DRIVEROPS_AUTH_REQUIRED: "true",
    DRIVEROPS_BACKUP_ENABLED: "true",
  });

  assert.equal(report.status, "BLOCKED");
  assert.ok(report.blockers.some((blocker) => blocker.id === "database-url"));
});
