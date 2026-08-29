import { Suspense } from "react";
import { AlertCircle, Bell, CalendarClock } from "lucide-react";

import { DashboardCard } from "@/components/mybrain/dashboard-card";
import { EmptyState } from "@/components/mybrain/empty-state";
import { PageHeader } from "@/components/mybrain/page-header";
import { createClient } from "@/lib/supabase/server";
import type { Reminder } from "@/lib/tasks/task-utils";

interface ReminderWithTaskTitle extends Reminder {
  taskTitle: string;
}

function formatReminderDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
  }).format(new Date(value));
}

function formatReminderTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    timeStyle: "short",
  }).format(new Date(value));
}

async function RemindersContent() {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;

  if (typeof userId !== "string") {
    return (
      <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Your session has expired. Please sign in again.
      </div>
    );
  }

  const { data, error } = await supabase
    .from("reminders")
    .select("id,user_id,task_id,remind_at,sent,created_at")
    .eq("user_id", userId)
    .order("remind_at", { ascending: true });

  if (error) {
    return (
      <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Reminders could not be loaded: {error.message}
      </div>
    );
  }

  const reminderRows = (data || []) as Reminder[];
  const taskIds = [...new Set(reminderRows.map((reminder) => reminder.task_id))];
  const taskTitles = new Map<string, string>();

  if (taskIds.length > 0) {
    const { data: tasks, error: tasksError } = await supabase
      .from("tasks")
      .select("id,title")
      .eq("user_id", userId)
      .in("id", taskIds);

    if (tasksError) {
      return (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Reminder task details could not be loaded: {tasksError.message}
        </div>
      );
    }

    tasks?.forEach((task) => taskTitles.set(task.id, task.title));
  }

  const reminders: ReminderWithTaskTitle[] = reminderRows.map((reminder) => ({
    ...reminder,
    taskTitle: taskTitles.get(reminder.task_id) || "Task reminder",
  }));

  if (reminders.length === 0) {
    return (
      <DashboardCard>
        <EmptyState
          icon={Bell}
          title="No reminders yet"
          description="Reminder scheduling and notifications will be added later."
        />
      </DashboardCard>
    );
  }

  const now = Date.now();

  return (
    <DashboardCard>
      <div className="divide-y divide-[#e8ece9]">
        {reminders.map((reminder) => {
          const overdue = new Date(reminder.remind_at).getTime() < now;
          const StateIcon = overdue ? AlertCircle : CalendarClock;

          return (
            <article key={reminder.id} className="flex gap-4 px-5 py-5 sm:px-6">
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  overdue
                    ? "bg-[#f9eeee] text-[#a14e4e]"
                    : "bg-[#edf5fb] text-[#356f9f]"
                }`}
              >
                <StateIcon aria-hidden="true" className="h-5 w-5" />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <h2 className="text-base font-semibold leading-6 text-[#2c3733]">
                    {reminder.taskTitle}
                  </h2>
                  <span
                    className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${
                      overdue
                        ? "bg-[#f9eeee] text-[#964646]"
                        : "bg-[#eaf4ee] text-[#377458]"
                    }`}
                  >
                    {overdue ? "Overdue" : "Upcoming"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#66726d]">
                  <span>{formatReminderDate(reminder.remind_at)}</span>
                  <span>{formatReminderTime(reminder.remind_at)}</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </DashboardCard>
  );
}

function RemindersLoading() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-[#dde3df] bg-white">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex gap-4 border-b border-[#e8ece9] px-5 py-5 last:border-0">
          <div className="h-11 w-11 rounded-xl bg-[#e4e9e5]" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/2 rounded bg-[#e4e9e5]" />
            <div className="h-3 w-1/3 rounded bg-[#edf0ee]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RemindersPage() {
  return (
    <div>
      <PageHeader
        title="Reminders"
        description="Keep time-sensitive commitments visible without adding noise."
      />
      <Suspense fallback={<RemindersLoading />}>
        <RemindersContent />
      </Suspense>
    </div>
  );
}
