import type { VehicleProfile } from "@/types/driverops";

export type VehicleCostSummary = {
  fixedMonthlyCost: number;
  fuelPerMile: number;
  variablePerMile: number;
  totalPerMile: number;
};

export function getVehicleCostSummary(profile: VehicleProfile): VehicleCostSummary {
  const fixedMonthlyCost = profile.monthlyPayment + profile.monthlyInsurance;
  const fuelPerMile = profile.fuelPricePerGallon / profile.mpg;
  const variablePerMile = profile.maintenancePerMile + profile.depreciationPerMile;
  const totalPerMile = fuelPerMile + variablePerMile;

  return {
    fixedMonthlyCost,
    fuelPerMile,
    variablePerMile,
    totalPerMile,
  };
}
