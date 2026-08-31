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
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-[#E4E8E5] bg-white px-4 py-6 md:flex md:flex-col">
        <BrandMark className="mb-8 px-2" />
        <BottomNavigation />
        <div className="mt-auto border-t border-[#E4E8E5] pt-4">
          <div className="mb-2 flex items-center gap-3 rounded-[14px] px-2 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EAF2F8] text-sm font-semibold text-[#557FAE]">
              {initial}
            </span>
            <span className="min-w-0 truncate text-xs font-medium text-[#66716C]">
              {email || "Your account"}
            </span>
          </div>
          <LogoutButton
            variant="ghost"
            className="h-11 w-full justify-start px-3 text-[#66716C] hover:bg-[#F2F4F2] hover:text-[#1F2328]"
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

        <main className="mx-auto min-h-svh w-full max-w-[960px] px-5 pb-[calc(6.75rem+env(safe-area-inset-bottom))] pt-7 sm:px-8 md:pb-14 md:pt-10 lg:px-10">
          {children}
        </main>
      </div>

      <BottomNavigation />
    </div>
  );
}
