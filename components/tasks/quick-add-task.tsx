"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { createTaskAction } from "@/app/protected/tasks/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function QuickAddTask() {
  const [title, setTitle] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    if (!title.trim()) {
      setFeedback("Task title is required.");
      return;
    }

    startTransition(async () => {
      const result = await createTaskAction({ title, status: "todo" });

      if (!result.success) {
        setFeedback(result.error);
        return;
      }

      setTitle("");
      setFeedback("Task added.");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex min-w-0 items-center gap-2 rounded-[16px] border border-[#E4E8E5] bg-[#F7F8F6] p-1.5 focus-within:border-[#B9C9C0] focus-within:ring-2 focus-within:ring-[#7FAAE0]/40">
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
      {feedback ? (
        <p
          role="status"
          aria-live="polite"
          className={`mt-3 text-sm ${feedback === "Task added." ? "text-[#377458]" : "text-red-700"}`}
        >
          {feedback}
        </p>
      ) : (
        <p className="mt-2.5 text-xs text-[#7B8580]">
          Quick Add creates a todo. Add dates and reminders from Tasks.
        </p>
      )}
    </form>
  );
}
