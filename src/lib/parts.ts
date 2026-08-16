import type { Part } from "@/data/types";

export function findPart(parts: Part[], id: string): Part {
  return parts.find((part) => part.id === id) ?? parts[0] ?? {
    id: "unknown",
    name: "Unknown block",
    short: "—",
    category: "System",
    accent: "sys",
    what: "No part is locked.",
    how: "",
    inference: "",
    watch: "",
    specs: [],
  };
}
