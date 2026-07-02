import { loadTimelineEvents } from "@/lib/storage/timeline";
import type { OperationsTimelineEvent } from "@/types/timeline";

export type TimelineSummary = {
  totalEvents: number;
  latestEvent: OperationsTimelineEvent | null;
  missionEvents: number;
  calibrationEvents: number;
  policyEvents: number;
};

export function getTimelineSummary(): TimelineSummary {
  const events = loadTimelineEvents();

  return {
    totalEvents: events.length,
    latestEvent: events[0] ?? null,
    missionEvents: events.filter((event) => event.type.startsWith("MISSION"))
      .length,
    calibrationEvents: events.filter(
      (event) => event.type === "CALIBRATION_RECORDED"
    ).length,
    policyEvents: events.filter((event) => event.type === "POLICY_CHECKED")
      .length,
  };
}
