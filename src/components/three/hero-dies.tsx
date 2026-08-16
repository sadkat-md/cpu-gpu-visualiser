"use client";

import { useFrame } from "@react-three/fiber";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Group } from "three";
import { cpuDieBlocks, gpuDieBlocks } from "@/lib/die-layouts";
import { HoloCanvas } from "@/components/three/holo-canvas";
import { HoloHud } from "@/components/three/holo-hud";
import { SiliconDie } from "@/components/three/silicon-die";

export function HeroDies() {
  return (
    <div className="absolute inset-0">
      <HoloCanvas accent="gpu" camera={[0, 8.4, 14.6]} minDistance={11} maxDistance={20} autoRotate>
        <HeroRig />
      </HoloCanvas>
      <HoloHud left="ATLAS // STANDBY" mid="CPU  ·  GPU" right="SELECT A PACKAGE" color="#6ee7ff" />
    </div>
  );
}

function HeroRig() {
  const group = useRef<Group>(null);
  const router = useRouter();

  useEffect(() => {
    return () => {
      document.body.style.cursor = "auto";
    };
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.05;
  });

  return (
    <group ref={group}>
      <group
        position={[-4.7, 0.12, 0]}
        rotation={[0, 0.2, 0]}
        onClick={(event) => {
          event.stopPropagation();
          router.push("/cpu");
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <SiliconDie
          accent="cpu"
          blocks={cpuDieBlocks}
          scale={0.7}
          interactive={false}
          detail="medium"
          showBlockLabels={false}
          nameplate="CPU"
          nameplateSub="Latency machine"
        />
      </group>
      <group
        position={[4.7, 0.12, 0]}
        rotation={[0, -0.2, 0]}
        onClick={(event) => {
          event.stopPropagation();
          router.push("/gpu");
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <SiliconDie
          accent="gpu"
          blocks={gpuDieBlocks}
          scale={0.7}
          interactive={false}
          detail="medium"
          showBlockLabels={false}
          nameplate="GPU"
          nameplateSub="Throughput machine"
        />
      </group>
    </group>
  );
}
