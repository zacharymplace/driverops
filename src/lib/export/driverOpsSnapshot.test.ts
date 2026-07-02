import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { createDriverOpsSnapshot } from "./driverOpsSnapshot";

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

test("createDriverOpsSnapshot exports core local state", () => {
  const snapshot = createDriverOpsSnapshot();

  assert.ok(snapshot.version);
  assert.ok(snapshot.exportedAt);
  assert.ok(snapshot.vehicleProfile);
  assert.ok(snapshot.rules);
  assert.ok(Array.isArray(snapshot.shifts));
  assert.ok(Array.isArray(snapshot.timeline));
});
