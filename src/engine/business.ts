import { getActiveShift, getLatestClosedShift } from "@/lib/storage/shifts";
import { loadVehicleProfile } from "@/lib/storage/vehicleProfile";

export type BusinessState =
  | "NOT_CONFIGURED"
  | "READY"
  | "SHIFT_ACTIVE"
  | "SHIFT_COMPLETE";

export type BusinessSnapshot = {
  state: BusinessState;
  hasVehicleProfile: boolean;
  activeShiftId?: string;
  latestClosedShiftId?: string;
};

export function getBusinessSnapshot(): BusinessSnapshot {
  const vehicle = loadVehicleProfile();
  const activeShift = getActiveShift();
  const latestClosedShift = getLatestClosedShift();

  const hasVehicleProfile = Boolean(vehicle);

  if (!hasVehicleProfile) {
    return {
      state: "NOT_CONFIGURED",
      hasVehicleProfile,
    };
  }

  if (activeShift) {
    return {
      state: "SHIFT_ACTIVE",
      hasVehicleProfile,
      activeShiftId: activeShift.id,
      latestClosedShiftId: latestClosedShift?.id,
    };
  }

  if (latestClosedShift) {
    return {
      state: "SHIFT_COMPLETE",
      hasVehicleProfile,
      latestClosedShiftId: latestClosedShift.id,
    };
  }

  return {
    state: "READY",
    hasVehicleProfile,
  };
}
