import { Mic2 } from "lucide-react";

import { FeatureEmptyPage } from "@/components/mybrain/feature-empty-page";

export default function VoiceNotesPage() {
  return (
    <FeatureEmptyPage
      title="Voice Notes"
      description="Capture thoughts naturally and return to them when you are ready."
      emptyTitle="No voice notes yet"
      emptyDescription="Recording and transcription will be introduced in a later phase."
      icon={Mic2}
      tone="green"
    />
  );
}
