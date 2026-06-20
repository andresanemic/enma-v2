"use client";

import { useEffect, useRef } from "react";

/**
 * FieldCursor — "Sonda en el campo".
 *
 * El cursor de Enma no es un ícono de energía: es una SONDA que perturba el
 * campo. Dos capas, coherentes con el lenguaje del sitio:
 *   1. Núcleo  — anillo de contorno + cruz hairline (sonda de medición CFD).
 *   2. Chispas — filamentos que se curvan siguiendo el MISMO campo vectorial
 *                que WindField (energía = campo de flujo). Gemela de Métricas.
 *
 * Quality floor (lore/responsive.md + animation.md):
 *   - Solo se monta con pointer fino (`matchMedia('(pointer: fine)')`). En táctil
 *     no existe → cursor nativo intacto.
 *   - `prefers-reduced-motion` → no se monta nada, cursor nativo intacto.
 *   - Un único <canvas> fijo, pointer-events:none, por encima de todo.
 *   - Tono-consciente vía [data-nav] (igual que el NavBar): adapta el color de la
 *     cruz de la sonda según la sección bajo el cursor.
 */
export default function FieldCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return; // cursor nativo intacto

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Paleta (rgb) ──────────────────────────────────────────────────────
    const EMBER = "241,84,28"; // brasa — anillo de la sonda + chispas (protagonista)
    const INK = "26,26,26"; // cruz sobre fondo claro
    const CREAM = "248,237,221"; // cruz sobre fondo oscuro

    let w = 0,
      h = 0,
      dpr = 1;

    // Estado del puntero / núcleo
    const ptr = { x: -9999, y: -9999, seen: false };
    const node = { x: -9999, y: -9999 }; // posición suavizada (lag tipo sonda)
    let pressed = false;

    // Caja del núcleo (anillo de la sonda; se contrae al presionar)
    const RING = 11; // radio base del anillo
    const box = { cx: 0, cy: 0, r: RING };

    // Estela de chispas (filamentos con dirección azarosa)
    type Fil = { trail: { x: number; y: number }[]; vx: number; vy: number; age: number; life: number };
    const fils: Fil[] = [];
    let emitAcc = 0; // distancia acumulada para emitir chispas

    let raf = 0;
    let toneIsLight = false; // tono de la sección bajo el cursor

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    // ── Dibujo del núcleo (sonda) ─────────────────────────────────────────
    const drawNode = () => {
      const cross = toneIsLight ? INK : CREAM;

      // Halo de brasa (glow) — siempre presente
      const glowR = 26;
      const g = ctx.createRadialGradient(box.cx, box.cy, 0, box.cx, box.cy, glowR);
      g.addColorStop(0, `rgba(${EMBER},0.16)`);
      g.addColorStop(1, `rgba(${EMBER},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(box.cx, box.cy, glowR, 0, Math.PI * 2);
      ctx.fill();

      // Anillo de la sonda
      ctx.strokeStyle = `rgba(${EMBER},${0.92})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(box.cx, box.cy, box.r, 0, Math.PI * 2);
      ctx.stroke();

      // Cruz-sonda (hairline)
      const cw = 5;
      ctx.strokeStyle = `rgba(${cross},0.7)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(box.cx - cw, box.cy);
      ctx.lineTo(box.cx + cw, box.cy);
      ctx.moveTo(box.cx, box.cy - cw);
      ctx.lineTo(box.cx, box.cy + cw);
      ctx.stroke();
    };

    // ── Loop ──────────────────────────────────────────────────────────────
    const step = () => {
      ctx.clearRect(0, 0, w, h);

      // Suavizado del núcleo (lag de sonda)
      const px = node.x,
        py = node.y;
      node.x = lerp(node.x, ptr.x, 0.22);
      node.y = lerp(node.y, ptr.y, 0.22);
      const dx = node.x - px,
        dy = node.y - py;
      const moved = Math.hypot(dx, dy);

      if (ptr.seen) {
        // Tono de la sección bajo el cursor (igual criterio que el NavBar)
        const under = document.elementFromPoint(ptr.x, ptr.y);
        const navEl = under?.closest("[data-nav]");
        toneIsLight = navEl?.getAttribute("data-nav") === "light";

        // Emisión de chispas proporcional al recorrido — dirección azarosa (360°)
        emitAcc += moved;
        while (emitAcc > 9 && fils.length < 40) {
          emitAcc -= 9;
          const a = Math.random() * Math.PI * 2; // ángulo al azar en todo el círculo
          const sp = 0.5 + Math.random() * 1.0;
          fils.push({
            trail: [{ x: node.x, y: node.y }],
            vx: Math.cos(a) * sp + dx * 0.12, // leve arrastre del movimiento del cursor
            vy: Math.sin(a) * sp + dy * 0.12,
            age: 0,
            life: 26 + ((Math.random() * 18) | 0),
          });
        }
      }

      // Estela de chispas: vuelo con turbulencia azarosa + desvanecimiento
      for (let i = fils.length - 1; i >= 0; i--) {
        const f = fils[i];
        f.age++;
        f.vx = f.vx * 0.93 + (Math.random() - 0.5) * 0.3; // bamboleo, sin sesgo direccional
        f.vy = f.vy * 0.93 + (Math.random() - 0.5) * 0.3;
        const last = f.trail[f.trail.length - 1];
        f.trail.push({ x: last.x + f.vx, y: last.y + f.vy });
        if (f.trail.length > 7) f.trail.shift();

        const k = 1 - f.age / f.life;
        for (let j = 1; j < f.trail.length; j++) {
          const seg = (j / f.trail.length) * k;
          ctx.strokeStyle = `rgba(${EMBER},${0.34 * seg})`;
          ctx.lineWidth = seg * 1.8 + 0.2;
          ctx.beginPath();
          ctx.moveTo(f.trail[j - 1].x, f.trail[j - 1].y);
          ctx.lineTo(f.trail[j].x, f.trail[j].y);
          ctx.stroke();
        }
        if (f.age >= f.life) fils.splice(i, 1);
      }

      // Núcleo: sigue al puntero; se contrae levemente al presionar
      box.cx = lerp(box.cx, node.x, 0.45);
      box.cy = lerp(box.cy, node.y, 0.45);
      box.r = lerp(box.r, RING * (pressed ? 0.78 : 1), 0.2);

      if (ptr.seen) drawNode();

      raf = requestAnimationFrame(step);
    };

    // ── Eventos ────────────────────────────────────────────────────────────
    const onMove = (ev: PointerEvent) => {
      ptr.x = ev.clientX;
      ptr.y = ev.clientY;
      if (!ptr.seen) {
        ptr.seen = true;
        node.x = box.cx = ptr.x;
        node.y = box.cy = ptr.y;
      }
    };
    const onDown = () => (pressed = true);
    const onUp = () => (pressed = false);
    const onLeave = () => {
      ptr.seen = false;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    document.documentElement.classList.add("has-field-cursor");
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.documentElement.classList.remove("has-field-cursor");
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] h-full w-full"
    />
  );
}
