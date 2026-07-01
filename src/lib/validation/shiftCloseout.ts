import type { ShiftCloseout } from "@/types/driverops";

export type ShiftCloseoutValidation = {
  valid: boolean;
  errors: string[];
};

export function validateShiftCloseout(input: ShiftCloseout): ShiftCloseoutValidation {
  const errors: string[] = [];

  if (!Number.isFinite(input.grossEarned) || input.grossEarned <= 0) {
    errors.push("Gross earned must be greater than zero.");
  }

  if (!Number.isFinite(input.milesDriven) || input.milesDriven <= 0) {
    errors.push("Miles driven must be greater than zero.");
  }

  if (!Number.isFinite(input.hoursOnline) || input.hoursOnline <= 0) {
    errors.push("Hours online must be greater than zero.");
  }

  if (!Number.isFinite(input.otherExpenses) || input.otherExpenses < 0) {
    errors.push("Other expenses cannot be negative.");
  }

  if (
    typeof input.fuelSpent === "number" &&
    (!Number.isFinite(input.fuelSpent) || input.fuelSpent < 0)
  ) {
    errors.push("Fuel spent cannot be negative.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
