import { loadCalibrationRecords } from "@/lib/storage/calibration";
import { loadMissionReviews } from "@/lib/storage/reviews";
import { loadShifts } from "@/lib/storage/shifts";
import { loadTimelineEvents } from "@/lib/storage/timeline";
import type { AlphaMilestone, AlphaReadinessReport } from "@/types/alpha";

function milestone({
  id,
  label,
  target,
  actual,
}: {
  id: string;
  label: string;
  target: number;
  actual: number;
}): AlphaMilestone {
  return {
    id,
    label,
    target,
    actual,
    status: actual >= target ? "COMPLETE" : "INCOMPLETE",
  };
}

export function getAlphaReadinessReport(): AlphaReadinessReport {
  const shifts = loadShifts();
  const reviews = loadMissionReviews();
  const calibration = loadCalibrationRecords();
  const timeline = loadTimelineEvents();

  const completedMissions = timeline.filter(
    (event) =>
      event.type === "MISSION_CREATED" ||
      event.type === "MISSION_PROGRESS_CHECKED"
  ).length;

  const milestones = [
    milestone({
      id: "missions",
      label: "Mission events",
      target: 5,
      actual: completedMissions,
    }),
    milestone({
      id: "closeouts",
      label: "Closed shifts",
      target: 5,
      actual: shifts.length,
    }),
    milestone({
      id: "forecast-comparisons",
      label: "Forecast comparisons",
      target: 5,
      actual: calibration.length,
    }),
    milestone({
      id: "mission-reviews",
      label: "Mission reviews",
      target: 5,
      actual: reviews.length,
    }),
  ];

  const completeCount = milestones.filter(
    (item) => item.status === "COMPLETE"
  ).length;

  const score = Math.round((completeCount / milestones.length) * 100);

  return {
    ready: completeCount === milestones.length,
    score,
    milestones,
    nextAction:
      score === 100
        ? "Alpha 0.1 evidence threshold met. Review outcomes before changing architecture."
        : "Run Mission Mode with one real test shift, close it out, and compare forecast versus actual.",
  };
}
