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

import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Home", href: "/protected", icon: Home, matches: ["/protected"] },
  {
    label: "Tasks",
    href: "/protected/tasks",
    icon: CheckCircle2,
    matches: ["/protected/tasks"],
  },
  {
    label: "Chat",
    href: "/protected/chat",
    icon: MessageCircle,
    matches: ["/protected/chat"],
  },
  {
    label: "Notes",
    href: "/protected/notes",
    icon: NotebookText,
    matches: [
      "/protected/notes",
      "/protected/documents",
      "/protected/voice-notes",
    ],
  },
  {
    label: "More",
    href: "/protected/more",
    icon: Menu,
    matches: [
      "/protected/more",
      "/protected/reminders",
      "/protected/account",
    ],
  },
];

function isItemActive(pathname: string, matches: string[]) {
  return matches.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <>
      <nav
        aria-label="Primary navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#dde3df] bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(42,56,51,0.05)] backdrop-blur md:hidden"
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {navigationItems.map((item) => {
            const active = isItemActive(pathname, item.matches);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium text-[#66726d] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f86c6] focus-visible:ring-offset-2",
                    active && "bg-[#edf5fb] text-[#285f94]",
                  )}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <nav aria-label="Primary navigation" className="hidden md:block">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const active = isItemActive(pathname, item.matches);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-xl px-4 text-sm font-medium text-[#66726d] transition-colors hover:bg-[#f2f5f2] hover:text-[#28332f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f86c6]",
                    active && "bg-[#edf5fb] text-[#285f94]",
                  )}
                >
                  <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={2} />
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
