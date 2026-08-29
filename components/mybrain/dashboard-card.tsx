import { cn } from "@/lib/utils";

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-[#dde3df] bg-white shadow-[0_12px_30px_rgba(39,55,48,0.045)]",
        className,
      )}
    >
      {children}
    </section>
  );
}
