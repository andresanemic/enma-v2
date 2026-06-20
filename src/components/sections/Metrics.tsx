"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

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
  {
    kind: "num",
    value: 5,
    label: "Estudios energéticos liderados en Aysén",
    hint: "Para el sector público regional, junto al CIEP.",
    accent: "orange",
    hero: true,
  },
  {
    kind: "badge",
    text: "ANID",
    label: "Proyecto de I+D financiado",
    hint: "Turbina eólica de baja escala, resiliente a vientos extremos.",
    accent: "teal",
  },
  {
    kind: "num",
    value: 100,
    suffix: "%",
    label: "Patagonia",
    hint: "Nacidos y operando en la Región de Aysén.",
    accent: "green",
  },
  {
    kind: "num",
    value: 4,
    label: "Fuentes renovables que dominamos",
    hint: "Eólica, solar, hidro y geotermia.",
    accent: "ember",
  },
  {
    kind: "num",
    value: 2,
    label: "Socios fundadores, ingenieros mecánicos",
    hint: "Con experiencia exitosa como consultores.",
    accent: "orange",
  },
];

// Clases literales por acento (para que Tailwind las genere en build).
const ACCENT = {
  orange: { bar: "bg-orange", num: "text-orange", hoverBorder: "hover:border-orange/40", glow: "rgba(254,169,79,0.22)" },
  ember: { bar: "bg-ember", num: "text-ember", hoverBorder: "hover:border-ember/40", glow: "rgba(241,84,28,0.22)" },
  teal: { bar: "bg-[#54c0a8]", num: "text-[#54c0a8]", hoverBorder: "hover:border-[#54c0a8]/40", glow: "rgba(84,192,168,0.22)" },
  green: { bar: "bg-[#7cc38a]", num: "text-[#7cc38a]", hoverBorder: "hover:border-[#7cc38a]/40", glow: "rgba(124,195,138,0.22)" },
} as const;

