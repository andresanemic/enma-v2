"use client";

import { useEffect, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SignalMarquee — marquee perpetuo al pie de un hero. Deriva a la izquierda con
// rAF + wrap pixel-perfecto (patrón Footer, NO CSS keyframes), pausa fuera de
// viewport y respeta prefers-reduced-motion (estático). Extraído de Vinculación
// para reutilizarlo en el índice del Blog; comportamiento idéntico.
//
// El wrap es por el ancho de UN grupo (`% w`). Para que nunca quede hueco en el
// borde derecho cuando un grupo es más angosto que el viewport (listas cortas /
// pantallas anchas → palabras que "desaparecen" a la derecha y reaparecen al
// reiniciar), se renderizan tantas copias como hagan falta para cubrir el
// contenedor + 1 extra (ver lore/animation.md "Marquee CSS reinicia con salto").
// ─────────────────────────────────────────────────────────────────────────────

export default function SignalMarquee({
  items,
  dotClassName = "bg-ember/70",
  speed = 46, // px/s
}: {
  items: string[];
  /** Color del punto separador (acento por página). */
  dotClassName?: string;
  speed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  // Nº de copias del grupo. Arranca en 2 (SSR-safe) y se ajusta tras medir.
  const [copies, setCopies] = useState(2);

  useEffect(() => {
    const track = trackRef.current;
    const group = groupRef.current;
    const container = containerRef.current;
    if (!track || !group || !container) return;

    let w = group.offsetWidth;

    // Copias necesarias para cubrir el contenedor + 1 extra para el wrap sin hueco.
    const fit = () => {
      w = group.offsetWidth;
      const cw = container.offsetWidth;
      if (w > 0) setCopies(Math.max(2, Math.ceil(cw / w) + 1));
    };
    fit();

    const onResize = () => fit();
    window.addEventListener("resize", onResize);
    if (document.fonts?.ready) document.fonts.ready.then(fit);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let visible = true;
    const tick = (now: number) => {
      if (!reduce && visible && w > 0) {
        const pos = ((now / 1000) * speed) % w;
        track.style.transform = `translate3d(${-pos}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    if (!reduce) raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting), {
      threshold: 0,
    });
    io.observe(track);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [speed, items]);

  const Item = ({ label }: { label: string }) => (
    <span className="flex items-center">
      <span
        aria-hidden="true"
        className={`mx-5 inline-block h-1.5 w-1.5 shrink-0 rounded-full sm:mx-7 ${dotClassName}`}
      />
      <span
        className="whitespace-nowrap font-body text-sm font-medium uppercase tracking-[0.18em] text-ink/45 sm:text-base"
        style={{ letterSpacing: "0.18em" }}
      >
        {label}
      </span>
    </span>
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-5"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0, #000 7%, #000 93%, transparent 100%)",
      }}
    >
      <div
        ref={trackRef}
        className="flex w-max"
        style={{ transform: "translate3d(0,0,0)", willChange: "transform" }}
      >
        {Array.from({ length: copies }).map((_, g) => (
          <div key={g} ref={g === 0 ? groupRef : undefined} className="flex shrink-0">
            {items.map((m) => (
              <Item key={`${g}-${m}`} label={m} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
