import { Brain } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { BottomNavigation } from "@/components/mybrain/bottom-navigation";

interface AppShellProps {
  children: React.ReactNode;
  email?: string;
}

export function AppShell({ children, email }: AppShellProps) {
  const initial = email?.charAt(0).toUpperCase() || "M";

  return (
    <div className="min-h-svh bg-[#f7f8f5] text-[#26312d]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#dde3df] bg-white px-5 py-7 md:flex md:flex-col">
        <div className="mb-10 flex items-center gap-3 px-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e8f2ec] text-[#377458]">
            <Brain aria-hidden="true" className="h-5 w-5" />
          </span>
          <span className="text-xl font-semibold tracking-tight">MyBrain</span>
        </div>
        <BottomNavigation />
        <div className="mt-auto border-t border-[#e6eae7] pt-5">
          <div className="mb-3 flex items-center gap-3 px-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#edf5fb] text-sm font-semibold text-[#285f94]">
              {initial}
            </span>
            <span className="min-w-0 truncate text-xs text-[#66726d]">
              {email || "Your account"}
            </span>
          </div>
          <LogoutButton
            variant="ghost"
            className="h-11 w-full justify-start rounded-xl px-3 text-[#66726d] hover:bg-[#f2f5f2] hover:text-[#26312d]"
          />
        </div>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-40 border-b border-[#dde3df] bg-[#f7f8f5]/95 px-5 py-3 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f2ec] text-[#377458]">
                <Brain aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="text-lg font-semibold tracking-tight">MyBrain</span>
            </div>
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#edf5fb] text-sm font-semibold text-[#285f94]"
              aria-label={email ? `Signed in as ${email}` : "Signed in"}
              title={email || "Signed in"}
            >
              {initial}
            </div>
          </div>
        </header>

        <main className="mx-auto min-h-svh w-full max-w-5xl px-5 pb-28 pt-8 sm:px-8 md:pb-12 md:pt-12 lg:px-12">
          {children}
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}
