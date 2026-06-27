"use client";

import { useEffect, useRef } from "react";

// Nieve fina a la deriva para la sección Métricas (reemplaza al efecto anterior).
// Ambiente frío y calmo, coherente con la sección "dark": motas pequeñas que caen
// lento con leve vaivén lateral (viento) y profundidad por capas (las grandes caen
// algo más rápido y opacas; las diminutas, lentas y tenues).
// - Se pausa fuera de viewport (IntersectionObserver) y respeta prefers-reduced-
//   motion (un esparcido estático, sin animación).
// Paleta fría: blancos-cielo y un crema escaso (sin naranjas → no rompe el frío).
const PALETTE = [
  "236,244,247", // blanco-cielo
  "236,244,247",
  "207,224,230", // azul-cielo pálido
  "183,206,214", // teal claro
  "248,237,221", // crema escaso
];

export default function SnowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Flake = {
      x: number; y: number; r: number; vy: number;
      sway: number; phase: number; freq: number; drift: number;
      color: string; alpha: number;
    };

    let w = 0, h = 0, dpr = 1;
    let flakes: Flake[] = [];
    let raf = 0;
    let running = false;

    const pickColor = () => PALETTE[(Math.random() * PALETTE.length) | 0];

    const spawn = (anywhere: boolean): Flake => {
      const r = 0.5 + Math.random() * 1.7; // tamaño
      const depth = (r - 0.5) / 1.7; // 0 (fondo) → 1 (frente)
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : -8 - Math.random() * 40,
        r,
        vy: 0.16 + depth * 0.42 + Math.random() * 0.1, // las grandes caen algo más rápido
        sway: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        freq: 0.006 + Math.random() * 0.01,
        drift: 0.06 + depth * 0.22, // leve deriva lateral (viento)
        color: pickColor(),
        alpha: 0.14 + depth * 0.42,
      };
    };

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Cantidad sobria (nieve fina, no ventisca).
      const count = Math.round(Math.max(40, Math.min(w / 14, 90)));
      flakes = new Array(count).fill(0).map(() => spawn(true));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        f.y += f.vy;
        f.phase += f.freq * 16;
        f.x += Math.sin(f.phase) * f.sway * 0.35 + f.drift; // vaivén + deriva
        if (f.y > h + 8 || f.x > w + 12) Object.assign(f, spawn(false));
        ctx.beginPath();
        ctx.fillStyle = `rgba(${f.color},${f.alpha})`;
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const staticDraw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const f of flakes) {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${f.color},${f.alpha})`;
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      draw();
      raf = requestAnimationFrame(step);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) staticDraw();
    });
    ro.observe(canvas);
    resize();

    if (reduce) {
      staticDraw();
      return () => { ro.disconnect(); };
    }

    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) start(); else stop(); },
      { threshold: 0 }
    );
    io.observe(canvas);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
