import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <div className="relative z-[1] mx-auto w-full max-w-[1360px] flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <header className="mb-5 max-w-2xl">
        <p className="kicker text-[#6ee7ff]">{eyebrow}</p>
        <h1 className="mt-2 text-[2.1rem] font-medium leading-[1.05] tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 text-[14px] leading-7 text-muted">{lede}</p>
      </header>
      {children}
    </div>
  );
}
