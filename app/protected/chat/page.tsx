import { MessageCircle } from "lucide-react";

import { FeatureEmptyPage } from "@/components/mybrain/feature-empty-page";

export default function ChatPage() {
  return (
    <FeatureEmptyPage
      title="Chat"
      description="A focused space to think with your personal AI assistant."
      emptyTitle="Your conversation starts here"
      emptyDescription="AI chat will be added in a later phase. No messages are stored yet."
      icon={MessageCircle}
    />
  );
}
