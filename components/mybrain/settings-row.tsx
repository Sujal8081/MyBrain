import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface SettingsRowProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  meta?: string;
  tone?: "green" | "blue" | "neutral";
}

const toneClasses = {
  green: "bg-[#EAF3EE] text-[#4F806A]",
  blue: "bg-[#EAF2F8] text-[#557FAE]",
  neutral: "bg-[#F0F2F1] text-[#66716C]",
};

export function SettingsRow({
  icon: Icon,
  title,
  description,
  href,
  meta,
  tone = "neutral",
}: SettingsRowProps) {
  const content = (
    <>
      <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px]", toneClasses[tone])}>
        <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.9} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-[#1F2328]">{title}</span>
        <span className="mt-0.5 block text-[13px] leading-5 text-[#66716C]">{description}</span>
      </span>
      {meta ? <span className="shrink-0 text-xs font-medium text-[#89938E]">{meta}</span> : null}
      {href ? <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-[#AAB2AE]" /> : null}
    </>
  );

  const className = "flex min-h-[76px] items-center gap-3.5 px-4 py-3.5 text-left transition-colors duration-200 motion-reduce:transition-none";

  return href ? (
    <Link
      href={href}
      className={cn(className, "hover:bg-[#FAFBFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#7FAAE0]")}
    >
      {content}
    </Link>
  ) : (
    <div className={className}>{content}</div>
  );
}
