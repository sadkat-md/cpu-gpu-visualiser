"use client";

import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { HoloRig } from "@/components/three/holo-fx";

export function HoloCanvas({
  accent,
  children,
  camera = [7.2, 6.2, 8.2],
  minDistance = 7,
  maxDistance = 18,
  autoRotate = false,
}: {
  accent: "cpu" | "gpu";
  children: ReactNode;
  camera?: [number, number, number];
  minDistance?: number;
  maxDistance?: number;
  autoRotate?: boolean;
}) {
  const [webgl, setWebgl] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const ok = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
      setWebgl(ok);
    } catch {
      setWebgl(false);
    }
  }, []);

  if (!webgl) {
    return (
      <div className="grid h-full place-items-center px-6 text-center">
        <p className="font-mono text-[12px] tracking-[0.16em] text-[#6ee7ff]">
          WEBGL REQUIRED TO PROJECT THE DIE
        </p>
      </div>
    );
  }

  return (
    <>
      <Canvas
        camera={{ position: camera, fov: 32, near: 0.1, far: 70 }}
        dpr={[1, 1.25]}
        performance={{ min: 0.5, max: 1, debounce: 120 }}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        style={{ position: "absolute", inset: 0, touchAction: "none" }}
      >
        <Suspense fallback={null}>
          <HoloRig accent={accent} />
          {children}
          <OrbitControls
            makeDefault
            enablePan={false}
            minPolarAngle={0.48}
            maxPolarAngle={1.25}
            minDistance={minDistance}
            maxDistance={maxDistance}
            enableDamping
            dampingFactor={0.08}
            autoRotate={autoRotate}
            autoRotateSpeed={0.28}
            rotateSpeed={0.7}
          />
        </Suspense>
      </Canvas>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(2,6,12,0.78)_100%)]" />
    </>
  );
}
