import { loadCalibrationRecords } from "@/lib/storage/calibration";
import { loadEvents } from "@/lib/storage/events";
import { loadExecutionPlan } from "@/lib/storage/execution";
import { loadExperimentResults, loadExperiments } from "@/lib/storage/experiments";
import { loadRecommendationInputs } from "@/lib/storage/recommendationInputs";
import { loadMissionReviews } from "@/lib/storage/reviews";
import { loadDriverRules } from "@/lib/storage/rules";
import { loadShifts } from "@/lib/storage/shifts";
import { loadTimelineEvents } from "@/lib/storage/timeline";
import { loadVehicleProfile } from "@/lib/storage/vehicleProfile";
import { DRIVEROPS_STORAGE_VERSION } from "@/lib/schema/storageVersion";

export type DriverOpsSnapshot = {
  version: number;
  exportedAt: string;
  vehicleProfile: ReturnType<typeof loadVehicleProfile>;
  rules: ReturnType<typeof loadDriverRules>;
  recommendationInputs: ReturnType<typeof loadRecommendationInputs>;
  shifts: ReturnType<typeof loadShifts>;
  events: ReturnType<typeof loadEvents>;
  timeline: ReturnType<typeof loadTimelineEvents>;
  calibration: ReturnType<typeof loadCalibrationRecords>;
  experiments: ReturnType<typeof loadExperiments>;
  experimentResults: ReturnType<typeof loadExperimentResults>;
  executionPlan: ReturnType<typeof loadExecutionPlan>;
  reviews: ReturnType<typeof loadMissionReviews>;
};

export function createDriverOpsSnapshot(): DriverOpsSnapshot {
  return {
    version: DRIVEROPS_STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    vehicleProfile: loadVehicleProfile(),
    rules: loadDriverRules(),
    recommendationInputs: loadRecommendationInputs(),
    shifts: loadShifts(),
    events: loadEvents(),
    timeline: loadTimelineEvents(),
    calibration: loadCalibrationRecords(),
    experiments: loadExperiments(),
    experimentResults: loadExperimentResults(),
    executionPlan: loadExecutionPlan(),
    reviews: loadMissionReviews(),
  };
}

export function createDriverOpsSnapshotJson() {
  return JSON.stringify(createDriverOpsSnapshot(), null, 2);
}
