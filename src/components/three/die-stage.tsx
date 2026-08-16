"use client";

import { cpuDieBlocks, gpuDieBlocks } from "@/lib/die-layouts";
import { HoloCanvas } from "@/components/three/holo-canvas";
import { HoloHud } from "@/components/three/holo-hud";
import { SiliconDie } from "@/components/three/silicon-die";

export function DieStage({
  accent,
  activeId,
  onSelect,
}: {
  accent: "cpu" | "gpu";
  activeId: string;
  onSelect: (partId: string) => void;
}) {
  const blocks = accent === "cpu" ? cpuDieBlocks : gpuDieBlocks;
  const glow = accent === "cpu" ? "#e8b86d" : "#6ee7ff";

  return (
    <div className="absolute inset-0">
      <HoloCanvas accent={accent} autoRotate>
        <SiliconDie
          accent={accent}
          blocks={blocks}
          activeId={activeId}
          onSelect={onSelect}
          detail="high"
          nameplate={accent === "cpu" ? "CPU" : "GPU"}
          nameplateSub={accent === "cpu" ? "Latency machine" : "Throughput machine"}
        />
      </HoloCanvas>
      <HoloHud
        left="ATLAS // HOLO-ANALYSIS"
        mid={accent === "cpu" ? "PKG.CPU · DELID · LIVE" : "PKG.GPU · HBM · LIVE"}
        right="DRAG ORBIT · SELECT BLOCK"
        color={glow}
      />
    </div>
  );
}

export function StageSkeleton() {
  return (
    <div className="absolute inset-0 grid place-items-center bg-[#02060c]">
      <p className="font-mono text-[11px] tracking-[0.22em] text-[#6ee7ff]">PROJECTING…</p>
    </div>
  );
}
