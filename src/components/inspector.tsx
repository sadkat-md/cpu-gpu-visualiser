import type { Part } from "@/data/types";

const sections: { key: keyof Pick<Part, "what" | "how" | "inference" | "watch">; label: string }[] =
  [
    { key: "what", label: "01  Identity" },
    { key: "how", label: "02  Mechanism" },
    { key: "inference", label: "03  Inference" },
    { key: "watch", label: "04  Anomaly" },
  ];

export function Inspector({ part, index, total }: { part: Part; index: number; total: number }) {
  const tone =
    part.accent === "cpu" ? "text-cpu" : part.accent === "gpu" ? "text-gpu" : "text-sys";

  return (
    <aside className="hud-glass flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-line px-4 py-3">
        <div>
          <p className={`kicker ${tone}`}>Target · {part.category}</p>
          <h2 className="mt-1 text-[1.05rem] font-medium tracking-tight">{part.name}</h2>
        </div>
        <p className="font-mono text-[10px] tracking-[0.16em] text-[#6ee7ff]">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
      </div>

      <dl className="grid grid-cols-3 gap-px border-b border-line bg-line/60">
        {part.specs.map((spec) => (
          <div key={spec.label} className="bg-black/20 px-2.5 py-2.5">
            <dt className="kicker">{spec.label}</dt>
            <dd className="mt-1 font-mono text-[10.5px] leading-snug text-ink">{spec.value}</dd>
          </div>
        ))}
      </dl>

      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {sections.map((section) => (
          <section key={section.key}>
            <h3 className="kicker mb-1 text-[#6ee7ff]">{section.label}</h3>
            <p className="text-[13px] leading-[1.65] text-ink/88">{part[section.key]}</p>
          </section>
        ))}
      </div>
    </aside>
  );
}
