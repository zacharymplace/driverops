import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { DEFAULT_DRIVER_RULES } from "@/lib/rules/defaultRules";
import { loadDriverRules, saveDriverRules } from "./rules";

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

test("loadDriverRules returns defaults when no rules are saved", () => {
  assert.deepEqual(loadDriverRules(), DEFAULT_DRIVER_RULES);
});

test("saveDriverRules persists custom thresholds", () => {
  saveDriverRules({
    ...DEFAULT_DRIVER_RULES,
    minimumNetPerHour: 32,
    targetDailyNet: 220,
  });

  const rules = loadDriverRules();

  assert.equal(rules.minimumNetPerHour, 32);
  assert.equal(rules.targetDailyNet, 220);
});
