import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface NotesNavigationCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  tone: "green" | "blue";
}

export function NotesNavigationCard({
  icon: Icon,
  title,
  description,
  href,
  tone,
}: NotesNavigationCardProps) {
  return (
    <Link
      href={href}
      className="group flex min-h-40 flex-col rounded-[18px] border border-[#E4E8E5] bg-white p-5 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-px hover:border-[#C8D4CD] hover:shadow-[0_8px_24px_rgba(31,35,40,0.035)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FAAE0] focus-visible:ring-offset-2 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-[14px]",
            tone === "green" ? "bg-[#EAF3EE] text-[#4F806A]" : "bg-[#EAF2F8] text-[#557FAE]",
          )}
        >
          <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-[#AAB2AE] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
      </div>
      <h2 className="mt-5 text-[16px] font-semibold tracking-[-0.01em] text-[#1F2328]">{title}</h2>
      <p className="mt-1.5 text-[14px] leading-6 text-[#66716C]">{description}</p>
    </Link>
  );
}
