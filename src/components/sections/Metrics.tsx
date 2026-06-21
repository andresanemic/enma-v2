"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import WindField from "@/components/metrics/WindField";
import WindTurbine from "@/components/metrics/WindTurbine";
import Ridge from "@/components/metrics/Ridge";

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
  { kind: "num", value: 5, label: "Estudios energéticos liderados en Aysén", hint: "Para el sector público regional, junto al CIEP.", accent: "orange", hero: true },
  { kind: "badge", text: "ANID", label: "Proyecto de I+D financiado", hint: "Turbina eólica de baja escala, resiliente a vientos extremos.", accent: "teal" },
  { kind: "num", value: 4, label: "Fuentes renovables que dominamos", hint: "Eólica, solar, hidro y geotermia.", accent: "sky" },
  { kind: "num", value: 2, label: "Socios fundadores, ingenieros mecánicos", hint: "Con experiencia exitosa como consultores.", accent: "orange" },
];

const ACCENT = {
  orange: { bar: "bg-orange", num: "text-orange" },
  ember: { bar: "bg-ember", num: "text-ember" },
  teal: { bar: "bg-[#54c0a8]", num: "text-[#54c0a8]" },
  green: { bar: "bg-[#7cc38a]", num: "text-[#7cc38a]" },
  sky: { bar: "bg-[#8fb8c4]", num: "text-[#8fb8c4]" },
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
        background:
          "radial-gradient(62% 44% at 20% 100%, rgba(247,201,150,0.55) 0%, rgba(233,150,86,0.16) 38%, transparent 66%)," +
          "linear-gradient(176deg, #2c4a5e 0%, #3c6976 30%, #56877f 54%, #7f9a76 76%, #b98f63 100%)",
      }}
    >
      {/* Nubes suaves a la deriva (cielo patagónico) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="absolute left-[6%] top-[14%] h-28 w-72 rounded-full bg-cream/15 blur-3xl" style={{ animation: "metric-cloud 46s ease-in-out infinite alternate" }} />
        <span className="absolute left-[42%] top-[24%] h-24 w-96 rounded-full bg-cream/10 blur-3xl" style={{ animation: "metric-cloud 64s ease-in-out infinite alternate", animationDelay: "-22s" }} />
        <span className="absolute left-[22%] top-[40%] h-20 w-72 rounded-full bg-[#cfe0e6]/10 blur-3xl" style={{ animation: "metric-cloud 54s ease-in-out infinite alternate", animationDelay: "-35s" }} />
      </div>

      {/* Campo de viento (CFD) — firma de la sección */}
      <WindField />

      {/* Cordillera patagónica — bosque, flores y huellas (visión diseñadora).
          Más baja en móvil → la franja de bosque ocupa menos y el "slice" del
          Ridge muestra una porción más ancha (árboles con proporción natural). */}
      <Ridge className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] w-full sm:h-[38%] md:h-[46%]" />

      {/* Scrim frío sutil — profundidad arriba/abajo sin reintroducir calidez */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(26,46,58,0.32) 0%, transparent 26%, transparent 64%, rgba(16,32,38,0.4) 100%)" }}
      />

      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* Aerogenerador — fuente del viento. En móvil se muestra COMPLETO en la
            esquina inferior izquierda (ancho acotado por w-%), a opacidad plena;
            el contenido se corre muy a la derecha para dejarle su carril, así no
            hay solape ni problema de contraste. Desde md recupera su disposición
            original (alto-% + carril editorial). */}
        <WindTurbine className="pointer-events-none absolute bottom-0 left-[1%] -z-0 w-[40%] opacity-90 sm:left-0 sm:w-[28%] md:left-[-14%] md:h-[86%] md:w-auto lg:left-[-4%] lg:h-auto lg:w-[22%]" />

        {/* Contenido en su posición editorial, con carril libre para el molino. */}
        <div className="relative md:pl-[30%] lg:pl-[23%]">
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
            Somos una empresa joven con evidencia real detrás de cada solución:
            estudios liderados en el territorio, I+D financiado y dominio de las
            principales energías renovables.
          </p>
        </div>

        {/* ── Métricas sobre el viento (sin cards, estáticas) ──
            En móvil todas las métricas van alineadas a la izquierda, en columna,
            y se reserva espacio al final (pb-%) igual al alto del molino para que
            la columna termine ARRIBA y el molino se vea completo debajo (sin
            solaparse). El pb-% es relativo al ancho → calza con w-% del molino.
            Desde md el carril lo da el padding del wrapper. */}
        <div className="flex flex-col gap-10 pb-[64%] sm:pb-[44%] md:pb-0 lg:flex-row lg:flex-nowrap lg:items-end lg:gap-8">
          {METRICS.map((m) => {
            const a = ACCENT[m.accent];
            const numColor = m.hero ? ACCENT.orange.num : "text-cream";
            return (
              <div
                key={m.label}
                className={`lg:min-w-0 ${m.hero ? "lg:flex-[1.4]" : "lg:flex-1"}`}
              >
                <div data-metric style={{ opacity: 0 }}>
                  {/* Número / badge */}
                  <p
                    className={`font-display font-light leading-[0.9] ${numColor}`}
                    style={{
                      fontSize: m.hero ? "clamp(3.25rem, 6vw, 5.5rem)" : "clamp(2.25rem, 3.4vw, 3.5rem)",
                      textShadow: "0 4px 40px rgba(0,0,0,0.55)",
                    }}
                  >
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

                  {/* Barra de acento (se dibuja) */}
                  <span
                    aria-hidden="true"
                    data-bar
                    className={`mt-4 block h-[3px] origin-left rounded-full ${a.bar} ${m.hero ? "w-20" : "w-12"}`}
                    style={{ transform: "scaleX(0)" }}
                  />

                  {/* Label + hint */}
                  <p className={`mt-3.5 font-display font-medium text-cream ${m.hero ? "text-lg sm:text-xl" : "text-base sm:text-lg"}`} style={{ textShadow: "0 1px 16px rgba(0,0,0,0.5)" }}>
                    {m.label}
                  </p>
                  <p className="mt-1.5 font-body text-sm leading-relaxed text-cream/55" style={{ textShadow: "0 1px 14px rgba(0,0,0,0.5)" }}>
                    {m.hint}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        </div>
      </div>
    </section>
  );
}
