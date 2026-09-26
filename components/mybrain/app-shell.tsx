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
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[230px] border-r border-[#DFE6E1] bg-[linear-gradient(180deg,#FFFFFF_0%,#FBFCFB_58%,#F5F8F6_100%)] px-3.5 py-4 md:flex md:flex-col">
        <div className="mb-5 border-b border-[#E4EBE7] px-2 py-2.5">
          <BrandMark />
        </div>
        <BottomNavigation variant="desktop" />
        <div className="mt-auto rounded-2xl border border-[#E2E8E4] bg-white p-2.5">
          <div className="flex items-center gap-2.5 rounded-xl bg-[#F7F9F8] px-2.5 py-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#DCE7E1] bg-[#EAF3EE] text-xs font-semibold text-[#3F715A]">
              {initial}
            </span>
            <span className="min-w-0">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8A958F]">Signed in</span>
              <span className="block truncate text-xs font-medium text-[#53615A]">{email || "Your account"}</span>
            </span>
          </div>
          <LogoutButton
            variant="ghost"
            className="mt-1 h-10 w-full justify-start rounded-xl px-2.5 text-xs font-medium text-[#7B8580] hover:bg-[#F4F7F5] hover:text-[#1F2328]"
          />
        </div>
      </aside>

      <div className="md:pl-[230px]">
        <header className="sticky top-0 z-40 border-b border-[#E4E8E5] bg-[#F7F8F6] px-5 py-3 md:hidden">
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

        <main className="mx-auto min-h-svh w-full max-w-[1060px] px-4 pb-[calc(6.75rem+env(safe-area-inset-bottom))] pt-6 min-[380px]:px-5 sm:px-8 md:pb-14 md:pt-8 lg:px-10">
          {children}
        </main>
      </div>

      <BottomNavigation variant="mobile" />
    </div>
  );
}
