"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// "Manifiesto pinneado" — tipografía monumental: una palabra GIGANTE por
// diferenciador, scrubbeada con el scroll (la anterior sale arriba, la nueva
// sube letra por letra). Contenido real (que-es-enma.txt → "Qué diferencia a
// Enma"). Fondo dark cálido (forja/brasa); teal fuera (regla de paleta).
// El título completo se divide en `lead` (contexto, crema) + `accent` (la esencia,
// naranja) para dar jerarquía tipográfica. Sin números ni eyebrows (regla del proyecto).
type Reason = { lead: string; accent: string; support: string };

const REASONS: Reason[] = [
  {
    lead: "PERTENENCIA",
    accent: "TERRITORIAL",
    support: "Nacimos en Aysén. El desafío logístico de la Patagonia mata a quien no lo considera desde el primer día.",
  },
  {
    lead: "SOLUCIONES",
    accent: "A LA MEDIDA",
    support: "Cada solución ajustada a tu contexto, con acompañamiento integral de la idea a la ejecución.",
  },
  {
    lead: "VISIÓN ESTRATÉGICA +",
    accent: "CÓMPUTO",
    support: "Simulamos y validamos con CFD y túnel de viento antes de construir: más rápido, eficiente y confiable.",
  },
  {
    lead: "ASOCIATIVIDAD Y",
    accent: "CO-CREACIÓN",
    support: "Socios, no proveedores. El aliado con el que conversar y co-crear, no un dominador de mercado.",
  },
];

// Frases largas → tamaño que deja caber la palabra más larga ("ASOCIATIVIDAD")
// y permite wrap a varias líneas (monumentalidad). Sin nowrap.
const KEY_FONT = "clamp(1.9rem, 8vw, 6.5rem)";

// Renderiza un texto como letras animables (cada una un inline-block con
// [data-letter]); los espacios son huecos que no se animan.
function letters(text: string) {
  return Array.from(text).map((ch, k) =>
    ch === " " ? (
      <span key={k} className="inline-block w-[0.28em]" />
    ) : (
      <span key={k} data-letter className="inline-block">
        {ch}
      </span>
    )
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
      const metaOf = (el: HTMLElement) =>
        Array.from(el.querySelectorAll<HTMLElement>("[data-meta]"));

      const mm = gsap.matchMedia();
      const SCRUB_LEN = REASONS.length * 100; // % de scroll para todo el recorrido

      // ── Desktop con movimiento → manifiesto pinneado y scrubbeado ──
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Estado inicial: solo la palabra 0 visible; las demás abajo y ocultas.
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
            gsap.set(metaOf(w), { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 24 });
          });

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: () => "+=" + SCRUB_LEN + "%",
              scrub: 1,
              pin: stage,
              anticipatePin: 1, // sección dark pinned (lore/animation)
              invalidateOnRefresh: true, // recalcula end/valores en resize
            },
          });

          for (let i = 1; i < words.length; i++) {
            const prev = words[i - 1];
            const cur = words[i];
            // Palabra anterior sale hacia arriba (letra por letra)
            tl.to(lettersOf(prev), { yPercent: -110, opacity: 0, stagger: { each: 0.012 } }, "+=0.5");
            tl.to(metaOf(prev), { opacity: 0, y: -24 }, "<");
            // Palabra nueva sube desde abajo (letra por letra)
            tl.to(lettersOf(cur), { yPercent: 0, opacity: 1, stagger: { each: 0.02 } }, "<0.12");
            tl.to(metaOf(cur), { opacity: 1, y: 0 }, "<0.3");
          }

          // Barra de progreso (scaleX = compositor; no width — lore/animation)
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

          // Recalcular posiciones cuando las fuentes asienten métricas.
          if (document.fonts?.ready) {
            document.fonts.ready.then(() => ScrollTrigger.refresh());
          }
        }
      );

      // ── Móvil con movimiento → sin pin: palabras en flujo, reveal simple ──
      mm.add(
        "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
        () => {
          words.forEach((w) => {
            gsap.set(w, { position: "relative", opacity: 1 });
            gsap.set(lettersOf(w), { yPercent: 0, opacity: 1 });
            const meta = metaOf(w);
            gsap.set(meta, { opacity: 0, y: 24 });
            gsap.to(meta, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              stagger: 0.12,
              scrollTrigger: { trigger: w, start: "top 88%" },
            });
          });
        }
      );

      // ── Reduced motion (cualquier ancho) → todo visible, sin animación ──
      mm.add("(prefers-reduced-motion: reduce)", () => {
        words.forEach((w) => {
          gsap.set(w, { position: "relative", opacity: 1 });
          gsap.set(lettersOf(w), { yPercent: 0, opacity: 1 });
          gsap.set(metaOf(w), { opacity: 1, y: 0 });
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
      style={{
        background: "linear-gradient(180deg, #1b130c 0%, #211309 46%, #140d07 100%)",
      }}
    >
      {/* Glow brasa (energía cálida sobre base oscura) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(58% 48% at 84% 2%, rgba(241,84,28,0.16) 0%, transparent 60%)",
        }}
      />

      {/* Stage: en desktop se pinea (100svh); en móvil crece en flujo */}
      <div ref={stageRef} className="relative flex min-h-svh flex-col justify-center overflow-hidden">
        {REASONS.map((r, i) => (
          <div
            key={i}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            className="flex flex-col justify-center px-6 py-[12vh] sm:px-10 md:px-14 lg:py-0"
          >
            <div className="mx-auto w-full max-w-[1400px]">
              {/* Título-manifiesto gigante a dos tonos (letras animadas). Wrap a
                  varias líneas; sin eyebrow ni números. */}
              <h2
                aria-label={`${r.lead} ${r.accent}`}
                className="m-0 font-display font-semibold"
                style={{
                  fontSize: KEY_FONT,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.04,
                  maxWidth: "15ch",
                  overflowWrap: "break-word",
                }}
              >
                <span aria-hidden="true" className="text-cream/80">
                  {letters(r.lead)}
                </span>
                <span aria-hidden="true" className="inline-block w-[0.28em]" />
                <span aria-hidden="true" className="text-orange">
                  {letters(r.accent)}
                </span>
              </h2>

              {/* Línea de apoyo */}
              <p
                data-meta
                className="mt-5 max-w-[44ch] font-body text-lg font-light leading-relaxed text-cream/70 sm:mt-6 sm:text-xl"
                style={{ opacity: 0 }}
              >
                {r.support}
              </p>
            </div>
          </div>
        ))}

        {/* Barra de progreso del recorrido (solo desktop pinneado) */}
        <span
          ref={progressRef}
          aria-hidden="true"
          className="absolute bottom-0 left-0 hidden h-px w-full origin-left bg-ember lg:block"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </section>
  );
}
