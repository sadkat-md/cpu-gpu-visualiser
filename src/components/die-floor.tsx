"use client";

import type { DieRegion, Part } from "@/data/types";

export function DieFloor({
  title,
  subtitle,
  accent,
  regions,
  parts,
  activeId,
  onSelect,
}: {
  title: string;
  subtitle: string;
  accent: "cpu" | "gpu";
  regions: DieRegion[];
  parts: Part[];
  activeId: string;
  onSelect: (partId: string) => void;
}) {
  const byId = new Map(parts.map((part) => [part.id, part]));
  const glow = accent === "cpu" ? "rgba(240,164,106,0.55)" : "rgba(62,232,197,0.55)";

  return (
    <div className="die-substrate relative overflow-hidden rounded-2xl border border-line p-3 sm:p-4">
      <div className="scan" />
      <div className="relative mb-3 flex items-end justify-between gap-3 px-1">
        <div>
          <p className="kicker">{subtitle}</p>
          <h2 className="serif text-2xl tracking-tight">{title}</h2>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted">
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full" style={{ background: glow }} />
          live floorplan
        </div>
      </div>

      <div
        className="relative grid min-h-[420px] gap-1.5 sm:min-h-[520px]"
        style={{
          gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
          gridTemplateRows: "72px 1fr 64px 1fr 72px",
        }}
      >
        {regions.map((region) => {
          const part = byId.get(region.partId);
          if (!part) return null;
          const active = part.id === activeId;
          return (
            <button
              key={region.id}
              type="button"
              onClick={() => onSelect(part.id)}
              data-accent={part.accent}
              data-active={active}
              className="die-tile flex flex-col items-start justify-between rounded-md p-2.5 text-left sm:p-3"
              style={{ gridColumn: region.col, gridRow: region.row }}
            >
              <span className="flex w-full items-start justify-between gap-2">
                <span className="text-[13px] font-medium leading-tight">{region.label}</span>
                {region.kind === "stack" ? (
                  <span className="flex flex-col gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-1 w-4 rounded-[1px]"
                        style={{
                          background: active ? "currentColor" : "var(--line-strong)",
                          color: glow,
                          opacity: 0.35 + i * 0.12,
                        }}
                      />
                    ))}
                  </span>
                ) : (
                  <span
                    className="mt-0.5 h-1.5 w-1.5 rounded-full"
                    style={{ background: active ? glow : "var(--line-strong)" }}
                  />
                )}
              </span>
              {region.sub ? (
                <span className="font-mono text-[10px] text-muted">{region.sub}</span>
              ) : null}
              {region.kind === "core" || region.kind === "array" ? (
                <span className="mt-2 hidden w-full grid-cols-4 gap-0.5 sm:grid">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <span
                      key={i}
                      className="h-1.5 rounded-[1px]"
                      style={{
                        background:
                          i % 3 === 0
                            ? active
                              ? glow
                              : "rgba(255,255,255,0.08)"
                            : "rgba(255,255,255,0.04)",
                      }}
                    />
                  ))}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <TraceOverlay accent={accent} />
    </div>
  );
}

function TraceOverlay({ accent }: { accent: "cpu" | "gpu" }) {
  const color = accent === "cpu" ? "#f0a46a" : "#3ee8c5";
  return (
    <svg
      className="pointer-events-none absolute inset-x-6 bottom-6 top-20 hidden opacity-70 sm:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path
        id="trace-a"
        d="M 4 8 H 96"
        fill="none"
        stroke={color}
        strokeOpacity="0.18"
        strokeWidth="0.35"
      />
      <path
        id="trace-b"
        d="M 4 52 H 96"
        fill="none"
        stroke={color}
        strokeOpacity="0.16"
        strokeWidth="0.35"
      />
      <path
        id="trace-c"
        d="M 50 8 V 88"
        fill="none"
        stroke={color}
        strokeOpacity="0.12"
        strokeWidth="0.35"
      />
      {[0, 1, 2].map((i) => (
        <circle key={i} r="0.7" fill={color}>
          <animateMotion
            dur={`${3.6 + i}s`}
            repeatCount="indefinite"
            begin={`${i * 0.8}s`}
          >
            <mpath href={i === 2 ? "#trace-c" : i === 1 ? "#trace-b" : "#trace-a"} />
          </animateMotion>
        </circle>
      ))}
    </svg>
  );
}
