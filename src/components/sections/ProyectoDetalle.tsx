"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import type { Proyecto } from "@/lib/proyectos";

// ─────────────────────────────────────────────────────────────────────────────
// PROYECTO — página de detalle (/proyectos/[slug]). Concepto "Lámina viva del
// viento": la hoja de un dossier de ingeniería que el viento —aquello para lo que
// la turbina está diseñada— atraviesa. Habla con el resto del sitio:
//   · WindField (el MISMO motor de flujo de la sección Métricas, paleta cálida).
//   · Vocabulario blueprint/cota (leaders que se trazan, nodos) en TODOS los bloques.
//   · Reveals IO + fallback, hovers vivos, gradiente cálido anclado → Footer verde.
//
// Bloques: Hero (espécimen acotado en su viento) · Ficha = "lecturas" · Narrativa
// asimétrica (Contexto / Qué hicimos) · "Cómo lo abordamos" (riel conectado) ·
// "Siguiente lámina" (prev/next con imagen). Copy desde lib/proyectos.ts.
// ─────────────────────────────────────────────────────────────────────────────

type NavPair = { prev: Proyecto; next: Proyecto };

export default function ProyectoDetalle({ proyecto, nav }: { proyecto: Proyecto; nav: NavPair }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Título con realce: parte el título alrededor de titleAccent (solo énfasis).
  const renderTitle = () => {
    const acc = proyecto.titleAccent;
    if (!acc || !proyecto.title.includes(acc)) return proyecto.title;
    const [before, after] = proyecto.title.split(acc);
    return (
      <>
        {before}
        <span className="relative inline-block text-terra">
          {acc}
          <span
            data-accent-rule
            aria-hidden="true"
            className="absolute -bottom-[0.04em] left-0 block h-[3px] w-full origin-left rounded-full bg-ember"
            style={{ transform: "scaleX(0)" }}
          />
        </span>
        {after}
      </>
    );
  };

  // ── Reveals por bloque (IO + fallback gateado por visibilidad real, lore/animation).
  //    Cada bloque su firma; FOUC-safe (fromTo + estado inicial inline). ──
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const q = <T extends Element>(s: string, ctx: ParentNode) => Array.from(ctx.querySelectorAll<T>(s));

    if (reduce) {
      blocks.forEach((b) => {
        q("[data-fade]", b).forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
        q("[data-accent-rule]", b).forEach((e) => gsap.set(e, { scaleX: 1 }));
        q("[data-panel]", b).forEach((e) => gsap.set(e, { clipPath: "inset(0% 0 0 0 round 18px)" }));
        q("[data-leader]", b).forEach((e) => gsap.set(e, { scaleX: 1 }));
        q("[data-node]", b).forEach((e) => gsap.set(e, { opacity: 1, scale: 1 }));
        q("[data-rail]", b).forEach((e) => gsap.set(e, { scaleX: 1 }));
        q("[data-rail-v]", b).forEach((e) => gsap.set(e, { scaleY: 1 }));
        q("[data-step]", b).forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
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
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 }, 0);
          tl.fromTo(q("[data-panel]", b), { clipPath: "inset(100% 0 0 0 round 18px)" }, { clipPath: "inset(0% 0 0 0 round 18px)", duration: 0.9, ease: "power3.inOut" }, 0.25);
          tl.fromTo(q("[data-accent-rule]", b), { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: "power2.inOut" }, 0.6);
          break;
        }
        case "ficha": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
          tl.fromTo(q("[data-leader]", b), { scaleX: 0 }, { scaleX: 1, duration: 0.7, stagger: 0.1, ease: "power2.inOut" }, 0.15);
          tl.fromTo(q("[data-node]", b), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.45, stagger: 0.1, ease: "back.out(2)" }, 0.3);
          break;
        }
        case "narrativa": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.16 }, 0);
          tl.fromTo(q("[data-rule]", b), { scaleX: 0 }, { scaleX: 1, duration: 0.85, ease: "power2.inOut" }, 0.3);
          break;
        }
        case "rail": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
          tl.fromTo(q("[data-rail]", b), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 0.15);
          tl.fromTo(q("[data-rail-v]", b), { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: "power2.inOut" }, 0.15);
          tl.fromTo(q("[data-step]", b), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.1 }, 0.35);
          break;
        }
        case "next": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
          tl.fromTo(q("[data-card]", b), { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.12);
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
      {/* ════════ 1 · HERO — el espécimen en su viento ════════ */}
      <section
        data-reveal="hero"
        data-nav="light"
        className="relative w-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, #f8eddd 0%, #f3ddbc 100%)" }}
      >
        <div className="relative z-10 mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-6 pb-16 pt-32 sm:px-10 sm:pt-40 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:px-14 md:pb-24 md:pt-44">
          {/* Texto */}
          <div>
            <Link
              data-fade
              href="/proyectos"
              className="group mb-7 inline-flex items-center gap-2 font-body text-sm font-medium uppercase tracking-[0.14em] text-ink/55 transition-colors duration-200 hover:text-terra"
              style={{ opacity: 0 }}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-x-1" fill="none" aria-hidden="true">
                <path d="M17 10H4M9 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Todos los proyectos
            </Link>

            <h1
              data-fade
              className="m-0 font-display font-light text-ink"
              style={{ opacity: 0, fontSize: "clamp(2.5rem, 6.2vw, 4.6rem)", lineHeight: 1.0, letterSpacing: "-0.04em" }}
            >
              {renderTitle()}
            </h1>
            <p data-fade className="mt-6 max-w-[50ch] font-body text-lg font-light leading-relaxed text-ink/70 sm:text-xl" style={{ opacity: 0 }}>
              {proyecto.lead}
            </p>
          </div>

          {/* Espécimen — imagen con cotas que se trazan */}
          <div data-fade className="relative" style={{ opacity: 0 }}>
            <div data-panel className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] ring-1 ring-ink/15 shadow-[0_30px_70px_-40px_rgba(26,26,26,0.6)]" style={{ clipPath: "inset(100% 0 0 0 round 18px)" }}>
              <Image src={proyecto.image} alt={proyecto.imageAlt} fill priority sizes="(min-width: 768px) 520px, 90vw" className="object-cover object-center" />
              {/* Scrim inferior → la pill y el borde se leen */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(0deg, rgba(26,26,26,0.22) 0%, transparent 20%)" }}
              />
              {/* Pill de dominio (sin eyebrow sobre el título) */}
              <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3.5 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.16em] text-ink shadow-[0_6px_18px_-8px_rgba(26,26,26,0.5)] backdrop-blur-sm">
                {proyecto.domain}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════ 2 · FICHA = "lecturas" (no tabla) ════════ */}
      <section
        data-reveal="ficha"
        data-nav="light"
        className="relative w-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, #f3ddbc 0%, #eecea1 100%)" }}
      >
        <div className="relative mx-auto max-w-[1180px] px-6 py-16 sm:px-10 md:px-14 md:py-24">
          <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-terra" style={{ opacity: 0 }}>
            Ficha técnica
          </h2>
          <dl className="mt-8 flex flex-col">
            {proyecto.facts.map((f) => (
              <div key={f.label} className="group relative">
                <div className="grid grid-cols-1 gap-1 py-5 transition-colors duration-300 sm:grid-cols-[220px_1fr] sm:items-baseline sm:gap-8 sm:py-6">
                  <dt className="flex items-center gap-2.5 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/55">
                    <span data-node className="h-1.5 w-1.5 shrink-0 rounded-full bg-terra transition-colors duration-200 group-hover:bg-ember" style={{ opacity: 0, transform: "scale(0)" }} />
                    {f.label}
                  </dt>
                  <dd className="font-display text-lg font-medium leading-snug text-ink transition-colors duration-200 group-hover:text-terra sm:text-xl">
                    {f.value}
                  </dd>
                </div>
                <span data-leader aria-hidden="true" className="absolute bottom-0 left-0 block h-px w-full origin-left bg-ink/15" style={{ transform: "scaleX(0)" }} />
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ════════ 3 · NARRATIVA — Contexto / Qué hicimos (asimétrica) ════════ */}
      <section
        data-reveal="narrativa"
        data-nav="light"
        className="relative w-full"
        style={{ background: "linear-gradient(180deg, #eecea1 0%, #eac395 100%)" }}
      >
        <div className="mx-auto max-w-[1180px] px-6 py-16 sm:px-10 md:px-14 md:py-24">
          {/* El contexto */}
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-12">
            <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-terra md:col-span-3" style={{ opacity: 0 }}>
              El contexto
            </h2>
            <p data-fade className="font-body text-xl font-light leading-relaxed text-ink/80 md:col-span-9 md:text-2xl" style={{ opacity: 0 }}>
              {proyecto.context}
            </p>
          </div>

          {/* Qué hicimos — desplazado, acento teal */}
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-4 md:mt-20 md:grid-cols-12">
            <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-teal md:col-span-3" style={{ opacity: 0 }}>
              Qué hicimos
            </h2>
            <p data-fade className="font-body text-base font-light leading-relaxed text-ink/75 md:col-span-9 md:text-lg" style={{ opacity: 0 }}>
              {proyecto.did}
            </p>
          </div>

          {/* Curva de nivel (mismo divider que el cierre de la mini-landing) */}
          <div data-rule aria-hidden="true" className="mt-16 w-full origin-left md:mt-24" style={{ transform: "scaleX(0)" }}>
            <svg viewBox="0 0 1200 12" preserveAspectRatio="none" className="h-3 w-full text-ink/20" fill="none">
              <path d="M0 6 C 100 1, 200 11, 300 6 S 500 1, 600 6 S 800 11, 900 6 S 1100 1, 1200 6" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>
      </section>

      {/* ════════ 4 · CÓMO LO ABORDAMOS — riel conectado (ex-pills) ════════ */}
      <section
        data-reveal="rail"
        data-nav="light"
        className="relative w-full"
        style={{ background: "linear-gradient(180deg, #eac395 0%, #eecea1 100%)" }}
      >
        <div className="mx-auto max-w-[1180px] px-6 py-16 sm:px-10 md:px-14 md:py-24">
          <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink/55" style={{ opacity: 0 }}>
            Cómo lo abordamos
          </h2>

          <div className="relative mt-10 md:mt-14">
            {/* Riel: línea base que se traza (horizontal en desktop, vertical en móvil) */}
            <span data-rail aria-hidden="true" className="absolute left-0 right-0 top-[11px] hidden h-px origin-left bg-ink/20 sm:block" style={{ transform: "scaleX(0)" }} />
            <span data-rail-v aria-hidden="true" className="absolute bottom-2 left-[11px] top-2 block w-px origin-top bg-ink/20 sm:hidden" style={{ transform: "scaleY(0)" }} />

            <ol className="flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
              {proyecto.capabilities.map((c) => (
                <li
                  key={c}
                  data-step
                  className="group flex items-start gap-4 sm:max-w-[15ch] sm:flex-col sm:items-center sm:gap-4 sm:text-center"
                  style={{ opacity: 0 }}
                >
                  <span className="relative z-10 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-terra bg-cream transition-colors duration-200 group-hover:border-ember">
                    <span className="h-[6px] w-[6px] rounded-full bg-terra transition-colors duration-200 group-hover:bg-ember" />
                  </span>
                  <span className="font-display text-base font-medium leading-snug text-ink transition-colors duration-200 group-hover:text-terra">
                    {c}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ════════ 5 · SIGUIENTE LÁMINA — prev / next con imagen ════════ */}
      <section
        data-reveal="next"
        data-nav="light"
        className="relative w-full"
        style={{ background: "linear-gradient(180deg, #eecea1 0%, #f3ddbc 100%)" }}
      >
        <div className="mx-auto max-w-[1180px] px-6 pb-24 pt-4 sm:px-10 md:px-14 md:pb-32">
          <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink/55" style={{ opacity: 0 }}>
            Más proyectos
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <PlateCard proyecto={nav.prev} dir="prev" />
            <PlateCard proyecto={nav.next} dir="next" />
          </div>
        </div>
      </section>
    </div>
  );
}

// "Lámina" prev/next: tarjeta con la imagen del proyecto + hover vivo (zoom + flecha).
function PlateCard({ proyecto, dir }: { proyecto: Proyecto; dir: "prev" | "next" }) {
  const isPrev = dir === "prev";
  const arrow = isPrev ? "M17 10H4M9 5l-5 5 5 5" : "M3 10h13M11 5l5 5-5 5";
  return (
    <Link
      data-card
      href={`/proyectos/${proyecto.slug}`}
      aria-label={`${isPrev ? "Proyecto anterior" : "Proyecto siguiente"}: ${proyecto.title}`}
      className="group relative block aspect-[16/10] overflow-hidden rounded-[18px] outline-none ring-1 ring-ink/12 transition-shadow duration-500 focus-visible:ring-2 focus-visible:ring-terra/60 hover:shadow-[0_28px_60px_-30px_rgba(26,26,26,0.5)]"
      style={{ opacity: 0 }}
    >
      <Image
        src={proyecto.image}
        alt={proyecto.imageAlt}
        fill
        sizes="(min-width: 768px) 560px, 90vw"
        className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(26,26,26,0.15) 0%, transparent 40%, rgba(26,26,26,0.4) 60%, rgba(26,26,26,0.82) 100%)" }}
      />
      <div className={`absolute inset-0 flex flex-col justify-between p-6 ${isPrev ? "items-start text-left" : "items-end text-right"}`}>
        <span className={`flex items-center gap-2 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-cream/85 transition-colors duration-200 group-hover:text-orange ${isPrev ? "" : "flex-row-reverse"}`}>
          <svg viewBox="0 0 20 20" className={`h-3.5 w-3.5 transition-transform duration-300 ease-out ${isPrev ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} fill="none" aria-hidden="true">
            <path d={arrow} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {isPrev ? "Anterior" : "Siguiente"}
        </span>
        <div>
          <p className="font-body text-[11px] uppercase tracking-[0.14em] text-cream/65">{proyecto.domain}</p>
          <p className="mt-1 font-display font-medium leading-tight text-cream" style={{ fontSize: "clamp(1.35rem, 2.4vw, 1.9rem)", letterSpacing: "-0.02em" }}>
            {proyecto.title}
          </p>
        </div>
      </div>
    </Link>
  );
}
