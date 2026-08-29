import assert from "node:assert/strict";
import test from "node:test";

import { getActiveNavigationSection } from "./route-state.ts";

test("Home is active only for the protected dashboard root", () => {
  assert.equal(getActiveNavigationSection("/protected"), "home");
  assert.equal(getActiveNavigationSection("/protected/reminders"), "more");
  assert.equal(getActiveNavigationSection("/protected/tasks"), "tasks");
});

test("related routes resolve to exactly one primary section", () => {
  assert.equal(getActiveNavigationSection("/protected/chat"), "chat");
  assert.equal(getActiveNavigationSection("/protected/notes"), "notes");
  assert.equal(getActiveNavigationSection("/protected/documents"), "notes");
  assert.equal(getActiveNavigationSection("/protected/voice-notes"), "notes");
  assert.equal(getActiveNavigationSection("/protected/more"), "more");
  assert.equal(getActiveNavigationSection("/protected/account"), "more");
});
