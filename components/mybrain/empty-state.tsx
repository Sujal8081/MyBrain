import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  tone?: "blue" | "green";
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = "blue",
}: EmptyStateProps) {
  const toneClasses =
    tone === "green"
      ? "bg-[#EAF3EE] text-[#4F806A]"
      : "bg-[#EAF2F8] text-[#557FAE]";

  return (
    <div className="flex flex-col items-center px-5 py-8 text-center sm:py-9">
      <span
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-[14px] ${toneClasses}`}
      >
        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[#1F2328]">
        {title}
      </h2>
      <p className="mt-1.5 max-w-sm text-sm leading-6 text-[#66716C]">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
