import { Bell } from "lucide-react";

import { FeatureEmptyPage } from "@/components/mybrain/feature-empty-page";

export default function RemindersPage() {
  return (
    <FeatureEmptyPage
      title="Reminders"
      description="Keep time-sensitive commitments visible without adding noise."
      emptyTitle="No reminders yet"
      emptyDescription="Reminder scheduling and notifications will be added later."
      icon={Bell}
    />
  );
}
