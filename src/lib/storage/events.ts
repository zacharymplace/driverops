import type { BusinessEvent } from "@/types/events";

const KEY = "driverops.events";

function getStorage() {
  return globalThis.localStorage ?? null;
}


export function loadEvents(): BusinessEvent[] {
  const storage = getStorage();
  if (!storage) return [];

  const raw = storage.getItem(KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw) as BusinessEvent[];
  } catch {
    return [];
  }
}

export function saveEvents(events: BusinessEvent[]) {
  if (typeof localStorage === "undefined") return;

  localStorage.setItem(KEY, JSON.stringify(events));

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("driverops:state-change"));
  }
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
