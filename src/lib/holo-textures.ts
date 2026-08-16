import * as THREE from "three";

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export function createSiliconMap(kind: "cpu" | "gpu"): THREE.CanvasTexture {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }

  const base = kind === "cpu" ? "#1c1612" : "#0b1618";
  const metalA = kind === "cpu" ? "#8a6a3e" : "#2a6d78";
  const metalB = kind === "cpu" ? "#c4a06a" : "#5ee0ff";
  const metalC = kind === "cpu" ? "#3a2a1c" : "#12343a";
  const via = kind === "cpu" ? "#e8d2a8" : "#b8f6ff";

  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 90; i += 1) {
    const x = hash(i + 1) * size;
    const y = hash(i + 3) * size;
    const w = 18 + hash(i + 5) * 90;
    const h = 8 + hash(i + 7) * 40;
    ctx.fillStyle = i % 3 === 0 ? metalA : metalC;
    ctx.globalAlpha = 0.28 + hash(i + 9) * 0.35;
    ctx.fillRect(x, y, w, h);
  }

  ctx.globalAlpha = 0.22;
  ctx.strokeStyle = metalB;
  ctx.lineWidth = 1;
  for (let i = 0; i < 48; i += 1) {
    const y = hash(i + 21) * size;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y + (hash(i + 22) - 0.5) * 30);
    ctx.stroke();
  }
  for (let i = 0; i < 36; i += 1) {
    const x = hash(i + 41) * size;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (hash(i + 42) - 0.5) * 24, size);
    ctx.stroke();
  }

  ctx.globalAlpha = 0.55;
  ctx.fillStyle = via;
  for (let i = 0; i < 1400; i += 1) {
    const x = hash(i + 80) * size;
    const y = hash(i + 180) * size;
    ctx.fillRect(x, y, 1.2, 1.2);
  }

  ctx.globalAlpha = 0.35;
  ctx.strokeStyle = kind === "cpu" ? "#e8b86d" : "#6ee7ff";
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, size - 20, size - 20);
  ctx.lineWidth = 2;
  ctx.strokeRect(22, 22, size - 44, size - 44);

  ctx.globalAlpha = 0.12;
  ctx.fillStyle = "#ffffff";
  for (let y = 0; y < size; y += 28) {
    ctx.fillRect(0, y, size, 1);
  }

  ctx.globalAlpha = 1;
  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

export function createNormalHatch(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }
  ctx.fillStyle = "#8080ff";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "#a0a0ff";
  ctx.lineWidth = 1;
  for (let i = 0; i < size; i += 8) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
