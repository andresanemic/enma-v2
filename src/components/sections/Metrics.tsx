"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import WindField from "@/components/metrics/WindField";

// Métricas REALES (entrevistas + que-es-enma.txt). Sin cifras infladas.
// Confirmar con el cliente antes de publicar.
type Metric = {
  kind: "num" | "badge";
  value?: number;
  suffix?: string;
  text?: string;
  label: string;
  hint: string;
  accent: "orange" | "ember" | "teal" | "green";
  hero?: boolean;
};

const METRICS: Metric[] = [
  { kind: "num", value: 5, label: "Estudios energéticos liderados en Aysén", hint: "Para el sector público regional, junto al CIEP.", accent: "orange", hero: true },
  { kind: "badge", text: "ANID", label: "Proyecto de I+D financiado", hint: "Turbina eólica de baja escala, resiliente a vientos extremos.", accent: "teal" },
  { kind: "num", value: 100, suffix: "%", label: "Patagonia", hint: "Nacidos y operando en la Región de Aysén.", accent: "green" },
  { kind: "num", value: 4, label: "Fuentes renovables que dominamos", hint: "Eólica, solar, hidro y geotermia.", accent: "ember" },
  { kind: "num", value: 2, label: "Socios fundadores, ingenieros mecánicos", hint: "Con experiencia exitosa como consultores.", accent: "orange" },
];

const ACCENT = {
  orange: { bar: "bg-orange", num: "text-orange" },
  ember: { bar: "bg-ember", num: "text-ember" },
  teal: { bar: "bg-[#54c0a8]", num: "text-[#54c0a8]" },
  green: { bar: "bg-[#7cc38a]", num: "text-[#7cc38a]" },
} as const;

// Offsets verticales para una disposición orgánica (no-grid), tipo flotando.
const FLOAT = [
  { dur: "7s", delay: "0s", mt: "" },
  { dur: "8.5s", delay: "0.8s", mt: "lg:mt-14" },
  { dur: "7.8s", delay: "1.6s", mt: "lg:mt-6" },
  { dur: "9s", delay: "0.4s", mt: "lg:mt-20" },
  { dur: "8s", delay: "1.2s", mt: "lg:mt-10" },
];

const HEAD_WORDS = ["Respaldo", "que", "se", "puede"];
const HEAD_ACCENT = "medir";

