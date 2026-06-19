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
    const t = window.setTimeout(() => setShown(true), 1800);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  const reveal = () =>
    `transition-all duration-700 ease-out ${
      shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
    }`;
  const delay = (i: number) => ({ transitionDelay: `${i * 90}ms` });

  return (
    <section
      ref={ref}
      id="about"
      className="relative w-full bg-cream px-6 py-20 sm:px-10 sm:py-28 md:px-14 md:py-32"
    >
      <div className="mx-auto max-w-[1400px]">
        {/* ── Eyebrow ── */}
        <div className={reveal()} style={delay(0)}>
          <span className="inline-flex items-center gap-3">
            <span aria-hidden="true" className="h-2.5 w-2.5 bg-ember" />
            <span className="eyebrow text-terra/70">Qué es Enma</span>
          </span>
        </div>

        {/* ── Grid principal: imagen | contenido ── */}
        <div className="mt-10 grid grid-cols-1 items-center gap-10 md:mt-14 md:grid-cols-2 md:gap-14 lg:gap-20">
          {/* Imagen */}
          <div className={`${reveal()} order-1`} style={delay(1)}>
            <div className="overflow-hidden rounded-3xl bg-sand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMG}
                alt="Paisaje de la Patagonia chilena, Región de Aysén"
                loading="lazy"
                className="h-full w-full object-cover"
                style={{ aspectRatio: "4 / 5" }}
              />
            </div>
          </div>

          {/* Contenido */}
          <div className="order-2">
            <h2
              className={`${reveal()} max-w-[18ch] font-display font-light text-ink`}
              style={{
                ...delay(1),
                fontSize: "clamp(1.9rem, 4vw, 3.4rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
              }}
            >
              Energía, manufactura y cambio climático:{" "}
              <span className="font-medium text-ember">tres áreas de impacto</span>{" "}
              en la Patagonia chilena.
            </h2>

            {/* Tres áreas */}
            <dl className="mt-10">
              {AREAS.map((a, i) => (
                <div
                  key={a.title}
                  className={`${reveal()} border-t border-ink/12 py-5`}
                  style={delay(2 + i)}
                >
                  <dt className="font-display text-lg font-medium text-ink sm:text-xl">
                    {a.title}
                  </dt>
                  <dd className="mt-1.5 max-w-md font-body text-sm leading-relaxed text-ink/60 sm:text-base">
                    {a.desc}
                  </dd>
                </div>
              ))}
            </dl>

            {/* CTA — dark pill + chip brasa (Golden Path: → /nosotros) */}
            <div className={`${reveal()} mt-10 flex items-center gap-2`} style={delay(5)}>
              <Link
                href="/nosotros"
                className="inline-flex items-center rounded-full bg-ink px-7 py-3.5 font-body text-sm font-medium text-cream transition-colors duration-300 hover:bg-terra"
              >
                Conoce más sobre nosotros
              </Link>
              <Link
                href="/nosotros"
                aria-hidden="true"
                tabIndex={-1}
                className="group inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-ember text-cream transition-colors duration-300 hover:bg-terra"
              >
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
