import { Brain } from "lucide-react";

import { cn } from "@/lib/utils";

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
}

export function BrandMark({ compact = false, className }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center bg-[#EAF3EE] text-[#4F806A]",
          compact ? "h-9 w-9 rounded-xl" : "h-10 w-10 rounded-[14px]",
        )}
      >
        <Brain aria-hidden="true" className={compact ? "h-5 w-5" : "h-[21px] w-[21px]"} strokeWidth={1.9} />
      </span>
      <span className={cn("font-semibold tracking-[-0.025em] text-[#1F2328]", compact ? "text-[17px]" : "text-xl")}>
        MyBrain
      </span>
    </div>
  );
}
