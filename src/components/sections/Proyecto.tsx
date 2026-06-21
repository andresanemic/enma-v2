"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

// ── Specs reales de la turbina (que-es-enma.txt) — sin números inventados ──
type Spec = { title: string; sub: string };
const SPECS_LEFT: Spec[] = [
  { title: "Financiada por ANID", sub: "También financió este sitio" },
  { title: "Baja escala", sub: "Granjas de muchas unidades" },
];
const SPECS_RIGHT: Spec[] = [
  { title: "Resiliente a vientos extremos", sub: "Ráfagas y alta turbulencia" },
  { title: "Túnel de viento + CFD", sub: "Validada con prototipo físico" },
];
const SPECS_ALL: Spec[] = [...SPECS_LEFT, ...SPECS_RIGHT];

// Título → palabras (rise+blur, sin clip → seguro al hacer wrap, lore/animation).
const HEAD_WORDS = ["Una", "turbina", "para", "el"];
const HEAD_ACCENT = "viento extremo";

export default function Proyecto() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = <T extends Element>(sel: string) => Array.from(el.querySelectorAll<T>(sel));

    if (reduce) {
      gsap.set(q("[data-head-word]"), { opacity: 1, y: 0, filter: "blur(0px)" });
      gsap.set(q("[data-dek], [data-cta], [data-anno], [data-anno-m], [data-cota-label]"), { opacity: 1, x: 0, y: 0 });
      gsap.set(q("[data-panel]"), { clipPath: "inset(0 0 0 0 round 18px)" });
      gsap.set(q("[data-leader]"), { scaleX: 1 });
      gsap.set(q("[data-cota]"), { strokeDashoffset: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(q("[data-head-word]"), { opacity: 0, y: "0.8em", filter: "blur(6px)" }, { opacity: 1, y: "0em", filter: "blur(0px)", duration: 0.8, stagger: 0.08 }, 0);
        const dek = el.querySelector("[data-dek]");
        if (dek) tl.fromTo(dek, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, 0.3);

        // Panel — el espécimen "se levanta" desde la base (clip de abajo hacia arriba).
        const panel = el.querySelector("[data-panel]");
        if (panel) tl.fromTo(panel, { clipPath: "inset(100% 0 0 0 round 18px)" }, { clipPath: "inset(0% 0 0 0 round 18px)", duration: 1.0, ease: "power3.inOut" }, 0.45);

        // Cotas técnicas — se trazan; sus labels aparecen detrás.
        tl.fromTo(q("[data-cota]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, stagger: 0.12, ease: "power2.inOut" }, 1.0);
        tl.fromTo(q("[data-cota-label]"), { opacity: 0 }, { opacity: 1, duration: 0.5, stagger: 0.1 }, 1.3);

        // Líneas guía (draw-on por scaleX) + anotaciones (fade) — desktop.
        tl.fromTo(q("[data-leader]"), { scaleX: 0 }, { scaleX: 1, duration: 0.6, stagger: 0.12, ease: "power2.out" }, 1.05);
        tl.fromTo(q("[data-anno]"), { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.12 }, 1.2);
        // Lista de specs (móvil) — cascada.
        tl.fromTo(q("[data-anno-m]"), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 }, 1.0);

        const cta = el.querySelector("[data-cta]");
        if (cta) tl.fromTo(cta, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.7 }, 1.5);
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

  // Anotación flanqueante (desktop). side controla la dirección de la línea guía.
  // Sección clara → líneas y texto en tinta (plano de ingeniería sobre arena).
  const Anno = ({ s, side }: { s: Spec; side: "left" | "right" }) => {
    const dot = <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ink/50" />;
    const leader = (
      <span
        data-leader
        className={`block h-px w-12 bg-ink/40 lg:w-20 ${side === "left" ? "origin-left" : "origin-right"}`}
        style={{ transform: "scaleX(0)" }}
      />
    );
    const text = (
      <div className={side === "left" ? "text-right" : "text-left"}>
        <p className="font-display text-[15px] font-medium leading-tight text-ink lg:text-base">{s.title}</p>
        <p className="mt-0.5 font-body text-[12px] uppercase tracking-[0.12em] text-ink/55">{s.sub}</p>
      </div>
    );
    return (
      <div data-anno className="flex items-center gap-3" style={{ opacity: 0 }}>
        {side === "left" ? (
          <>
            {text}
            {leader}
            {dot}
          </>
        ) : (
          <>
            {dot}
            {leader}
            {text}
          </>
        )}
      </div>
    );
  };

  return (
    <section
      ref={ref}
      id="proyecto"
      data-nav="light"
      className="relative w-full overflow-hidden px-6 py-24 sm:px-10 sm:py-28 md:px-14 md:py-32"
      // Tramo superior del degradado (claro). Ancla abajo en crema (FAQ) y sube
      // hasta este ámbar-arena suave, sin llegar a tonos oscuros.
      style={{ background: "linear-gradient(180deg, #eac395 0%, #eecea1 100%)" }}
    >
      {/* Grilla de ingeniería finísima (papel técnico) — líneas en tinta sobre arena */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(26,26,26,0.05) 0 1px, transparent 1px 34px)," +
            "repeating-linear-gradient(90deg, rgba(26,26,26,0.05) 0 1px, transparent 1px 34px)",
        }}
      />

      <div className="relative mx-auto max-w-[1180px]">
        {/* ── Encabezado (alineado a la izquierda, como las demás secciones) ── */}
        <div className="mb-14 md:mb-20">
          <h2 className="m-0 max-w-[20ch] font-display font-light text-ink" aria-label="Una turbina para el viento extremo." style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)", lineHeight: 1.06, letterSpacing: "-0.03em" }}>
            <span aria-hidden="true">
              {HEAD_WORDS.map((w, i) => (
                <span key={i} data-head-word className="mr-[0.24em] inline-block" style={{ opacity: 0, transform: "translateY(0.8em)" }}>
                  {w}
                </span>
              ))}
              <span data-head-word className="inline-block font-medium text-terra" style={{ opacity: 0, transform: "translateY(0.8em)" }}>
                {HEAD_ACCENT}
              </span>
              <span data-head-word className="inline-block" style={{ opacity: 0, transform: "translateY(0.8em)" }}>
                .
              </span>
            </span>
          </h2>
          <p data-dek className="mt-5 max-w-[58ch] font-body text-base font-light leading-relaxed text-ink/65 sm:text-lg" style={{ opacity: 0 }}>
            El proyecto que más queremos mostrar: un diseño propio de baja escala, financiado por ANID, pensado para los vientos más difíciles de la Patagonia.
          </p>
        </div>

        {/* ── Escenario: espécimen central + anotaciones flanqueantes (desktop) ── */}
        <div className="flex flex-col items-center md:flex-row md:justify-center md:gap-8 lg:gap-12">
          {/* Columna izquierda (desktop) */}
          <div className="hidden w-[200px] flex-col items-end gap-12 md:flex lg:w-[240px]">
            {SPECS_LEFT.map((s) => (
              <Anno key={s.title} s={s} side="left" />
            ))}
          </div>

          {/* Panel central — la turbina como espécimen */}
          <div className="relative shrink-0">
            <div data-panel className="group/panel relative aspect-[3/4] w-[clamp(230px,32vw,340px)] overflow-hidden rounded-[18px] ring-1 ring-ink/15" style={{ clipPath: "inset(100% 0 0 0 round 18px)" }}>
              <Image
                src="/proyecto/turbina.jpg"
                alt="Turbina eólica de baja escala en un paisaje abierto"
                fill
                sizes="(min-width: 768px) 300px, 70vw"
                className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover/panel:scale-[1.06]"
              />

              {/* Cotas técnicas (draw-on) — ↕ torre (izq) · ↔ rotor (arriba) */}
              <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full text-ink/55" viewBox="0 0 100 133" preserveAspectRatio="none" fill="none">
                {/* rotor — horizontal arriba */}
                <path data-cota d="M26 16 H74" stroke="currentColor" strokeWidth="0.6" vectorEffect="non-scaling-stroke" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
                <path d="M26 13 V19 M74 13 V19" stroke="currentColor" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
                {/* torre — vertical izquierda */}
                <path data-cota d="M10 30 V120" stroke="currentColor" strokeWidth="0.6" vectorEffect="non-scaling-stroke" pathLength={1} style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
                <path d="M7 30 H13 M7 120 H13" stroke="currentColor" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
              </svg>
              <span data-cota-label className="absolute left-[14%] top-[8%] font-body text-[10px] uppercase tracking-[0.18em] text-cream/90 mix-blend-difference" style={{ opacity: 0 }}>
                rotor
              </span>
              <span data-cota-label className="absolute left-[2%] top-1/2 -translate-y-1/2 -rotate-90 font-body text-[10px] uppercase tracking-[0.18em] text-cream/90 mix-blend-difference" style={{ opacity: 0 }}>
                torre
              </span>
            </div>
          </div>

          {/* Columna derecha (desktop) */}
          <div className="hidden w-[200px] flex-col items-start gap-12 md:flex lg:w-[240px]">
            {SPECS_RIGHT.map((s) => (
              <Anno key={s.title} s={s} side="right" />
            ))}
          </div>
        </div>

        {/* ── Specs (móvil) — lista limpia bajo el espécimen ── */}
        <ul className="mx-auto mt-10 grid max-w-[420px] grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
          {SPECS_ALL.map((s) => (
            <li key={s.title} data-anno-m className="flex items-start gap-2.5" style={{ opacity: 0 }}>
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/50" />
              <div>
                <p className="font-display text-[15px] font-medium leading-tight text-ink">{s.title}</p>
                <p className="mt-0.5 font-body text-[12px] uppercase tracking-[0.12em] text-ink/55">{s.sub}</p>
              </div>
            </li>
          ))}
        </ul>

        {/* ── Pie + CTA ── */}
        <div data-cta className="mt-14 text-center md:mt-20" style={{ opacity: 0 }}>
          <p className="font-body text-sm uppercase tracking-[0.16em] text-ink/55">
            Netbilling · reduce la cuenta de luz — campo, electrificación rural e industria
          </p>
          <Link
            href="/proyectos"
            className="group mt-6 inline-flex items-center gap-2.5 font-display text-lg font-medium text-terra transition-colors duration-200 hover:text-ember"
          >
            <span className="relative">
              Ver el proyecto
              <span aria-hidden="true" className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-ember transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
            </span>
            <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" fill="none" aria-hidden="true">
              <path d="M3 10h13M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
