import type { VehicleProfile } from "@/types/driverops";

export const DEFAULT_VEHICLE_PROFILE: VehicleProfile = {
  monthlyPayment: 450,
  monthlyInsurance: 180,
  mpg: 50,
  fuelPricePerGallon: 3.75,
  maintenancePerMile: 0.08,
  depreciationPerMile: 0.12,
  taxReserveRate: 0.22,
};

const KEY = "driverops.vehicleProfile";

export function loadVehicleProfile(): VehicleProfile {
  if (typeof window === "undefined") return DEFAULT_VEHICLE_PROFILE;

  const raw = window.localStorage.getItem(KEY);
  if (!raw) return DEFAULT_VEHICLE_PROFILE;

  try {
    return { ...DEFAULT_VEHICLE_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_VEHICLE_PROFILE;
  }
}

export function saveVehicleProfile(profile: VehicleProfile) {
  window.localStorage.setItem(KEY, JSON.stringify(profile));
}
