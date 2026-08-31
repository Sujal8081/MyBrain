import Link from "next/link";
import { AlertCircle, Bell, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface ReminderCardProps {
  taskTitle: string;
  remindAt: string;
  overdue?: boolean;
  href?: string;
  compact?: boolean;
}

function reminderDate(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function reminderTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function ReminderCard({
  taskTitle,
  remindAt,
  overdue = false,
  href,
  compact = false,
}: ReminderCardProps) {
  const Icon = overdue ? AlertCircle : Bell;
  const content = (
    <>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-[13px]",
          compact ? "h-10 w-10" : "h-11 w-11",
          overdue ? "bg-[#FBECEC] text-[#A44747]" : "bg-[#EAF2F8] text-[#557FAE]",
        )}
      >
        <Icon aria-hidden="true" className="h-[19px] w-[19px]" strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-pretty text-[15px] font-semibold leading-5 text-[#1F2328]">
          {taskTitle}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[#66716C]">
          <span>{reminderDate(remindAt)}</span>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-[#B8C0BC]" />
          <span>{reminderTime(remindAt)}</span>
        </span>
      </span>
      <span
        className={cn(
          "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
          overdue ? "bg-[#FBECEC] text-[#9E4444]" : "bg-[#EAF3EE] text-[#3F715A]",
        )}
      >
        {overdue ? "Overdue" : "Upcoming"}
      </span>
      {href ? <ChevronRight aria-hidden="true" className="hidden h-4 w-4 shrink-0 text-[#AAB2AE] sm:block" /> : null}
    </>
  );

  const className = cn(
    "flex items-center gap-3.5 rounded-2xl border border-[#E4E8E5] bg-white px-4 transition-[border-color,background-color,transform] duration-200 motion-reduce:transition-none",
    compact ? "min-h-[72px] py-3" : "min-h-20 py-4",
    href && "hover:-translate-y-px hover:border-[#C9D5CE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FAAE0] focus-visible:ring-offset-2",
  );

  return href ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <article className={className}>{content}</article>
  );
}
