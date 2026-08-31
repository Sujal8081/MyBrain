import { Suspense } from "react";
import { Bell } from "lucide-react";

import { DashboardCard } from "@/components/mybrain/dashboard-card";
import { EmptyState } from "@/components/mybrain/empty-state";
import { PageHeader } from "@/components/mybrain/page-header";
import { ReminderCard } from "@/components/mybrain/reminder-card";
import { createClient } from "@/lib/supabase/server";
import type { Reminder } from "@/lib/tasks/task-utils";

interface ReminderWithTaskTitle extends Reminder {
  taskTitle: string;
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
          compact
        />
      </DashboardCard>
    );
  }

  const now = Date.now();

  return (
    <div className="space-y-2.5">
      {reminders.map((reminder) => (
        <ReminderCard
          key={reminder.id}
          taskTitle={reminder.taskTitle}
          remindAt={reminder.remind_at}
          overdue={new Date(reminder.remind_at).getTime() < now}
        />
      ))}
    </div>
  );
}

function RemindersLoading() {
  return (
    <div className="animate-pulse space-y-2.5">
      {[1, 2, 3].map((item) => (
        <div key={item} className="flex gap-4 rounded-2xl border border-[#E4E8E5] bg-white px-4 py-4">
          <div className="h-11 w-11 rounded-xl bg-[#E4E8E5]" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-1/2 rounded bg-[#E4E8E5]" />
            <div className="h-3 w-1/3 rounded bg-[#F0F2F1]" />
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
