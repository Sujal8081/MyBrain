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
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="quick-task" className="sr-only">
          Task title
        </label>
        <Input
          id="quick-task"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="What do you need to do?"
          required
          maxLength={200}
          disabled={isPending}
          className="h-12 rounded-xl bg-[#fafbf9] px-4"
        />
        <Button
          type="submit"
          size="lg"
          disabled={isPending || !title.trim()}
          className="min-h-12 shrink-0 rounded-xl px-6"
        >
          <Plus aria-hidden="true" />
          {isPending ? "Adding…" : "Add"}
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
        <p className="mt-3 text-xs text-[#7b8580]">
          Add a simple todo now. You can add details from Tasks later.
        </p>
      )}
    </form>
  );
}
