import assert from "node:assert/strict";
import test from "node:test";

import {
  filterTasks,
  getTaskRevalidationPaths,
  sortTasks,
  toIsoDateTime,
  validateTaskTitle,
  type Task,
} from "./task-utils.ts";

const task = (overrides: Partial<Task>): Task => ({
  id: crypto.randomUUID(),
  user_id: "user-1",
  title: "Task",
  description: null,
  due_date: null,
  status: "todo",
  created_at: "2026-08-20T10:00:00.000Z",
  updated_at: "2026-08-20T10:00:00.000Z",
  ...overrides,
});

test("sortTasks keeps incomplete tasks before completed tasks", () => {
  const done = task({ title: "Done", status: "done" });
  const todo = task({ title: "Todo", status: "todo" });

  assert.deepEqual(sortTasks([done, todo]).map((item) => item.title), [
    "Todo",
    "Done",
  ]);
});

test("sortTasks orders dated tasks by the closest due date", () => {
  const later = task({ title: "Later", due_date: "2026-08-30T10:00:00.000Z" });
  const sooner = task({ title: "Sooner", due_date: "2026-08-29T10:00:00.000Z" });

  assert.deepEqual(sortTasks([later, sooner]).map((item) => item.title), [
    "Sooner",
    "Later",
  ]);
});

test("sortTasks puts dated tasks before undated tasks and newest undated first", () => {
  const older = task({ title: "Older", created_at: "2026-08-20T10:00:00.000Z" });
  const newer = task({ title: "Newer", created_at: "2026-08-28T10:00:00.000Z" });
  const dated = task({ title: "Dated", due_date: "2026-09-01T10:00:00.000Z" });

  assert.deepEqual(sortTasks([older, newer, dated]).map((item) => item.title), [
    "Dated",
    "Newer",
    "Older",
  ]);
});

test("filterTasks returns only tasks matching a selected status", () => {
  const tasks = [
    task({ status: "todo" }),
    task({ status: "in_progress" }),
    task({ status: "done" }),
  ];

  assert.equal(filterTasks(tasks, "all").length, 3);
  assert.equal(filterTasks(tasks, "in_progress").length, 1);
  assert.equal(filterTasks(tasks, "in_progress")[0]?.status, "in_progress");
});

test("validateTaskTitle rejects blank titles and trims valid titles", () => {
  assert.deepEqual(validateTaskTitle("   "), {
    success: false,
    error: "Task title is required.",
  });
  assert.deepEqual(validateTaskTitle("  Plan tomorrow  "), {
    success: true,
    title: "Plan tomorrow",
  });
});

test("toIsoDateTime combines a local date and time into a database timestamp", () => {
  const result = toIsoDateTime("2026-08-29", "14:30");

  assert.equal(result, new Date("2026-08-29T14:30:00").toISOString());
  assert.equal(toIsoDateTime("", "14:30"), null);
});

test("Quick Add invalidates only the task route", () => {
  assert.deepEqual(getTaskRevalidationPaths("create", {}), ["/protected/tasks"]);
});

test("creating a dated task invalidates Tasks and Dashboard", () => {
  assert.deepEqual(
    getTaskRevalidationPaths("create", { dueDate: "2026-08-29T14:30:00.000Z" }),
    ["/protected/tasks", "/protected"],
  );
});

test("creating a reminder also invalidates Dashboard and Reminders", () => {
  assert.deepEqual(
    getTaskRevalidationPaths("create", { reminderAt: "2026-08-29T14:30:00.000Z" }),
    ["/protected/tasks", "/protected", "/protected/reminders"],
  );
});

test("update, status, and delete invalidate only their affected task views", () => {
  assert.deepEqual(getTaskRevalidationPaths("update"), [
    "/protected/tasks",
    "/protected",
    "/protected/reminders",
  ]);
  assert.deepEqual(getTaskRevalidationPaths("status"), [
    "/protected/tasks",
    "/protected",
  ]);
  assert.deepEqual(getTaskRevalidationPaths("delete"), [
    "/protected/tasks",
    "/protected",
    "/protected/reminders",
  ]);
});
