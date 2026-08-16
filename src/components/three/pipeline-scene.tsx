"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { pipelineStages } from "@/data/pipeline";
import { HoloCanvas } from "@/components/three/holo-canvas";
import { HoloHud } from "@/components/three/holo-hud";
import { HoloLabel } from "@/components/three/holo-label";

export function PipelineScene({
  step,
  onSelect,
}: {
  step: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="absolute inset-0">
      <HoloCanvas accent="gpu" camera={[0, 5.6, 11.5]} minDistance={8} maxDistance={16} autoRotate>
        <PipelineRig step={step} onSelect={onSelect} />
      </HoloCanvas>
      <HoloHud
        left="ATLAS // TOKEN PATH"
        mid={`STAGE ${String(step + 1).padStart(2, "0")} / 07`}
        right="SELECT A NODE"
        color="#6ee7ff"
      />
    </div>
  );
}

function nodePos(i: number, n: number): THREE.Vector3 {
  const t = n === 1 ? 0.5 : i / (n - 1);
  return new THREE.Vector3((t - 0.5) * 11.4, 0.35 + Math.sin(t * Math.PI) * 0.35, Math.sin(t * Math.PI) * -2.1);
}

function PipelineRig({ step, onSelect }: { step: number; onSelect: (index: number) => void }) {
  const token = useRef<THREE.Mesh>(null);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);
  const targets = useMemo(
    () => pipelineStages.map((_, i) => nodePos(i, pipelineStages.length)),
    [],
  );
  const path = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(targets, false, "catmullrom", 0.25);
    return curve.getPoints(80);
  }, [targets]);

  useFrame((_, dt) => {
    if (!token.current) return;
    const dest = targets[step] ?? targets[0];
    if (!dest) return;
    token.current.position.lerp(dest, 1 - Math.exp(-dt * 5));
    token.current.rotation.y += dt * 1.6;
  });

  return (
    <group>
      <Line points={path} color="#6ee7ff" transparent opacity={0.4} lineWidth={1.4} />
      {pipelineStages.map((stage, i) => {
        const p = targets[i];
        const on = i === step;
        const color =
          stage.owner === "cpu" ? "#e8b86d" : stage.owner === "gpu" ? "#6ee7ff" : "#9db0ff";
        return (
          <group key={stage.id} position={p}>
            <mesh
              onClick={(event) => {
                event.stopPropagation();
                onSelect(i);
              }}
              onPointerOver={() => {
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                document.body.style.cursor = "auto";
              }}
            >
              <octahedronGeometry args={[on ? 0.38 : 0.26, 0]} />
              <meshStandardMaterial
                color={on ? color : "#071018"}
                emissive={color}
                emissiveIntensity={on ? 0.9 : 0.18}
                metalness={0.7}
                roughness={0.2}
                transparent
                opacity={0.92}
              />
            </mesh>
            <HoloLabel
              text={stage.name}
              position={[0, 0.58, 0]}
              color={color}
              size={on ? 0.16 : 0.12}
              opacity={on ? 1 : 0.7}
            />
          </group>
        );
      })}
      <mesh ref={token}>
        <sphereGeometry args={[0.13, 24, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#6ee7ff"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
