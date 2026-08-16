"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  modelPresets,
  pipelineStages,
  type ModelId,
  type Quant,
} from "@/data/pipeline";
import { bottleneck, estimateStep, formatBytes, formatFlops } from "@/lib/roofline";
import { PipelineSceneLazy } from "@/components/three/lazy";

const batches = [1, 4, 16, 64] as const;
const seqs = [512, 2048, 8192, 32768] as const;
const quants: Quant[] = ["fp16", "fp8", "int8", "fp4"];

export function PipelineLab() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [modelId, setModelId] = useState<ModelId>("70b");
  const [batch, setBatch] = useState<(typeof batches)[number]>(4);
  const [seq, setSeq] = useState<(typeof seqs)[number]>(2048);
  const [quant, setQuant] = useState<Quant>("fp8");

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setStep((value) => (value + 1) % pipelineStages.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [playing]);

  const prefill = useMemo(
    () => estimateStep({ modelId, batch, seq, quant, mode: "prefill" }),
    [modelId, batch, seq, quant],
  );
  const decode = useMemo(
    () => estimateStep({ modelId, batch, seq, quant, mode: "decode" }),
    [modelId, batch, seq, quant],
  );

  const ridge = 300;
  const active = pipelineStages[step] ?? pipelineStages[0];
  const prefillBound = bottleneck(prefill.ai, ridge);
  const decodeBound = bottleneck(decode.ai, ridge);

  return (
    <div>
    <div className="viewport">
      <PipelineSceneLazy
        step={step}
        onSelect={(index) => {
          setPlaying(false);
          setStep(index);
        }}
      />
      <div className="hud-layer pointer-events-none">
        <div className="pointer-events-auto absolute left-4 top-16 max-w-sm sm:left-6 sm:top-[4.5rem]">
          <p className="kicker text-[#6ee7ff]">Runtime · prefill · decode</p>
          <h1 className="mt-1 text-2xl font-medium tracking-tight sm:text-3xl">Token path</h1>
          <button type="button" className="chip mt-3" onClick={() => setPlaying((v) => !v)}>
            {playing ? "Halt" : "Play"}
          </button>
        </div>

        <aside className="pointer-events-auto absolute right-4 top-16 hidden w-[340px] flex-col gap-2 xl:flex sm:right-6 sm:top-[4.5rem]">
          <div className="hud-glass p-4">
            <p className="kicker text-[#6ee7ff]">Now</p>
            <h2 className="mt-1 text-lg font-medium">{active.name}</h2>
            <p className="mt-2 text-[13px] leading-6 text-muted">{active.what}</p>
          </div>
          <div className="hud-glass p-4">
            <p className="kicker">Knobs</p>
            <Field label="Model">
              {modelPresets.map((model) => (
                <Chip key={model.id} on={modelId === model.id} onClick={() => setModelId(model.id)}>
                  {model.name}
                </Chip>
              ))}
            </Field>
            <Field label={`Batch ${batch}`}>
              {batches.map((value) => (
                <Chip key={value} on={batch === value} onClick={() => setBatch(value)}>
                  {value}
                </Chip>
              ))}
            </Field>
            <Field label={`Ctx ${seq >= 1000 ? `${seq / 1000}k` : seq}`}>
              {seqs.map((value) => (
                <Chip key={value} on={seq === value} onClick={() => setSeq(value)}>
                  {value >= 1000 ? `${value / 1000}k` : value}
                </Chip>
              ))}
            </Field>
            <Field label="Precision">
              {quants.map((value) => (
                <Chip key={value} on={quant === value} onClick={() => setQuant(value)}>
                  {value}
                </Chip>
              ))}
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <BoundCard title="Prefill" bound={prefillBound} ai={prefill.ai} flops={prefill.flops} bytes={prefill.bytes} />
            <BoundCard title="Decode" bound={decodeBound} ai={decode.ai} flops={decode.flops} bytes={decode.bytes} />
          </div>
        </aside>
      </div>
    </div>
      <div className="space-y-3 px-4 py-4 xl:hidden">
        <div className="hud-glass p-4">
          <p className="kicker text-[#6ee7ff]">Now</p>
          <h2 className="mt-1 text-lg font-medium">{active.name}</h2>
          <p className="mt-2 text-[13px] leading-6 text-muted">{active.what}</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-3">
      <p className="kicker mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button type="button" data-on={on} onClick={onClick} className="chip">
      {children}
    </button>
  );
}

function BoundCard({
  title,
  bound,
  ai,
  flops,
  bytes,
}: {
  title: string;
  bound: "compute" | "memory";
  ai: number;
  flops: number;
  bytes: number;
}) {
  const color = bound === "compute" ? "var(--gpu)" : "var(--cpu)";
  return (
    <div className="hud-glass p-3">
      <p className="kicker">{title}</p>
      <p className="mt-1 font-mono text-sm" style={{ color }}>
        {bound}
      </p>
      <p className="mt-2 font-mono text-[10px] text-muted">
        {ai.toFixed(1)} FLOP/B
        <br />
        {formatFlops(flops)} · {formatBytes(bytes)}
      </p>
    </div>
  );
}
