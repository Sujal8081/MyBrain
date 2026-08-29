import { NotesHub } from "@/components/mybrain/notes-hub";
import { PageHeader } from "@/components/mybrain/page-header";

export default function NotesPage() {
  return (
    <div>
      <PageHeader
        title="Notes"
        description="Choose how you want to capture or revisit information."
      />
      <NotesHub />
    </div>
  );
}
