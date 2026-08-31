import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  id?: string;
  title: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ id, title, action, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-3 flex min-h-5 items-center justify-between gap-4", className)}>
      <h2 id={id} className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#66716C]">
        {title}
      </h2>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
