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
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-[#1F2328]/30 p-0 sm:items-center sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        className="max-h-[92svh] w-full overflow-x-hidden overflow-y-auto rounded-t-[22px] border border-[#E4E8E5] bg-white shadow-[0_24px_64px_rgba(31,35,40,0.14)] sm:max-w-xl sm:rounded-[18px]"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#E4E8E5] bg-white px-5 py-4 sm:px-7 sm:py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4F806A]">
              {isEditing ? "Edit" : "New task"}
            </p>
            <h2 id="task-form-title" className="mt-1 text-2xl font-semibold tracking-[-0.025em] text-[#1F2328]">
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
            className="h-11 w-11"
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
              className="h-12 bg-[#F7F8F6] px-4"
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
              className="flex w-full resize-none rounded-[14px] border border-input bg-[#F7F8F6] px-4 py-3 text-sm text-[#1F2328] outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus-visible:border-[#B9C9C0] focus-visible:ring-2 focus-visible:ring-[#7FAAE0]/60 disabled:opacity-50 motion-reduce:transition-none"
            />
          </div>

          <fieldset>
            <legend className="mb-3 flex items-center gap-2 text-sm font-medium">
              <CalendarDays aria-hidden="true" className="h-4 w-4 text-[#4F806A]" />
              Due date (optional)
            </legend>
            <div className="grid grid-cols-1 gap-3 min-[380px]:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="task-due-date" className="text-xs text-[#66716C]">
                  Date
                </Label>
                <Input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  className="h-12 bg-[#F7F8F6]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-due-time" className="text-xs text-[#66716C]">
                  Time
                </Label>
                <Input
                  id="task-due-time"
                  type="time"
                  value={dueTime}
                  onChange={(event) => setDueTime(event.target.value)}
                  disabled={!dueDate}
                  className="h-12 bg-[#F7F8F6]"
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
              className="h-12 w-full rounded-[14px] border border-input bg-[#F7F8F6] px-4 text-sm text-[#1F2328] outline-none focus-visible:ring-2 focus-visible:ring-[#7FAAE0]"
            >
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {!isEditing ? (
            <div className="rounded-2xl border border-[#E4E8E5] bg-[#F7F8F6] p-4">
              <label className="flex min-h-11 cursor-pointer items-center justify-between gap-4">
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#557FAE]">
                    <Bell aria-hidden="true" className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">Add reminder</span>
                    <span className="block text-xs text-[#66716C]">Optional</span>
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(event) => setReminderEnabled(event.target.checked)}
                  className="h-5 w-5 rounded border-[#AEBBB4] text-[#4F806A] focus:ring-[#7FAAE0]"
                />
              </label>

              {reminderEnabled ? (
                <div className="mt-4 grid grid-cols-1 gap-3 border-t border-[#E4E8E5] pt-4 min-[380px]:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-date" className="text-xs text-[#66716C]">
                      Reminder date
                    </Label>
                    <Input
                      id="reminder-date"
                      type="date"
                      value={reminderDate}
                      onChange={(event) => setReminderDate(event.target.value)}
                      required={reminderEnabled}
                      className="h-12 bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reminder-time" className="text-xs text-[#66716C]">
                      Reminder time
                    </Label>
                    <Input
                      id="reminder-time"
                      type="time"
                      value={reminderTime}
                      onChange={(event) => setReminderTime(event.target.value)}
                      required={reminderEnabled}
                      className="h-12 bg-white"
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

          <div className="flex flex-col-reverse gap-3 border-t border-[#E4E8E5] pt-5 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={onClose}
              disabled={isPending}
              className="min-h-12"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isPending || !title.trim()}
              className="min-h-12 px-6"
            >
              {isPending ? "Saving…" : isEditing ? "Save changes" : "Create task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
