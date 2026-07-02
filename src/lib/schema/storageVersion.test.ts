import assert from "node:assert/strict";
import { test } from "node:test";

import {
  DRIVEROPS_STORAGE_VERSION,
  createVersionedPayload,
  readVersionedPayload,
} from "./storageVersion";

test("createVersionedPayload wraps data with current version", () => {
  const payload = createVersionedPayload({ ok: true });

  assert.equal(payload.version, DRIVEROPS_STORAGE_VERSION);
  assert.deepEqual(payload.data, { ok: true });
});

test("readVersionedPayload reads versioned data", () => {
  const raw = JSON.stringify(createVersionedPayload({ count: 3 }));

  assert.deepEqual(
    readVersionedPayload({
      raw,
      fallback: { count: 0 },
    }),
    { count: 3 }
  );
});

test("readVersionedPayload falls back on invalid JSON", () => {
  assert.deepEqual(
    readVersionedPayload({
      raw: "{bad",
      fallback: { count: 0 },
    }),
    { count: 0 }
  );
});
