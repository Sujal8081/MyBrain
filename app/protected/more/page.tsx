import { Bell, Info, LogOut, Palette, ShieldCheck, UserRound } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { PageHeader } from "@/components/mybrain/page-header";
import { SectionHeader } from "@/components/mybrain/section-header";
import { SettingsRow } from "@/components/mybrain/settings-row";

const moreItems = [
  {
    title: "Reminders",
    description: "Review time-sensitive items and future alerts.",
    href: "/protected/reminders",
    icon: Bell,
    tone: "blue" as const,
  },
  {
    title: "Account",
    description: "View your account area and profile placeholder.",
    href: "/protected/account",
    icon: UserRound,
    tone: "green" as const,
  },
];

export default function MorePage() {
  return (
    <div>
      <PageHeader
        title="More"
        description="Account controls and a few useful places that do not need to crowd your day."
      />
      <div className="space-y-7">
        <section aria-labelledby="more-your-space">
          <SectionHeader id="more-your-space" title="Your space" />
          <div className="surface-card divide-y divide-[#EEF1EF] overflow-hidden">
            {moreItems.map((item) => (
              <SettingsRow key={item.href} {...item} />
            ))}
          </div>
        </section>

        <section aria-labelledby="more-preferences">
          <SectionHeader id="more-preferences" title="Preferences" />
          <div className="surface-card divide-y divide-[#EEF1EF] overflow-hidden">
            <SettingsRow icon={ShieldCheck} title="Permissions" description="Manage future device and data permissions." meta="Later" />
            <SettingsRow icon={Palette} title="Appearance" description="Personalize how MyBrain looks and feels." meta="Later" tone="green" />
            <SettingsRow icon={Info} title="About MyBrain" description="Product details and future release information." meta="Phase 3" />
          </div>
        </section>

        <section aria-label="Sign out" className="surface-card flex min-h-[76px] items-center gap-3.5 px-4 py-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[13px] bg-[#FBECEC] text-[#A44747]">
            <LogOut aria-hidden="true" className="h-[18px] w-[18px]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-[#1F2328]">Sign out</p>
            <p className="mt-0.5 text-[13px] text-[#66716C]">End your current MyBrain session.</p>
          </div>
          <LogoutButton variant="ghost" className="shrink-0 px-3 text-[#9E4444] hover:bg-[#FBECEC] hover:text-[#873F3F]" />
        </section>
      </div>
    </div>
  );
}
