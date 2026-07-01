import type { ShiftCloseout, ShiftScore, VehicleProfile } from "@/types/driverops";

export function scoreShift(
  vehicle: VehicleProfile,
  shift: ShiftCloseout
): ShiftScore {
  const estimatedFuel =
    shift.fuelSpent ??
    (shift.milesDriven / vehicle.mpg) * vehicle.fuelPricePerGallon;

  const vehicleReserve =
    shift.milesDriven *
    (vehicle.maintenancePerMile + vehicle.depreciationPerMile);

  const taxReserve = shift.grossEarned * vehicle.taxReserveRate;

  const netProfit =
    shift.grossEarned -
    estimatedFuel -
    shift.otherExpenses -
    vehicleReserve -
    taxReserve;

  const netPerHour = shift.hoursOnline > 0 ? netProfit / shift.hoursOnline : 0;
  const netPerMile = shift.milesDriven > 0 ? netProfit / shift.milesDriven : 0;

  let recommendation: ShiftScore["recommendation"] = "DO_NOT_DRIVE";

  if (netPerHour >= 25 && netPerMile >= 1) recommendation = "DRIVE";
  else if (netPerHour >= 18 && netPerMile >= 0.75) recommendation = "CONDITIONAL";

  return {
    netProfit,
    netPerHour,
    netPerMile,
    taxReserve,
    vehicleReserve,
    recommendation,
  };
}
