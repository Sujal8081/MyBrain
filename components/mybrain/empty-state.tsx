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
      ? "bg-[#eaf4ee] text-[#377458]"
      : "bg-[#edf5fb] text-[#356f9f]";

  return (
    <div className="flex flex-col items-center px-5 py-10 text-center sm:py-12">
      <span
        className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${toneClasses}`}
      >
        <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.8} />
      </span>
      <h2 className="text-lg font-semibold tracking-tight text-[#2c3733]">
        {title}
      </h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#6a756f]">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
