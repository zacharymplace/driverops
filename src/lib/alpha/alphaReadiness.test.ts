import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { getAlphaReadinessReport } from "./alphaReadiness";

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
    value: { localStorage, dispatchEvent: () => true },
    configurable: true,
  });
});

test("getAlphaReadinessReport starts incomplete before operations", () => {
  const report = getAlphaReadinessReport();

  assert.equal(report.ready, false);
  assert.equal(report.score, 0);
  assert.equal(report.milestones.length, 4);
});
