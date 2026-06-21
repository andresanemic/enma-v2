"use client";

import { useEffect, useMemo, useRef } from "react";

// Chispas cálidas que derivan — mismo lenguaje visual que el bloque CTA+Footer,
// pero con cobertura de ÁREA (no banda fina): se reparten por todo el contenedor
// (y en %) para llenar superficies grandes como el overlay del menú móvil.
//
// PRNG determinista (mulberry32) → la MISMA nube en servidor y cliente, sin
// hydration mismatch ni Math.random() en render. Deriva por rAF ligada al reloj
// global + wrap pixel-perfecto (dos grupos idénticos) → loop sin costuras.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SPARK_RGB = [
  [247, 223, 186], // arena
  [254, 169, 79], // naranja
  [241, 84, 28], // brasa
] as const;

type Spark = { x: number; y: number; size: number; color: string; dur: number; delay: number };

function makeSparks(seed: number, count: number): Spark[] {
  const rnd = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const c = SPARK_RGB[(rnd() * SPARK_RGB.length) | 0];
    const alpha = 0.3 + rnd() * 0.5;
    return {
      x: rnd() * 100, // % horizontal dentro del grupo
      y: rnd() * 100, // % vertical del contenedor
      size: 1 + rnd() * 2.6, // 1–3.6px
      color: `rgba(${c[0]},${c[1]},${c[2]},${alpha.toFixed(3)})`,
      dur: 3 + rnd() * 4, // s — parpadeo
      delay: -rnd() * 6, // s — desfase del parpadeo
    };
  });
}

export default function Sparks({
  className = "",
  seed = 0x5e3a91,
  count = 70,
  secsPerViewport = 26,
}: {
  className?: string;
  seed?: number;
  count?: number;
  secsPerViewport?: number;
}) {
  const driftRef = useRef<HTMLDivElement>(null);
  const sparks = useMemo(() => makeSparks(seed, count), [seed, count]);

  useEffect(() => {
    const drift = driftRef.current;
    if (!drift) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // estático

    const band = drift.parentElement;
    let w = band ? band.clientWidth : window.innerWidth;
    const onResize = () => {
      w = band ? band.clientWidth : window.innerWidth;
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    let visible = true;
    const tick = (now: number) => {
      if (visible && w > 0) {
        const pos = ((now / 1000) * (w / secsPerViewport)) % w;
        drift.style.transform = `translate3d(${-pos}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(band ?? drift);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [secsPerViewport]);

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div
        ref={driftRef}
        style={{ position: "absolute", inset: 0, width: "200%", willChange: "transform" }}
      >
        {[0, 50].map((offset) => (
          <div
            key={offset}
            style={{ position: "absolute", top: 0, left: `${offset}%`, width: "50%", height: "100%" }}
          >
            {sparks.map((s, i) => (
              <span
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  background: s.color,
                  animation: `spark-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
