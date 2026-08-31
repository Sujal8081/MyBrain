"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CheckCircle2,
  Home,
  Menu,
  MessageCircle,
  NotebookText,
} from "lucide-react";

import { getActiveNavigationSection } from "@/lib/navigation/route-state";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Home", href: "/protected", icon: Home, section: "home" },
  {
    label: "Tasks",
    href: "/protected/tasks",
    icon: CheckCircle2,
    section: "tasks",
  },
  {
    label: "Chat",
    href: "/protected/chat",
    icon: MessageCircle,
    section: "chat",
  },
  {
    label: "Notes",
    href: "/protected/notes",
    icon: NotebookText,
    section: "notes",
  },
  {
    label: "More",
    href: "/protected/more",
    icon: Menu,
    section: "more",
  },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const activeSection = getActiveNavigationSection(pathname);

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E4E8E5] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-6px_20px_rgba(31,35,40,0.045)] backdrop-blur md:hidden"
      >
        <ul className="mx-auto grid h-[68px] max-w-lg grid-cols-5 items-center">
          {navigationItems.map((item) => {
            const active = activeSection === item.section;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "mx-0.5 flex min-h-14 flex-col items-center justify-center gap-1 rounded-[14px] px-1 text-[11px] font-medium text-[#66716C] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FAAE0] focus-visible:ring-offset-1 motion-reduce:transition-none",
                    active && "bg-[#EAF3EE] text-[#3F715A]",
                  )}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav aria-label="Primary navigation" className="hidden md:block">
        <ul className="space-y-0.5">
          {navigationItems.map((item) => {
            const active = activeSection === item.section;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-11 items-center gap-2.5 rounded-xl px-2.5 text-sm font-medium text-[#66716C] transition-colors duration-200 hover:bg-[#F7F8F6] hover:text-[#1F2328] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FAAE0] motion-reduce:transition-none",
                    active && "bg-[#F0F5F2] font-semibold text-[#3F715A]",
                  )}
                >
                  <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={active ? 2.1 : 1.8} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
