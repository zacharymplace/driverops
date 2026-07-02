import type { OperationsTimelineEvent } from "@/types/timeline";

const KEY = "driverops.operationsTimeline";

export function loadTimelineEvents(): OperationsTimelineEvent[] {
  if (typeof localStorage === "undefined") return [];

  const raw = localStorage.getItem(KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as OperationsTimelineEvent[];
  } catch {
    return [];
  }
}

export function saveTimelineEvents(events: OperationsTimelineEvent[]) {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(KEY, JSON.stringify(events));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("driverops:state-change"));
  }
}

export function recordTimelineEvent(
  event: Omit<OperationsTimelineEvent, "id" | "createdAt">
) {
  const timelineEvent: OperationsTimelineEvent = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  saveTimelineEvents([timelineEvent, ...loadTimelineEvents()]);

  return timelineEvent;
}

export function clearTimelineEvents() {
  saveTimelineEvents([]);
}
