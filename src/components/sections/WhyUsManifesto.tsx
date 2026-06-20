"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// "Manifiesto pinneado" — tipografía monumental: el título de cada diferenciador
// llena el viewport y se scrubbea con el scroll (el anterior sale arriba, el
// nuevo sube letra por letra). Enmarcado por una TESIS persistente. Concepto:
// DESCENDER bajo la superficie patagónica — cada razón tiene su propia "zona" de
// subsuelo (superficie → sedimento → roca/tectónica → núcleo geotérmico). En
// desktop el fondo es una columna que se traslada hacia arriba con el scrub
// (sensación de bajar, sin zoom); en móvil/reduced cada razón lleva su zona en
// flujo. Contenido real (que-es-enma.txt). Teal fuera (regla de paleta).
//
// Títulos en LÍNEAS art-directed (cada línea atómica, nowrap) → NUNCA se parte una
// palabra. `lead` = contexto (crema), `accent` = esencia (naranja).
type Reason = { lead: string[]; accent: string[]; support: string };

const REASONS: Reason[] = [
  {
    lead: ["PERTENENCIA"],
    accent: ["TERRITORIAL"],
    support: "Nacimos en Aysén. El desafío logístico de la Patagonia mata a quien no lo considera desde el primer día.",
  },
  {
    lead: ["SOLUCIONES"],
    accent: ["A LA MEDIDA"],
    support: "Cada solución ajustada a tu contexto, con acompañamiento integral de la idea a la ejecución.",
  },
  {
    lead: ["VISIÓN", "ESTRATÉGICA"],
    accent: ["+ CÓMPUTO"],
    support: "Simulamos y validamos con CFD y túnel de viento antes de construir: más rápido, eficiente y confiable.",
  },
  {
    lead: ["ASOCIATIVIDAD"],
    accent: ["Y CO-CREACIÓN"],
    support: "Socios, no proveedores. El aliado con el que conversar y co-crear, no un dominador de mercado.",
  },
];

// Tamaño calibrado para que la línea más larga quepa en una sola línea de móvil a
// desktop (nunca overflow ni break).
const KEY_FONT = "clamp(1.5rem, 7.5vw, 6rem)";

function letters(text: string) {
  return Array.from(text).map((ch, k) =>
    ch === " " ? (
      <span key={k} className="inline-block w-[0.26em]" />
    ) : (
      <span key={k} data-letter className="inline-block">
        {ch}
      </span>
    )
  );
}

// Líneas atómicas (bloque nowrap → no se parte ninguna palabra).
function renderLines(lines: string[], className: string) {
  return lines.map((line, li) => (
    <span key={li} className={`block ${className}`} style={{ whiteSpace: "nowrap" }}>
      {letters(line)}
    </span>
  ));
}

// Zona de subsuelo por razón: 0 superficie · 1 sedimento · 2 roca/tectónica ·
// 3 núcleo/magma. Los colores encadenan (el fondo de una zona = el techo de la
// siguiente) para que la columna apilada se sienta continua al descender.
function Zone({ i }: { i: number }) {
  const base = [
    "linear-gradient(180deg,#2c1f12 0%,#241608 100%)",
    "linear-gradient(180deg,#241608 0%,#1d1208 100%)",
    "linear-gradient(180deg,#1d1208 0%,#1a0f07 100%)",
    "linear-gradient(180deg,#1a0f07 0%,#2a1206 45%,#6e1d07 80%,#f1541c 116%)",
  ][i];
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={{ background: base }}
    >
      {/* Superficie: luz cenital + raíces que bajan (conexión con la Patagonia de arriba) */}
      {i === 0 && (
        <>
          <span
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(120% 32% at 50% 0%, rgba(247,223,186,0.10) 0%, transparent 60%)",
            }}
          />
          <svg
            className="absolute inset-x-0 top-0 h-[62%] w-full"
            viewBox="0 0 100 60"
            preserveAspectRatio="none"
            fill="none"
          >
            {[12, 29, 47, 64, 83].map((x, k) => (
              <path
                key={k}
                d={`M ${x} 0 C ${x + 3} 12 ${x - 4} 21 ${x + 2} 34 C ${x + 5} 45 ${x - 2} 53 ${x} 60`}
                stroke="rgba(247,223,186,0.15)"
                strokeWidth="0.35"
              />
            ))}
          </svg>
        </>
      )}

      {/* Sedimento: estratos horizontales finos */}
      {i === 1 && (
        <span
          className="absolute inset-0"
          style={{
            background:
              "repeating-linear-gradient(180deg, transparent 0 42px, rgba(0,0,0,0.22) 42px 44px)",
          }}
        />
      )}

      {/* Roca / tectónica: fallas diagonales + vetas minerales tenues de brasa */}
      {i === 2 && (
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d="M -5 30 L 105 47" stroke="rgba(241,84,28,0.16)" strokeWidth="0.5" />
          <path d="M -5 63 L 105 79" stroke="rgba(241,84,28,0.10)" strokeWidth="0.5" />
          <path d="M 12 -5 L 40 105" stroke="rgba(0,0,0,0.28)" strokeWidth="0.7" />
          <path d="M 78 -5 L 58 105" stroke="rgba(0,0,0,0.20)" strokeWidth="0.6" />
        </svg>
      )}

      {/* Núcleo: resplandor geotérmico que late, concentrado al fondo (calor) */}
      {i === 3 && (
        <span
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(85% 55% at 50% 100%, rgba(241,84,28,0.5) 0%, rgba(177,44,0,0) 70%)",
            animation: "spark-twinkle 6s ease-in-out infinite",
          }}
        />
      )}

      {/* Scrim de legibilidad (más oscuro arriba/abajo, claro al centro donde va el texto) */}
      <span
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,5,2,0.34) 0%, rgba(8,5,2,0.12) 26%, rgba(8,5,2,0.12) 64%, rgba(8,5,2,0.42) 100%)",
        }}
      />
    </div>
  );
}

