"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const CONTACT = "mailto:contacto@enmachile.com";

// Sistema de líneas raíz/circuito (huella + monograma "E"): un tronco baja desde
// el borde superior hasta un nodo de confluencia, y desde ahí se ramifica.
// pathLength={1} normaliza la longitud → draw-on con dashoffset sin medir el DOM.
const LINES = [
  "M520,-20 C480,150 360,250 250,360", // tronco desde arriba
  "M250,360 C370,382 480,360 620,326", // rama derecha
  "M250,360 C320,470 372,560 392,660", // rama inferior
  "M250,360 C188,468 150,556 108,660", // rama inferior-izquierda
  "M250,360 C338,300 432,302 540,250", // rama superior-derecha
];

export default function CTA() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Selecciones SCOPED a esta sección: play() corre en un callback async del
    // IntersectionObserver, donde los selectores globales NO quedan scoped al
    // contexto y chocarían con los data-reveal/data-fade del Hero.
    const q = <T extends Element>(sel: string) => Array.from(el.querySelectorAll<T>(sel));

    const ctx = gsap.context(() => {
      const reveals = q("[data-reveal]");
      const fades = q("[data-fade]");
      const draws = q("[data-draw]");
      const nodes = q("[data-node]");
      const pulses = q("[data-pulse]");

      // Reduced motion: todo en estado final, sin loop ni pulsos.
      if (reduce) {
        gsap.set(reveals, { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(fades, { opacity: 1, y: 0 });
        gsap.set(draws, { strokeDashoffset: 0 });
        gsap.set(nodes, { scale: 1, opacity: 1 });
        return;
      }

      let played = false;
      const play = () => {
        if (played) return;
        played = true;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        // Título — reveal fade-up + blur por línea (robusto, sin clip)
        tl.fromTo(reveals, { opacity: 0, y: 24, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.12 }, 0);
        // Líneas — draw-on (dashoffset 1 → 0)
        tl.fromTo(draws, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.7, ease: "power2.inOut", stagger: 0.16 }, 0.15);
        // Cuerpo + link
        tl.fromTo(fades, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.55);
        // Nodo de confluencia
        tl.fromTo(nodes, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2.2)", transformOrigin: "center" }, 1.25);
        // Pulso de energía recorriendo las líneas (loop ambiental)
        gsap.set(pulses, { opacity: 1 });
        gsap.to(pulses, { strokeDashoffset: 0, duration: 3.4, ease: "none", repeat: -1, stagger: { each: 0.7, repeat: -1 }, delay: 1.4 });
      };

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            play();
            io.disconnect();
          }
        },
        { threshold: 0.28 }
      );
      io.observe(el);
      // Fallback: si el observer no dispara, revelar igualmente (nunca queda oculto).
      const t = window.setTimeout(play, 2200);
      return () => {
        io.disconnect();
        window.clearTimeout(t);
      };
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="contacto"
      data-nav="dark"
      className="relative w-full overflow-hidden px-6 py-5 sm:px-10 sm:py-6 md:px-14 md:py-7"
      style={{
        background:
          "radial-gradient(125% 110% at 82% 42%, #341507 0%, #20100a 52%, #190d08 100%)",
      }}
    >
      {/* ── Firma: líneas raíz/circuito con pulso de energía ── */}
      <svg
        aria-hidden="true"
        viewBox="0 0 620 660"
        preserveAspectRatio="xMaxYMid slice"
        className="pointer-events-none absolute inset-y-0 right-0 h-full w-[88%] opacity-90 sm:w-[64%] md:w-[52%]"
      >
        <g style={{ filter: "drop-shadow(0 0 7px rgba(62,124,108,0.45))" }}>
          {LINES.map((d, i) => (
            <path
              key={`l-${i}`}
              data-draw
              d={d}
              pathLength={1}
              fill="none"
              stroke="#3e7c6c"
              strokeOpacity={0.6}
              strokeWidth={1.5}
              strokeLinecap="round"
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          ))}
        </g>
        {/* Pulsos — dash corto que viaja por cada línea (energía) */}
        <g style={{ filter: "drop-shadow(0 0 8px rgba(254,169,79,0.7))" }}>
          {LINES.map((d, i) => (
            <path
              key={`p-${i}`}
              data-pulse
              d={d}
              pathLength={1}
              fill="none"
              stroke="#fea94f"
              strokeWidth={2}
              strokeLinecap="round"
              style={{ strokeDasharray: "0.1 0.9", strokeDashoffset: 1, opacity: 0 }}
            />
          ))}
        </g>
        {/* Nodo de confluencia */}
        <g data-node style={{ opacity: 0 }}>
          <circle cx={250} cy={360} r={9} fill="#fea94f" fillOpacity={0.12} />
          <circle cx={250} cy={360} r={3.4} fill="#fea94f" style={{ filter: "drop-shadow(0 0 6px rgba(254,169,79,0.8))" }} />
        </g>
      </svg>

      {/* ── Contenido ── */}
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="max-w-[20ch] sm:max-w-[30ch]">
          {/* Título */}
          <h2
            className="font-display font-light text-cream"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 3rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.035em",
            }}
          >
            <span data-reveal className="block whitespace-nowrap" style={{ opacity: 0 }}>
              Pongamos tu proyecto
            </span>
            <span data-reveal className="block whitespace-nowrap font-medium text-orange" style={{ opacity: 0 }}>
              en movimiento.
            </span>
          </h2>
        </div>

        {/* Cuerpo */}
        <p
          data-fade
          style={{ opacity: 0 }}
          className="mt-4 max-w-md font-body text-sm font-light leading-relaxed text-cream/75 sm:text-base"
        >
          Cuéntanos qué necesitas resolver en energía, manufactura o
          medioambiente. Diseñamos cada solución a la medida de tu territorio
          —y partimos por escuchar.
        </p>

        {/* CTA — link subrayado con flecha (coherente con el Hero) */}
        <a
          href={CONTACT}
          data-fade
          style={{ opacity: 0 }}
          className="group mt-6 inline-flex items-center gap-4"
        >
          <span className="relative font-display text-lg font-medium text-cream sm:text-xl">
            Hablemos de tu proyecto
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-100 bg-cream/30 transition-transform duration-500 group-hover:scale-x-0"
            />
            <span
              aria-hidden="true"
              className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-orange transition-transform delay-200 duration-500 group-hover:scale-x-100"
            />
          </span>
          <span
            aria-hidden="true"
            className="grid h-11 w-11 place-items-center rounded-full border border-cream/25 text-cream transition-colors duration-300 group-hover:border-orange group-hover:bg-orange group-hover:text-ink"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </span>
        </a>
      </div>
    </section>
  );
}
