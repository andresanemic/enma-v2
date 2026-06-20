"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// TODO: reemplazar por imagen propia de Enma (Patagonia / Aysén / proceso).
// Placeholder Unsplash (montañas y agua — fiordos/bosques de Aysén).
const IMG =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1400&q=80&auto=format&fit=crop";

const AREAS = [
  {
    title: "Energía",
    desc: "Autogeneración renovable: microhidro, solar, eólica y geotermia, en diseño y planificación.",
  },
  {
    title: "Manufactura",
    desc: "Upcycling y manufactura avanzada con prototipado en impresión 3D y corte CNC.",
  },
  {
    title: "Cambio Climático",
    desc: "Cuantificación de huella de carbono y mitigación de impacto ambiental.",
  },
];

// Título del About en segmentos (el central lleva acento brasa).
const TITLE_SEGMENTS = [
  { text: "Energía, manufactura y cambio climático:", accent: false },
  { text: "tres áreas de impacto", accent: true },
  { text: "en la Patagonia chilena.", accent: false },
];
// Aplanado a palabras, conservando el flag de acento.
const TITLE_WORDS = TITLE_SEGMENTS.flatMap((seg) =>
  seg.text.split(" ").map((w) => ({ w, accent: seg.accent }))
);

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  // Reveal robusto: IntersectionObserver + fallback por timeout + guard reduced-motion.
  // Nunca queda en blanco aunque el observer no dispare.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    // Fallback de seguridad: SOLO revelar si la sección está realmente en
    // viewport. Antes revelaba a ciegas y, si el usuario tardaba en bajar, el
    // título se revelaba fuera de pantalla y se perdía la animación al llegar.
    const t = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) setShown(true);
    }, 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  const reveal = () =>
    `transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
      shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`;
  const delay = (i: number) => ({ transitionDelay: `${i * 110}ms` });

  return (
    <section
      ref={ref}
      id="about"
      data-nav="light"
      className="relative w-full bg-cream px-6 py-20 sm:px-10 sm:py-28 md:px-14 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* ── Grid principal: imagen | contenido ── */}
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
          {/* Imagen */}
          <div className={`${reveal()} order-1`} style={delay(1)}>
            <div className="group overflow-hidden rounded-3xl bg-sand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG}
                alt="Paisaje de la Patagonia chilena, Región de Aysén"
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                style={{ aspectRatio: "4 / 5" }}
              />
            </div>
          </div>

          {/* Contenido */}
          <div className="order-2">
            {/* Título — aparición palabra por palabra */}
            <h2
              className="max-w-[18ch] font-display font-light text-ink"
              style={{
                fontSize: "clamp(1.9rem, 4vw, 3.4rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
              }}
            >
              {TITLE_WORDS.map((item, i) => (
                <span
                  key={i}
                  className={`inline-block transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    item.accent ? "font-medium text-ember" : ""
                  } ${shown ? "translate-y-0 opacity-100" : "translate-y-[0.5em] opacity-0"}`}
                  style={{ transitionDelay: `${160 + i * 65}ms`, marginRight: "0.26em" }}
                >
                  {item.w}
                </span>
              ))}
            </h2>

            {/* Tres áreas — filas interactivas */}
            <dl className="mt-10">
              {AREAS.map((a, i) => (
                <div key={a.title} className={reveal()} style={delay(2 + i)}>
                  <div className="group relative cursor-default border-t border-ink/12 py-5 pl-0 transition-[padding] duration-300 ease-out hover:pl-3">
                    {/* Línea-acento brasa que recorre el borde superior en hover */}
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-0 h-px w-0 bg-ember transition-all duration-500 ease-out group-hover:w-full"
                    />
                    <dt className="font-display text-xl font-medium text-ink transition-colors duration-300 group-hover:text-ember sm:text-2xl">
                      {a.title}
                    </dt>
                    <dd className="mt-2 max-w-md font-body text-base leading-relaxed text-ink/60 transition-colors duration-300 group-hover:text-ink/80 sm:text-lg">
                      {a.desc}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            {/* CTA — pill ink con ignición cálida (Golden Path: → /nosotros) */}
            <div className={`${reveal()} mt-10`} style={delay(5)}>
              <Link
                href="/nosotros"
                className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-ink px-7 py-3.5 font-body text-base font-medium text-cream transition-shadow duration-500 ease-out hover:shadow-[0_10px_34px_-8px_rgba(241,84,28,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                {/* Ignición: la energía nace en el borde izquierdo y se expande hasta
                    inundar el pill en hover (energía cálida sobre base fría — eco del glow del cursor). */}
                <span
                  aria-hidden="true"
                  className="absolute left-5 top-1/2 h-8 w-8 -translate-y-1/2 scale-0 rounded-full bg-[radial-gradient(circle,#f1541c,#b12c00)] transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[22]"
                />
                <span className="relative z-10">Conoce más sobre nosotros</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
