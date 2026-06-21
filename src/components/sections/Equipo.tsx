"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

// ── Cofundadores (datos reales de que-es-enma.txt) ──
type Cofounder = {
  id: string;
  name: string;
  role: string; // etiqueta — Outfit uppercase (no mono)
  photo: string;
  alt: string;
  bio: string;
};

const COFOUNDERS: Cofounder[] = [
  {
    id: "bruno",
    name: "Bruno Ortega",
    role: "Socio fundador · Ingeniero mecánico",
    photo: "/equipo/equipo-bruno.jpg",
    alt: "Persona andando en bicicleta al atardecer",
    bio: "La mirada de la energía: generación renovable, eléctrica y térmica. Experiencia en eólica, solar, geotermia e hidro; supervisó la calefacción geotérmica que dio origen a Enma.",
  },
  {
    id: "patricio",
    name: "Patricio Campos",
    role: "Socio fundador · Ingeniero mecánico",
    photo: "/equipo/equipo-patricio.jpg",
    alt: "Un pato solitario nadando en un lago",
    bio: "Diseñó el upcycling de residuos salmoneros que originó Enma. Lideró estudios energéticos para el CIEP y aporta formulación de proyectos, simulaciones CFD y huella de carbono.",
  },
];

// Título → palabras (rise+blur, sin clip → seguro al hacer wrap, lore/animation).
const HEAD_WORDS = ["Dos", "socios,"];
const HEAD_ACCENT = "un propósito";

// Retratos: a color pleno siempre, estáticos (sin hover).

