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
    name: "Bruno Ortega Leiva",
    role: "Socio Fundador · Gerente de Proyectos",
    photo: "/equipo/bruno-ortega-v3.webp",
    alt: "Bruno Ortega, co-fundador de Enma",
    bio: "Ingeniero civil mecánico. Diez años en energías renovables e innovación, donde lidero proyectos de hidrógeno verde y geotermia con mirada territorial y sostenible. Sumo experiencia en IoT, sensorización y automatización.",
  },
  {
    id: "patricio",
    name: "Patricio Campos Cisternas",
    role: "Socio Fundador · Gerente de Estudios",
    photo: "/equipo/patricio-campos-v2.webp",
    alt: "Patricio Campos, co-fundador de Enma",
    bio: "Ingeniero civil mecánico. Diez años en energías renovables, I+D+i y cambio climático, donde lidero proyectos de generación limpia, eficiencia energética y desarrollo tecnológico.",
  },
];

// ── Equipos de proyecto (colaboradores por iniciativa) ──
// No son cofundadores: son los equipos que suman fuerzas por proyecto. Se presentan
// con el lenguaje del bloque "Cómo lo abordamos" del detalle de Proyectos (header
// tipo eyebrow + callouts numerados con esquineros de registro), pero alineados en
// grilla y sin riel ni nodos.
type ProjectTeam = {
  id: string;
  name: string; // header tipo eyebrow (Outfit uppercase, terra)
  subtitle?: string; // glosa del proyecto
  members: string[];
};

const PROJECT_TEAMS: ProjectTeam[] = [
  {
    id: "anid-suc250296",
    name: "Equipo ANID SUC250296",
    subtitle:
      "Investigación y Diseño de Innovación Eólica para Generación Distribuida en Condiciones no Convencionales",
    members: ["Carlos Díaz", "José Aldunate", "Fernando\nSoto-Aguilar"],
  },
  {
    id: "estudios-regionales",
    name: "Equipo Estudios Regionales",
    members: ["Pablo Aranda", "Claudio Herrera"],
  },
];

