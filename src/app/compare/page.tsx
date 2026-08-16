import { CompareLab } from "@/components/compare-lab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CPU vs GPU",
  description: "Holographic dual-lock comparison of CPU and GPU for inference.",
};

export default function ComparePage() {
  return <CompareLab />;
}
