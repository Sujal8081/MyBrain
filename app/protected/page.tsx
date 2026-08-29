import Link from "next/link";
import { Suspense } from "react";
import {
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Plus,
} from "lucide-react";

import { DashboardCard } from "@/components/mybrain/dashboard-card";
import { EmptyState } from "@/components/mybrain/empty-state";
import { QuickAddTask } from "@/components/tasks/quick-add-task";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { formatTaskDate, sortTasks, type Reminder, type Task } from "@/lib/tasks/task-utils";

interface ReminderWithTitle extends Reminder {
  taskTitle: string;
}

async function DashboardContent() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (typeof userId !== "string") {
    return (
      <DashboardCard className="p-5 text-sm text-red-700">
        Your session has expired. Please sign in again.
      </DashboardCard>
    );
  }

  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);
  const reminderEnd = new Date(now);
  reminderEnd.setDate(reminderEnd.getDate() + 7);

  const [tasksResult, remindersResult] = await Promise.all([
    supabase
      .from("tasks")
      .select("id,user_id,title,description,due_date,status,created_at,updated_at")
      .eq("user_id", userId)
      .gte("due_date", todayStart.toISOString())
      .lt("due_date", tomorrowStart.toISOString()),
    supabase
      .from("reminders")
      .select("id,user_id,task_id,remind_at,sent,created_at")
      .eq("user_id", userId)
      .eq("sent", false)
      .gte("remind_at", now.toISOString())
      .lte("remind_at", reminderEnd.toISOString())
      .order("remind_at", { ascending: true }),
  ]);

  const todayTasks = sortTasks((tasksResult.data || []) as Task[]);
  const reminderRows = (remindersResult.data || []) as Reminder[];
  const taskIds = [...new Set(reminderRows.map((reminder) => reminder.task_id))];
  const reminderTaskTitles = new Map<string, string>();

  if (taskIds.length > 0) {
    const { data: reminderTasks } = await supabase
      .from("tasks")
      .select("id,title")
      .eq("user_id", userId)
      .in("id", taskIds);

    reminderTasks?.forEach((task) => reminderTaskTitles.set(task.id, task.title));
  }

  const upcomingReminders: ReminderWithTitle[] = reminderRows.map((reminder) => ({
    ...reminder,
    taskTitle: reminderTaskTitles.get(reminder.task_id) || "Task reminder",
  }));
  const loadError = tasksResult.error || remindersResult.error;

  return (
    <div className="space-y-9">
      {loadError ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Some dashboard information could not be loaded: {loadError.message}
        </div>
      ) : null}

      <section aria-labelledby="today-heading">
        <div className="mb-3 flex items-center justify-between">
          <h2 id="today-heading" className="text-xs font-semibold uppercase tracking-[0.16em] text-[#59655f]">
            Today
          </h2>
          {todayTasks.length > 0 ? (
            <Link href="/protected/tasks" className="text-xs font-medium text-[#356f9f] hover:underline">
              View all
            </Link>
          ) : null}
        </div>
        <DashboardCard>
          {todayTasks.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="Nothing planned for today"
              description="Your day is clear. Add a task when something needs your attention."
              tone="green"
              action={
                <Button asChild size="lg" className="min-h-12 rounded-xl px-5">
                  <Link href="/protected/tasks?new=1">
                    <Plus aria-hidden="true" />
                    Add task
                  </Link>
                </Button>
              }
            />
          ) : (
            <div className="divide-y divide-[#e8ece9]">
              {todayTasks.map((task) => (
                <Link
                  key={task.id}
                  href="/protected/tasks"
                  className="flex min-h-20 items-center gap-4 px-5 py-4 transition-colors hover:bg-[#fafcfb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4f86c6] sm:px-6"
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${task.status === "done" ? "bg-[#eaf4ee] text-[#377458]" : "bg-[#edf5fb] text-[#356f9f]"}`}>
                    <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-sm font-semibold ${task.status === "done" ? "text-[#74807a] line-through" : "text-[#2c3733]"}`}>
                      {task.title}
                    </span>
                    <span className="mt-1 block text-xs text-[#6a756f]">
                      {task.due_date ? formatTaskDate(task.due_date) : "Due today"}
                    </span>
                  </span>
                  <ChevronRight aria-hidden="true" className="h-5 w-5 text-[#9aa39e]" />
                </Link>
              ))}
            </div>
          )}
        </DashboardCard>
      </section>

      <section aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading" className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#59655f]">
          Upcoming
        </h2>
        <DashboardCard>
          {upcomingReminders.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="No upcoming reminders"
              description="Reminders scheduled during the next seven days will appear here."
            />
          ) : (
            <div className="divide-y divide-[#e8ece9]">
              {upcomingReminders.map((reminder) => (
                <Link
                  key={reminder.id}
                  href="/protected/reminders"
                  className="flex min-h-20 items-center gap-4 px-5 py-4 transition-colors hover:bg-[#fafcfb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4f86c6] sm:px-6"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf5fb] text-[#356f9f]">
                    <CalendarClock aria-hidden="true" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[#2c3733]">
                      {reminder.taskTitle}
                    </span>
                    <span className="mt-1 block text-xs text-[#6a756f]">
                      {formatTaskDate(reminder.remind_at)}
                    </span>
                  </span>
                  <ChevronRight aria-hidden="true" className="h-5 w-5 text-[#9aa39e]" />
                </Link>
              ))}
            </div>
          )}
        </DashboardCard>
      </section>

      <section aria-labelledby="quick-add-heading">
        <h2 id="quick-add-heading" className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#59655f]">
          Quick add
        </h2>
        <DashboardCard className="p-5 sm:p-6">
          <QuickAddTask />
        </DashboardCard>
      </section>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-9 animate-pulse">
      {[1, 2, 3].map((item) => (
        <div key={item}>
          <div className="mb-3 h-3 w-24 rounded bg-[#e4e9e5]" />
          <div className="h-40 rounded-2xl bg-white" />
        </div>
      ))}
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <div>
      <header className="mb-9">
        <p className="text-sm font-medium text-[#4d7d68]">Good afternoon</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-[#26312d] sm:text-4xl">
          Here&apos;s what needs your attention.
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-[#66726d]">
          A calm overview of your tasks and reminders for the days ahead.
        </p>
      </header>
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
