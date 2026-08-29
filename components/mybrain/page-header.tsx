interface PageHeaderProps {
  title: string;
  description: string;
  eyebrow?: string;
}

export function PageHeader({ title, description, eyebrow }: PageHeaderProps) {
  return (
    <header className="mb-8 sm:mb-10">
      {eyebrow ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#4d7d68]">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[#26312d] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-2 max-w-2xl text-base leading-7 text-[#66726d]">
        {description}
      </p>
    </header>
  );
}
