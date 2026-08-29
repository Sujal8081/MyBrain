"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell, CalendarDays, X } from "lucide-react";

import {
  createTaskAction,
  updateTaskAction,
  type TaskMutationInput,
} from "@/app/protected/tasks/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  isTaskStatus,
  toIsoDateTime,
  type Task,
  type TaskStatus,
} from "@/lib/tasks/task-utils";

interface TaskFormProps {
  task?: Task;
  onClose: () => void;
  onSaved: (task: Task, message: string) => void;
}

function getLocalDateParts(value: string | null) {
  if (!value) return { date: "", time: "" };

  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");

  return {
    date: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
  };
}

export function TaskForm({ task, onClose, onSaved }: TaskFormProps) {
  const dueParts = getLocalDateParts(task?.due_date || null);
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [dueDate, setDueDate] = useState(dueParts.date);
  const [dueTime, setDueTime] = useState(dueParts.time);
  const [status, setStatus] = useState<TaskStatus>(task?.status || "todo");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(task);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isPending, onClose]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (reminderEnabled && (!reminderDate || !reminderTime)) {
      setError("Choose both a reminder date and time.");
      return;
    }

    const input: TaskMutationInput = {
      title,
      description,
      dueDate: toIsoDateTime(dueDate, dueTime),
      status: isTaskStatus(status) ? status : "todo",
      reminderAt: reminderEnabled
        ? toIsoDateTime(reminderDate, reminderTime)
        : null,
    };

    startTransition(async () => {
      const result = task
        ? await updateTaskAction(task.id, input)
        : await createTaskAction(input);

      if (!result.success || !result.task) {
        setError(result.success ? "The task could not be saved." : result.error);
        return;
      }

      onSaved(
        result.task,
        task ? "Task updated." : reminderEnabled ? "Task and reminder created." : "Task created.",
      );
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#1f2925]/30 p-0 backdrop-blur-[2px] sm:items-center sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        className="max-h-[92svh] w-full overflow-y-auto rounded-t-3xl border border-[#d9e1dc] bg-white shadow-2xl sm:max-w-xl sm:rounded-3xl"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#e5eae6] bg-white px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#4d7d68]">
              {isEditing ? "Edit" : "New task"}
            </p>
            <h2 id="task-form-title" className="mt-1 text-2xl font-semibold tracking-tight">
              {isEditing ? "Update task" : "What needs your attention?"}
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close task form"
            className="h-11 w-11 rounded-xl"
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-5 py-6 sm:px-7">
          <div className="space-y-2">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Prepare Monday meeting"
              required
              autoFocus
              maxLength={200}
              className="h-12 rounded-xl bg-[#fafbf9] px-4"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="task-description">Description (optional)</Label>
            <textarea
              id="task-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add useful context"
              rows={4}
              className="flex w-full resize-none rounded-xl border border-input bg-[#fafbf9] px-4 py-3 text-sm shadow-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            />
          </div>

          <fieldset>
            <legend className="mb-3 flex items-center gap-2 text-sm font-medium">
              <CalendarDays aria-hidden="true" className="h-4 w-4 text-[#4d7d68]" />
              Due date (optional)
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="task-due-date" className="text-xs text-[#66726d]">
                  Date
                </Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="h-12 rounded-xl bg-[#fafbf9]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-due-time" className="text-xs text-[#66726d]">
                  Time
                </Label>
                <Input
                  id="task-due-time"
                  type="time"
                  value={dueTime}
                  onChange={(event) => setDueTime(event.target.value)}
                  disabled={!dueDate}
                  className="h-12 rounded-xl bg-[#fafbf9]"
                />
              </div>
            </div>
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="task-status">Status</Label>
            <select
              id="task-status"
              value={status}
              onChange={(event) => {
                if (isTaskStatus(event.target.value)) setStatus(event.target.value);
              }}
              className="h-12 w-full rounded-xl border border-input bg-[#fafbf9] px-4 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {!isEditing ? (
            <div className="rounded-2xl border border-[#dde3df] bg-[#f8faf8] p-4">
              <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4">
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf5fb] text-[#356f9f]">
                    <Bell aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">Add reminder</span>
                    <span className="block text-xs text-[#6a756f]">Optional</span>
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(event) => setReminderEnabled(event.target.checked)}
                  className="h-5 w-5 rounded border-[#aebbb4] text-[#377458] focus:ring-[#4f86c6]"
                />
              </label>

              {reminderEnabled ? (
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#e0e6e2] pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-date" className="text-xs text-[#66726d]">
                      Reminder date
                    </Label>
                    <Input
                      id="reminder-date"
                      type="date"
                      value={reminderDate}
                      onChange={(event) => setReminderDate(event.target.value)}
                      required={reminderEnabled}
                      className="h-12 rounded-xl bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reminder-time" className="text-xs text-[#66726d]">
                      Reminder time
                    </Label>
                    <Input
                      id="reminder-time"
                      type="time"
                      value={reminderTime}
                      onChange={(event) => setReminderTime(event.target.value)}
                      required={reminderEnabled}
                      className="h-12 rounded-xl bg-white"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {error ? (
            <p
              role="alert"
              aria-live="polite"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-[#e5eae6] pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              disabled={isPending}
              className="min-h-12 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isPending || !title.trim()}
              className="min-h-12 rounded-xl px-6"
            >
              {isPending ? "Saving…" : isEditing ? "Save changes" : "Create task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
