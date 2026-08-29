import { UserRound } from "lucide-react";

import { FeatureEmptyPage } from "@/components/mybrain/feature-empty-page";

export default function AccountPage() {
  return (
    <FeatureEmptyPage
      title="Account"
      description="Your personal account area within MyBrain."
      emptyTitle="Account settings are coming later"
      emptyDescription="Your existing Supabase account remains active. Profile settings are not part of this phase."
      icon={UserRound}
      tone="green"
    />
  );
}
