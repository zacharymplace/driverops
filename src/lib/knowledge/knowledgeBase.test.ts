import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import { getKnowledgeItems, getKnowledgeSummary, seedDefaultKnowledge } from "./knowledgeBase";

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

test("getKnowledgeItems returns default knowledge when none is saved", () => {
  assert.ok(getKnowledgeItems().length > 0);
});

test("seedDefaultKnowledge stores default knowledge", () => {
  const items = seedDefaultKnowledge();

  assert.equal(items.length, getKnowledgeItems().length);
});

test("getKnowledgeSummary summarizes knowledge base", () => {
  const summary = getKnowledgeSummary();

  assert.ok(summary.totalItems > 0);
  assert.ok(summary.highConfidenceItems > 0);
});
