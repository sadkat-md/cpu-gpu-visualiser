"use client";

import { cpuDieBlocks, gpuDieBlocks } from "@/lib/die-layouts";
import { HoloCanvas } from "@/components/three/holo-canvas";
import { HoloHud } from "@/components/three/holo-hud";
import { HoloLabel } from "@/components/three/holo-label";
import { SiliconDie } from "@/components/three/silicon-die";

export function CompareScene({ topic }: { topic: string }) {
  return (
    <div className="absolute inset-0">
      <HoloCanvas accent="gpu" camera={[0, 7.4, 13.2]} minDistance={10} maxDistance={20} autoRotate>
        <group position={[-4.55, 0.1, 0]} rotation={[0, 0.22, 0]}>
          <SiliconDie
            accent="cpu"
            blocks={cpuDieBlocks}
            scale={0.68}
            interactive={false}
            detail="medium"
            showBlockLabels={false}
            nameplate="CPU"
            nameplateSub="Latency"
          />
        </group>
        <group position={[4.55, 0.1, 0]} rotation={[0, -0.22, 0]}>
          <SiliconDie
            accent="gpu"
            blocks={gpuDieBlocks}
            scale={0.68}
            interactive={false}
            detail="medium"
            showBlockLabels={false}
            nameplate="GPU"
            nameplateSub="Throughput"
          />
        </group>
        <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 8.6, 8]} />
          <meshBasicMaterial color="#6ee7ff" transparent opacity={0.28} />
        </mesh>
        <HoloLabel text={topic} position={[0, 2.35, 0]} color="#6ee7ff" size={0.2} />
      </HoloCanvas>
      <HoloHud left="ATLAS // DUAL LOCK" mid="CPU  ↔  GPU" right="COMPARE LIVE" color="#6ee7ff" />
    </div>
  );
}
