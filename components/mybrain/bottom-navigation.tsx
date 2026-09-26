"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Home,
  Menu,
  MessageCircle,
  NotebookText,
} from "lucide-react";

import {
  getActiveNavigationSection,
  type NavigationSection,
} from "@/lib/navigation/route-state";
import { cn } from "@/lib/utils";

interface MobileNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  section: NavigationSection;
}

type DesktopNavigationItem =
  | {
      kind: "link";
      label: string;
      href: string;
      icon: LucideIcon;
      isActive: (pathname: string, activeSection: NavigationSection | null) => boolean;
    }
  | {
      kind: "disabled";
      label: string;
      icon: LucideIcon;
      badge: string;
    };

const navigationItems: MobileNavigationItem[] = [
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

const desktopNavigationItems: DesktopNavigationItem[] = [
  {
    kind: "link",
    label: "Home",
    href: "/protected",
    icon: Home,
    isActive: (_pathname, activeSection) => activeSection === "home",
  },
  {
    kind: "link",
    label: "Tasks",
    href: "/protected/tasks",
    icon: CheckCircle2,
    isActive: (_pathname, activeSection) => activeSection === "tasks",
  },
  {
    kind: "link",
    label: "Chat",
    href: "/protected/chat",
    icon: MessageCircle,
    isActive: (_pathname, activeSection) => activeSection === "chat",
  },
  {
    kind: "link",
    label: "Notes",
    href: "/protected/notes",
    icon: NotebookText,
    isActive: (_pathname, activeSection) => activeSection === "notes",
  },
  {
    kind: "disabled",
    label: "Calendar",
    icon: CalendarDays,
    badge: "Soon",
  },
  {
    kind: "link",
    label: "Reminders",
    href: "/protected/reminders",
    icon: Bell,
    isActive: (pathname) =>
      pathname === "/protected/reminders" || pathname.startsWith("/protected/reminders/"),
  },
  {
    kind: "link",
    label: "More",
    href: "/protected/more",
    icon: Menu,
    isActive: (pathname, activeSection) =>
      activeSection === "more" && !pathname.startsWith("/protected/reminders"),
  },
];

interface BottomNavigationProps {
  variant: "desktop" | "mobile";
}

export function BottomNavigation({ variant }: BottomNavigationProps) {
  const pathname = usePathname();
  const activeSection = getActiveNavigationSection(pathname);

  return (
    <>
      {variant === "mobile" ? (
        <nav
        aria-label="Primary navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E4E8E5] bg-white px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_14px_rgba(31,35,40,0.035)] md:hidden"
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
      ) : null}

      {variant === "desktop" ? (
        <nav aria-label="Primary navigation" className="hidden md:block">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#98A29D]">
          Workspace
        </p>
        <ul className="space-y-1">
          {desktopNavigationItems.map((item) => {
            const Icon = item.icon;

            if (item.kind === "disabled") {
              return (
                <li key={item.label}>
                  <span
                    aria-disabled="true"
                    title="Calendar is planned for a future phase"
                    className="flex min-h-11 cursor-not-allowed items-center gap-3 rounded-[14px] px-3 text-sm font-medium text-[#A1AAA5]"
                  >
                    <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />
                    <span>{item.label}</span>
                    <span className="ml-auto rounded-full bg-[#F0F2F1] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-[#89938E]">
                      {item.badge}
                    </span>
                  </span>
                </li>
              );
            }

            const active = item.isActive(pathname, activeSection);

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex min-h-11 items-center gap-3 rounded-[14px] px-3 text-sm font-medium text-[#66716C] transition-[color,background-color,box-shadow] duration-200 hover:bg-[#F4F7F5] hover:text-[#1F2328] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7FAAE0] motion-reduce:transition-none",
                    active && "bg-[#E5F0EA] font-semibold text-[#2F664C] shadow-[inset_0_0_0_1px_rgba(79,128,106,0.16)]",
                  )}
                >
                  <span className={cn("flex h-7 w-7 items-center justify-center rounded-lg border border-transparent transition-colors", active ? "border-[#D5E4DB] bg-white" : "group-hover:bg-white")}>
                    <Icon aria-hidden="true" className="h-[17px] w-[17px]" strokeWidth={active ? 2.2 : 1.8} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
          </ul>
        </nav>
      ) : null}
    </>
  );
}
