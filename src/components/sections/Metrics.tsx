"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import SnowField from "@/components/metrics/SnowField";
import MetricsBackdrop from "@/components/metrics/MetricsBackdrop";

// Métricas REALES (entrevistas + que-es-enma.txt). Sin cifras infladas.
// Confirmar con el cliente antes de publicar.
type Metric = {
  kind: "num" | "badge";
  value?: number;
  suffix?: string;
  text?: string;
  label: string;
  hint: string;
  accent: "orange" | "ember" | "teal" | "green" | "sky";
  hero?: boolean;
};

const METRICS: Metric[] = [
  { kind: "num", value: 10, label: "Estudios energéticos liderados en Aysén", hint: "Para el sector público y privado.", accent: "orange", hero: true },
  { kind: "badge", text: "+$200M", label: "Apalancados para proyectos I+D+i", hint: "", accent: "ember" },
];

// Acentos VIVOS (varios colores) sobre base fría: cada métrica con su tono fuerte
// y luminoso sobre el oscuro. El "10" y el header anclan en naranja; +$150M en
// brasa; 2 en teal-menta brillante (acento frío que da vida y contraste — no el
// teal apagado de antes). El número secundario vira a su color en hover.
const ACCENT = {
  orange: { bar: "bg-[#fea94f]", numHero: "text-[#fea94f]", num: "text-cream group-hover:text-[#fea94f]" },
  ember: { bar: "bg-[#f1541c]", numHero: "text-[#f1541c]", num: "text-cream group-hover:text-[#f1541c]" },
  teal: { bar: "bg-[#5fc9ad]", numHero: "text-[#5fc9ad]", num: "text-cream group-hover:text-[#5fc9ad]" },
  green: { bar: "bg-[#fea94f]", numHero: "text-[#fea94f]", num: "text-cream group-hover:text-[#fea94f]" },
  sky: { bar: "bg-[#fea94f]", numHero: "text-[#fea94f]", num: "text-cream group-hover:text-[#fea94f]" },
} as const;

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
        gsap.set(stamps, { opacity: 1, y: 0 });
        counts.forEach((n) => setCount(n, Number(n.dataset.target)));
        return;
      }

      let played = false;
      const play = () => {
        if (played) return;
        played = true;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        // Título — entra como UN bloque que sube (sin blur ni cascada palabra-a-
        // palabra). Esa coreografía queda reservada a Hero y Footer.
        tl.fromTo([...words, ...letters], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, 0);
        tl.fromTo(sub, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, 0.55);
        // Métricas — aparecen con un fundido simple, en cascada. Los números NO se
        // mueven: sin desplazamiento, sin count-up y sin flotación perpetua; quedan
        // fijos en su valor final desde el inicio.
        tl.fromTo(metrics, { opacity: 0 }, { opacity: 1, duration: 0.8, stagger: 0.1 }, 0.6);
        tl.fromTo(bars, { scaleX: 0 }, { scaleX: 1, duration: 0.7, stagger: 0.1, ease: "power2.inOut" }, 0.9);
        tl.fromTo(stamps, { opacity: 0 }, { opacity: 1, duration: 0.7 }, 0.9);
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
        // Respaldo dark-frío: solo se ve si la foto falla. Sección "dark" de la
        // landing — azul/teal profundo, nunca crema-sobre-crema.
        background: "linear-gradient(160deg, #0a1216 0%, #10222a 60%, #16323a 100%)",
      }}
    >
      {/* ── Fondo fotográfico de Aysén (Opción A) con blur-up ── */}
      <MetricsBackdrop />

      {/* ── Grade frío (multiply) ──
          Enfría la foto hacia azul/teal profundo → la sección lee como "dark".
          Apaga la calidez general sin matar la imagen. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-multiply"
        style={{ background: "linear-gradient(125deg, #08131a 0%, rgba(22,58,68,0.62) 45%, rgba(40,92,98,0.40) 100%)" }}
      />

      {/* ── Brillo cálido de cumbre (screen) — re-enciende la luz dorada del
          amanecer sobre los picos como ÚNICO acento cálido (energía cálida sobre
          base fría). Radial acotado a la banda superior donde está la cordillera. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{ background: "radial-gradient(50% 34% at 56% 28%, rgba(254,169,79,0.32) 0%, rgba(241,84,28,0.12) 45%, transparent 74%)" }}
      />

      {/* ── Scrim frío direccional — oscurece donde viven el título y los números ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(95deg, rgba(7,16,21,0.80) 0%, rgba(7,16,21,0.44) 40%, rgba(7,16,21,0.06) 72%), linear-gradient(to top, rgba(7,16,21,0.68) 0%, transparent 38%)",
        }}
      />

      {/* ── Viñeta — oscurece los bordes para dar drama y foco (impacto) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(125% 115% at 50% 40%, transparent 52%, rgba(5,11,15,0.55) 100%)" }}
      />

      {/* ── Nieve fina a la deriva — firma de la sección, sobre la foto graduada ── */}
      <SnowField />

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
              <span className="inline-block font-medium text-[#fea94f]">
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
            Somos una empresa joven con evidencia real detrás de cada solución:
            estudios liderados en la región, I+D financiado y dominio de las
            principales energías renovables.
          </p>
        </div>

        {/* ── Métricas sobre el viento — fila horizontal, columnas reveladas ──
            En reposo cada columna muestra número + barra + label; el hint de las
            secundarias se revela en hover (la hero lo lleva abierto = tesis). En
            touch/sin hover los hints quedan visibles (@media hover). */}
        <div className="flex flex-col gap-10 lg:flex-row lg:flex-nowrap lg:items-end lg:gap-8">
          {/* spacer invisible — mantiene la posición original del +$200M en el centro */}
          <div aria-hidden="true" className="hidden lg:block lg:flex-1 lg:order-last" />
          {METRICS.map((m) => {
            const a = ACCENT[m.accent];
            const numColor = m.hero ? a.numHero : `${a.num} transition-colors duration-300`;
            return (
              <div
                key={m.label}
                className={`group relative lg:min-w-0 ${m.hero ? "lg:flex-[1.4]" : "lg:flex-1"}`}
              >
                <div data-metric className="relative" style={{ opacity: 0 }}>
                  {/* Número / badge */}
                  <p
                    className={`relative inline-block font-display font-light leading-[0.9] ${numColor}`}
                    style={{
                      fontSize: m.hero ? "clamp(3.25rem, 6vw, 5.5rem)" : "clamp(2.25rem, 3.4vw, 3.5rem)",
                      textShadow: m.hero
                        ? "0 4px 40px rgba(0,0,0,0.55), 0 0 28px rgba(254,169,79,0.45)"
                        : "0 4px 40px rgba(0,0,0,0.55)",
                    }}
                  >
                    {/* Brillo cálido de hover — centrado en el NÚMERO (no en la
                        columna), así se alinea con cada métrica sin importar su ancho.
                        Blur → glow orgánico que se desvanece por todos lados. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-1/2 top-1/2 h-[13rem] w-[19rem] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      style={{
                        background:
                          "radial-gradient(50% 50% at 50% 50%, rgba(246,206,150,0.32) 0%, rgba(246,206,150,0.10) 50%, transparent 76%)",
                        filter: "blur(22px)",
                      }}
                    />
                    {m.kind === "num" ? (
                      <span className="inline-block">
                        <span data-count data-target={m.value}>{m.value}</span>
                        {m.suffix && <span>{m.suffix}</span>}
                      </span>
                    ) : (
                      <span data-stamp className="inline-block font-medium tracking-tight" style={{ opacity: 0 }}>
                        {m.text}
                      </span>
                    )}
                  </p>

                  {/* Barra de acento (se dibuja en la entrada; crece en hover) */}
                  <span
                    aria-hidden="true"
                    data-bar
                    className={`mt-4 block h-[3px] origin-left rounded-full ${a.bar} transition-[width] duration-300 ${m.hero ? "w-20 group-hover:w-28" : "w-12 group-hover:w-24"}`}
                    style={{ transform: "scaleX(0)" }}
                  />

                  {/* Label */}
                  <p className={`mt-3.5 font-display font-medium text-cream ${m.hero ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`} style={{ textShadow: "0 1px 16px rgba(0,0,0,0.5)" }}>
                    {m.label}
                  </p>

                  {/* Hint — la hero (métrica 1) lo muestra de una; las secundarias se
                      revelan en hover (colapso solo en dispositivos con hover; espacio
                      reservado → sin saltos de layout; touch/lectores ven el texto). */}
                  <p
                    className={`mt-1.5 font-body text-sm leading-relaxed text-cream/60 transition-all duration-300 ${
                      m.hero
                        ? ""
                        : "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0"
                    }`}
                    style={{ textShadow: "0 1px 14px rgba(0,0,0,0.5)" }}
                  >
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
