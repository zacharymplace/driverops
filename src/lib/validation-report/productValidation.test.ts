import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { getProductValidationReport } from "./productValidation";

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

test("getProductValidationReport returns validation status", () => {
  const report = getProductValidationReport();

  assert.ok(report.forecastCount > 0);
  assert.equal(report.status, "NEEDS_MORE_USAGE");
});
