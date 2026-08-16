"use client";

import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { diePackage, type DieBlock } from "@/lib/die-layouts";
import { createSiliconMap } from "@/lib/holo-textures";
import { HoloLabel } from "@/components/three/holo-label";

const kindTint: Record<DieBlock["kind"], string> = {
  core: "#2a2118",
  array: "#102226",
  cache: "#141c24",
  io: "#1a1d28",
  fabric: "#1c1824",
  stack: "#1b201c",
};

export function SiliconDie({
  accent,
  blocks,
  activeId,
  onSelect,
  interactive = true,
  scale = 1,
  detail = "high",
  nameplate,
  nameplateSub,
  showBlockLabels = true,
}: {
  accent: "cpu" | "gpu";
  blocks: DieBlock[];
  activeId?: string;
  onSelect?: (partId: string) => void;
  interactive?: boolean;
  scale?: number;
  detail?: "high" | "medium";
  nameplate?: string;
  nameplateSub?: string;
  showBlockLabels?: boolean;
}) {
  const pkg = diePackage[accent];
  const glow = accent === "cpu" ? "#e8b86d" : "#6ee7ff";
  const [map, setMap] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    const texture = createSiliconMap(accent);
    setMap(texture);
    return () => texture.dispose();
  }, [accent]);

  return (
    <group scale={scale}>
      <mesh position={[0, -pkg.h / 2 - 0.04, 0]}>
        <boxGeometry args={[pkg.w + 0.7, 0.08, pkg.d + 0.7]} />
        <meshStandardMaterial color="#07090e" metalness={0.68} roughness={0.4} />
      </mesh>
      <mesh position={[0, -pkg.h / 2, 0]}>
        <boxGeometry args={[pkg.w, pkg.h, pkg.d]} />
        <meshStandardMaterial
          color={accent === "cpu" ? "#1a1410" : "#0b1416"}
          metalness={0.7}
          roughness={0.34}
          map={map ?? undefined}
        />
      </mesh>
      <SolderBumps width={pkg.w} depth={pkg.d} density={detail === "high" ? 16 : 11} />
      <TraceNet accent={accent} width={pkg.w - 0.5} depth={pkg.d - 0.5} />
      {blocks.map((block) => (
        <DieModule
          key={block.id}
          block={block}
          accent={accent}
          glow={glow}
          map={map}
          active={block.partId === activeId}
          interactive={interactive}
          detail={detail}
          showLabel={showBlockLabels}
          onSelect={onSelect}
        />
      ))}
      {nameplate ? (
        <HoloLabel text={nameplate} position={[0, 2.55, 0]} color={glow} size={0.4} />
      ) : null}
      {nameplateSub ? (
        <HoloLabel text={nameplateSub} position={[0, 2.12, 0]} color={glow} size={0.14} opacity={0.8} />
      ) : null}
    </group>
  );
}

