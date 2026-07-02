import { getProductionReadinessReport } from "../src/lib/production/productionReadiness.ts";

const report = getProductionReadinessReport();

console.log(JSON.stringify(report, null, 2));

if (report.status !== "READY") {
  console.error("Production readiness blocked.");
  process.exit(1);
}
