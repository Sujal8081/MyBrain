import Link from "next/link";
import { Suspense } from "react";
import {
  BarChart3,
  Bell,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  ListTodo,
  Target,
} from "lucide-react";

import { DashboardCard } from "@/components/mybrain/dashboard-card";
import { ReminderCard } from "@/components/mybrain/reminder-card";
import { SectionHeader } from "@/components/mybrain/section-header";
import { StatusBadge } from "@/components/mybrain/status-badge";
import { QuickAddTask } from "@/components/tasks/quick-add-task";

import { createClient } from "@/lib/supabase/server";
import { formatTaskDate, sortTasks, type Reminder, type Task } from "@/lib/tasks/task-utils";

interface ReminderWithTitle extends Reminder {
  taskTitle: string;
}

const weekdayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "narrow" });
const weekdayLongFormatter = new Intl.DateTimeFormat("en-US", { weekday: "long" });

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
  const openTodayCount = todayTasks.filter((task) => task.status !== "done").length;
  const completedTodayCount = todayTasks.filter((task) => task.status === "done").length;
  const todaySummary = tasksResult.error ? "—" : String(openTodayCount);
  const completedSummary = tasksResult.error ? "—" : String(completedTodayCount);
  const upcomingSummary = remindersResult.error ? "—" : String(upcomingReminders.length);
  const reminderActivity = Array.from({ length: 7 }, (_, index) => {
    const dayStart = new Date(todayStart);
    dayStart.setDate(todayStart.getDate() + index);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);
    const isLastBucket = index === 6;

    return {
      label: `${weekdayFormatter.format(dayStart)}${isLastBucket ? "+" : ""}`,
      accessibleLabel: `${weekdayLongFormatter.format(dayStart)}${isLastBucket ? " and later" : ""}`,
      count: reminderRows.filter((reminder) => {
        const remindAt = new Date(reminder.remind_at);
        return remindAt >= dayStart && (isLastBucket ? remindAt <= reminderEnd : remindAt < dayEnd);
      }).length,
    };
  });
  const maxReminderActivity = Math.max(1, ...reminderActivity.map((day) => day.count));

  return (
    <div className="space-y-5 sm:space-y-6">
      {loadError ? (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Some dashboard information could not be loaded: {loadError.message}
        </div>
      ) : null}

      <section aria-label="Dashboard summary" className="grid grid-cols-3 gap-2 sm:gap-3">
        <article className="relative flex min-h-[98px] flex-col items-center justify-center overflow-hidden rounded-[18px] border border-[#DDE8E1] bg-white px-2 py-3 text-center sm:grid sm:grid-cols-[36px_minmax(0,1fr)] sm:gap-3 sm:px-4 sm:text-left">
          <span aria-hidden="true" className="absolute inset-y-3 left-0 w-0.5 rounded-r-full bg-[#8FAE9A]" />
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF3EE] text-[#4F806A] sm:h-9 sm:w-9">
            <ListTodo aria-hidden="true" className="h-4 w-4" strokeWidth={1.9} />
          </span>
          <div className="mt-1.5 min-w-0 sm:mt-0">
            <p className="text-lg font-semibold leading-none tracking-[-0.04em] text-[#1F2328] sm:text-xl">{todaySummary}</p>
            <p className="mt-1 text-[10px] font-semibold text-[#4F806A] sm:text-[11px]">Today</p>
            <p className="mt-0.5 hidden truncate text-[10px] text-[#7A8580] sm:block">{tasksResult.error ? "unavailable" : "open tasks"}</p>
          </div>
        </article>
        <article className="relative flex min-h-[98px] flex-col items-center justify-center overflow-hidden rounded-[18px] border border-[#DDE6EB] bg-[#F8FBFD] px-2 py-3 text-center sm:grid sm:grid-cols-[36px_minmax(0,1fr)] sm:gap-3 sm:px-4 sm:text-left">
          <span aria-hidden="true" className="absolute inset-y-3 left-0 w-0.5 rounded-r-full bg-[#7FAAE0]" />
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#557FAE] sm:h-9 sm:w-9">
            <Bell aria-hidden="true" className="h-4 w-4" strokeWidth={1.9} />
          </span>
          <div className="mt-1.5 min-w-0 sm:mt-0">
            <p className="text-lg font-semibold leading-none tracking-[-0.04em] text-[#1F2328] sm:text-xl">{upcomingSummary}</p>
            <p className="mt-1 text-[10px] font-semibold text-[#557FAE] sm:text-[11px]">Upcoming</p>
            <p className="mt-0.5 hidden truncate text-[10px] text-[#7A8580] sm:block">{remindersResult.error ? "unavailable" : "next 7 days"}</p>
          </div>
        </article>
        <article className="relative flex min-h-[98px] flex-col items-center justify-center overflow-hidden rounded-[18px] border border-[#D8E6DD] bg-[#F5F9F7] px-2 py-3 text-center sm:grid sm:grid-cols-[36px_minmax(0,1fr)] sm:gap-3 sm:px-4 sm:text-left">
          <span aria-hidden="true" className="absolute inset-y-3 left-0 w-0.5 rounded-r-full bg-[#4F806A]" />
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E1EEE7] text-[#4F806A] sm:h-9 sm:w-9">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.9} />
          </span>
          <div className="mt-1.5 min-w-0 sm:mt-0">
            <p className="text-lg font-semibold leading-none tracking-[-0.04em] text-[#1F2328] sm:text-xl">{completedSummary}</p>
            <p className="mt-1 text-[10px] font-semibold text-[#4F806A] sm:text-[11px]">Completed</p>
            <p className="mt-0.5 hidden truncate text-[10px] text-[#7A8580] sm:block">{tasksResult.error ? "unavailable" : "today"}</p>
          </div>
        </article>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.8fr)] lg:gap-6">
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
          {tasksResult.error ? (
            <div className="flex min-h-[92px] items-center gap-3.5 rounded-[18px] border border-[#E4E8E5] bg-white px-4 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#F0F2F1] text-[#7A8580]">
                <ListTodo aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <div>
                <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#1F2328]">Today is unavailable</h2>
                <p className="mt-0.5 text-sm text-[#66716C]">Tasks could not be loaded right now.</p>
              </div>
            </div>
          ) : todayTasks.length === 0 ? (
            <div className="flex min-h-[92px] items-center gap-3.5 rounded-[18px] border border-[#DDE8E1] bg-[#F7FAF8] px-4 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#EAF3EE] text-[#4F806A]">
                <CheckCircle2 aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <div>
                <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#1F2328]">Nothing planned for today</h2>
                <p className="mt-0.5 text-sm text-[#66716C]">Your day is clear.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayTasks.map((task) => (
                <Link
                  key={task.id}
                  href="/protected/tasks"
                  className="surface-card group relative flex min-h-[72px] items-center gap-3 overflow-hidden px-3.5 py-3 transition-[border-color,box-shadow,transform] duration-200 hover:border-[#C9D5CE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FAAE0] focus-visible:ring-offset-2 min-[380px]:px-4 md:hover:-translate-y-px md:hover:shadow-[0_10px_28px_rgba(31,35,40,0.05)] motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <span aria-hidden="true" className={`absolute inset-y-3 left-0 w-[3px] rounded-r-full ${task.status === "in_progress" ? "bg-[#7FAAE0]" : "bg-[#8FAE9A]"}`} />
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${task.status === "done" ? "border-[#BBD1C4] bg-[#EAF3EE] text-[#4F806A]" : "border-[#D8DFDB] bg-white text-[#8B9690]"}`}>
                    <CheckCircle2 aria-hidden="true" className="h-[19px] w-[19px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-[15px] font-semibold text-[#1F2328] ${task.status === "done" ? "text-[#78827D] line-through" : ""}`}>{task.title}</span>
                    <span className="mt-1 flex min-w-0 items-center gap-1.5 text-[12px] text-[#66716C] sm:text-[13px]">
                      {task.description ? <span className="max-w-[55%] truncate">{task.description}</span> : null}
                      {task.description ? <span aria-hidden="true">·</span> : null}
                      <CalendarClock aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#4F806A]" />
                      <span className="truncate">{task.due_date ? formatTaskDate(task.due_date) : "Today"}</span>
                    </span>
                  </span>
                  <StatusBadge status={task.status} className="shrink-0 px-2 py-0.5 text-[11px]" />
                  <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-[#AAB2AE]" />
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside className="relative min-h-[132px] overflow-hidden rounded-[18px] border border-[#DDE8E1] bg-[#F7FAF8] px-4 py-4" aria-labelledby="focus-heading">
          <span aria-hidden="true" className="absolute inset-y-4 left-0 w-[3px] rounded-r-full bg-[#8FAE9A]" />
          <span aria-hidden="true" className="absolute -bottom-5 -right-4 h-20 w-24 rounded-tl-[42px] bg-[#EAF2F8]" />
          <span aria-hidden="true" className="absolute -bottom-7 right-8 h-16 w-20 rounded-t-[38px] bg-[#DDECE4]" />
          <div className="relative">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF3EE] text-[#4F806A]">
                <Target aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.9} />
              </span>
              <div>
                <h2 id="focus-heading" className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4F806A]">Today&apos;s focus</h2>
                <p className="mt-1 text-sm font-medium leading-5 text-[#34423B]">Keep the next useful action visible.</p>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:gap-6">
        <section aria-labelledby="upcoming-heading">
          <SectionHeader id="upcoming-heading" title="Upcoming" />
          {remindersResult.error ? (
            <div className="flex min-h-[92px] items-center gap-3.5 rounded-[18px] border border-[#E4E8E5] bg-white px-4 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#F0F2F1] text-[#7A8580]">
                <Bell aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <div>
                <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#1F2328]">Upcoming is unavailable</h2>
                <p className="mt-0.5 text-sm leading-5 text-[#66716C]">Reminders could not be loaded right now.</p>
              </div>
            </div>
          ) : upcomingReminders.length === 0 ? (
            <div className="flex min-h-[92px] items-center gap-3.5 rounded-[18px] border border-[#DDE6EB] bg-[#F7FAFC] px-4 py-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#EAF2F8] text-[#557FAE]">
                <Bell aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <div>
                <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-[#1F2328]">No upcoming reminders</h2>
                <p className="mt-0.5 text-sm leading-5 text-[#66716C]">The next seven days are clear.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {upcomingReminders.map((reminder) => (
                <ReminderCard key={reminder.id} taskTitle={reminder.taskTitle} remindAt={reminder.remind_at} href="/protected/reminders" compact />
              ))}
            </div>
          )}
        </section>

        <aside className="rounded-[18px] border border-[#E0E7E3] bg-white p-4" aria-labelledby="activity-heading">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF2F8] text-[#557FAE]">
              <BarChart3 aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </span>
            <div>
              <h2 id="activity-heading" className="text-[15px] font-semibold tracking-[-0.01em] text-[#1F2328]">This week</h2>
              <p className="mt-0.5 text-xs text-[#7A8580]">Reminder activity for the next seven days.</p>
            </div>
          </div>
          {remindersResult.error ? (
            <p className="mt-5 text-sm text-[#66716C]">Activity is unavailable.</p>
          ) : (
            <>
              <div
                role="img"
                aria-label={reminderActivity.map((day) => `${day.accessibleLabel}: ${day.count}`).join(", ")}
                className="mt-4 flex h-16 items-end gap-2"
              >
                {reminderActivity.map((day, index) => (
                  <div key={`${day.label}-${index}`} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
                    <span
                      aria-hidden="true"
                      className={`w-full max-w-5 rounded-t-md ${day.count > 0 ? "bg-[#8FAE9A]" : "bg-[#E5EBE7]"}`}
                      style={{ height: `${day.count > 0 ? 12 + Math.round((day.count / maxReminderActivity) * 30) : 4}px` }}
                    />
                    <span className="text-[10px] font-medium text-[#7A8580]">{day.label}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 border-t border-[#EEF1EF] pt-3 text-xs text-[#66716C]">
                <span className="font-semibold text-[#1F2328]">{upcomingReminders.length}</span> reminders ahead
              </p>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-[98px] rounded-[18px] border border-[#E4E8E5] bg-white" />
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.8fr)] lg:gap-6">
        <div>
          <div className="mb-3 h-3 w-16 rounded bg-[#E4E8E5]" />
          <div className="h-[92px] rounded-[18px] bg-white" />
        </div>
        <div className="h-[132px] rounded-[18px] bg-white" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)] lg:gap-6">
        <div>
          <div className="mb-3 h-3 w-20 rounded bg-[#E4E8E5]" />
          <div className="h-[92px] rounded-[18px] bg-white" />
        </div>
        <div className="h-[174px] rounded-[18px] bg-white" />
      </div>
    </div>
  );
}

export default function ProtectedPage() {
  return (
    <div className="mx-auto max-w-[980px]">
      <header className="relative mb-5 px-0.5 pt-0.5">
        <div aria-hidden="true" className="absolute right-0 top-0 hidden h-20 w-28 rounded-[20px] border border-[#E0E9E4] bg-[#F2F7F4] md:block" />
        <div aria-hidden="true" className="absolute right-8 top-4 hidden h-9 w-9 rounded-[13px] bg-[#EAF3EE] md:block" />
        <div aria-hidden="true" className="absolute right-20 top-12 hidden h-5 w-5 rounded-full bg-[#EAF2F8] md:block" />
        <div className="relative md:pr-36">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#4F806A]">Good afternoon</p>
          <h1 className="mt-1.5 max-w-2xl text-[26px] font-semibold leading-[1.16] tracking-[-0.04em] text-[#1F2328] sm:text-[30px]">
            Here&apos;s what needs your attention.
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-5 text-[#66716C]">
            A calm overview of your tasks and reminders for the days ahead.
          </p>
          <section aria-labelledby="quick-add-heading" className="mt-4 max-w-3xl">
            <h2 id="quick-add-heading" className="sr-only">Quick add</h2>
            <QuickAddTask compact />
          </section>
        </div>
      </header>
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