function DieModule({
  block,
  accent,
  glow,
  map,
  active,
  interactive,
  detail,
  showLabel,
  onSelect,
}: {
  block: DieBlock;
  accent: "cpu" | "gpu";
  glow: string;
  map: THREE.CanvasTexture | null;
  active: boolean;
  interactive: boolean;
  detail: "high" | "medium";
  showLabel: boolean;
  onSelect?: (partId: string) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered && interactive);

  useFrame((_, dt) => {
    if (!group.current) return;
    const target = active ? 0.2 : hovered ? 0.08 : 0;
    const y = group.current.position.y;
    if (Math.abs(y - target) < 0.0008) return;
    group.current.position.y = y + (target - y) * Math.min(1, dt * 10);
  });

  return (
    <group ref={group} position={[block.x, 0.02, block.z]}>
      <mesh
        position={[0, block.h / 2, 0]}
        onClick={(event) => {
          if (!interactive) return;
          event.stopPropagation();
          onSelect?.(block.partId);
        }}
        onPointerOver={(event) => {
          if (!interactive) return;
          event.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[block.w, block.h, block.d]} />
        <meshStandardMaterial
          color={active ? glow : kindTint[block.kind]}
          map={active ? null : map}
          roughness={active ? 0.2 : 0.38}
          metalness={active ? 0.82 : 0.58}
          emissive={glow}
          emissiveIntensity={active ? 0.55 : hovered ? 0.18 : 0.05}
        />
      </mesh>
      {block.kind === "stack" ? <HbmStack width={block.w} depth={block.d} glow={glow} /> : null}
      {(block.kind === "core" || block.kind === "array") && detail === "high" ? (
        <MicroCells width={block.w} depth={block.d} y={block.h + 0.01} accent={accent} />
      ) : null}
      {block.kind === "cache" && detail === "high" ? (
        <CacheStripes width={block.w} depth={block.d} y={block.h + 0.012} glow={glow} />
      ) : null}
      {showLabel ? (
        <HoloLabel
          text={block.label}
          position={[0, block.h + 0.28, 0]}
          color={glow}
          size={active ? 0.15 : 0.11}
          opacity={active ? 1 : 0.72}
        />
      ) : null}
    </group>
  );
}

function MicroCells({
  width,
  depth,
  y,
  accent,
}: {
  width: number;
  depth: number;
  y: number;
  accent: "cpu" | "gpu";
}) {
  const cols = 7;
  const rows = 5;
  const count = cols * rows;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = accent === "cpu" ? "#c4924c" : "#4fd6ea";

  useLayoutEffect(() => {
    if (!mesh.current) return;
    const gapX = width / cols;
    const gapZ = depth / rows;
    let i = 0;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        dummy.position.set(-width / 2 + gapX * (c + 0.5), y, -depth / 2 + gapZ * (r + 0.5));
        dummy.scale.set(gapX * 0.7, r % 3 === 0 ? 1.8 : 1, gapZ * 0.58);
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
        i += 1;
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [dummy, width, depth, y]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <boxGeometry args={[0.08, 0.016, 0.06]} />
      <meshBasicMaterial color={color} transparent opacity={0.85} />
    </instancedMesh>
  );
}

function CacheStripes({
  width,
  depth,
  y,
  glow,
}: {
  width: number;
  depth: number;
  y: number;
  glow: string;
}) {
  const n = Math.min(10, Math.max(5, Math.floor(width * 2.2)));
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    const step = width / n;
    for (let i = 0; i < n; i += 1) {
      dummy.position.set(-width / 2 + step * (i + 0.5), y, 0);
      dummy.scale.set(Math.max(0.2, step - 0.04) / 0.12, 1, depth * 0.82);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [dummy, n, width, depth, y]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, n]}>
      <boxGeometry args={[0.12, 0.012, 1]} />
      <meshBasicMaterial color={glow} transparent opacity={0.28} />
    </instancedMesh>
  );
}

function HbmStack({ width, depth, glow }: { width: number; depth: number; glow: string }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    for (let i = 0; i < 6; i += 1) {
      dummy.position.set(0, 0.16 + i * 0.08, 0);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, 6]}>
      <boxGeometry args={[width * 0.9, 0.038, depth * 0.94]} />
      <meshStandardMaterial color="#1f2824" metalness={0.72} roughness={0.28} emissive={glow} emissiveIntensity={0.06} />
    </instancedMesh>
  );
}

function TraceNet({
  accent,
  width,
  depth,
}: {
  accent: "cpu" | "gpu";
  width: number;
  depth: number;
}) {
  const geometry = useMemo(() => {
    const pts: number[] = [];
    const step = 0.7;
    for (let x = -width / 2; x <= width / 2; x += step) {
      pts.push(x, 0.09, -depth / 2, x, 0.09, depth / 2);
    }
    for (let z = -depth / 2; z <= depth / 2; z += step) {
      pts.push(-width / 2, 0.09, z, width / 2, 0.09, z);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, [width, depth]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={accent === "cpu" ? "#e8b86d" : "#6ee7ff"} transparent opacity={0.14} />
    </lineSegments>
  );
}

function SolderBumps({
  width,
  depth,
  density,
}: {
  width: number;
  depth: number;
  density: number;
}) {
  const cols = density;
  const rows = Math.max(8, Math.round(density * 0.8));
  const count = cols * rows;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    let i = 0;
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        dummy.position.set(
          -width / 2 + 0.3 + (c * (width - 0.6)) / (cols - 1),
          -0.2,
          -depth / 2 + 0.3 + (r * (depth - 0.6)) / (rows - 1),
        );
        dummy.updateMatrix();
        mesh.current.setMatrixAt(i, dummy.matrix);
        i += 1;
      }
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [cols, rows, dummy, width, depth]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.03, 5, 5]} />
      <meshStandardMaterial color="#d7b57a" roughness={0.22} metalness={0.9} />
    </instancedMesh>
  );
}
