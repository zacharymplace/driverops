import type { PolicyContext, PolicyResult } from "@/types/policy";

export function evaluatePolicy(context: PolicyContext): PolicyResult {
  const violations: PolicyResult["violations"] = [];

  if (context.projectedNetPerHour < 25) {
    violations.push({
      ruleId: "minimum-hourly-net",
      label: "Minimum Hourly Net",
      severity: "BLOCKER",
      detail: `Projected net per hour is $${context.projectedNetPerHour.toFixed(
        2
      )}, below the $25.00 policy floor.`,
    });
  }

  if (context.projectedHours > 10) {
    violations.push({
      ruleId: "maximum-work-hours",
      label: "Maximum Work Hours",
      severity: "BLOCKER",
      detail: `Projected shift duration is ${context.projectedHours.toFixed(
        1
      )} hours, above the 10 hour policy limit.`,
    });
  }

  if (context.confidence < 70) {
    violations.push({
      ruleId: "minimum-confidence",
      label: "Minimum Confidence",
      severity: "WARNING",
      detail: `Recommendation confidence is ${context.confidence}%, below the 70% policy target.`,
    });
  }

  if (context.taxReserveRate < 0.25) {
    violations.push({
      ruleId: "tax-reserve",
      label: "Tax Reserve",
      severity: "WARNING",
      detail: `Tax reserve rate is ${(context.taxReserveRate * 100).toFixed(
        0
      )}%, below the 25% target.`,
    });
  }

  if (context.projectedNetPerMile < context.vehicleCostPerMile) {
    violations.push({
      ruleId: "vehicle-cost-floor",
      label: "Vehicle Cost Floor",
      severity: "BLOCKER",
      detail: `Projected net per mile is $${context.projectedNetPerMile.toFixed(
        2
      )}, below vehicle cost per mile of $${context.vehicleCostPerMile.toFixed(
        2
      )}.`,
    });
  }

  return {
    allowed: !violations.some((violation) => violation.severity === "BLOCKER"),
    violations,
  };
}
