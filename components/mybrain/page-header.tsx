interface PageHeaderProps {
  title: string;
  description: string;
  eyebrow?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, eyebrow, action }: PageHeaderProps) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#4F806A]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-[28px] font-semibold leading-[1.18] tracking-[-0.03em] text-[#1F2328] sm:text-[30px]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-6 text-[#66716C]">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
