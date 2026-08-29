import { CheckCircle2, Plus, Sparkles } from "lucide-react";

import { DashboardCard } from "@/components/mybrain/dashboard-card";
import { EmptyState } from "@/components/mybrain/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProtectedPage() {
  return (
    <div>
      <header className="mb-9">
        <p className="text-sm font-medium text-[#4d7d68]">Good afternoon</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.035em] text-[#26312d] sm:text-4xl">
          Here&apos;s what needs your attention.
        </h1>
        <p className="mt-3 max-w-xl text-base leading-7 text-[#66726d]">
          A calm overview of your day. Your tasks, reminders, and notes will
          come together here.
        </p>
      </header>

      <div className="space-y-9">
        <section aria-labelledby="today-heading">
          <div className="mb-3 flex items-center justify-between">
            <h2
              id="today-heading"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-[#59655f]"
            >
              Today
            </h2>
          </div>
          <DashboardCard>
            <EmptyState
              icon={CheckCircle2}
              title="Nothing planned for today"
              description="Your day is clear. Add a task when something needs your attention."
              tone="green"
              action={
                <Button type="button" size="lg" className="min-h-12 rounded-xl px-5">
                  <Plus aria-hidden="true" />
                  Add task
                </Button>
              }
            />
          </DashboardCard>
        </section>

        <section aria-labelledby="upcoming-heading">
          <h2
            id="upcoming-heading"
            className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#59655f]"
          >
            Upcoming
          </h2>
          <DashboardCard>
            <EmptyState
              icon={Sparkles}
              title="No upcoming reminders"
              description="Reminders you create later will appear here so nothing slips by."
            />
          </DashboardCard>
        </section>

        <section aria-labelledby="quick-add-heading">
          <h2
            id="quick-add-heading"
            className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#59655f]"
          >
            Quick add
          </h2>
          <DashboardCard className="p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="quick-task" className="sr-only">
                Task title
              </label>
              <Input
                id="quick-task"
                placeholder="What do you need to do?"
                className="h-12 rounded-xl bg-[#fafbf9] px-4"
              />
              <Button
                type="button"
                size="lg"
                className="min-h-12 shrink-0 rounded-xl px-6"
              >
                Add
              </Button>
            </div>
            <p className="mt-3 text-xs text-[#7b8580]">
              Quick add is a visual preview for now. Tasks are not saved yet.
            </p>
          </DashboardCard>
        </section>
      </div>
    </div>
  );
}
