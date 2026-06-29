"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const IMG = "/about/about-v2.webp";

const AREAS = [
  {
    title: "Energía",
    desc: "I+D+i, prototipado, estudios sociotécnicos y proyectos energéticos sobre tecnologías limpias.",
  },
  {
    title: "Economía circular",
    desc: "Proyectos de upcycling, gestión de residuos y Ley REP para un desarrollo sostenible.",
  },
  {
    title: "Cambio climático",
    desc: "Cuantificación de huella de carbono y mitigación de gases de efecto invernadero.",
  },
];

// Título del About en segmentos (el central lleva acento brasa).
const TITLE_SEGMENTS = [
  { text: "Energía, Economía circular y Cambio climático:", accent: false },
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
    `transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
      shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
    }`;
  const delay = (i: number) => ({ transitionDelay: `${i * 90}ms` });

  return (
    <section
      ref={ref}
      id="about"
      data-nav="light"
      className="relative w-full px-6 py-20 sm:px-10 sm:py-28 md:px-14 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* ── Grid principal: imagen | contenido ── */}
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-20">
          {/* Imagen */}
          <div className={`${reveal()} order-1`} style={delay(1)}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sand">
              <Image
                src={IMG}
                alt="Paisaje de la Patagonia chilena, Región de Aysén"
                fill
                sizes="(min-width: 768px) 50vw, 90vw"
                className="object-cover"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "linear-gradient(160deg, rgba(254,169,79,0.28) 0%, rgba(241,84,28,0.18) 60%, rgba(177,44,0,0.22) 100%)",
                  mixBlendMode: "multiply",
                }}
              />
            </div>
          </div>

          {/* Contenido */}
          <div className="order-2">
            {/* Título — aparece como un bloque (mismo gesto que el header de Servicios) */}
            <h2
              className="max-w-[22ch] font-display font-light text-ink"
              style={{
                fontSize: "clamp(1.7rem, 3.4vw, 3rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
              }}
            >
              {TITLE_WORDS.map((item, i) => (
                <span
                  key={i}
                  className={`inline-block transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    item.accent ? "font-medium text-ember" : ""
                  } ${shown ? "translate-y-0 opacity-100" : "translate-y-[0.5em] opacity-0"}`}
                  style={{ transitionDelay: "120ms", marginRight: "0.26em" }}
                >
                  {item.w}
                </span>
              ))}
            </h2>

            {/* Tres áreas — filas interactivas.
                Estructura: <dl> → un único <div> por par → <dt>/<dd>. axe exige que
                dt/dd estén a lo más UN <div> bajo el <dl> (regla dlitem); el doble
                anidamiento anterior rompía esa regla (y el árbol de accesibilidad
                para agentes de IA). El <span> decorativo es aria-hidden. */}
            <dl className="mt-10">
              {AREAS.map((a, i) => (
                <div
                  key={a.title}
                  className={`${reveal()} group relative cursor-default border-t border-ink/12 py-5 pl-0`}
                  style={delay(2 + i)}
                >
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
              ))}
            </dl>

            {/* CTA — negro que cambia a naranjo en hover, como el botón del navbar
                (Golden Path: → /nosotros) */}
            <div className={`${reveal()} mt-10`} style={delay(5)}>
              <Link
                href="/nosotros"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 font-body text-base font-medium text-cream transition-colors duration-300 hover:bg-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
              >
                Conoce más sobre nosotros
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
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
