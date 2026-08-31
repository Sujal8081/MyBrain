import { LogoutButton } from "@/components/logout-button";
import { BottomNavigation } from "@/components/mybrain/bottom-navigation";
import { BrandMark } from "@/components/mybrain/brand-mark";

interface AppShellProps {
  children: React.ReactNode;
  email?: string;
}

export function AppShell({ children, email }: AppShellProps) {
  const initial = email?.charAt(0).toUpperCase() || "M";

  return (
    <div className="min-h-svh bg-[#F7F8F6] text-[#1F2328]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-[#E4E8E5] bg-white px-4 py-5 md:flex md:flex-col">
        <BrandMark className="mb-6 px-1.5" />
        <BottomNavigation />
        <div className="mt-auto border-t border-[#EEF1EF] pt-3">
          <div className="mb-1 flex items-center gap-2.5 rounded-xl px-2 py-1.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F0F4F2] text-xs font-semibold text-[#66716C]">
              {initial}
            </span>
            <span className="min-w-0 truncate text-xs font-medium text-[#66716C]">
              {email || "Your account"}
            </span>
          </div>
          <LogoutButton
            variant="ghost"
            className="h-11 w-full justify-start px-2.5 text-xs font-medium text-[#7B8580] hover:bg-[#F7F8F6] hover:text-[#1F2328]"
          />
        </div>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-40 border-b border-[#E4E8E5] bg-[#F7F8F6]/95 px-5 py-3 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <BrandMark compact />
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#EAF2F8] text-sm font-semibold text-[#557FAE]"
              aria-label={email ? `Signed in as ${email}` : "Signed in"}
              title={email || "Signed in"}
            >
              {initial}
            </div>
          </div>
        </header>

        <main className="mx-auto min-h-svh w-full max-w-[1120px] px-4 pb-[calc(6.75rem+env(safe-area-inset-bottom))] pt-6 min-[380px]:px-5 sm:px-8 md:pb-14 md:pt-8 lg:px-10">
          {children}
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}