export default function WhyUsManifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;
      const words = wordRefs.current.filter(Boolean) as HTMLDivElement[];
      const lettersOf = (el: HTMLElement) =>
        Array.from(el.querySelectorAll<HTMLElement>("[data-letter]"));
      const supLineOf = (el: HTMLElement) =>
        Array.from(el.querySelectorAll<HTMLElement>("[data-supline]"));
      const supWordsOf = (el: HTMLElement) =>
        Array.from(el.querySelectorAll<HTMLElement>("[data-supword]"));
      const thesis = Array.from(stage.querySelectorAll<HTMLElement>("[data-thesis]"));

      const mm = gsap.matchMedia();
      const SCRUB_LEN = REASONS.length * 100; // % de scroll para todo el recorrido

      const revealThesis = () =>
        gsap.fromTo(
          thesis,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
          }
        );

      // ── Desktop con movimiento → manifiesto pinneado + descenso del subsuelo ──
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          revealThesis();
          words.forEach((w, i) => {
            gsap.set(w, {
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: 1,
            });
            gsap.set(lettersOf(w), { yPercent: i === 0 ? 0 : 110, opacity: i === 0 ? 1 : 0 });
            gsap.set(supLineOf(w), { scaleX: i === 0 ? 1 : 0, transformOrigin: "left center" });
            gsap.set(supWordsOf(w), { opacity: i === 0 ? 1 : 0, yPercent: i === 0 ? 0 : 60 });
          });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => "+=" + SCRUB_LEN + "%",
              scrub: 1,
              pin: stage,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          for (let i = 1; i < words.length; i++) {
            const prev = words[i - 1];
            const cur = words[i];
            // salida del anterior (título arriba + apoyo se retira)
            tl.to(lettersOf(prev), { yPercent: -110, opacity: 0, stagger: { each: 0.012 } }, "+=0.5");
            tl.to(supWordsOf(prev), { opacity: 0, yPercent: -30, stagger: { each: 0.006 } }, "<");
            tl.to(supLineOf(prev), { scaleX: 0 }, "<");
            // entrada del nuevo (título sube + apoyo palabra por palabra)
            tl.to(lettersOf(cur), { yPercent: 0, opacity: 1, stagger: { each: 0.02 } }, "<0.12");
            tl.to(supLineOf(cur), { scaleX: 1 }, "<0.25");
            tl.to(supWordsOf(cur), { opacity: 1, yPercent: 0, stagger: { each: 0.012 } }, "<0.05");
          }

          if (progressRef.current) {
            gsap.fromTo(
              progressRef.current,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: "top top",
                  end: () => "+=" + SCRUB_LEN + "%",
                  scrub: true,
                },
              }
            );
          }

          if (document.fonts?.ready) {
            document.fonts.ready.then(() => ScrollTrigger.refresh());
          }
        }
      );

      // ── Móvil con movimiento → sin pin: títulos en flujo, cada uno con su zona ──
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          revealThesis();
          words.forEach((w) => {
            gsap.set(w, { position: "relative", opacity: 1 });
            gsap.set(lettersOf(w), { yPercent: 0, opacity: 1 });
            gsap.set(supLineOf(w), { scaleX: 0, transformOrigin: "left center" });
            gsap.set(supWordsOf(w), { opacity: 0, yPercent: 40 });
            gsap.to(supLineOf(w), {
              scaleX: 1,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: { trigger: w, start: "top 85%" },
            });
            gsap.to(supWordsOf(w), {
              opacity: 1,
              yPercent: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.02,
              scrollTrigger: { trigger: w, start: "top 85%" },
            });
          });
        }
      );

      // ── Reduced motion → todo visible, sin animación (zonas por bloque en flujo) ──
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(thesis, { opacity: 1, y: 0 });
        words.forEach((w) => {
          gsap.set(w, { position: "relative", opacity: 1 });
          gsap.set(lettersOf(w), { yPercent: 0, opacity: 1 });
          gsap.set(supLineOf(w), { scaleX: 1, transformOrigin: "left center" });
          gsap.set(supWordsOf(w), { opacity: 1, yPercent: 0 });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="distintos"
      data-nav="dark"
      className="relative w-full text-cream"
      style={{ background: "#160f08" }}
    >
      {/* Stage: en desktop se pinea (100svh); en móvil crece en flujo */}
      <div ref={stageRef} className="relative flex min-h-svh flex-col overflow-hidden">
        {/* Fondo único y estático para las 4 razones (roca/tectónica). No cambia
            ni desciende; cubre todo el stage (desktop pinneado y móvil en flujo). */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <Zone i={2} />
        </div>

        {/* ── Tesis persistente ── */}
        <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pt-[clamp(5rem,13vh,9rem)] sm:px-10 md:px-14">
          <h2
            className="m-0 font-display font-light text-cream"
            style={{
              fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.12,
              maxWidth: "20ch",
            }}
          >
            <span data-thesis className="block text-cream/90" style={{ opacity: 0 }}>
              En Enma, lo que nos distingue
            </span>
            <span data-thesis className="block" style={{ opacity: 0 }}>
              va <span className="font-medium text-orange">más profundo</span>.
            </span>
          </h2>
          <div
            data-thesis
            className="mt-4 flex items-center gap-2 text-cream/45"
            style={{ opacity: 0 }}
          >
            <span className="font-body text-sm font-light lowercase">desciende</span>
            <span
              aria-hidden="true"
              className="text-orange"
              style={{ animation: "metric-float 2.4s ease-in-out infinite" }}
            >
              ↓
            </span>
          </div>
        </div>

        {/* ── Títulos-manifiesto (en desktop se apilan absolutos y centrados) ── */}
        <div className="relative z-10 flex-1">
          {REASONS.map((r, i) => (
            <div
              key={i}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className="relative flex flex-col justify-center px-6 py-[9vh] sm:px-10 md:px-14 lg:py-0"
            >
              <div className="relative z-10 mx-auto w-full max-w-[1400px]">
                <h3
                  aria-label={[...r.lead, ...r.accent].join(" ")}
                  className="m-0 font-display font-semibold"
                  style={{ fontSize: KEY_FONT, letterSpacing: "-0.03em", lineHeight: 0.98 }}
                >
                  <span aria-hidden="true">
                    {renderLines(r.lead, "text-cream/80")}
                    {renderLines(r.accent, "text-orange")}
                  </span>
                </h3>

                {/* Apoyo kinético: acento que se traza + palabras que suben */}
                <div className="mt-5 sm:mt-7">
                  <span
                    data-supline
                    aria-hidden="true"
                    className="mb-4 block h-px w-12 origin-left bg-ember"
                    style={{ transform: "scaleX(0)" }}
                  />
                  <p
                    aria-label={r.support}
                    className="max-w-[44ch] font-body text-lg font-light leading-relaxed text-cream/70 sm:text-xl"
                  >
                    {r.support.split(" ").map((w, k) => (
                      <span key={k} className="inline">
                        <span
                          data-supword
                          aria-hidden="true"
                          className="inline-block"
                          style={{ opacity: 0 }}
                        >
                          {w}
                        </span>{" "}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Barra de progreso del recorrido (solo desktop pinneado) */}
          <span
            ref={progressRef}
            aria-hidden="true"
            className="absolute bottom-0 left-0 z-10 hidden h-px w-full origin-left bg-ember motion-safe:lg:block"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
      </div>
    </section>
  );
}
