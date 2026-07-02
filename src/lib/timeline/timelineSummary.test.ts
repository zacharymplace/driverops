import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { recordTimelineEvent } from "@/lib/storage/timeline";
import { getTimelineSummary } from "./timelineSummary";

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

test("getTimelineSummary summarizes recorded operations events", () => {
  recordTimelineEvent({
    type: "MISSION_CREATED",
    title: "Mission created",
  });

  recordTimelineEvent({
    type: "POLICY_CHECKED",
    title: "Policy checked",
  });

  const summary = getTimelineSummary();

  assert.equal(summary.totalEvents, 2);
  assert.equal(summary.missionEvents, 1);
  assert.equal(summary.policyEvents, 1);
  assert.equal(summary.latestEvent?.type, "POLICY_CHECKED");
});
