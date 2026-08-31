export const taskStatuses = ["todo", "in_progress", "done"] as const;

export type TaskStatus = (typeof taskStatuses)[number];
export type TaskFilter = "all" | TaskStatus;
export type TaskMutationKind = "create" | "update" | "status" | "delete";
export type OptimisticTaskAction =
  | { type: "status"; taskId: string; status: TaskStatus }
  | { type: "delete"; taskId: string };

interface TaskRevalidationOptions {
  dueDate?: string | null;
  reminderAt?: string | null;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  task_id: string;
  remind_at: string;
  sent: boolean;
  created_at: string;
  tasks?: { title: string } | { title: string }[] | null;
}

export function isTaskStatus(value: string): value is TaskStatus {
  return taskStatuses.includes(value as TaskStatus);
}

export function validateTaskTitle(
  value: string,
): { success: true; title: string } | { success: false; error: string } {
  const title = value.trim();

  if (!title) {
    return { success: false, error: "Task title is required." };
  }

  return { success: true, title };
}

export function filterTasks(tasks: Task[], filter: TaskFilter) {
  if (filter === "all") return tasks;
  return tasks.filter((task) => task.status === filter);
}

export function getTaskRevalidationPaths(
  kind: TaskMutationKind,
  options: TaskRevalidationOptions = {},
) {
  const paths = ["/protected/tasks"];

  if (kind === "create") {
    if (options.dueDate || options.reminderAt) paths.push("/protected");
    if (options.reminderAt) paths.push("/protected/reminders");
    return paths;
  }

  paths.push("/protected");
  if (kind === "update" || kind === "delete") {
    paths.push("/protected/reminders");
  }

  return paths;
}

export function applyOptimisticTaskAction(
  tasks: Task[],
  action: OptimisticTaskAction,
) {
  if (action.type === "delete") {
    return tasks.filter((task) => task.id !== action.taskId);
  }

  return sortTasks(
    tasks.map((task) =>
      task.id === action.taskId ? { ...task, status: action.status } : task,
    ),
  );
}

export function sortTasks(tasks: Task[]) {
  return [...tasks].sort((a, b) => {
    const aComplete = a.status === "done" ? 1 : 0;
    const bComplete = b.status === "done" ? 1 : 0;

    if (aComplete !== bComplete) return aComplete - bComplete;

    if (a.due_date && b.due_date) {
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    }

    if (a.due_date) return -1;
    if (b.due_date) return 1;

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export function toIsoDateTime(date: string, time: string) {
  if (!date) return null;

  const value = new Date(`${date}T${time || "23:59"}:00`);
  if (Number.isNaN(value.getTime())) return null;

  return value.toISOString();
}

export function formatTaskDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getReminderTaskTitle(reminder: Reminder) {
  if (Array.isArray(reminder.tasks)) {
    return reminder.tasks[0]?.title || "Task reminder";
  }

  return reminder.tasks?.title || "Task reminder";
}
