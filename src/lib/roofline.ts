import { modelPresets, quantBytes, type ModelId, type Quant } from "@/data/pipeline";

export function estimateStep(input: {
  modelId: ModelId;
  batch: number;
  seq: number;
  quant: Quant;
  mode: "prefill" | "decode";
}) {
  const model = modelPresets.find((item) => item.id === input.modelId) ?? modelPresets[0];
  const bytesW = quantBytes[input.quant];
  const params = model.paramsB * 1e9;
  const weightBytes = params * bytesW;

  const kvBytesPerToken =
    2 * model.layers * model.kvHeads * model.headDim * 2 * input.batch;

  if (input.mode === "prefill") {
    const flops = 2 * params * input.seq * input.batch;
    const bytes = weightBytes + kvBytesPerToken * input.seq * 0.5;
    return { flops, bytes, ai: flops / bytes, weightBytes, kvBytesPerToken };
  }

  const flops = 2 * params * input.batch;
  const bytes = weightBytes + kvBytesPerToken * input.seq;
  return { flops, bytes, ai: flops / bytes, weightBytes, kvBytesPerToken };
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(2)} TB`;
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)} MB`;
  if (bytes >= 1e3) return `${(bytes / 1e3).toFixed(0)} KB`;
  return `${bytes.toFixed(0)} B`;
}

export function formatFlops(flops: number): string {
  if (flops >= 1e15) return `${(flops / 1e15).toFixed(2)} PFLOP`;
  if (flops >= 1e12) return `${(flops / 1e12).toFixed(1)} TFLOP`;
  if (flops >= 1e9) return `${(flops / 1e9).toFixed(1)} GFLOP`;
  return `${(flops / 1e6).toFixed(0)} MFLOP`;
}

export function bottleneck(ai: number, ridge: number): "compute" | "memory" {
  return ai >= ridge ? "compute" : "memory";
}
