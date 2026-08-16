"use client";

import { memoryTiers } from "@/data/memory";
import { HoloCanvas } from "@/components/three/holo-canvas";
import { HoloHud } from "@/components/three/holo-hud";
import { HoloLabel } from "@/components/three/holo-label";

const widths = [1.15, 1.45, 1.8, 2.15, 2.55, 3.0, 3.4, 3.85, 4.3];

export function MemoryTower({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="absolute inset-0">
      <HoloCanvas accent="gpu" camera={[5.8, 4.6, 7.6]} minDistance={6} maxDistance={13} autoRotate>
        <Tower activeId={activeId} onSelect={onSelect} />
      </HoloCanvas>
      <HoloHud left="MEM.HIERARCHY" mid="REG → NIC" right="SELECT A TIER" color="#6ee7ff" />
    </div>
  );
}

function Tower({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <group position={[0, 0.05, 0]}>
      {memoryTiers.map((tier, i) => {
        const w = widths[i] ?? 4;
        const y = (memoryTiers.length - 1 - i) * 0.44;
        const active = tier.id === activeId;
        const color =
          tier.accent === "cpu" ? "#e8b86d" : tier.accent === "gpu" ? "#6ee7ff" : "#9db0ff";
        return (
          <group key={tier.id} position={[0, y, 0]}>
            <mesh
              onClick={(event) => {
                event.stopPropagation();
                onSelect(tier.id);
              }}
              onPointerOver={() => {
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "auto";
              }}
            >
              <boxGeometry args={[w, 0.26, w * 0.7]} />
              <meshStandardMaterial
                color={active ? color : "#081018"}
                roughness={0.22}
                metalness={0.72}
                emissive={color}
                emissiveIntensity={active ? 0.55 : 0.08}
                transparent
                opacity={0.88}
              />
            </mesh>
            <HoloLabel
              text={tier.name}
              position={[w / 2 + 0.55, 0, 0]}
              color={color}
              size={active ? 0.16 : 0.12}
              opacity={active ? 1 : 0.75}
            />
          </group>
        );
      })}
    </group>
  );
}
