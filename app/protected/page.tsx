import Link from "next/link";
import { Suspense } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Plus,
} from "lucide-react";

import { DashboardCard } from "@/components/mybrain/dashboard-card";
import { EmptyState } from "@/components/mybrain/empty-state";
import { ReminderCard } from "@/components/mybrain/reminder-card";
import { SectionHeader } from "@/components/mybrain/section-header";
import { StatusBadge } from "@/components/mybrain/status-badge";
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
    <div className="space-y-8">
      {loadError ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Some dashboard information could not be loaded: {loadError.message}
        </div>
      ) : null}

      <section aria-labelledby="today-heading">
        <SectionHeader
          id="today-heading"
          title="Today"
          action={
            todayTasks.length > 0 ? (
              <Link href="/protected/tasks" className="rounded-lg px-1 py-1 text-xs font-semibold text-[#4F806A] hover:text-[#365F4B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FAAE0]">
                View all
              </Link>
            ) : undefined
          }
        />
        {todayTasks.length === 0 ? (
          <DashboardCard>
            <EmptyState
              icon={CheckCircle2}
              title="Nothing planned for today"
              description="Your day is clear. Add a task when something needs your attention."
              tone="green"
              action={
                <Button asChild size="lg">
                  <Link href="/protected/tasks?new=1">
                    <Plus aria-hidden="true" />
                    Add task
                  </Link>
                </Button>
              }
            />
          </DashboardCard>
        ) : (
          <div className="space-y-2.5">
            {todayTasks.map((task) => (
              <Link
                key={task.id}
                href="/protected/tasks"
                className="surface-card flex min-h-[76px] items-center gap-3.5 px-4 py-3.5 transition-[border-color,transform] duration-200 hover:-translate-y-px hover:border-[#C9D5CE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FAAE0] focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${task.status === "done" ? "border-[#BBD1C4] bg-[#EAF3EE] text-[#4F806A]" : "border-[#D8DFDB] bg-white text-[#8B9690]"}`}>
                  <CheckCircle2 aria-hidden="true" className="h-[19px] w-[19px]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`block truncate text-[15px] font-semibold text-[#1F2328] ${task.status === "done" ? "text-[#78827D] line-through" : ""}`}>
                    {task.title}
                  </span>
                  <span className="mt-1 flex min-w-0 items-center gap-2 text-[13px] text-[#66716C]">
                    {task.description ? <span className="max-w-[55%] truncate">{task.description}</span> : null}
                    {task.description ? <span aria-hidden="true">·</span> : null}
                    <span className="truncate">{task.due_date ? formatTaskDate(task.due_date) : "Due today"}</span>
                  </span>
                </span>
                <StatusBadge status={task.status} className="hidden sm:inline-flex" />
                <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-[#AAB2AE]" />
              </Link>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="upcoming-heading">
        <SectionHeader id="upcoming-heading" title="Upcoming" />
        {upcomingReminders.length === 0 ? (
          <DashboardCard>
            <EmptyState
              icon={Bell}
              title="No upcoming reminders"
              description="Reminders scheduled during the next seven days will appear here."
            />
          </DashboardCard>
        ) : (
          <div className="space-y-2.5">
            {upcomingReminders.map((reminder) => (
              <ReminderCard
                key={reminder.id}
                taskTitle={reminder.taskTitle}
                remindAt={reminder.remind_at}
                href="/protected/reminders"
                compact
              />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="quick-add-heading">
        <SectionHeader id="quick-add-heading" title="Quick add" />
        <DashboardCard className="p-4 sm:p-5">
          <QuickAddTask />
        </DashboardCard>
      </section>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {[1, 2, 3].map((item) => (
        <div key={item}>
          <div className="mb-3 h-3 w-24 rounded bg-[#E4E8E5]" />
          <div className="h-40 rounded-2xl bg-white" />
        </div>
      ))}
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <div>
      <header className="mb-8">
        <p className="text-sm font-semibold text-[#4F806A]">Good afternoon</p>
        <h1 className="mt-2 max-w-2xl text-[28px] font-semibold leading-[1.15] tracking-[-0.035em] text-[#1F2328] sm:text-[34px]">
          Here&apos;s what needs your attention.
        </h1>
        <p className="mt-2.5 max-w-xl text-[15px] leading-6 text-[#66716C]">
          A calm overview of your tasks and reminders for the days ahead.
        </p>
      </header>
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
