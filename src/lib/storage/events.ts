import type { BusinessEvent } from "@/types/events";

const KEY = "driverops.events";

export function loadEvents(): BusinessEvent[] {
  if (typeof window === "undefined") return [];

  const raw = window.localStorage.getItem(KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as BusinessEvent[];
  } catch {
    return [];
  }
}

export function saveEvents(events: BusinessEvent[]) {
  window.localStorage.setItem(KEY, JSON.stringify(events));
  window.dispatchEvent(new Event("driverops:state-change"));
}

export function recordEvent(event: Omit<BusinessEvent, "id" | "createdAt">) {
  const events = loadEvents();

  saveEvents([
    {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...event,
    },
    ...events,
  ]);
}

export function getRecentEvents(limit = 6): BusinessEvent[] {
  return loadEvents().slice(0, limit);
}
