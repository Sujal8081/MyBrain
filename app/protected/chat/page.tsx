import { Brain, Mic, Send, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/mybrain/page-header";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100svh-12rem)] max-w-3xl flex-col md:min-h-[calc(100svh-7rem)]">
      <PageHeader
        eyebrow="Future assistant"
        title="Chat"
        description="A focused space to think with MyBrain. AI chat is not active yet."
      />

      <div className="flex flex-1 flex-col justify-between gap-8">
        <section className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center" aria-labelledby="chat-empty-title">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF2F8] text-[#557FAE]">
            <Brain aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
          </span>
          <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#4F806A]">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
            MyBrain
          </div>
          <h2 id="chat-empty-title" className="mt-2 text-xl font-semibold tracking-[-0.025em] text-[#1F2328]">
            Ask anything about your day.
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-[#66716C]">
            In a future phase, conversations will help you work across tasks, notes, and documents.
          </p>
        </section>

        <div className="rounded-[18px] border border-[#E4E8E5] bg-white p-2 shadow-[0_1px_2px_rgba(31,35,40,0.025),0_8px_24px_rgba(31,35,40,0.035)]">
          <label htmlFor="chat-placeholder" className="sr-only">Ask MyBrain</label>
          <textarea
            id="chat-placeholder"
            readOnly
            rows={2}
            placeholder="Ask MyBrain..."
            className="min-h-[56px] w-full resize-none bg-transparent px-3 py-2.5 text-sm text-[#1F2328] outline-none placeholder:text-[#89938E]"
          />
          <div className="flex items-center justify-between border-t border-[#EEF1EF] px-1 pt-2">
            <Button type="button" variant="ghost" size="icon" disabled aria-label="Voice input will be available later" className="text-[#66716C]">
              <Mic aria-hidden="true" />
            </Button>
            <Button type="button" size="icon" disabled aria-label="Chat will be available later">
              <Send aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
