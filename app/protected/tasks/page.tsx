import { CheckCircle2 } from "lucide-react";

import { FeatureEmptyPage } from "@/components/mybrain/feature-empty-page";

export default function TasksPage() {
  return (
    <FeatureEmptyPage
      title="Tasks"
      description="Keep the next important thing clear and manageable."
      emptyTitle="No tasks yet"
      emptyDescription="When task creation is added, your open tasks will be collected here."
      icon={CheckCircle2}
      tone="green"
    />
  );
}
