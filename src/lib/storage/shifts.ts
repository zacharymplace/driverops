import type { Shift } from "@/types/shifts";
import { recordEvent } from "@/lib/storage/events";

const KEY = "driverops.shifts";

export function loadShifts(): Shift[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as Shift[];
  } catch {
    return [];
  }
}

export function saveShifts(shifts: Shift[]) {
  window.localStorage.setItem(KEY, JSON.stringify(shifts));
  window.dispatchEvent(new Event("driverops:state-change"));
}

export function getActiveShift(): Shift | undefined {
  return loadShifts().find((shift) => shift.status === "ACTIVE");
}

export function getLatestClosedShift(): Shift | undefined {
  return loadShifts()
    .filter((shift) => shift.status === "CLOSED")
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))[0];
}

export function startShift(platform: Shift["platform"], startOdometer?: number): Shift {
  const shifts = loadShifts();

  const existingActive = shifts.find((shift) => shift.status === "ACTIVE");
  if (existingActive) return existingActive;

  const shift: Shift = {
    id: crypto.randomUUID(),
    status: "ACTIVE",
    startedAt: new Date().toISOString(),
    platform,
    startOdometer,
  };

  saveShifts([shift, ...shifts]);

  recordEvent({
    type: "SHIFT_STARTED",
    title: "Shift started",
    detail: `${platform} shift began.`,
  });

  return shift;
}

export function closeShift(updatedShift: Shift): Shift {
  const shifts = loadShifts();

  const next = shifts.map((shift) =>
    shift.id === updatedShift.id ? updatedShift : shift
  );

  saveShifts(next);

  recordEvent({
    type: "SHIFT_CLOSED",
    title: "Shift closed",
    detail: `Net profit recorded: $${(updatedShift.netProfit ?? 0).toFixed(2)}.`,
  });

  return updatedShift;
}
