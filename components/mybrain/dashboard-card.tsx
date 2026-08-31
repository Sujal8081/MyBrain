import { cn } from "@/lib/utils";

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardCard({ children, className }: DashboardCardProps) {
  return (
    <section
      className={cn(
        "surface-card overflow-hidden",
        className,
      )}
    >
      {children}
    </section>
  );
}
