"use client";

import { useFrame } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

export function HoloRig({ accent }: { accent: "cpu" | "gpu" }) {
  const glow = accent === "cpu" ? "#e8b86d" : "#6ee7ff";
  return (
    <>
      <color attach="background" args={["#02060c"]} />
      <fog attach="fog" args={["#02060c", 16, 34]} />
      <hemisphereLight args={["#9fdfff", "#02060c", 0.42]} />
      <directionalLight position={[6, 10, 4]} intensity={1.25} color="#e7f7ff" />
      <HoloRings color={glow} />
      <ScanSweep color={glow} />
      <Dust color={glow} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.62, 0]}>
        <circleGeometry args={[11, 48]} />
        <meshBasicMaterial color="#041018" transparent opacity={0.9} />
      </mesh>
      <gridHelper args={[18, 28, glow, "#08313c"]} position={[0, -0.61, 0]} />
    </>
  );
}

function HoloRings({ color }: { color: string }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.1;
  });

  return (
    <group ref={group} position={[0, -0.58, 0]}>
      {[5.2, 6.5, 7.8].map((radius, i) => (
        <mesh key={radius} rotation={[-Math.PI / 2, 0, i * 0.3]}>
          <ringGeometry args={[radius, radius + 0.02, 72]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.24 - i * 0.05}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
      <RingTicks color={color} />
    </group>
  );
}

function RingTicks({ color }: { color: string }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    for (let i = 0; i < 24; i += 1) {
      const a = (i / 24) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * 6.5, 0.01, Math.sin(a) * 6.5);
      dummy.lookAt(0, 0.01, 0);
      dummy.scale.set(1, 1, i % 4 === 0 ? 1.8 : 1);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 24]}>
      <boxGeometry args={[0.012, 0.012, 0.12]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </instancedMesh>
  );
}

function ScanSweep({ color }: { color: string }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.position.z = Math.sin(state.clock.elapsedTime * 0.5) * 4.2;
  });
  return (
    <mesh ref={mesh} position={[0, 0.55, 0]}>
      <planeGeometry args={[10.2, 1.2]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.07}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Dust({ color }: { color: string }) {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = 70;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = Math.random() * 4.2;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((_, dt) => {
    if (points.current) points.current.rotation.y += dt * 0.04;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial color={color} size={0.035} transparent opacity={0.35} depthWrite={false} />
    </points>
  );
}
