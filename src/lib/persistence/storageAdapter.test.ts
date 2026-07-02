import assert from "node:assert/strict";
import { test } from "node:test";

import { createMemoryStorageAdapter } from "./storageAdapter";

test("memory storage adapter persists values", () => {
  const storage = createMemoryStorageAdapter();

  storage.setItem("x", "1");

  assert.equal(storage.getItem("x"), "1");

  storage.removeItem("x");

  assert.equal(storage.getItem("x"), null);
});
