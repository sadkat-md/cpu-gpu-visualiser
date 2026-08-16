import { MemoryLab } from "@/components/memory-lab";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Memory hierarchy",
  description: "Holographic memory stack from registers to the network.",
};

export default function MemoryPage() {
  return <MemoryLab />;
}