// Título → palabras (rise+blur, sin clip → seguro al hacer wrap, lore/animation).
// "para" va pegado al acento (nbsp) para que nunca quede huérfano en una línea en móvil.
const HEAD_WORDS = ["Equipo", "interdisciplinario"];
const HEAD_ACCENT = "desafíos complejos";

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
      gsap.set(q("[data-team-rule]"), { scaleX: 1 });
      gsap.set(q("[data-team-head]"), { opacity: 1, y: 0 });
      gsap.set(q("[data-member]"), { opacity: 1, y: 0 });
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

      };

      // Equipos de proyecto: reveal propio (entran más abajo que el dúo).
      const teams = el.querySelector("[data-teams]");
      let played2 = false;
      const play2 = () => {
        if (played2) return;
        played2 = true;
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(q("[data-team-rule]"), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 0);
        tl.fromTo(q("[data-team-head]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06 }, 0.2);
        tl.fromTo(q("[data-member]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 }, 0.32);
      };

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            if (e.target === el) {
              play();
              io.unobserve(el);
            } else if (e.target === teams) {
              play2();
              io.unobserve(teams);
            }
          });
        },
        { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(el);
      if (teams) io.observe(teams);
      const t = window.setTimeout(() => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) play();
        if (teams) {
          const rt = teams.getBoundingClientRect();
          if (rt.top < window.innerHeight && rt.bottom > 0) play2();
        }
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
      className="relative w-full overflow-hidden px-6 pb-14 pt-28 sm:px-10 sm:pb-16 sm:pt-32 md:px-14 md:pb-20 md:pt-40"
      // Tramo medio del degradado claro: encadena con Proyecto (arriba) y Blog (abajo).
      style={{ background: "linear-gradient(180deg, #eecea1 0%, #f3ddbc 100%)" }}
    >
      {/* Textura de fondo — curvas de nivel finísimas en tinta */}
      <svg aria-hidden="true" className="pointer-events-none absolute -left-24 bottom-0 hidden h-[420px] w-[640px] text-ink/[0.06] md:block" viewBox="0 0 600 400" fill="none">
        {[0, 28, 56, 84, 112].map((o) => (
          <path key={o} d={`M-20 ${300 - o} C 150 ${360 - o}, 320 ${200 - o}, 470 ${300 - o} S 760 ${380 - o}, 920 ${260 - o}`} stroke="currentColor" strokeWidth="1.5" />
        ))}
      </svg>

      <div className="relative mx-auto max-w-[1180px]">
        {/* ── Encabezado (sin eyebrow) ── */}
        <div className="mb-16 md:mb-24">
          <h2 className="m-0 max-w-[30ch] font-display font-light text-ink" aria-label="Equipo interdisciplinario para desafíos complejos." style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)", lineHeight: 1.06, letterSpacing: "-0.03em" }}>
            <span aria-hidden="true">
              {HEAD_WORDS.map((w, i) => (
                <span key={i} data-head-word className="mr-[0.26em] inline-block" style={{ opacity: 0, transform: "translateY(0.8em)" }}>
                  {w}
                </span>
              ))}
              <span data-head-word className="inline-block" style={{ opacity: 0, transform: "translateY(0.8em)" }}>
                {"para "}
                <span className="font-medium text-teal">{HEAD_ACCENT}.</span>
              </span>
            </span>
          </h2>
          <p data-dek className="mt-5 max-w-[54ch] font-body text-base font-light leading-relaxed text-ink/65 sm:text-lg" style={{ opacity: 0 }}>
            Fundamos Enma para resolver, desde Aysén, los problemas de energía y manufactura de la Patagonia.
          </p>
        </div>

        {/* ── Dúo entrelazado ── */}
        <div className="relative md:grid md:grid-cols-12">
{order.map((cfIndex, i) => {
            const cf = COFOUNDERS[cfIndex];
            const isSlot1 = i === 0;
            return (
              <div key={i} className="contents">

                <article
                  data-cf-block
                  style={{ opacity: 0 }}
                  className={`relative z-10 ${
                    isSlot1
                      ? "mb-14 md:mb-0 md:col-start-1 md:col-end-8 md:row-start-1"
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

        {/* ── Equipos de proyecto (colaboradores por iniciativa) ── */}
        <div data-teams className="mt-20 md:mt-28">
          {/* Divider recto que se traza — mismo ancho que el cierre de /Vinculación */}
          <div data-team-rule aria-hidden="true" className="mx-auto mb-14 h-px w-full max-w-[440px] origin-left bg-ink/20 md:mb-20" style={{ transform: "scaleX(0)" }} />
          <div className="flex flex-col gap-14 md:gap-20">
            {PROJECT_TEAMS.map((team) => {
              const gridClass =
                team.members.length >= 3
                  ? "mx-auto grid max-w-[720px] grid-cols-1 gap-4 sm:grid-cols-3"
                  : "mx-auto grid max-w-[480px] grid-cols-1 gap-4 sm:grid-cols-2";
              return (
                <div key={team.id} className="text-center">
                  {/* Header tipo eyebrow (mismo estilo que "Cómo lo abordamos") */}
                  <h3 data-team-head className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-terra" style={{ opacity: 0 }}>
                    {team.name}
                  </h3>
                  {team.subtitle && (
                    <p data-team-head className="mx-auto mt-2.5 max-w-[60ch] font-body text-base font-light leading-relaxed text-ink/65" style={{ opacity: 0 }}>
                      «{team.subtitle}»
                    </p>
                  )}

                  {/* Integrantes — callouts numerados, centrados y juntos (sin riel, sin nodos, sin zig-zag) */}
                  <ol className={`mt-8 ${gridClass}`}>
                    {team.members.map((name) => (
                      <li key={name} data-member className="group relative" style={{ opacity: 0 }}>
                        <div className="relative flex h-full min-h-[88px] items-center justify-center px-4 py-4 text-center">
                          {/* Esquineros de registro en vértices opuestos — encuadre técnico sin caja pesada */}
                          <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t border-ink/25 transition-colors duration-300 group-hover:border-terra/60" />
                          <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r border-ink/25 transition-colors duration-300 group-hover:border-terra/60" />
                          <span className="block font-display text-lg font-medium leading-snug text-ink transition-colors duration-200 group-hover:text-terra">
                            {name.split("\n").map((line, j) => (
                              <span key={j} className="block">
                                {line}
                              </span>
                            ))}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