export default function Metrics() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = <T extends Element>(sel: string) => Array.from(el.querySelectorAll<T>(sel));

    const ctx = gsap.context(() => {
      const words = q("[data-word]");
      const letters = q("[data-letter]");
      const sub = q("[data-sub]");
      const metrics = q<HTMLElement>("[data-metric]");
      const bars = q("[data-bar]");
      const stamps = q("[data-stamp]");
      const counts = q<HTMLElement>("[data-count]");

      const setCount = (n: HTMLElement, v: number) => { n.textContent = Math.round(v).toString(); };

      if (reduce) {
        gsap.set(words, { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(letters, { opacity: 1, y: 0 });
        gsap.set(sub, { opacity: 1, y: 0 });
        gsap.set(metrics, { opacity: 1, y: 0 });
        gsap.set(bars, { scaleX: 1 });
        gsap.set(stamps, { clipPath: "inset(0 0% 0 0)" });
        counts.forEach((n) => setCount(n, Number(n.dataset.target)));
        return;
      }

      let played = false;
      const play = () => {
        if (played) return;
        played = true;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(words, { opacity: 0, y: "0.9em", filter: "blur(6px)" }, { opacity: 1, y: "0em", filter: "blur(0px)", duration: 0.8, stagger: 0.09 }, 0);
        tl.fromTo(letters, { opacity: 0, y: "0.45em" }, { opacity: 1, y: "0em", duration: 0.5, stagger: 0.04, ease: "power2.out" }, 0.45);
        tl.fromTo(sub, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, 0.6);
        // Métricas — emergen del viento en cascada (izq → der)
        tl.fromTo(metrics, { opacity: 0, y: 30, filter: "blur(6px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9, stagger: 0.13 }, 0.7);
        tl.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 0.7, stagger: 0.1, ease: "power2.inOut" }, 1.0);
        tl.fromTo(stamps, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.8, ease: "power3.inOut" }, 1.05);

        // Contadores: el viento "carga" cada número (proxy → DOM, sin setState).
        counts.forEach((node, i) => {
          const target = Number(node.dataset.target);
          const o = { v: 0 };
          setCount(node, 0);
          gsap.to(o, {
            v: target,
            duration: 1.7,
            ease: "power2.out",
            delay: 0.85 + i * 0.13,
            onUpdate: () => setCount(node, o.v),
            onComplete: () => {
              // Pulso de "cargado"
              gsap.fromTo(node, { scale: 1 }, { scale: 1.08, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out", transformOrigin: "left bottom" });
            },
          });
        });
      };

      const io = new IntersectionObserver(
        (entries) => { if (entries[0].isIntersecting) { play(); io.disconnect(); } },
        { threshold: 0.18 }
      );
      io.observe(el);
      const t = window.setTimeout(() => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) play();
      }, 2500);
      return () => { io.disconnect(); window.clearTimeout(t); };
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="numeros"
      data-nav="dark"
      className="relative w-full overflow-hidden px-6 py-24 text-cream sm:px-10 sm:py-32 md:px-14 md:py-36"
      style={{
        background:
          "radial-gradient(125% 100% at 80% 6%, #5a1b06 0%, #2a0f06 48%, #150a05 100%)",
      }}
    >
      {/* Campo de viento (CFD) — firma de la sección */}
      <WindField />

      {/* Scrim sutil para legibilidad del texto sobre el flujo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(100deg, rgba(21,10,5,0.72) 0%, rgba(21,10,5,0.32) 42%, transparent 72%)" }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* ── Encabezado ── */}
        <div className="mb-16 md:mb-20">
          <h2
            className="m-0 max-w-[18ch] font-display font-light"
            aria-label="Respaldo que se puede medir."
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.4rem)", letterSpacing: "-0.03em", lineHeight: 1.06, textShadow: "0 2px 30px rgba(0,0,0,0.4)" }}
          >
            <span aria-hidden="true">
              {HEAD_WORDS.map((w, i) => (
                <span key={i} data-word className="mr-[0.24em] inline-block" style={{ opacity: 0, transform: "translateY(0.9em)" }}>
                  {w}
                </span>
              ))}
              <span className="inline-block font-medium text-orange">
                {Array.from(HEAD_ACCENT).map((ch, i) => (
                  <span key={i} data-letter className="inline-block" style={{ opacity: 0, transform: "translateY(0.45em)" }}>
                    {ch}
                  </span>
                ))}
              </span>
              <span data-letter className="inline-block" style={{ opacity: 0, transform: "translateY(0.45em)" }}>.</span>
            </span>
          </h2>

          <p
            data-sub
            className="mt-5 max-w-[58ch] font-body text-base font-light leading-relaxed text-cream/70 sm:text-lg"
            style={{ opacity: 0, textShadow: "0 1px 20px rgba(0,0,0,0.5)" }}
          >
            Una empresa joven con evidencia real detrás de cada solución: estudios
            liderados en el territorio, I+D financiado y dominio de las principales
            energías renovables.
          </p>
        </div>

        {/* ── Métricas flotando en el viento (sin cards) ── */}
        <div className="flex flex-col gap-12 lg:flex-row lg:flex-wrap lg:items-start lg:gap-x-16 lg:gap-y-4">
          {METRICS.map((m, i) => {
            const a = ACCENT[m.accent];
            const numColor = m.hero ? ACCENT.orange.num : m.kind === "badge" ? ACCENT.teal.num : "text-cream";
            const f = FLOAT[i];
            return (
              <div
                key={m.label}
                className={`${f.mt}`}
                style={{ animation: `metric-float ${f.dur} ease-in-out ${f.delay} infinite` }}
              >
                <div data-metric style={{ opacity: 0 }} className={m.hero ? "max-w-[14ch]" : "max-w-[20ch]"}>
                  {/* Número / badge */}
                  <p
                    className={`font-display font-light leading-[0.9] ${numColor}`}
                    style={{
                      fontSize: m.hero ? "clamp(4.5rem, 12vw, 10rem)" : "clamp(3rem, 5.5vw, 5rem)",
                      textShadow: "0 4px 40px rgba(0,0,0,0.55)",
                    }}
                  >
                    {m.kind === "num" ? (
                      <span className="inline-block">
                        <span data-count data-target={m.value}>{m.value}</span>
                        {m.suffix && <span>{m.suffix}</span>}
                      </span>
                    ) : (
                      <span data-stamp className="inline-block font-medium tracking-tight" style={{ clipPath: "inset(0 100% 0 0)" }}>
                        {m.text}
                      </span>
                    )}
                  </p>

                  {/* Barra de acento (se dibuja) */}
                  <span
                    aria-hidden="true"
                    data-bar
                    className={`mt-4 block h-[3px] origin-left rounded-full ${a.bar} ${m.hero ? "w-20" : "w-12"}`}
                    style={{ transform: "scaleX(0)" }}
                  />

                  {/* Label + hint */}
                  <p className={`mt-4 font-display font-medium text-cream ${m.hero ? "text-xl sm:text-2xl" : "text-lg"}`} style={{ textShadow: "0 1px 16px rgba(0,0,0,0.5)" }}>
                    {m.label}
                  </p>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-cream/55 sm:text-base" style={{ textShadow: "0 1px 14px rgba(0,0,0,0.5)" }}>
                    {m.hint}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
