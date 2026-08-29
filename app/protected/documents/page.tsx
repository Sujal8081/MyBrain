import { FileText } from "lucide-react";

import { FeatureEmptyPage } from "@/components/mybrain/feature-empty-page";

export default function DocumentsPage() {
  return (
    <FeatureEmptyPage
      title="Documents"
      description="A quiet library for PDFs and documents you want MyBrain to help with."
      emptyTitle="No documents yet"
      emptyDescription="Document uploads and summaries will be added in a future phase."
      icon={FileText}
    />
  );
}
