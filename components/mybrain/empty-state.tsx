import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  tone?: "blue" | "green";
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = "blue",
  compact = false,
}: EmptyStateProps) {
  const toneClasses =
    tone === "green"
      ? "bg-[#EAF3EE] text-[#4F806A]"
      : "bg-[#EAF2F8] text-[#557FAE]";

  return (
    <div
      className={cn(
        "flex flex-col items-center px-5 text-center",
        compact ? "min-h-[152px] justify-center py-6 sm:min-h-[164px]" : "py-8 sm:py-9",
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-[14px]",
          compact ? "mb-3 h-10 w-10" : "mb-4 h-11 w-11",
          toneClasses,
        )}
      >
        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[#1F2328]">
        {title}
      </h2>
      <p className={cn("max-w-sm text-sm text-[#66716C]", compact ? "mt-1 leading-5" : "mt-1.5 leading-6")}>
        {description}
      </p>
      {action ? <div className={compact ? "mt-4" : "mt-5"}>{action}</div> : null}
    </div>
  );
}
