import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { getRecentEvents, loadEvents, recordEvent, saveEvents } from "./events";

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

test("recordEvent stores a business event", () => {
  recordEvent({
    type: "SHIFT_STARTED",
    title: "Shift started",
    detail: "Uber shift began.",
  });

  const events = loadEvents();

  assert.equal(events.length, 1);
  assert.equal(events[0].title, "Shift started");
  assert.ok(events[0].id);
});

test("getRecentEvents limits event results", () => {
  for (let i = 0; i < 8; i += 1) {
    recordEvent({
      type: "CHECK_PASSED",
      title: `Check ${i}`,
    });
  }

  assert.equal(getRecentEvents(3).length, 3);
});


test("loadEvents returns an empty array when stored JSON is invalid", () => {
  globalThis.localStorage.setItem("driverops.events", "{bad-json");

  assert.deepEqual(loadEvents(), []);
});
