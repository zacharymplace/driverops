import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { getPrelaunchReadiness } from "./prelaunchReadiness";

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

test("getPrelaunchReadiness warns before real operations exist", () => {
  const readiness = getPrelaunchReadiness();

  assert.equal(readiness.ready, false);
  assert.ok(readiness.score > 0);
  assert.ok(
    readiness.checks.some((check) => check.id === "real-shifts" && check.status === "MISSING")
  );
});
