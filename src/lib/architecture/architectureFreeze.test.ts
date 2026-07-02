import assert from "node:assert/strict";
import { test } from "node:test";

import {
  ARCHITECTURE_FREEZE_STATUS,
  isArchitectureChangeAllowed,
} from "./architectureFreeze";

test("architecture is frozen for alpha validation", () => {
  assert.equal(ARCHITECTURE_FREEZE_STATUS.frozen, true);
  assert.equal(ARCHITECTURE_FREEZE_STATUS.phase, "pre-operations-alpha");
});

test("architecture freeze allows validation-safe work", () => {
  assert.equal(isArchitectureChangeAllowed("tests"), true);
  assert.equal(isArchitectureChangeAllowed("UI polish"), true);
});

test("architecture freeze blocks new engines by default", () => {
  assert.equal(isArchitectureChangeAllowed("new engines"), false);
});
