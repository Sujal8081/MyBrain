"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CalendarClock,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  ListChecks,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  deleteTaskAction,
  updateTaskStatusAction,
} from "@/app/protected/tasks/actions";
import { EmptyState } from "@/components/mybrain/empty-state";
import { PageHeader } from "@/components/mybrain/page-header";
import { StatusBadge } from "@/components/mybrain/status-badge";
import { TaskForm } from "@/components/tasks/task-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  filterTasks,
  formatTaskDate,
  sortTasks,
  type Task,
  type TaskFilter,
  type TaskStatus,
} from "@/lib/tasks/task-utils";

const filters: { label: string; value: TaskFilter }[] = [
  { label: "All", value: "all" },
  { label: "Todo", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

interface TaskManagerProps {
  initialTasks: Task[];
  initialError?: string | null;
}

export function TaskManager({ initialTasks, initialError }: TaskManagerProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tasks, setTasks] = useState(() => sortTasks(initialTasks));
  const [filter, setFilter] = useState<TaskFilter>("all");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showForm, setShowForm] = useState(searchParams.get("new") === "1");
  const [feedback, setFeedback] = useState<string | null>(initialError || null);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const visibleTasks = useMemo(
    () => filterTasks(sortTasks(tasks), filter),
    [filter, tasks],
  );

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
    if (searchParams.get("new")) router.replace("/protected/tasks", { scroll: false });
  };

  const handleSaved = (savedTask: Task, message: string) => {
    setTasks((current) => {
      const exists = current.some((task) => task.id === savedTask.id);
      return sortTasks(
        exists
          ? current.map((task) => (task.id === savedTask.id ? savedTask : task))
          : [savedTask, ...current],
      );
    });
    setFeedback(message);
    closeForm();
    router.refresh();
  };

  const handleStatusChange = (task: Task, status: TaskStatus) => {
    if (task.status === status) return;
    setFeedback(null);
    setPendingTaskId(task.id);

    startTransition(async () => {
      const result = await updateTaskStatusAction(task.id, status);
      setPendingTaskId(null);

      if (!result.success || !result.task) {
        setFeedback(result.success ? "The task could not be updated." : result.error);
        return;
      }

      setTasks((current) =>
        sortTasks(current.map((item) => (item.id === task.id ? result.task! : item))),
      );
      setFeedback(status === "done" ? "Task completed." : "Task status updated.");
      router.refresh();
    });
  };

  const handleDelete = (task: Task) => {
    const confirmed = window.confirm(
      `Delete “${task.title}”? This will also delete its linked reminders.`,
    );
    if (!confirmed) return;

    setFeedback(null);
    setPendingTaskId(task.id);
    startTransition(async () => {
      const result = await deleteTaskAction(task.id);
      setPendingTaskId(null);

      if (!result.success) {
        setFeedback(result.error);
        return;
      }

      setTasks((current) => current.filter((item) => item.id !== task.id));
      setFeedback("Task deleted.");
      router.refresh();
    });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Your day, made clear"
        title="Tasks"
        description="Keep the next important thing visible and move it forward calmly."
        action={
          <Button
            id="add-task"
            type="button"
            size="lg"
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            <Plus aria-hidden="true" />
            Add task
          </Button>
        }
      />

      <div className="mb-5 max-w-full overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max gap-2" role="tablist" aria-label="Filter tasks">
          {filters.map((item) => {
            const count =
              item.value === "all"
                ? tasks.length
                : tasks.filter((task) => task.status === item.value).length;
            const selected = filter === item.value;

            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setFilter(item.value)}
                className={cn(
                  "min-h-11 rounded-full border px-4 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FAAE0] motion-reduce:transition-none",
                  selected
                    ? "border-[#BCD0C3] bg-[#EAF3EE] font-semibold text-[#3F715A]"
                    : "border-[#E4E8E5] bg-white text-[#66716C] hover:bg-[#F2F4F2]",
                )}
              >
                {item.label} <span className="ml-1 text-xs opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {feedback ? (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "mb-5 rounded-xl border px-4 py-3 text-sm",
            feedback.toLowerCase().includes("could not") ||
              feedback.toLowerCase().includes("expired") ||
              feedback.toLowerCase().includes("error")
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-[#cfe0d6] bg-[#f1f8f4] text-[#34664e]",
          )}
        >
          {feedback}
        </div>
      ) : null}

      {visibleTasks.length === 0 ? (
        <div className="surface-card">
          <EmptyState
            icon={filter === "done" ? CheckCircle2 : ListChecks}
            title={tasks.length === 0 ? "No tasks yet" : `No ${filters.find((item) => item.value === filter)?.label.toLowerCase()} tasks`}
            description={
              tasks.length === 0
                ? "Create your first task and MyBrain will keep it close at hand."
                : "Try another filter or update a task's status."
            }
            tone="green"
            action={
              tasks.length === 0 ? (
                <Button
                  type="button"
                  size="lg"
                  onClick={() => setShowForm(true)}
                  className="min-h-12"
                >
                  <Plus aria-hidden="true" />
                  Add your first task
                </Button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="space-y-2.5" aria-busy={isPending}>
          {visibleTasks.map((task) => {
            const taskPending = pendingTaskId === task.id;
            const complete = task.status === "done";

            return (
              <article
                key={task.id}
                className={cn(
                  "surface-card p-4 transition-[border-color,opacity] duration-200 hover:border-[#CBD5D0] sm:p-5 motion-reduce:transition-none",
                  complete && "bg-[#FBFCFB]",
                  taskPending && "opacity-60",
                )}
              >
                <div className="flex gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(task, complete ? "todo" : "done")}
                    disabled={taskPending}
                    aria-label={complete ? `Mark ${task.title} as todo` : `Mark ${task.title} as done`}
                    className={cn(
                      "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FAAE0] motion-reduce:transition-none",
                      complete
                        ? "border-[#BBD1C4] bg-[#EAF3EE] text-[#4F806A]"
                        : "border-[#D2DAD6] bg-white text-[#8B9690] hover:border-[#8FAE9A] hover:text-[#4F806A]",
                    )}
                  >
                    {complete ? <Check aria-hidden="true" /> : <Circle aria-hidden="true" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2
                          className={cn(
                            "text-[15px] font-semibold leading-6 text-[#1F2328]",
                            complete && "text-[#78827D] line-through",
                          )}
                        >
                          {task.title}
                        </h2>
                        {task.description ? (
                          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[#66716C]">
                            {task.description}
                          </p>
                        ) : null}
                      </div>
                      <StatusBadge status={task.status} />
                    </div>

                    <div className="mt-3.5 flex flex-col gap-3 border-t border-[#EEF1EF] pt-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2 text-xs text-[#66716C]">
                        {task.due_date ? (
                          <>
                            <CalendarClock aria-hidden="true" className="h-4 w-4 text-[#4F806A]" />
                            Due {formatTaskDate(task.due_date)}
                          </>
                        ) : (
                          <>
                            <Clock3 aria-hidden="true" className="h-4 w-4" />
                            No due date
                          </>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={task.status}
                          onChange={(event) =>
                            handleStatusChange(task, event.target.value as TaskStatus)
                          }
                          disabled={taskPending}
                          aria-label={`Change status for ${task.title}`}
                          className="h-10 max-w-[8.5rem] rounded-xl border border-[#E4E8E5] bg-white px-3 text-xs font-medium text-[#1F2328] outline-none focus-visible:ring-2 focus-visible:ring-[#7FAAE0]"
                        >
                          <option value="todo">Todo</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditingTask(task);
                            setShowForm(true);
                          }}
                          disabled={taskPending}
                          aria-label={`Edit ${task.title}`}
                          className="h-10 w-10 text-[#66716C]"
                        >
                          <Pencil aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(task)}
                          disabled={taskPending}
                          aria-label={`Delete ${task.title}`}
                          className="h-10 w-10 text-[#A35656] hover:bg-[#FBECEC] hover:text-[#873F3F]"
                        >
                          <Trash2 aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {showForm ? (
        <TaskForm task={editingTask || undefined} onClose={closeForm} onSaved={handleSaved} />
      ) : null}
    </div>
  );
}
