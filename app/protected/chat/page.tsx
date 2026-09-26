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

      <div className="relative flex flex-1 flex-col justify-between gap-8 overflow-hidden rounded-[22px] border border-[#E0E8E4] bg-[linear-gradient(180deg,#F9FBFA_0%,#F4F8FA_100%)] p-4 sm:p-6 md:shadow-[0_14px_42px_rgba(31,35,40,0.035)]">
        <div aria-hidden="true" className="absolute -right-20 -top-24 hidden h-56 w-56 rounded-full bg-[#EAF2F8] blur-3xl md:block" />
        <section className="relative flex flex-1 flex-col justify-center py-6" aria-labelledby="chat-empty-title">
          <div className="flex max-w-[88%] items-start gap-3 sm:max-w-[72%]">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-[#D9E5DE] bg-[#EAF3EE] text-[#4F806A] md:shadow-[0_5px_16px_rgba(79,128,106,0.07)]">
              <Brain aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
            </span>
            <div className="rounded-[18px] rounded-tl-md border border-[#E1E7E4] bg-white px-4 py-3.5 md:shadow-[0_7px_22px_rgba(31,35,40,0.035)]">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4F806A]">
                <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
                MyBrain
              </div>
              <h2 id="chat-empty-title" className="mt-1.5 text-[16px] font-semibold tracking-[-0.015em] text-[#1F2328]">
                Ask anything about your day.
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-[#66716C]">
                In a future phase, conversations will help you work across tasks, notes, and documents.
              </p>
            </div>
          </div>
        </section>

        <div className="relative rounded-[18px] border border-[#DCE4E0] bg-white p-2 md:shadow-[0_10px_28px_rgba(31,35,40,0.05)]">
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
