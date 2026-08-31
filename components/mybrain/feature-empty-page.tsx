import type { LucideIcon } from "lucide-react";

import { DashboardCard } from "@/components/mybrain/dashboard-card";
import { EmptyState } from "@/components/mybrain/empty-state";
import { PageHeader } from "@/components/mybrain/page-header";

interface FeatureEmptyPageProps {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  icon: LucideIcon;
  tone?: "blue" | "green";
}

export function FeatureEmptyPage({
  title,
  description,
  emptyTitle,
  emptyDescription,
  icon,
  tone,
}: FeatureEmptyPageProps) {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={title} description={description} />
      <DashboardCard>
        <EmptyState
          icon={icon}
          title={emptyTitle}
          description={emptyDescription}
          tone={tone}
        />
      </DashboardCard>
    </div>
  );
}
