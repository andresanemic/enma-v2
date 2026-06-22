"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import type { Proyecto } from "@/lib/proyectos";
import PrevNextCard from "./PrevNext";

// ─────────────────────────────────────────────────────────────────────────────
// PROYECTO — página de detalle (/proyectos/[slug]). Concepto "Lámina viva del
// viento": la hoja de un dossier de ingeniería que el viento —aquello para lo que
// la turbina está diseñada— atraviesa. Habla con el resto del sitio:
//   · WindField (el MISMO motor de flujo de la sección Métricas, paleta cálida).
//   · Vocabulario blueprint/cota (leaders que se trazan, nodos) en TODOS los bloques.
//   · Reveals IO + fallback, hovers vivos, gradiente cálido anclado → Footer verde.
//
// Bloques: Hero (espécimen acotado en su viento) · Narrativa asimétrica (Contexto /
// Qué hicimos) · Ficha técnica = "lámina de cotas" (incluye la validación CFD →
// túnel → prototipo) · "Cómo lo abordamos" (riel conectado) · "Siguiente lámina"
// (prev/next con imagen). Copy desde lib/proyectos.ts.
// ─────────────────────────────────────────────────────────────────────────────

type NavPair = { prev: Proyecto; next: Proyecto };

export default function ProyectoDetalle({ proyecto, nav }: { proyecto: Proyecto; nav: NavPair }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Riel "Cómo lo abordamos": usa el enriquecido (label + detalle) si existe;
  // si no, cae a las capabilities simples (CIEP / biodiésel).
  const steps = proyecto.approach ?? proyecto.capabilities.map((label) => ({ label, detail: "" }));

  // Título con realce: parte el título alrededor de titleAccent (solo énfasis).
  const renderTitle = () => {
    const acc = proyecto.titleAccent;
    if (!acc || !proyecto.title.includes(acc)) return proyecto.title;
    const [before, after] = proyecto.title.split(acc);
    return (
      <>
        {before}
        <span className="text-terra">{acc}</span>
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
        q("[data-panel]", b).forEach((e) => gsap.set(e, { clipPath: "inset(0% 0 0 0 round 18px)" }));
        q("[data-rail]", b).forEach((e) => gsap.set(e, { scaleX: 1 }));
        q("[data-rail-v]", b).forEach((e) => gsap.set(e, { scaleY: 1 }));
        q("[data-step]", b).forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
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

      // Orquestación en 2 tiers (acorde al sitio, sin sobrecarga):
      //   · Showcase → clip-wipe: la foto del espécimen en el Hero.
      //   · Tranquilo → una sola familia de fade-up (y:16/18, ~0.7s) en el resto;
      //     la curva de nivel de "Cómo" es el único trazo-firma extra.
      switch (id) {
        case "hero": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 }, 0);
          tl.fromTo(q("[data-panel]", b), { clipPath: "inset(100% 0 0 0 round 18px)" }, { clipPath: "inset(0% 0 0 0 round 18px)", duration: 0.9, ease: "power3.inOut" }, 0.25);
          break;
        }
        case "ficha": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
          tl.fromTo(q("[data-card]", b), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 }, 0.15);
          break;
        }
        case "narrativa": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.12 }, 0);
          break;
        }
        case "rail": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
          tl.fromTo(q("[data-rail]", b), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.inOut" }, 0.15);
          tl.fromTo(q("[data-rail-v]", b), { scaleY: 0 }, { scaleY: 1, duration: 0.9, ease: "power2.inOut" }, 0.15);
          tl.fromTo(q("[data-step]", b), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 }, 0.35);
          break;
        }
        case "next": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
          tl.fromTo(q("[data-card]", b), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 }, 0.12);
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
        <div className="relative z-10 mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-6 pb-12 pt-32 sm:px-10 sm:pt-40 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:px-14 md:pb-16 md:pt-40">
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

      {/* ════════ 2 · NARRATIVA — Contexto / Qué hicimos (asimétrica) ════════ */}
      <section
        data-reveal="narrativa"
        data-nav="light"
        className="relative w-full"
        style={{ background: "linear-gradient(180deg, #f3ddbc 0%, #edcfa4 100%)" }}
      >
        <div className="mx-auto max-w-[1180px] px-6 py-12 sm:px-10 md:px-14 md:py-16">
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
        </div>
      </section>

      {/* ════════ 3 · FICHA TÉCNICA — lámina de cotas (grilla blueprint) ════════ */}
      <section
        data-reveal="ficha"
        data-nav="light"
        className="relative w-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, #edcfa4 0%, #e8c08e 100%)" }}
      >
        {/* Trama blueprint tenue, anclada a la esquina superior derecha */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(26,26,26,0.05) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(26,26,26,0.05) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            maskImage: "radial-gradient(120% 100% at 100% 0%, #000 28%, transparent 78%)",
            WebkitMaskImage: "radial-gradient(120% 100% at 100% 0%, #000 28%, transparent 78%)",
          }}
        />
        <div className="relative mx-auto max-w-[1180px] px-6 py-12 sm:px-10 md:px-14 md:py-16">
          <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-terra" style={{ opacity: 0 }}>
            Ficha técnica
          </h2>

          {/* Panel flotante: celdas en grilla, separadas por hairlines (papel técnico).
              Cada celda enciende en hover; la marca de registro "+" gira y se vuelve brasa. */}
          <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-[20px] bg-ink/12 shadow-[0_24px_60px_-40px_rgba(26,26,26,0.55)] ring-1 ring-ink/12 sm:grid-cols-2">
            {proyecto.facts.map((f, i) => {
              const spanAll = i === proyecto.facts.length - 1 && proyecto.facts.length % 2 === 1;
              return (
                <div
                  key={f.label}
                  data-card
                  className={`group relative bg-cream/75 px-6 py-6 transition-colors duration-300 hover:bg-sand/80 sm:px-7 sm:py-7 ${spanAll ? "sm:col-span-2" : ""}`}
                  style={{ opacity: 0 }}
                >
                  {/* Marca de registro (cruz de cotas) — gira y se enciende en hover */}
                  <svg
                    viewBox="0 0 12 12"
                    aria-hidden="true"
                    className="absolute right-5 top-5 h-3 w-3 text-ink/25 transition-all duration-300 group-hover:rotate-90 group-hover:text-ember"
                    fill="none"
                  >
                    <path d="M6 0.5v11M0.5 6h11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                  </svg>
                  <dt className="flex items-center gap-2.5 pr-8 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/55">
                    <span className="h-3 w-[3px] shrink-0 rounded-full bg-terra transition-all duration-300 group-hover:h-4 group-hover:bg-ember" />
                    {f.label}
                  </dt>
                  <dd className="mt-2.5 font-display text-lg font-medium leading-snug text-ink transition-colors duration-200 group-hover:text-terra sm:text-xl">
                    {f.value}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </section>

      {/* ════════ 4 · CÓMO LO ABORDAMOS — riel conectado (ex-pills) ════════ */}
      <section
        data-reveal="rail"
        data-nav="light"
        className="relative w-full"
        style={{ background: "linear-gradient(180deg, #e8c08e 0%, #edca9c 100%)" }}
      >
        <div className="mx-auto max-w-[1180px] px-6 py-12 sm:px-10 md:px-14 md:py-16">
          <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink/55" style={{ opacity: 0 }}>
            Cómo lo abordamos
          </h2>

          <div className="relative mt-10 md:mt-14">
            {/* Curva de nivel que se traza tras los nodos (desktop); en móvil,
                conector vertical recto para la columna de cards. */}
            <div data-rail aria-hidden="true" className="absolute left-0 right-0 top-[10px] hidden origin-left sm:block" style={{ transform: "scaleX(0)" }}>
              <svg viewBox="0 0 1200 12" preserveAspectRatio="none" className="h-3 w-full text-ink/25" fill="none">
                <path d="M0 6 C 100 1, 200 11, 300 6 S 500 1, 600 6 S 800 11, 900 6 S 1100 1, 1200 6" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <span data-rail-v aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 block w-px origin-top bg-ink/20 sm:hidden" style={{ transform: "scaleY(0)" }} />

            <ol className="flex flex-col gap-5 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4">
              {steps.map((s) => (
                <li
                  key={s.label}
                  data-step
                  className="group flex items-start gap-4 sm:flex-1 sm:flex-col sm:items-center sm:gap-4 sm:text-center"
                  style={{ opacity: 0 }}
                >
                  {/* Nodo (estación) sobre la curva — se enciende y crece en hover */}
                  <span className="relative z-10 mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 border-terra bg-cream transition-colors duration-300 group-hover:border-ember sm:mt-0">
                    <span className="h-[6px] w-[6px] rounded-full bg-terra transition-all duration-300 group-hover:h-[10px] group-hover:w-[10px] group-hover:bg-ember" />
                  </span>
                  {/* Card: panel cálido que cuelga del nodo */}
                  <span className="block w-full rounded-2xl bg-cream/70 px-4 py-4 text-left ring-1 ring-ink/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-sand/75 group-hover:shadow-[0_18px_42px_-28px_rgba(26,26,26,0.55)] group-hover:ring-terra/40 sm:flex-1 sm:text-center">
                    <span className="block font-display text-base font-medium leading-snug text-ink transition-colors duration-200 group-hover:text-terra">
                      {s.label}
                    </span>
                    {s.detail && (
                      <span className="mt-1.5 block font-body text-[13px] font-light leading-snug text-ink/55">{s.detail}</span>
                    )}
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
        style={{ background: "linear-gradient(180deg, #edca9c 0%, #f3ddbc 100%)" }}
      >
        <div className="mx-auto max-w-[1180px] px-6 pb-20 pt-4 sm:px-10 md:px-14 md:pb-24">
          <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink/55" style={{ opacity: 0 }}>
            Más proyectos
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <PrevNextCard
              item={{ href: `/proyectos/${nav.prev.slug}`, image: nav.prev.image, imageAlt: nav.prev.imageAlt, eyebrow: nav.prev.domain, title: nav.prev.title }}
              dir="prev"
            />
            <PrevNextCard
              item={{ href: `/proyectos/${nav.next.slug}`, image: nav.next.image, imageAlt: nav.next.imageAlt, eyebrow: nav.next.domain, title: nav.next.title }}
              dir="next"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