export default function Equipo() {
  const ref = useRef<HTMLElement>(null);
  // SSR determinista (Bruno arriba); el cliente re-aleatoriza tras montar, MIENTRAS
  // los bloques están ocultos (sin hydration mismatch ni CLS — slots del mismo tamaño).
  const [order, setOrder] = useState<[number, number]>([0, 1]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOrder(Math.random() < 0.5 ? [0, 1] : [1, 0]);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = <T extends Element>(sel: string) => Array.from(el.querySelectorAll<T>(sel));

    if (reduce) {
      gsap.set(q("[data-cf-block]"), { opacity: 1, x: 0, y: 0 });
      gsap.set(q("[data-head-word]"), { opacity: 1, y: 0, filter: "blur(0px)" });
      gsap.set(q("[data-dek]"), { opacity: 1, y: 0 });
      gsap.set(q("[data-thread-path]"), { strokeDashoffset: 0 });
      gsap.set(q("[data-thread-node]"), { opacity: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // Encabezado — palabra por palabra (rise, sin blur).
        tl.fromTo(q("[data-head-word]"), { opacity: 0, y: "0.5em" }, { opacity: 1, y: "0em", duration: 0.7, stagger: 0.06 }, 0);
        const dek = el.querySelector("[data-dek]");
        if (dek) tl.fromTo(dek, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.75 }, 0.28);

        // Cada bloque entra deslizando desde su lado (sin overshoot/rebote).
        // Dirección por SLOT (no por cofundador) → coherente con el swap.
        q<HTMLElement>("[data-cf-block]").forEach((b, i) => {
          const fromX = i === 0 ? -60 : 60;
          const fromY = i === 0 ? -24 : 28;
          tl.fromTo(b, { opacity: 0, x: fromX, y: fromY }, { opacity: 1, x: 0, y: 0, duration: 0.85, ease: "power3.out" }, 0.32 + i * 0.12);
        });

        // Hilo "E" — se traza entre ambos; los nodos aparecen al final (sin pop).
        const path = el.querySelector("[data-thread-path]");
        if (path) tl.fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 0.65);
        tl.fromTo(q("[data-thread-node]"), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.1, ease: "power2.out", transformOrigin: "center" }, 1.05);
      };

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            play();
            io.disconnect();
          }
        },
        { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(el);
      const t = window.setTimeout(() => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) play();
      }, 2600);
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
      id="equipo"
      data-nav="light"
      className="relative w-full overflow-hidden px-6 py-28 sm:px-10 sm:py-32 md:px-14 md:py-40"
      // Tramo medio del degradado claro: encadena con Proyecto (arriba) y Blog (abajo).
      style={{ background: "linear-gradient(180deg, #eecea1 0%, #f3ddbc 100%)" }}
    >
      {/* Textura de fondo — curvas de nivel finísimas en tinta */}
      <svg aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-0 h-[420px] w-[640px] text-ink/[0.06]" viewBox="0 0 600 400" fill="none">
        {[0, 28, 56, 84, 112].map((o) => (
          <path key={o} d={`M-20 ${300 - o} C 150 ${360 - o}, 320 ${200 - o}, 470 ${300 - o} S 760 ${380 - o}, 920 ${260 - o}`} stroke="currentColor" strokeWidth="1.5" />
        ))}
      </svg>

      <div className="relative mx-auto max-w-[1180px]">
        {/* ── Encabezado (sin eyebrow) ── */}
        <div className="mb-16 md:mb-24">
          <h2 className="m-0 max-w-[18ch] font-display font-light text-ink" aria-label="Dos socios, un propósito." style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)", lineHeight: 1.06, letterSpacing: "-0.03em" }}>
            <span aria-hidden="true">
              {HEAD_WORDS.map((w, i) => (
                <span key={i} data-head-word className="mr-[0.26em] inline-block" style={{ opacity: 0, transform: "translateY(0.8em)" }}>
                  {w}
                </span>
              ))}
              <span data-head-word className="inline-block font-medium text-teal" style={{ opacity: 0, transform: "translateY(0.8em)" }}>
                {HEAD_ACCENT}
              </span>
              <span data-head-word className="inline-block" style={{ opacity: 0, transform: "translateY(0.8em)" }}>
                .
              </span>
            </span>
          </h2>
          <p data-dek className="mt-5 max-w-[54ch] font-body text-base font-light leading-relaxed text-ink/65 sm:text-lg" style={{ opacity: 0 }}>
            Bruno y Patricio fundaron Enma para resolver, desde Aysén, los problemas de energía y manufactura de un territorio complejo.
          </p>
        </div>

        {/* ── Dúo entrelazado ── */}
        <div className="relative md:grid md:grid-cols-12">
          {/* Hilo "E" (desktop) — circuito/raíz que teje entre ambos slots */}
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full text-teal/45 md:block" viewBox="0 0 100 70" preserveAspectRatio="none" fill="none">
            <path data-thread-path d="M24 20 C 44 20, 38 40, 54 44 S 74 52, 80 56" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
            <circle data-thread-node cx="24" cy="20" r="1.4" fill="currentColor" style={{ opacity: 0 }} />
            <circle data-thread-node cx="54" cy="44" r="1" fill="currentColor" style={{ opacity: 0 }} />
            <circle data-thread-node cx="80" cy="56" r="1.4" fill="currentColor" style={{ opacity: 0 }} />
          </svg>

          {order.map((cfIndex, i) => {
            const cf = COFOUNDERS[cfIndex];
            const isSlot1 = i === 0;
            return (
              <div key={i} className="contents">
                {/* Conector vertical (solo móvil) entre los dos bloques */}
                {!isSlot1 && (
                  <div aria-hidden="true" className="flex justify-center py-8 md:hidden">
                    <svg className="h-16 w-3 text-teal/45" viewBox="0 0 12 64" fill="none">
                      <path d="M6 2 C 1 16, 11 28, 6 42 S 1 56, 6 62" stroke="currentColor" strokeWidth="1" />
                      <circle cx="6" cy="2" r="1.6" fill="currentColor" />
                      <circle cx="6" cy="62" r="1.6" fill="currentColor" />
                    </svg>
                  </div>
                )}

                <article
                  data-cf-block
                  style={{ opacity: 0 }}
                  className={`relative z-10 ${
                    isSlot1
                      ? "md:col-start-1 md:col-end-8 md:row-start-1"
                      : "md:col-start-6 md:col-end-13 md:row-start-2 md:-mt-16 lg:-mt-24"
                  }`}
                >
                  <div className={`group/cf flex flex-col items-start gap-6 sm:items-center sm:gap-8 ${isSlot1 ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                    {/* Retrato — color pleno, estático (sin hover) */}
                    <div className="relative aspect-[4/5] w-[200px] shrink-0 overflow-hidden rounded-[20px] ring-1 ring-ink/15 sm:w-[clamp(180px,22vw,270px)]">
                      <Image
                        src={cf.photo}
                        alt={cf.alt}
                        fill
                        sizes="(min-width: 768px) 270px, 60vw"
                        className="object-cover"
                      />
                    </div>

                    {/* Texto */}
                    <div className="min-w-0">
                      <h3 className="m-0 font-display font-light leading-tight text-ink" style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)", letterSpacing: "-0.02em" }}>
                        {cf.name}
                      </h3>
                      <p className="mt-1.5 font-body text-[11px] uppercase tracking-[0.2em] text-ink/55">{cf.role}</p>
                      <p className="mt-4 max-w-[40ch] font-body text-base font-light leading-relaxed text-ink/70">{cf.bio}</p>
                    </div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
