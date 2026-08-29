import Link from "next/link";
import { FileText, Mic2 } from "lucide-react";

const noteOptions = [
  {
    title: "Documents",
    description: "A home for PDFs and documents you upload in a future phase.",
    href: "/protected/documents",
    icon: FileText,
    tone: "bg-[#edf5fb] text-[#356f9f]",
  },
  {
    title: "Voice Notes",
    description: "Recorded and transcribed thoughts will live here later.",
    href: "/protected/voice-notes",
    icon: Mic2,
    tone: "bg-[#eaf4ee] text-[#377458]",
  },
];

export function NotesHub() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {noteOptions.map((option) => {
        const Icon = option.icon;

        return (
          <Link
            key={option.href}
            href={option.href}
            className="group min-h-48 rounded-2xl border border-[#dde3df] bg-white p-6 shadow-[0_12px_30px_rgba(39,55,48,0.04)] transition-colors hover:border-[#bfcfc7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4f86c6] focus-visible:ring-offset-2"
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${option.tone}`}
            >
              <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
            </span>
            <h2 className="mt-6 text-lg font-semibold tracking-tight text-[#2c3733] group-hover:text-[#285f94]">
              {option.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#6a756f]">
              {option.description}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
