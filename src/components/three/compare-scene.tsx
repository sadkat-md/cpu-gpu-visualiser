"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
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
        <DataStream />
        <HoloLabel text={topic} position={[0, 2.35, 0]} color="#6eff99ff" size={0.2} />
      </HoloCanvas>
      <HoloHud left="ATLAS // DUAL LOCK" mid="CPU  ↔  GPU" right="COMPARE LIVE" color="#6eff9eff" />
    </div>
  );
}

function DataStream() {
  const lanes = 8;
  
  const curves = useMemo(() => {
    const cpuDummy = new THREE.Object3D();
    cpuDummy.position.set(-4.55, 0.1, 0);
    cpuDummy.rotation.set(0, 0.22, 0);
    cpuDummy.updateMatrixWorld();

    const gpuDummy = new THREE.Object3D();
    gpuDummy.position.set(4.55, 0.1, 0);
    gpuDummy.rotation.set(0, -0.22, 0);
    gpuDummy.updateMatrixWorld();

    return Array.from({ length: lanes }, (_, i) => {
      // Local Z offset along the edge
      const localZ = (i - (lanes - 1) / 2) * 0.35;
      
      const startLocal = new THREE.Vector3(2.2, 0, localZ);
      const startWorld = startLocal.applyMatrix4(cpuDummy.matrixWorld);

      const endLocal = new THREE.Vector3(-2.2, 0, localZ);
      const endWorld = endLocal.applyMatrix4(gpuDummy.matrixWorld);

      return new THREE.LineCurve3(startWorld, endWorld);
    });
  }, [lanes]);

  const tubes = useMemo(() => {
    return curves.map(curve => new THREE.TubeGeometry(curve, 64, 0.008, 8, false));
  }, [curves]);

  return (
    <group>
      {/* Static bright glowing wire bonds connecting the dies */}
      {tubes.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <meshStandardMaterial color="#3cda7eff" emissive="#6eff99ff" emissiveIntensity={2.5} />
        </mesh>
      ))}
    </group>
  );
}
