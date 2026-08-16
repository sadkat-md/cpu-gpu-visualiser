import { DieExplorer } from "@/components/die-explorer";
import { gpuParts, gpuTour } from "@/data/gpu";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GPU die",
  description: "Interactive holographic GPU die for inference engineers.",
};

export default function GpuPage() {
  return (
    <DieExplorer
      accent="gpu"
      parts={gpuParts}
      tour={gpuTour}
      eyebrow="GPU · SIMT · HBM"
      title="Throughput machine"
    />
  );
}
