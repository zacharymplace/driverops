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
  let score = 0;

  if (input.estimatedNetPerHour >= rules.minimumNetPerHour) {
    score += 30;
    reasons.push("Estimated net per hour clears your minimum threshold.");
  } else {
    reasons.push("Estimated net per hour is below your minimum threshold.");
  }

  if (input.estimatedNetPerMile >= rules.minimumNetPerMile) {
    score += 25;
    reasons.push("Estimated net per mile clears your minimum threshold.");
  } else {
    reasons.push("Estimated net per mile is below your minimum threshold.");
  }

  if (input.estimatedDailyNet >= rules.targetDailyNet) {
    score += 25;
    reasons.push("Expected daily net meets your target.");
  } else {
    reasons.push("Expected daily net is below your target.");
  }

  if (input.fuelPricePerGallon <= rules.maxFuelPricePerGallon) {
    score += 10;
    reasons.push("Fuel price is within your allowed range.");
  } else {
    reasons.push("Fuel price is above your preferred limit.");
  }

  if (
    input.currentHour >= rules.preferredStartHour &&
    input.currentHour <= rules.latestStartHour
  ) {
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
  };
}
