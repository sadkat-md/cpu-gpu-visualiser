import type { CompareRow } from "./types";

export const compareRows: CompareRow[] = [
  {
    topic: "What a 'core' is",
    cpu: "A wide out-of-order machine that runs one or two threads very well. Speculation, a ROB, and a branch predictor keep a single PC busy.",
    gpu: "An SM that runs tens of warps of 32 threads. No deep speculation. Latency is hidden by having someone else to issue.",
    takeaway: "CPUs win irregular single-request work. GPUs win when you can show up with a grid.",
  },
  {
    topic: "How math is wide",
    cpu: "AVX-512 / SVE plus AMX/SME tiles. Width is tens of lanes, or a small matrix tile per core.",
    gpu: "Tensor cores do large tiled MMA across a warp or warpgroup. Peak is measured in petaflops of low-precision MMA.",
    takeaway: "Same idea (tiles), two scales. AMX is a tensor core you can book per request; an H100 is a warehouse of them.",
  },
  {
    topic: "Hiding memory latency",
    cpu: "Out-of-order window of a few hundred µops. A DRAM miss can stall the ROB.",
    gpu: "Switch among resident warps. Hundreds of cycles of HBM look free if occupancy is real.",
    takeaway: "A GPU kernel that does not launch enough warps becomes a bad CPU.",
  },
  {
    topic: "On-die SRAM",
    cpu: "L1/L2 private, L3 shared and coherent across cores. Great for shared weights on one socket.",
    gpu: "Giant register file + software shared memory + a big but non-CPU-coherent L2.",
    takeaway: "CPU caches are automatic and coherent. GPU scratch is explicit and faster when you use it.",
  },
  {
    topic: "Off-die bandwidth",
    cpu: "DDR5 hundreds of GB/s, or HBM on a few SKUs. Capacity is the superpower (terabytes).",
    gpu: "HBM at 3–8 TB/s, capacity tens to low hundreds of GB.",
    takeaway: "Decode is a bandwidth tax. GPU pays it faster; CPU can hold more sessions in DRAM.",
  },
  {
    topic: "Prefill",
    cpu: "AMX/SME GEMM, good up to modest sizes if the working set stays in L2/L3.",
    gpu: "The happy path. Fat GEMMs and flash-attention saturate tensor cores.",
    takeaway: "Long prompts belong on the GPU unless the model is small or already in CPU cache.",
  },
  {
    topic: "Decode / batch-1",
    cpu: "Honest. You stream weights from DDR. Fine for small quantized models and local tools.",
    gpu: "Uncomfortable. Skinny GEMMs underfill MMA. You batch, speculate, or quantize to buy utilization.",
    takeaway: "Batch-1 is not the GPU's religion. Serving stacks exist to lie to the hardware about batch size.",
  },
  {
    topic: "Control flow",
    cpu: "Branch predictor + speculation. Tokenizers, routers, grammar samplers feel at home.",
    gpu: "Divergent warps waste lanes. Keep kernels uniform; put messy policy on the host.",
    takeaway: "If it looks like Python, it probably wants a CPU. If it looks like a GEMM, it wants a GPU.",
  },
  {
    topic: "Connecting devices",
    cpu: "PCIe root, CXL, UPI/IF, C2C. The host of the system.",
    gpu: "NVLink/NVSwitch among peers; PCIe or C2C back to the host.",
    takeaway: "Tensor-parallel decode is a fabric problem. Placement is part of the model.",
  },
  {
    topic: "When to pick it",
    cpu: "Orchestration, tokenization, tiny/quantized models, draft models, huge KV in DRAM, edge boxes, idle-sensitive cost.",
    gpu: "Anything with real prefill, batched decode, large dense/MoE experts, training-adjacent serving.",
    takeaway: "Most production stacks use both: CPU as the conductor, GPU as the orchestra.",
  },
];

export const rooflinePoints = {
  cpu: {
    peakFlops: 20,
    peakBw: 0.4,
    label: "CPU socket · AMX INT8 / DDR5",
  },
  gpu: {
    peakFlops: 1000,
    peakBw: 3.35,
    label: "H100-class · dense fp16 tensor / HBM",
  },
} as const;
