// Canvas charts for HearthLedger: a spending donut and monthly bars.
// Plain canvas 2D, no libraries, drawn at device pixel ratio so they stay crisp.

import { moneyRound } from "./format.js";

const PALETTE = [
  "#14655e", "#d9930d", "#c2502e", "#4d7c5f", "#5b7fa6",
  "#8a6d9b", "#b07d4f", "#7a8a3d", "#a34d6e", "#3f6d7a", "#97791f",
];

function setupCanvas(canvas, cssWidth, cssHeight) {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(cssWidth * ratio);
  canvas.height = Math.round(cssHeight * ratio);
  canvas.style.height = cssHeight + "px";
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return ctx;
}

export function drawDonut(canvas, slices) {
  const width = canvas.clientWidth || 320;
  const height = 300;
  const ctx = setupCanvas(canvas, width, height);
  const cx = width / 2;
  const cy = height / 2 - 6;
  const outer = Math.min(width, height) / 2 - 14;
  const inner = outer * 0.62;
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (!total) {
    ctx.fillStyle = "#5a6a72";
    ctx.font = "15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("No spending recorded yet.", cx, cy);
    return;
  }
  let angle = -Math.PI / 2;
  slices.forEach((slice, i) => {
    const sweep = (slice.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outer, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = PALETTE[i % PALETTE.length];
    ctx.fill();
    angle += sweep;
  });
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

export function drawBars(canvas, months) {
  const width = canvas.clientWidth || 640;
  const height = 260;
  const ctx = setupCanvas(canvas, width, height);
  const padLeft = 56;
  const padBottom = 30;
  const padTop = 14;
  const plotWidth = width - padLeft - 12;
  const plotHeight = height - padTop - padBottom;
  const max = Math.max(...months.map((m) => m.spentCents), 100);
  const top = Math.ceil(max / 100000) * 100000;

  ctx.strokeStyle = "#ddd3bd";
  ctx.fillStyle = "#5a6a72";
  ctx.font = "12px sans-serif";
  ctx.textAlign = "right";
  for (let grid = 0; grid <= 4; grid++) {
    const value = (top / 4) * grid;
    const y = padTop + plotHeight - (plotHeight * grid) / 4;
    ctx.beginPath();
    ctx.moveTo(padLeft, y);
    ctx.lineTo(width - 12, y);
    ctx.stroke();
    ctx.fillText(moneyRound(value), padLeft - 8, y + 4);
  }

  const slot = plotWidth / months.length;
  const barWidth = Math.min(52, slot * 0.58);
  months.forEach((month, i) => {
    const barHeight = (month.spentCents / top) * plotHeight;
    const x = padLeft + slot * i + (slot - barWidth) / 2;
    const y = padTop + plotHeight - barHeight;
    ctx.fillStyle = i === months.length - 1 ? "#d9930d" : "#14655e";
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [5, 5, 0, 0]);
    ctx.fill();
    ctx.fillStyle = "#22303c";
    ctx.font = "600 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(moneyRound(month.spentCents), x + barWidth / 2, y - 6);
    ctx.fillStyle = "#5a6a72";
    ctx.font = "12px sans-serif";
    ctx.fillText(month.short, x + barWidth / 2, height - 10);
  });
}
