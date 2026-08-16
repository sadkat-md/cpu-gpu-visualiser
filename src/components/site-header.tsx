"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/cpu" as const, label: "CPU" },
  { href: "/gpu" as const, label: "GPU" },
  { href: "/pipeline" as const, label: "Pipeline" },
  { href: "/memory" as const, label: "Memory" },
  { href: "/compare" as const, label: "Compare" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const tick = () => setClock(new Date().toISOString().slice(11, 19));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line/70 bg-[#02060c]/55 backdrop-blur-xl">
      <div className="mx-auto flex h-12 max-w-[1360px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-3 w-3">
            <span className="absolute inset-0 border border-[#6ee7ff]" />
            <span className="absolute inset-1 bg-[#6ee7ff] shadow-[0_0_10px_#6ee7ff]" />
          </span>
          <span className="font-mono text-[11px] tracking-[0.28em] text-[#6ee7ff]">ATLAS</span>
          <span className="hidden font-mono text-[10px] tracking-[0.18em] text-muted sm:inline">
            HOLO.OS
          </span>
        </Link>
        <nav className="hidden items-center gap-5 md:flex">
          {links.map((link) => {
            const on = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[11px] tracking-[0.2em]"
                style={{ color: on ? "var(--holo)" : "var(--muted)" }}
              >
                {on ? "▸ " : ""}
                {link.label}
              </Link>
            );
          })}
        </nav>
        <p className="font-mono text-[10px] tracking-[0.16em] text-muted" suppressHydrationWarning>
          {clock} UTC
        </p>
      </div>
      <nav className="flex gap-3 overflow-x-auto border-t border-line px-4 py-2 md:hidden">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="chip shrink-0">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
