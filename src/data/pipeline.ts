import type { PipelineStage } from "./types";

export const pipelineStages: PipelineStage[] = [
  {
    id: "host",
    name: "Host ingest",
    owner: "cpu",
    durationHint: "µs–ms",
    what: "The request lands on a CPU core. The runtime tokenizes, applies chat templates, looks up a prefix cache, packs the batch, and decides placement (which replica, which KV slot, draft or not).",
    bound: "host",
    parts: ["core", "frontend", "l2", "smt"],
  },
  {
    id: "h2d",
    name: "Host → device",
    owner: "sys",
    durationHint: "µs",
    what: "Only new token ids and control land on the GPU. Weights stay resident. A well-run server copies kilobytes here, not gigabytes. CUDA graphs or a persistent kernel already wait on the device.",
    bound: "latency",
    parts: ["pcie", "gpu-pcie"],
  },
  {
    id: "prefill",
    name: "Prefill",
    owner: "gpu",
    durationHint: "ms",
    what: "The prompt is a fat GEMM plus attention over the whole prefix. Arithmetic intensity is high, tensor cores should be loud, and HBM is busy but not usually the limiter on long prompts.",
    bound: "compute",
    parts: ["tensor", "smem", "tma", "sm"],
  },
  {
    id: "kvwrite",
    name: "KV write",
    owner: "gpu",
    durationHint: "µs",
    what: "K and V for the new tokens are written into the paged cache. This is a layout problem: block size, head packing, and whether the write is fused into the attention kernel.",
    bound: "memory",
    parts: ["ldst", "l2", "hbm"],
  },
  {
    id: "decode",
    name: "Decode step",
    owner: "gpu",
    durationHint: "ms / tok",
    what: "One new token, every layer: stream weights, attend over the cache, write one more KV slot. Arithmetic intensity collapses. HBM bandwidth and cache locality decide tokens/s.",
    bound: "memory",
    parts: ["hbm", "l2", "tensor", "warp"],
  },
  {
    id: "sample",
    name: "Sample",
    owner: "gpu",
    durationHint: "µs",
    what: "Logits become a token. Argmax is trivial. Nucleus / grammar / constrained decode can bounce back to the CPU if the kernel is not fused. Speculative decoding verifies a draft here.",
    bound: "latency",
    parts: ["cuda", "sfu", "core"],
  },
  {
    id: "d2h",
    name: "Device → host",
    owner: "sys",
    durationHint: "µs",
    what: "A few token ids return. Streaming to the client is a CPU/network problem again. Do not synchronize the whole device just to read one int32.",
    bound: "latency",
    parts: ["gpu-pcie", "pcie", "core"],
  },
];

export type Quant = "fp16" | "fp8" | "int8" | "fp4";

export const quantBytes: Record<Quant, number> = {
  fp16: 2,
  fp8: 1,
  int8: 1,
  fp4: 0.5,
};

export const modelPresets = [
  { id: "8b", name: "8B dense", paramsB: 8, layers: 32, kvHeads: 8, headDim: 128 },
  { id: "70b", name: "70B dense", paramsB: 70, layers: 80, kvHeads: 8, headDim: 128 },
  { id: "405b", name: "405B dense", paramsB: 405, layers: 126, kvHeads: 8, headDim: 128 },
] as const;

export type ModelId = (typeof modelPresets)[number]["id"];
