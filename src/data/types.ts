export type Accent = "cpu" | "gpu" | "sys";

export type Spec = {
  label: string;
  value: string;
};

export type Part = {
  id: string;
  name: string;
  short: string;
  category: string;
  accent: Accent;
  what: string;
  how: string;
  inference: string;
  watch: string;
  specs: Spec[];
};

export type DieRegion = {
  id: string;
  partId: string;
  label: string;
  sub?: string;
  col: string;
  row: string;
  kind: "core" | "cache" | "io" | "array" | "stack" | "fabric";
};

export type MemoryTier = {
  id: string;
  name: string;
  where: string;
  latency: string;
  capacity: string;
  bandwidth: string;
  managed: string;
  inference: string;
  accent: Accent;
};

export type PipelineStage = {
  id: string;
  name: string;
  owner: Accent;
  durationHint: string;
  what: string;
  bound: "compute" | "memory" | "latency" | "host";
  parts: string[];
};

export type CompareRow = {
  topic: string;
  cpu: string;
  gpu: string;
  takeaway: string;
};
