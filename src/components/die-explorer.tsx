"use client";

import { useEffect, useMemo, useState } from "react";
import type { Part } from "@/data/types";
import { Inspector } from "@/components/inspector";
import { DieStageLazy } from "@/components/three/lazy";
import { findPart } from "@/lib/parts";

export function DieExplorer({
  accent,
  parts,
  tour,
  eyebrow,
  title,
}: {
  accent: "cpu" | "gpu";
  parts: Part[];
  tour: readonly string[];
  eyebrow: string;
  title: string;
}) {
  const [activeId, setActiveId] = useState(tour[0] ?? parts[0]?.id ?? "core");
  const [playing, setPlaying] = useState(true);
  const [query, setQuery] = useState("");

  const part = findPart(parts, activeId);
  const index = Math.max(0, tour.indexOf(activeId));
  const tone = accent === "cpu" ? "#e8b86d" : "#6ee7ff";

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setActiveId((current) => {
        const at = tour.indexOf(current);
        return tour[(at + 1) % tour.length] ?? tour[0] ?? current;
      });
    }, 4200);
    return () => window.clearInterval(id);
  }, [playing, tour]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (event.code === "Space") {
        event.preventDefault();
        setPlaying((value) => !value);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setPlaying(false);
        setActiveId((current) => {
          const at = Math.max(0, tour.indexOf(current));
          return tour[(at + 1) % tour.length] ?? current;
        });
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setPlaying(false);
        setActiveId((current) => {
          const at = Math.max(0, tour.indexOf(current));
          return tour[(at - 1 + tour.length) % tour.length] ?? current;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tour]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return parts;
    return parts.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.short.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q),
    );
  }, [parts, query]);

  const select = (id: string) => {
    setPlaying(false);
    setActiveId(id);
  };

  const shown = query ? filtered : parts;

  return (
    <div>
      <div className="viewport">
        <DieStageLazy accent={accent} activeId={activeId} onSelect={select} />

        <div className="hud-layer pointer-events-none">
          <div className="pointer-events-auto absolute left-4 top-[4.75rem] max-w-sm sm:left-6">
            <p className="kicker" style={{ color: tone }}>
              {eyebrow}
            </p>
            <h1 className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-2 hidden font-mono text-[10px] tracking-[0.14em] text-muted sm:block">
              Space tour · arrows step
            </p>
          </div>

          <div className="pointer-events-auto absolute right-4 top-[4.75rem] flex w-[min(100%-2rem,360px)] flex-col gap-2 sm:right-6">
            <div className="flex gap-2">
              <label className="hud-glass flex min-w-0 flex-1 items-center gap-2 px-3 py-2">
                <span className="kicker">Lock</span>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="AMX, tensor, HBM…"
                  className="w-full bg-transparent font-mono text-[12px] outline-none placeholder:text-muted/70"
                />
              </label>
              <button type="button" onClick={() => setPlaying((value) => !value)} className="chip">
                {playing ? "Halt" : "Tour"}
              </button>
            </div>
            <div className="hidden h-[min(56vh,540px)] xl:block">
              <Inspector part={part} index={index === -1 ? 0 : index} total={tour.length} />
            </div>
          </div>

          <div className="chip-row pointer-events-auto absolute inset-x-4 bottom-4 sm:inset-x-6 xl:right-[400px]">
            {shown.map((item) => (
              <button
                key={item.id}
                type="button"
                data-on={item.id === activeId}
                className="chip shrink-0"
                onClick={() => {
                  select(item.id);
                  setQuery("");
                }}
              >
                {item.short}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="relative z-[2] px-4 py-4 xl:hidden">
        <Inspector part={part} index={index === -1 ? 0 : index} total={tour.length} />
      </div>
    </div>
  );
}
