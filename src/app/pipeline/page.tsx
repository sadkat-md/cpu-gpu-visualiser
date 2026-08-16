import { PipelineLab } from "@/components/pipeline-lab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inference pipeline",
  description: "Holographic path of a token through host, PCIe, prefill, KV, and decode.",
};

export default function PipelinePage() {
  return <PipelineLab />;
}
