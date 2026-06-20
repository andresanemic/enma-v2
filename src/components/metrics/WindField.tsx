"use client";

import { useEffect, useRef } from "react";

// Campo de flujo generativo (líneas de viento / CFD) en canvas.
// - Las partículas siguen un campo vectorial (suma de senos) sesgado hacia la
//   derecha → streamlines que ondulan como viento.
// - El cursor (solo pointer fino) deflecta las líneas a su alrededor.
// - Se pausa fuera de viewport (IO) y respeta prefers-reduced-motion.
// Paleta cálida protagonista + teal/green como chispa (coherente con la sección).
const PALETTE = [
  "254,169,79", // orange
  "254,169,79",
  "241,84,28", // ember
  "248,237,221", // cream
  "84,192,168", // teal brillante
  "124,195,138", // green brillante
];

export default function WindField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduce) return; // sin animación → queda el fondo/gradiente de la sección

    type P = {
      x: number; y: number; speed: number; color: string; alpha: number;
      trail: { x: number; y: number }[]; len: number;
    };

    let w = 0, h = 0, dpr = 1;
    let particles: P[] = [];
    let raf = 0;
    let running = false;
    let t = 0;
    const mouse = { x: -9999, y: -9999, active: false };

    const pickColor = () => PALETTE[(Math.random() * PALETTE.length) | 0];

    const spawn = (anywhere: boolean): P => ({
      x: anywhere ? Math.random() * w : -20 - Math.random() * 80,
      y: Math.random() * h,
      speed: 0.5 + Math.random() * 1.1,
      color: pickColor(),
      alpha: 0.1 + Math.random() * 0.22,
      trail: [],
      len: 8 + ((Math.random() * 10) | 0),
    });

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (w === 0 || h === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.max(60, Math.min(w / 8, 180)));
      particles = new Array(count).fill(0).map(() => spawn(true));
    };

    // Campo: ángulo (alrededor de 0 = derecha) que ondula con el tiempo.
    const field = (x: number, y: number, time: number) =>
      -0.05 +
      0.55 * Math.sin(y * 0.0016 + time * 0.00022) +
      0.35 * Math.sin(x * 0.0021 - time * 0.00021) +
      0.18 * Math.sin((x + y) * 0.0013 + time * 0.0003);

    const step = () => {
      t += 16;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        const a = field(p.x, p.y, t);
        let vx = Math.cos(a) * p.speed * 1.5 + p.speed * 1.2; // sesgo a la derecha
        let vy = Math.sin(a) * p.speed * 1.6;

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          const R = 140;
          if (d2 < R * R) {
            const d = Math.sqrt(d2) || 1;
            const force = ((R - d) / R) * 3.4;
            vx += (dx / d) * force;
            vy += (dy / d) * force;
          }
        }

        p.x += vx;
        p.y += vy;
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > p.len) p.trail.shift();

        const tr = p.trail;
        for (let i = 1; i < tr.length; i++) {
          const aa = p.alpha * (i / tr.length);
          ctx.strokeStyle = `rgba(${p.color},${aa})`;
          ctx.lineWidth = (i / tr.length) * 1.6 + 0.25;
          ctx.beginPath();
          ctx.moveTo(tr[i - 1].x, tr[i - 1].y);
          ctx.lineTo(tr[i].x, tr[i].y);
          ctx.stroke();
        }

        if (p.x > w + 40 || p.y < -50 || p.y > h + 50) Object.assign(p, spawn(false));
      }
      raf = requestAnimationFrame(step);
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(step);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    // Pointer (solo fino) → deflexión
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      if (mx >= 0 && mx <= r.width && my >= 0 && my <= r.height) {
        mouse.x = mx;
        mouse.y = my;
        mouse.active = true;
      } else {
        mouse.active = false;
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    // Pausar fuera de viewport
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) start();
        else stop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    if (finePointer) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      if (finePointer) window.removeEventListener("pointermove", onMove);
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
