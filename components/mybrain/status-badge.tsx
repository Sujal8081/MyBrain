import type { TaskStatus } from "@/lib/tasks/task-utils";
import { cn } from "@/lib/utils";

const statusLabels: Record<TaskStatus, string> = {
  todo: "Todo",
  in_progress: "In Progress",
  done: "Done",
};

const statusClasses: Record<TaskStatus, string> = {
  todo: "bg-[#F0F2F1] text-[#66716C]",
  in_progress: "bg-[#EAF2F8] text-[#456F9F]",
  done: "bg-[#EAF3EE] text-[#3F715A]",
};

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-[12px] font-semibold leading-4",
        statusClasses[status],
        className,
      )}
    >
      {statusLabels[status]}
    </span>
  );
}
