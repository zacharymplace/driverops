import type { DriverRules, RuleDecision, RuleInput } from "@/types/rules";

function formatHour(hour: number) {
  const normalized = ((hour % 24) + 24) % 24;
  const suffix = normalized >= 12 ? "PM" : "AM";
  const display = normalized % 12 === 0 ? 12 : normalized % 12;

  return `${display}:00 ${suffix}`;
}

export function evaluateDriveRules(
  rules: DriverRules,
  input: RuleInput
): RuleDecision {
  const reasons: string[] = [];
  const checks: RuleDecision["checks"] = [];
  let score = 0;

  const hourlyPassed = input.estimatedNetPerHour >= rules.minimumNetPerHour;
  checks.push({
    label: "Net / Hour",
    actual: `$${input.estimatedNetPerHour.toFixed(2)}`,
    threshold: `≥ $${rules.minimumNetPerHour.toFixed(2)}`,
    passed: hourlyPassed,
  });

  if (hourlyPassed) {
    score += 30;
    reasons.push("Estimated net per hour clears your minimum threshold.");
  } else {
    reasons.push("Estimated net per hour is below your minimum threshold.");
  }

  const milePassed = input.estimatedNetPerMile >= rules.minimumNetPerMile;
  checks.push({
    label: "Net / Mile",
    actual: `$${input.estimatedNetPerMile.toFixed(2)}`,
    threshold: `≥ $${rules.minimumNetPerMile.toFixed(2)}`,
    passed: milePassed,
  });

  if (milePassed) {
    score += 25;
    reasons.push("Estimated net per mile clears your minimum threshold.");
  } else {
    reasons.push("Estimated net per mile is below your minimum threshold.");
  }

  const dailyPassed = input.estimatedDailyNet >= rules.targetDailyNet;
  checks.push({
    label: "Daily Net",
    actual: `$${input.estimatedDailyNet.toFixed(2)}`,
    threshold: `≥ $${rules.targetDailyNet.toFixed(2)}`,
    passed: dailyPassed,
  });

  if (dailyPassed) {
    score += 25;
    reasons.push("Expected daily net meets your target.");
  } else {
    reasons.push("Expected daily net is below your target.");
  }

  const fuelPassed = input.fuelPricePerGallon <= rules.maxFuelPricePerGallon;
  checks.push({
    label: "Fuel Price",
    actual: `$${input.fuelPricePerGallon.toFixed(2)}`,
    threshold: `≤ $${rules.maxFuelPricePerGallon.toFixed(2)}`,
    passed: fuelPassed,
  });

  if (fuelPassed) {
    score += 10;
    reasons.push("Fuel price is within your allowed range.");
  } else {
    reasons.push("Fuel price is above your preferred limit.");
  }

  const windowPassed =
    input.currentHour >= rules.preferredStartHour &&
    input.currentHour <= rules.latestStartHour;

  checks.push({
    label: "Time Window",
    actual: formatHour(input.currentHour),
    threshold: `${formatHour(rules.preferredStartHour)}–${formatHour(
      rules.latestStartHour
    )}`,
    passed: windowPassed,
  });

  if (windowPassed) {
    score += 10;
    reasons.push("Current time is inside your preferred work window.");
  } else if (input.currentHour < rules.preferredStartHour) {
    reasons.push("Demand window has not reached your preferred start time.");
  } else {
    reasons.push("Current time is later than your preferred start window.");
  }

  let status: RuleDecision["status"] = "STAND_DOWN";

  if (score >= 80) status = "GO";
  else if (score >= 60) status = "PREPARE";
  else if (score >= 40) status = "WAIT";

  return {
    status,
    confidence: score,
    expectedNet: input.estimatedDailyNet,
    recommendedStart: formatHour(rules.preferredStartHour),
    reasons,
    checks,
  };
}
