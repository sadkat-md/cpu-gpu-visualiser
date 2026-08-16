import type { DieRegion } from "@/data/types";

export type DieBlock = {
  id: string;
  partId: string;
  label: string;
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  kind: DieRegion["kind"];
};

export const cpuDieBlocks: DieBlock[] = [
  { id: "imc", partId: "imc", label: "IMC", x: -3.15, z: 3.55, w: 2.85, d: 0.95, h: 0.2, kind: "io" },
  { id: "mesh", partId: "mesh", label: "Mesh", x: 0, z: 3.55, w: 2.85, d: 0.95, h: 0.16, kind: "fabric" },
  { id: "pcie", partId: "pcie", label: "PCIe", x: 3.15, z: 3.55, w: 2.85, d: 0.95, h: 0.2, kind: "io" },
  { id: "c0", partId: "core", label: "Core 0", x: -3.15, z: 1.85, w: 1.9, d: 1.75, h: 0.34, kind: "core" },
  { id: "c1", partId: "core", label: "Core 1", x: -1.05, z: 1.85, w: 1.9, d: 1.75, h: 0.34, kind: "core" },
  { id: "fe", partId: "frontend", label: "Frontend", x: 1.05, z: 1.85, w: 1.9, d: 1.75, h: 0.3, kind: "core" },
  { id: "bp", partId: "bpred", label: "BPred", x: 3.15, z: 1.85, w: 1.9, d: 1.75, h: 0.3, kind: "core" },
  { id: "l3a", partId: "l3", label: "L3", x: -2.1, z: 0.35, w: 4.0, d: 0.62, h: 0.14, kind: "cache" },
  { id: "l3b", partId: "l3", label: "L3", x: 2.1, z: 0.35, w: 4.0, d: 0.62, h: 0.14, kind: "cache" },
  { id: "c4", partId: "core", label: "Core 4", x: -3.15, z: -1.15, w: 1.9, d: 1.75, h: 0.34, kind: "core" },
  { id: "alu", partId: "alu", label: "ALU", x: -1.05, z: -1.15, w: 1.9, d: 1.75, h: 0.3, kind: "core" },
  { id: "simd", partId: "simd", label: "SIMD", x: 1.05, z: -1.15, w: 1.9, d: 1.75, h: 0.32, kind: "core" },
  { id: "amx", partId: "amx", label: "AMX", x: 3.15, z: -1.15, w: 1.9, d: 1.75, h: 0.36, kind: "core" },
  { id: "l1", partId: "l1", label: "L1", x: -3.15, z: -2.9, w: 1.9, d: 1.0, h: 0.18, kind: "cache" },
  { id: "l2", partId: "l2", label: "L2", x: -1.05, z: -2.9, w: 1.9, d: 1.0, h: 0.2, kind: "cache" },
  { id: "pf", partId: "prefetch", label: "Prefetch", x: 1.05, z: -2.9, w: 1.9, d: 1.0, h: 0.18, kind: "io" },
  { id: "smt", partId: "smt", label: "SMT", x: 3.15, z: -2.9, w: 1.9, d: 1.0, h: 0.18, kind: "io" },
  { id: "rob", partId: "rob", label: "ROB", x: 0, z: -4.15, w: 8.2, d: 0.72, h: 0.16, kind: "core" },
];

const gpuSpecial: Record<string, { partId: string; label: string; kind: DieRegion["kind"]; h: number }> = {
  "0-0": { partId: "gpc", label: "GPC", kind: "array", h: 0.26 },
  "0-1": { partId: "sm", label: "SM", kind: "array", h: 0.3 },
  "0-2": { partId: "sm", label: "SM", kind: "array", h: 0.3 },
  "0-3": { partId: "sfu", label: "SFU", kind: "core", h: 0.22 },
  "1-0": { partId: "warp", label: "Warp", kind: "core", h: 0.26 },
  "1-1": { partId: "cuda", label: "CUDA", kind: "core", h: 0.26 },
  "1-2": { partId: "tensor", label: "Tensor", kind: "core", h: 0.38 },
  "1-3": { partId: "tmem", label: "TMEM", kind: "cache", h: 0.22 },
  "2-0": { partId: "regs", label: "Regs", kind: "cache", h: 0.2 },
  "2-1": { partId: "smem", label: "SMem", kind: "cache", h: 0.22 },
  "2-2": { partId: "tma", label: "TMA", kind: "io", h: 0.24 },
  "2-3": { partId: "sm", label: "SM", kind: "array", h: 0.3 },
  "3-0": { partId: "ldst", label: "LD/ST", kind: "io", h: 0.18 },
  "3-1": { partId: "nvlink", label: "NVLink", kind: "fabric", h: 0.2 },
  "3-2": { partId: "gpu-pcie", label: "PCIe", kind: "io", h: 0.18 },
  "3-3": { partId: "sm", label: "SM", kind: "array", h: 0.3 },
};

function gpuSmGrid(): DieBlock[] {
  const blocks: DieBlock[] = [];
  const cols = 4;
  const rows = 4;
  const w = 1.55;
  const d = 1.22;
  const ox = -2.4;
  const oz = 2.35;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const spec = gpuSpecial[`${r}-${c}`] ?? {
        partId: "sm",
        label: "SM",
        kind: "array" as const,
        h: 0.28,
      };
      blocks.push({
        id: `sm-${r}-${c}`,
        partId: spec.partId,
        label: spec.label,
        x: ox + c * 1.62,
        z: oz - r * 1.32,
        w,
        d,
        h: spec.h,
        kind: spec.kind,
      });
    }
  }
  return blocks;
}

export const gpuDieBlocks: DieBlock[] = [
  { id: "hbm0", partId: "hbm", label: "HBM 0", x: -4.85, z: 0.2, w: 1.05, d: 7.6, h: 0.7, kind: "stack" },
  { id: "hbm1", partId: "hbm", label: "HBM 1", x: 4.85, z: 0.2, w: 1.05, d: 7.6, h: 0.7, kind: "stack" },
  ...gpuSmGrid(),
  { id: "l2", partId: "l2", label: "L2", x: 0.05, z: -3.55, w: 6.6, d: 0.72, h: 0.15, kind: "cache" },
];

export const diePackage = {
  cpu: { w: 10.2, d: 10.2, h: 0.15 },
  gpu: { w: 11.6, d: 9.5, h: 0.15 },
} as const;
