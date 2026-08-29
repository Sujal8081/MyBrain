import Link from "next/link";
import { Bell, ChevronRight, LogOut, UserRound } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { PageHeader } from "@/components/mybrain/page-header";

const moreItems = [
  {
    title: "Reminders",
    description: "Review time-sensitive items and future alerts.",
    href: "/protected/reminders",
    icon: Bell,
  },
  {
    title: "Account",
    description: "View your account area and profile placeholder.",
    href: "/protected/account",
    icon: UserRound,
  },
];

export default function MorePage() {
  return (
    <div>
      <PageHeader
        title="More"
        description="Account controls and a few useful places that do not need to crowd your day."
      />
      <div className="overflow-hidden rounded-2xl border border-[#dde3df] bg-white shadow-[0_12px_30px_rgba(39,55,48,0.04)]">
        {moreItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-20 items-center gap-4 border-b border-[#e7ebe8] px-5 py-4 transition-colors last:border-0 hover:bg-[#f8faf8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#4f86c6]"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#edf5fb] text-[#356f9f]">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-medium text-[#2c3733]">{item.title}</span>
                <span className="mt-0.5 block text-sm text-[#6a756f]">
                  {item.description}
                </span>
              </span>
              <ChevronRight aria-hidden="true" className="h-5 w-5 text-[#9aa39e]" />
            </Link>
          );
        })}
        <div className="flex min-h-20 items-center gap-4 px-5 py-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f8eeee] text-[#a44c4c]">
            <LogOut aria-hidden="true" className="h-5 w-5" />
          </span>
          <LogoutButton
            variant="ghost"
            className="h-auto flex-1 justify-start p-0 text-base font-medium text-[#8f4545] hover:bg-transparent hover:text-[#713434]"
          />
        </div>
      </div>
    </div>
  );
}
