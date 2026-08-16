import { DieExplorer } from "@/components/die-explorer";
import { cpuParts, cpuTour } from "@/data/cpu";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CPU die",
  description: "Interactive holographic CPU die for inference engineers.",
};

export default function CpuPage() {
  return (
    <DieExplorer
      accent="cpu"
      parts={cpuParts}
      tour={cpuTour}
      eyebrow="CPU · out-of-order · coherent"
      title="Latency machine"
    />
  );
}
