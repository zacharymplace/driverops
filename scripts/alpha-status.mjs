import { getAlphaReadinessReport } from "../src/lib/alpha/alphaReadiness.ts";
import { getPrelaunchReadiness } from "../src/lib/prelaunch/prelaunchReadiness.ts";
import { getProductionReadinessReport } from "../src/lib/production/productionReadiness.ts";

const alpha = getAlphaReadinessReport();
const prelaunch = getPrelaunchReadiness();
const production = getProductionReadinessReport();

console.log(
  JSON.stringify(
    {
      alpha,
      prelaunch,
      production,
    },
    null,
    2
  )
);

if (!prelaunch.ready) {
  console.error("Prelaunch is not complete. Continue validation before trusting recommendations.");
}

if (!alpha.ready) {
  console.error("Alpha evidence threshold has not been met yet.");
}
