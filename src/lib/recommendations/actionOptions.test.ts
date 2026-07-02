import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { getActionOptions } from "./actionOptions";

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

test("getActionOptions returns ranked action options", () => {
  const result = getActionOptions();

  assert.equal(result.options.length, 3);
  assert.ok(result.recommended);
  assert.equal(result.options[0], result.recommended);
});

test("getActionOptions includes drive, wait, and stand down", () => {
  const result = getActionOptions();
  const types = result.options.map((option) => option.type).sort();

  assert.deepEqual(types, ["DRIVE_NOW", "STAND_DOWN", "WAIT"]);
});
