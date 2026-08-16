"use client";

import { useEffect, useState } from "react";
import { compareRows, rooflinePoints } from "@/data/compare";
import { CompareSceneLazy } from "@/components/three/lazy";

export function CompareLab() {
  const [open, setOpen] = useState(compareRows[0]?.topic ?? "");
  const [playing, setPlaying] = useState(true);
  const row = compareRows.find((item) => item.topic === open) ?? compareRows[0];

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setOpen((current) => {
        const at = compareRows.findIndex((item) => item.topic === current);
        return compareRows[(at + 1) % compareRows.length]?.topic ?? current;
      });
    }, 5200);
    return () => window.clearInterval(id);
  }, [playing]);

  return (
    <div>
    <div className="viewport">
      <CompareSceneLazy topic={open} />
      <div className="hud-layer pointer-events-none">
        <div className="pointer-events-auto absolute left-4 top-16 max-w-sm sm:left-6 sm:top-[4.5rem]">
          <p className="kicker text-[#6ee7ff]">Placement · roofline</p>
          <h1 className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">Dual lock</h1>
        </div>

        <aside className="pointer-events-auto absolute right-4 top-16 hidden w-[360px] xl:block sm:right-6 sm:top-[4.5rem]">
          <div className="hud-glass p-4">
            <p className="kicker text-[#6ee7ff]">{row.topic}</p>
            <div className="mt-3 grid gap-3">
              <p className="text-[13px] leading-6">
                <span className="kicker text-cpu">CPU</span>
                <span className="mt-1 block text-ink/90">{row.cpu}</span>
              </p>
              <p className="text-[13px] leading-6">
                <span className="kicker text-gpu">GPU</span>
                <span className="mt-1 block text-ink/90">{row.gpu}</span>
              </p>
              <p className="text-[13px] leading-6 text-muted">
                <span className="kicker text-ink">Takeaway</span>
                <span className="mt-1 block">{row.takeaway}</span>
              </p>
            </div>
            <p className="mt-4 font-mono text-[10px] text-muted">
              Ridge CPU {(rooflinePoints.cpu.peakFlops / rooflinePoints.cpu.peakBw).toFixed(0)} FLOP/B
              · GPU {(rooflinePoints.gpu.peakFlops / rooflinePoints.gpu.peakBw).toFixed(0)} FLOP/B
            </p>
          </div>
        </aside>

        <div className="chip-row pointer-events-auto absolute inset-x-4 bottom-4 sm:inset-x-6 xl:right-[400px]">
          {compareRows.map((item) => (
            <button
              key={item.topic}
              type="button"
              data-on={item.topic === open}
              className="chip shrink-0"
              onClick={() => {
                setPlaying(false);
                setOpen(item.topic);
              }}
            >
              {item.topic}
            </button>
          ))}
        </div>
      </div>
    </div>
      <div className="px-4 py-4 xl:hidden">
        <div className="hud-glass p-4">
          <p className="kicker text-[#6ee7ff]">{row.topic}</p>
          <p className="mt-3 text-[13px] leading-6 text-muted">{row.takeaway}</p>
        </div>
      </div>
    </div>
  );
}
