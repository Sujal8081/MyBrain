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
          "flex shrink-0 items-center justify-center border border-white/70 bg-white/75 text-[#4F806A] md:shadow-[0_4px_14px_rgba(79,128,106,0.1)]",
          compact ? "h-9 w-9 rounded-xl" : "h-11 w-11 rounded-[15px]",
        )}
      >
        <Brain aria-hidden="true" className={compact ? "h-5 w-5" : "h-[22px] w-[22px]"} strokeWidth={2} />
      </span>
      <span>
        <span className={cn("block font-semibold tracking-[-0.035em] text-[#1F2328]", compact ? "text-[17px]" : "text-[21px]")}>
          MyBrain
        </span>
        {!compact ? (
          <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5F806F]">
            Personal workspace
          </span>
        ) : null}
      </span>
    </div>
  );
}
