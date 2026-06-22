"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { PROYECTOS } from "@/lib/proyectos";

// ─────────────────────────────────────────────────────────────────────────────
// PROYECTOS — mini-landing (banco de proyectos). 3 secciones, igual que Vinculación:
//   1 · Hero (sin imágenes) — portada de dossier, datum que se traza.
//   2 · Fila de 3 cards que GIRAN en hover (foto ↔ ficha de ingeniería).
//   3 · Cierre cálido centrado (mismo patrón que Vinculación) → entrega al Footer.
//
// Firma: "papel técnico / blueprint" — grilla de ingeniería de fondo, cotas y el
// giro foto→plano que encarna la tesis (territorio ↔ rigor). Acento terra + "E" teal.
// Copy en 1ª persona; datos solo de que-es-enma.txt.
// ─────────────────────────────────────────────────────────────────────────────

export default function Proyectos() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeMobileCard, setActiveMobileCard] = useState<string | null>(null);

  const handleCardClick =
    (slug: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!window.matchMedia("(pointer: coarse)").matches) return;
      if (activeMobileCard === slug) return;
      e.preventDefault();
      setActiveMobileCard(slug);
    };

  // ── Reveals por bloque (IO + fallback gateado por visibilidad real, lore/animation).
  //    Cada bloque su firma; ninguna repite la coreografía reservada a Hero/Footer. ──
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const q = <T extends Element>(s: string, ctx: ParentNode) =>
      Array.from(ctx.querySelectorAll<T>(s));

    if (reduce) {
      blocks.forEach((b) => {
        q("[data-fade]", b).forEach((e) => gsap.set(e, { opacity: 1, y: 0, scale: 1 }));
        q("[data-rule]", b).forEach((e) => gsap.set(e, { scaleX: 1 }));
        q("[data-card]", b).forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
      });
      return;
    }

    const played = new WeakSet<HTMLElement>();
    const play = (b: HTMLElement) => {
      if (played.has(b)) return;
      played.add(b);
      const id = b.dataset.reveal;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      switch (id) {
        case "hero": {
          // El titular "se asienta" (sube + leve escala), distinto del clip-wipe de Vinculación.
          tl.fromTo(
            q("[data-fade]", b),
            { opacity: 0, y: 16, scale: 0.995 },
            { opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.12 },
            0
          );
          // Datum: línea de cota que se traza bajo el título.
          tl.fromTo(q("[data-rule]", b), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 0.25);
          break;
        }
        case "cards": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
          // Cards: cascada que sube (clip-up por translate). El flip vive aparte (CSS).
          tl.fromTo(
            q("[data-card]", b),
            { opacity: 0, y: 34 },
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.13 },
            0.12
          );
          break;
        }
        case "cierre": {
          tl.fromTo(q("[data-rule]", b), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 0);
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.15);
          break;
        }
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            play(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    blocks.forEach((b) => io.observe(b));

    const t = window.setTimeout(() => {
      blocks.forEach((b) => {
        const r = b.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) play(b);
      });
    }, 2600);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div ref={rootRef} className="w-full">
      {/* ════════ 1 · HERO — portada del dossier (sin imágenes) ════════ */}
      <section
        data-reveal="hero"
        data-nav="light"
        className="relative w-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, #f8eddd 0%, #f3ddbc 100%)" }}
      >
        <div className="relative mx-auto max-w-[900px] px-6 pb-8 pt-36 text-center sm:px-10 sm:pt-44 md:pb-10">
          <h1
            data-fade
            className="m-0 mx-auto font-display font-light text-ink"
            style={{ opacity: 0, fontSize: "clamp(2.4rem, 6.5vw, 5rem)", lineHeight: 1.02, letterSpacing: "-0.04em" }}
          >
            Nuestros proyectos,{" "}
            <span className="font-medium text-terra">del modelo al territorio</span>.
          </h1>

          <p
            data-fade
            className="mx-auto mt-6 max-w-[46ch] font-body text-lg font-light leading-relaxed text-ink/70 sm:text-xl"
            style={{ opacity: 0 }}
          >
            Tres iniciativas en energía y manufactura, nacidas en Aysén.
          </p>
        </div>
      </section>

      {/* ════════ 2 · CARDS — fila de 3 que giran (foto ↔ ficha) ════════ */}
      <section
        data-reveal="cards"
        data-nav="light"
        className="relative w-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, #f3ddbc 0%, #eecea1 100%)" }}
      >
        <div className="relative mx-auto max-w-[1340px] px-6 pb-20 pt-4 sm:px-10 md:px-14 md:pb-28 md:pt-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {PROYECTOS.map((p) => {
              const mob = activeMobileCard === p.slug;
              return (
                <Link
                  key={p.slug}
                  href={`/proyectos/${p.slug}`}
                  onClick={handleCardClick(p.slug)}
                  data-card
                  aria-label={`${p.title} — ver proyecto`}
                  className="group relative block aspect-[3/4.4] w-full overflow-hidden rounded-[18px] outline-none ring-1 ring-ink/12 transition-shadow duration-500 focus-visible:ring-2 focus-visible:ring-terra/60 hover:shadow-[0_28px_60px_-28px_rgba(26,26,26,0.45)]"
                  style={{ opacity: 0 }}
                >
                  <Image
                    src={p.image}
                    alt={p.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                    className={`object-cover object-center transition-[filter] duration-700 ease-out group-hover:blur-[7px] group-focus-within:blur-[7px]${mob ? " blur-[7px]" : ""}`}
                  />
                  {/* Scrim base */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(26,26,26,0.28) 0%, transparent 26%, transparent 52%, rgba(26,26,26,0.78) 100%)",
                    }}
                  />
                  {/* Velo oscuro al hover / tap */}
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 transition-colors duration-500 ease-out group-hover:bg-ink/55 group-focus-within:bg-ink/55${mob ? " bg-ink/55" : " bg-ink/0"}`}
                  />

                  {/* Pill de dominio */}
                  <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3.5 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.16em] text-ink shadow-[0_6px_18px_-8px_rgba(26,26,26,0.5)] backdrop-blur-sm">
                    {p.domain}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h2
                      className="m-0 font-display font-medium text-cream"
                      style={{ fontSize: "clamp(1.5rem, 2.4vw, 1.95rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}
                    >
                      {p.title}
                    </h2>
                    <p className={`mt-2 font-body text-[15px] font-light text-cream/75 transition-opacity duration-300 ease-out group-hover:opacity-0 group-focus-within:opacity-0${mob ? " opacity-0" : ""}`}>
                      {p.kicker}
                    </p>

                    <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100${mob ? " grid-rows-[1fr] opacity-100" : " grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <ul className="mt-4 flex flex-col gap-2.5">
                          {p.cardFacts.map((f) => (
                            <li key={f} className="flex items-start gap-2.5">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange" />
                              <span className="font-body text-sm font-light leading-snug text-cream/85">{f}</span>
                            </li>
                          ))}
                        </ul>
                        {mob && (
                          <p className="mt-4 font-body text-xs font-semibold uppercase tracking-[0.12em] text-orange/90">
                            Toca de nuevo para entrar →
                          </p>
                        )}
                        {!mob && (
                          <span className="mt-5 inline-flex items-center gap-2 font-display text-base font-medium text-cream">
                            <span className="relative">
                              Ver proyecto
                              <span aria-hidden="true" className="absolute -bottom-1 left-0 h-px w-full bg-orange" />
                            </span>
                            <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" fill="none" aria-hidden="true">
                              <path d="M3 10h13M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ 3 · CIERRE — claro cálido centrado (tono CTA) → entrega al Footer ════════ */}
      <section
        data-reveal="cierre"
        data-nav="light"
        className="relative w-full"
        style={{ background: "linear-gradient(180deg, #eecea1 0%, #f3ddbc 100%)" }}
      >
        <div className="mx-auto max-w-[900px] px-6 pb-24 pt-16 text-center sm:px-10 md:px-14 md:pb-32 md:pt-20">
          {/* Curva de nivel que se traza (mismo divider que el cierre de Vinculación) */}
          <div
            data-rule
            aria-hidden="true"
            className="mx-auto mb-10 w-full max-w-[440px] origin-left"
            style={{ transform: "scaleX(0)" }}
          >
            <svg viewBox="0 0 1200 12" preserveAspectRatio="none" className="h-3 w-full text-ink/20" fill="none">
              <path
                d="M0 6 C 100 1, 200 11, 300 6 S 500 1, 600 6 S 800 11, 900 6 S 1100 1, 1200 6"
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <h2
            data-fade
            className="m-0 mx-auto max-w-[24ch] font-display font-light text-ink"
            style={{ opacity: 0, fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            ¿Tienes un problema de energía o manufactura?{" "}
            <span className="font-medium text-teal">Conversémoslo</span>.
          </h2>
          <p
            data-fade
            className="mx-auto mt-6 max-w-[56ch] font-body text-base font-light leading-relaxed text-ink/65 sm:text-lg"
            style={{ opacity: 0 }}
          >
            Cada uno de estos proyectos empezó con una conversación. Cuéntanos qué
            necesitas resolver y lo estudiamos contigo.
          </p>
        </div>
      </section>
    </div>
  );
}