// Posición bento por tarjeta (lg: 12 cols × 2 filas; el héroe ocupa la izquierda).
const SPAN = [
  "sm:col-span-2 lg:col-span-6 lg:row-span-2",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-3",
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
      const cards = q<HTMLElement>("[data-card]");
      const bars = q("[data-bar]");
      const stamps = q("[data-stamp]");
      const counts = q<HTMLElement>("[data-count]");
      const metas = q("[data-meta]");

      const setCount = (node: HTMLElement, v: number) => {
        node.textContent = Math.round(v).toString();
      };

      if (reduce) {
        gsap.set(words, { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(letters, { opacity: 1, y: 0 });
        gsap.set(sub, { opacity: 1, y: 0 });
        gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        gsap.set(bars, { scaleX: 1 });
        gsap.set(stamps, { clipPath: "inset(0 0% 0 0)" });
        gsap.set(metas, { opacity: 1, y: 0 });
        counts.forEach((n) => setCount(n, Number(n.dataset.target)));
        return;
      }

      let played = false;
      const play = () => {
        if (played) return;
        played = true;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        // Titular — palabra por palabra (rise + blur) + acento letra por letra
        tl.fromTo(words, { opacity: 0, y: "0.9em", filter: "blur(6px)" }, { opacity: 1, y: "0em", filter: "blur(0px)", duration: 0.8, stagger: 0.09 }, 0);
        tl.fromTo(letters, { opacity: 0, y: "0.45em" }, { opacity: 1, y: "0em", duration: 0.5, stagger: 0.04, ease: "power2.out" }, 0.45);
        tl.fromTo(sub, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8 }, 0.6);

        // Tarjetas — el héroe escala+fade; las pequeñas suben en cascada
        const hero = cards.filter((c) => c.dataset.card === "hero");
        const small = cards.filter((c) => c.dataset.card !== "hero");
        tl.fromTo(hero, { opacity: 0, scale: 0.94, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.55);
        tl.fromTo(small, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.09 }, 0.7);

        // Barras de acento — dibujo (scaleX), no width (lore/animation)
        tl.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 0.7, stagger: 0.07, ease: "power2.inOut" }, 0.95);
        // Stamp "ANID" — clip-wipe
        tl.fromTo(stamps, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power3.inOut" }, 1.05);
        // Labels / hints
        tl.fromTo(metas, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, 1.0);

        // Contadores — tween de un proxy y escritura directa al DOM (NO setState
        // por frame, lore/animation). Arrancan en 0 al dispararse.
        counts.forEach((node) => {
          const target = Number(node.dataset.target);
          const o = { v: 0 };
          setCount(node, 0);
          gsap.to(o, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            delay: 0.7,
            onUpdate: () => setCount(node, o.v),
          });
        });
      };

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            play();
            io.disconnect();
          }
        },
        { threshold: 0.18 }
      );
      io.observe(el);
      const t = window.setTimeout(() => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) play();
      }, 2500);
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
      id="numeros"
      data-nav="dark"
      className="relative w-full overflow-hidden px-6 py-20 text-cream sm:px-10 sm:py-28 md:px-14 md:py-32"
      // Bloque cálido y oscuro: contraste fuerte con las secciones claras vecinas.
      style={{
        background:
          "radial-gradient(120% 95% at 78% 8%, #7a2306 0%, #3a1305 46%, #1b0c06 100%)",
      }}
    >
      {/* Textura de huella / grid de puntos cálido */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: "radial-gradient(rgba(247,223,186,0.07) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* ── Encabezado ── */}
        <div className="mb-12 md:mb-16">
          <h2
            className="m-0 max-w-[18ch] font-display font-light"
            aria-label="Respaldo que se puede medir."
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.4rem)", letterSpacing: "-0.03em", lineHeight: 1.06 }}
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
              <span data-letter className="inline-block" style={{ opacity: 0, transform: "translateY(0.45em)" }}>
                .
              </span>
            </span>
          </h2>

          <p
            data-sub
            className="mt-5 max-w-[58ch] font-body text-base font-light leading-relaxed text-cream/65 sm:text-lg"
            style={{ opacity: 0 }}
          >
            Una empresa joven con evidencia real detrás de cada solución: estudios
            liderados en el territorio, I+D financiado y dominio de las principales
            energías renovables.
          </p>
        </div>

        {/* ── Bento de métricas ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-2">
          {METRICS.map((m, i) => {
            const a = ACCENT[m.accent];
            const numColor = m.hero ? ACCENT.orange.num : m.kind === "badge" ? ACCENT.teal.num : "text-cream";
            return (
              <div
                key={m.label}
                data-card={m.hero ? "hero" : "small"}
                style={{ opacity: 0 }}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-cream/10 bg-cream/[0.04] backdrop-blur-[1px] transition-all duration-300 hover:-translate-y-1 hover:bg-cream/[0.07] ${a.hoverBorder} ${SPAN[i]} ${m.hero ? "p-7 sm:p-9" : "p-6 sm:p-7"}`}
              >
                {/* Glow de acento que aparece en hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(circle, ${a.glow} 0%, transparent 70%)` }}
                />
                {/* Textura de huella solo en el héroe */}
                {m.hero && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.5] mix-blend-soft-light"
                    style={{
                      backgroundImage:
                        "repeating-radial-gradient(circle at 88% 105%, rgba(248,237,221,0.12) 0 1px, transparent 1px 16px)",
                    }}
                  />
                )}

                <div className="relative z-10">
                  {/* Número / badge */}
                  <p
                    className={`font-display font-light leading-[0.92] ${numColor} ${m.hero ? "" : ""}`}
                    style={{ fontSize: m.hero ? "clamp(3.75rem, 9vw, 7.5rem)" : "clamp(2.75rem, 5vw, 4.25rem)" }}
                  >
                    {m.kind === "num" ? (
                      <>
                        <span data-count data-target={m.value}>
                          {m.value}
                        </span>
                        {m.suffix && <span>{m.suffix}</span>}
                      </>
                    ) : (
                      <span
                        data-stamp
                        className="inline-block font-medium tracking-tight"
                        style={{ clipPath: "inset(0 100% 0 0)" }}
                      >
                        {m.text}
                      </span>
                    )}
                  </p>

                  {/* Barra de acento (se dibuja) */}
                  <span
                    aria-hidden="true"
                    data-bar
                    className={`mt-5 block h-[3px] origin-left rounded-full ${a.bar} ${m.hero ? "w-16" : "w-12"}`}
                    style={{ transform: "scaleX(0)" }}
                  />
                </div>

                {/* Label + hint */}
                <div data-meta className="relative z-10 mt-6" style={{ opacity: 0 }}>
                  <p className={`font-display font-medium text-cream ${m.hero ? "text-xl sm:text-2xl" : "text-lg"}`}>
                    {m.label}
                  </p>
                  <p className="mt-1.5 max-w-[42ch] font-body text-sm leading-relaxed text-cream/45 sm:text-base">
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
