import type { ForecastCalibrationRecord } from "@/types/calibration";

const KEY = "driverops.calibration";

export function loadCalibrationRecords(): ForecastCalibrationRecord[] {
  if (typeof localStorage === "undefined") return [];

  const raw = localStorage.getItem(KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as ForecastCalibrationRecord[];
  } catch {
    return [];
  }
}

export function saveCalibrationRecords(records: ForecastCalibrationRecord[]) {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(KEY, JSON.stringify(records));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("driverops:state-change"));
  }
}

export function addCalibrationRecord(record: ForecastCalibrationRecord) {
  saveCalibrationRecords([record, ...loadCalibrationRecords()]);
}
