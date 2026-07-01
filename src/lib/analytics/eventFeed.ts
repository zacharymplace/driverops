import { getRecentEvents } from "@/lib/storage/events";

export function getEventFeed() {
  return getRecentEvents(6);
}
