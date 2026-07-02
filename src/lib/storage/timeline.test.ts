import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import {
  clearTimelineEvents,
  loadTimelineEvents,
  recordTimelineEvent,
} from "./timeline";

class LocalStorageMock {
  private store = new Map<string, string>();

  getItem(key: string) {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
}

beforeEach(() => {
  const localStorage = new LocalStorageMock();

  Object.defineProperty(globalThis, "localStorage", {
    value: localStorage,
    configurable: true,
  });

  Object.defineProperty(globalThis, "window", {
    value: {
      localStorage,
      dispatchEvent: () => true,
    },
    configurable: true,
  });
});

test("recordTimelineEvent stores a timeline event", () => {
  recordTimelineEvent({
    type: "MISSION_CREATED",
    title: "Mission created",
    detail: "Execution plan created.",
  });

  const events = loadTimelineEvents();

  assert.equal(events.length, 1);
  assert.equal(events[0].type, "MISSION_CREATED");
});

test("clearTimelineEvents removes timeline events", () => {
  recordTimelineEvent({
    type: "MISSION_CREATED",
    title: "Mission created",
  });

  clearTimelineEvents();

  assert.equal(loadTimelineEvents().length, 0);
});
