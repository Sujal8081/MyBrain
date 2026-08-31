import { FileText, Mic2 } from "lucide-react";

import { NotesNavigationCard } from "@/components/mybrain/notes-navigation-card";

const noteOptions = [
  {
    title: "Documents",
    description: "A home for PDFs and documents you upload in a future phase.",
    href: "/protected/documents",
    icon: FileText,
    tone: "blue" as const,
  },
  {
    title: "Voice Notes",
    description: "Recorded and transcribed thoughts will live here later.",
    href: "/protected/voice-notes",
    icon: Mic2,
    tone: "green" as const,
  },
];

export function NotesHub() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {noteOptions.map((option) => (
        <NotesNavigationCard key={option.href} {...option} />
      ))}
    </div>
  );
}
