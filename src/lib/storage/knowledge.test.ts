import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";

import {
  loadKnowledgeItems,
  saveKnowledgeItems,
  upsertKnowledgeItem,
} from "./knowledge";

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

test("saveKnowledgeItems persists knowledge", () => {
  saveKnowledgeItems([
    {
      id: "test",
      type: "OPERATING_NOTE",
      label: "Test",
      detail: "Test detail.",
      confidence: "LOW",
      source: "test",
      evidenceCount: 1,
      updatedAt: new Date().toISOString(),
    },
  ]);

  assert.equal(loadKnowledgeItems().length, 1);
});

test("upsertKnowledgeItem replaces existing knowledge item", () => {
  upsertKnowledgeItem({
    id: "test",
    type: "OPERATING_NOTE",
    label: "Old",
    detail: "Old detail.",
    confidence: "LOW",
    source: "test",
    evidenceCount: 1,
    updatedAt: new Date().toISOString(),
  });

  upsertKnowledgeItem({
    id: "test",
    type: "OPERATING_NOTE",
    label: "New",
    detail: "New detail.",
    confidence: "HIGH",
    source: "test",
    evidenceCount: 2,
    updatedAt: new Date().toISOString(),
  });

  const items = loadKnowledgeItems();

  assert.equal(items.length, 1);
  assert.equal(items[0].label, "New");
});
