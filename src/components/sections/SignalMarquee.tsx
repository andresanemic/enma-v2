"use client";

import { useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// SignalMarquee — marquee perpetuo al pie de un hero. Deriva a la izquierda con
// rAF + wrap pixel-perfecto (patrón Footer, NO CSS keyframes), pausa fuera de
// viewport y respeta prefers-reduced-motion (estático). Extraído de Vinculación
// para reutilizarlo en el índice del Blog; comportamiento idéntico.
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
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!track || !group) return;

    let w = group.offsetWidth;
    const onResize = () => {
      w = group.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    if (document.fonts?.ready) document.fonts.ready.then(() => (w = group.offsetWidth));

    let raf = 0;
    let visible = true;
    const tick = (now: number) => {
      if (visible && w > 0) {
        const pos = ((now / 1000) * speed) % w;
        track.style.transform = `translate3d(${-pos}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting), {
      threshold: 0,
    });
    io.observe(track);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [speed]);

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
        {[0, 1].map((g) => (
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
