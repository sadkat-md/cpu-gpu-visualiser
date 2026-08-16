# Silicon Atlas

An interactive CPU and GPU visualiser for inference engineers. Click a block on the die, read what it is, how it works, and why it shows up in a prefill or decode trace.

Built with **Next.js 16.3**, **TypeScript 7**, and **Three.js** (React Three Fiber) for the interactive dies.

## Labs

- **CPU die** — cores, frontend, branch predictor, AMX/SME, SIMD, ROB, caches, IMC, PCIe, mesh, SMT
- **GPU die** — SMs, warps, tensor cores, TMA, TMEM, HBM, L2, NVLink
- **Pipeline** — host → H2D → prefill → KV write → decode → sample → D2H, with batch / context / precision knobs
- **Memory** — registers through IB, with latency bars
- **Compare** — CPU vs GPU paired ideas and a roofline sketch

Numbers are typical modern-server orders of magnitude, not a datasheet for one SKU.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run typecheck
npm run build
```

Type checking uses the TypeScript 7 native `tsc` CLI (Next.js 16.3 default).
