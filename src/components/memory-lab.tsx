"use client";

import { useEffect, useState } from "react";
import { MemoryTowerLazy } from "@/components/three/lazy";
import { memoryTiers } from "@/data/memory";

export function MemoryLab() {
  const [active, setActive] = useState(memoryTiers[4]?.id ?? "hbm");
  const [playing, setPlaying] = useState(true);
  const tier = memoryTiers.find((item) => item.id === active) ?? memoryTiers[0];

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setActive((current) => {
        const at = memoryTiers.findIndex((item) => item.id === current);
        return memoryTiers[(at + 1) % memoryTiers.length]?.id ?? current;
      });
    }, 3800);
    return () => window.clearInterval(id);
  }, [playing]);
  const tone =
    tier.accent === "cpu" ? "var(--cpu)" : tier.accent === "gpu" ? "var(--gpu)" : "var(--sys)";

  return (
    <div>
    <div className="viewport">
      <MemoryTowerLazy
        activeId={active}
        onSelect={(id) => {
          setPlaying(false);
          setActive(id);
        }}
      />
      <div className="hud-layer pointer-events-none">
        <div className="pointer-events-auto absolute left-4 top-16 max-w-sm sm:left-6 sm:top-[4.5rem]">
          <p className="kicker text-[#6ee7ff]">Locality · KV · weights</p>
          <h1 className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">Byte geography</h1>
        </div>

        <aside className="pointer-events-auto absolute right-4 top-16 hidden w-[360px] xl:block sm:right-6 sm:top-[4.5rem]">
          <div className="hud-glass p-4">
            <p className="kicker" style={{ color: tone }}>
              {tier.where}
            </p>
            <h2 className="mt-1 text-xl font-medium">{tier.name}</h2>
            <dl className="mt-4 grid grid-cols-2 gap-2">
              <Stat label="Latency" value={tier.latency} />
              <Stat label="Capacity" value={tier.capacity} />
              <Stat label="Bandwidth" value={tier.bandwidth} />
              <Stat label="Managed" value={tier.managed} />
            </dl>
            <p className="kicker mt-4">Inference</p>
            <p className="mt-2 text-[13px] leading-6 text-ink/88">{tier.inference}</p>
          </div>
        </aside>

        <div className="chip-row pointer-events-auto absolute inset-x-4 bottom-4 sm:inset-x-6 xl:right-[400px]">
          {memoryTiers.map((item) => (
            <button
              key={item.id}
              type="button"
              data-on={item.id === active}
              className="chip shrink-0"
              onClick={() => {
                setPlaying(false);
                setActive(item.id);
              }}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </div>
      <div className="px-4 py-4 xl:hidden">
        <div className="hud-glass p-4">
          <p className="kicker" style={{ color: tone }}>
            {tier.where}
          </p>
          <h2 className="mt-1 text-xl font-medium">{tier.name}</h2>
          <p className="mt-2 text-[13px] leading-6 text-ink/88">{tier.inference}</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-line px-2.5 py-2">
      <dt className="kicker">{label}</dt>
      <dd className="mt-1 text-[12px]">{value}</dd>
    </div>
  );
}
