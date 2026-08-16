"use client";

import dynamic from "next/dynamic";
import { StageSkeleton } from "@/components/three/die-stage";

export const DieStageLazy = dynamic(
  () => import("@/components/three/die-stage").then((mod) => mod.DieStage),
  { ssr: false, loading: () => <StageSkeleton /> },
);

export const HeroDiesLazy = dynamic(
  () => import("@/components/three/hero-dies").then((mod) => mod.HeroDies),
  { ssr: false, loading: () => <StageSkeleton /> },
);

export const MemoryTowerLazy = dynamic(
  () => import("@/components/three/memory-tower").then((mod) => mod.MemoryTower),
  { ssr: false, loading: () => <StageSkeleton /> },
);

export const PipelineSceneLazy = dynamic(
  () => import("@/components/three/pipeline-scene").then((mod) => mod.PipelineScene),
  { ssr: false, loading: () => <StageSkeleton /> },
);

export const CompareSceneLazy = dynamic(
  () => import("@/components/three/compare-scene").then((mod) => mod.CompareScene),
  { ssr: false, loading: () => <StageSkeleton /> },
);
