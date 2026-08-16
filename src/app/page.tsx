import Link from "next/link";
import { HeroDiesLazy } from "@/components/three/lazy";

const labs = [
  { href: "/cpu" as const, id: "01", title: "CPU", copy: "Latency machine" },
  { href: "/gpu" as const, id: "02", title: "GPU", copy: "Throughput machine" },
  { href: "/pipeline" as const, id: "03", title: "Pipeline", copy: "Token itinerary" },
  { href: "/memory" as const, id: "04", title: "Memory", copy: "Byte geography" },
  { href: "/compare" as const, id: "05", title: "Compare", copy: "Dual lock" },
];

export default function Home() {
  return (
    <div className="viewport">
      <HeroDiesLazy />
      <div className="hud-layer pointer-events-none">
        <div className="pointer-events-auto absolute left-4 top-16 max-w-md sm:left-8 sm:top-20">
          <p className="kicker text-[#6ee7ff]">Holo-analysis · inference silicon</p>
          <h1 className="mt-3 text-4xl font-medium leading-[0.96] tracking-tight sm:text-6xl">
            Project the die.
            <br />
            <span className="text-[#6ee7ff]">Read the token.</span>
          </h1>
          <p className="mt-4 max-w-sm text-[14px] leading-7 text-muted">
            Click a package. Orbit. Lock a block. The briefing writes itself.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href="/cpu" className="chip" style={{ color: "var(--cpu)", borderColor: "var(--cpu)" }}>
              Engage CPU
            </Link>
            <Link href="/gpu" className="chip" style={{ color: "var(--gpu)", borderColor: "var(--gpu)" }}>
              Engage GPU
            </Link>
          </div>
        </div>

        <div className="pointer-events-auto absolute inset-x-4 bottom-8 grid grid-cols-5 gap-px border border-line/80 bg-line/80 sm:inset-x-8">
          {labs.map((lab) => (
            <Link
              key={lab.href}
              href={lab.href}
              className="bg-[#02060c]/80 px-3 py-3 backdrop-blur-md transition-colors hover:bg-[#062028]"
            >
              <p className="font-mono text-[10px] tracking-[0.18em] text-[#6ee7ff]">{lab.id}</p>
              <p className="mt-1 font-mono text-[12px] tracking-[0.14em]">{lab.title}</p>
              <p className="mt-1 hidden text-[11px] text-muted sm:block">{lab.copy}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
