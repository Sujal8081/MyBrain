"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";

import { createTaskAction } from "@/app/protected/tasks/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface QuickAddTaskProps {
  compact?: boolean;
}

export function QuickAddTask({ compact = false }: QuickAddTaskProps) {
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!title.trim()) {
      setFeedback("Task title is required.");
      return;
    }

    const submittedTitle = title.trim();
    setTitle("");

    startTransition(async () => {
      try {
        const result = await createTaskAction({ title: submittedTitle, status: "todo" });

        if (!result.success) {
          setTitle(submittedTitle);
          setFeedback(result.error);
          return;
        }

        setFeedback("Task added.");
      } catch {
        setTitle(submittedTitle);
        setFeedback("The task could not be created.");
      }
    });
  };

  const statusMessage = isPending ? "Adding task…" : feedback;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex min-w-0 items-center gap-2 rounded-[16px] border border-[#DCE4DF] bg-white p-1.5 transition-[border-color,box-shadow] focus-within:border-[#AFC4B7] focus-within:ring-2 focus-within:ring-[#7FAAE0]/35 md:shadow-[0_7px_22px_rgba(31,35,40,0.05)] md:focus-within:shadow-[0_9px_26px_rgba(79,128,106,0.08)]">
        <label htmlFor="quick-task" className="sr-only">
          Task title
        </label>
        <Input
          id="quick-task"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a task, reminder, or note..."
          required
          maxLength={200}
          disabled={isPending}
          className="h-10 min-w-0 border-0 bg-transparent px-3 shadow-none focus-visible:ring-0"
        />
        <Button
          type="submit"
          size="default"
          disabled={isPending || !title.trim()}
          className="h-10 shrink-0 px-3 sm:px-4"
        >
          <Plus aria-hidden="true" />
          <span className="hidden min-[380px]:inline">{isPending ? "Adding…" : "Add"}</span>
        </Button>
      </div>
      {statusMessage ? (
        <p
          role="status"
          aria-live="polite"
          className={`mt-3 text-sm ${isPending ? "text-[#66716C]" : feedback === "Task added." ? "text-[#377458]" : "text-red-700"}`}
        >
          {statusMessage}
        </p>
      ) : compact ? null : (
        <p className="mt-2.5 text-xs text-[#7B8580]">
          Quick Add creates a todo. Add dates and reminders from Tasks.
        </p>
      )}
    </form>
  );
}
