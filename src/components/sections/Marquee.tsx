"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

// "Ríos de palabras" — tipografía total en movimiento perpetuo (personalidad de
// marca: "activo, enérgico, en constante movimiento… entra por la vista").
// Cada diferenciador REAL (que-es-enma.txt → "Qué diferencia a Enma") es un río
// de su palabra clave derivando en bucle; la fila activa se ilumina y revela su
// explicación. Fondo dark cálido (forja/brasa); teal fuera (regla de paleta).
//
// NOTA: este componente NACIÓ como la sección "¿Por qué somos distintos?" de la
// landing, pero esa sección quedó finalmente con la versión "Manifiesto pinneado"
// (WhyUsManifesto.tsx). Se conserva como patrón reutilizable de marquee/ríos de
// tipografía para PÁGINAS INTERNAS (Nosotros, Servicios, Proyectos). Para reusar:
// parametrizar REASONS/HEAD_* y, si se usa fuera de la landing, revisar el id.
type Reason = {
  key: string; // palabra-río (mayúsculas)
  title: string;
  desc: string;
  dir: 1 | -1; // sentido de la deriva
  speed: number; // px/s
};

const REASONS: Reason[] = [
  {
    key: "TERRITORIO",
    title: "Pertenencia territorial",
    desc: "Nacimos y operamos en Aysén. El desafío logístico de la Patagonia mata los proyectos que no lo consideran desde el primer día —nosotros lo entendemos en los huesos.",
    dir: -1,
    speed: 38,
  },
  {
    key: "A LA MEDIDA",
    title: "Soluciones a la medida",
    desc: "Cada solución se adapta a tu contexto, con acompañamiento integral de la idea a la ejecución. Nada de recetas genéricas traídas desde Santiago.",
    dir: 1,
    speed: 30,
  },
  {
    key: "CÓMPUTO",
    title: "Visión estratégica + cómputo",
    desc: "Simulamos y validamos con CFD y túnel de viento antes de construir: menos prueba y error, soluciones más rápidas, eficientes y confiables.",
    dir: -1,
    speed: 46,
  },
  {
    key: "CO-CREACIÓN",
    title: "Asociatividad",
    desc: "Socios, no proveedores. Co-creamos contigo —preferimos ser el aliado con el que conversar antes que un dominador de mercado.",
    dir: 1,
    speed: 34,
  },
];

const HEAD_WORDS = ["¿Por", "qué", "somos"];
const HEAD_ACCENT = "distintos?";
const RIVER_FONT = "clamp(2.4rem, 8vw, 7rem)";

export default function Marquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]); // elemento que deriva
  const groupRefs = useRef<(HTMLDivElement | null)[]>([]); // 1er grupo (para medir)
  const widths = useRef<number[]>([]); // ancho de un grupo por fila (cache)
  const pausedRef = useRef(false); // hover/foco pausa el auto-avance
  // Copias por grupo: suficientes para que un grupo cubra el viewport (así la
  // deriva nunca deja hueco). Se ajusta tras medir con la fuente cargada.
  const [copies, setCopies] = useState(6);
  const [active, setActive] = useState(0);

  // Medir el ancho real de un grupo y, si hace falta, subir las copias para que
  // un grupo ≥ viewport. El wrap por rAF usa modulo de este ancho medido en vivo
  // → sin el "salto" del marquee CSS por desajuste de copias (lore/animation).
  const measure = () => {
    const vw = window.innerWidth;
    let need = copies;
    REASONS.forEach((_, i) => {
      const g = groupRefs.current[i];
      if (!g) return;
      const w = g.offsetWidth;
      widths.current[i] = w;
      const instance = w / copies;
      if (instance > 0) need = Math.max(need, Math.ceil(vw / instance) + 2);
    });
    if (need > copies) setCopies(need);
  };

  useLayoutEffect(() => {
    measure();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copies]);

  // Re-medir al redimensionar y cuando las fuentes web ya asentaron sus métricas
  // (Manrope cambia el ancho del río — lore/animation: fonts.ready).
  useEffect(() => {
    let cancelled = false;
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    if (document.fonts?.ready) document.fonts.ready.then(() => !cancelled && measure());
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [copies]);

  // Deriva perpetua (rAF, patrón Footer): velocidad constante + wrap pixel-perfect
  // por modulo del ancho medido. Pausa fuera de viewport (perf/batería).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let visible = true;
    const tick = (now: number) => {
      if (visible) {
        for (let i = 0; i < REASONS.length; i++) {
          const t = trackRefs.current[i];
          const W = widths.current[i];
          if (!t || !W) continue;
          const pos = ((now / 1000) * REASONS[i].speed) % W;
          // dir -1 → izquierda (x = -pos); dir 1 → derecha (x = pos - W).
          const x = REASONS[i].dir < 0 ? -pos : pos - W;
          t.style.transform = `translate3d(${x}px,0,0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const io = new IntersectionObserver((e) => (visible = e[0].isIntersecting), {
      threshold: 0,
    });
    if (sectionRef.current) io.observe(sectionRef.current);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  // Auto-avance del río activo (vida en táctil, donde no hay hover). Se pausa
  // mientras el usuario interactúa con la sección.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) setActive((a) => (a + 1) % REASONS.length);
    }, 4000);
    return () => window.clearInterval(id);
  }, []);

  // Reveal de entrada orquestado (IO + nodos scoped, no selectores string —
  // lore/animation). Título palabra×palabra (sin clip-mask: puede hacer wrap),
  // sub fade+blur, ríos clip-wipe escalonado, explicación fade.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = <T extends Element>(s: string) => Array.from(el.querySelectorAll<T>(s));

    const ctx = gsap.context(() => {
      const words = q("[data-word]");
      const sub = q("[data-sub]");
      const rows = q("[data-row]");
      const explain = q("[data-explain]");

      if (reduce) {
        gsap.set([words, sub, explain], { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(rows, { opacity: 1, clipPath: "inset(0 0% 0 0)" });
        return;
      }

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          words,
          { opacity: 0, y: "0.9em", filter: "blur(6px)" },
          { opacity: 1, y: "0em", filter: "blur(0px)", duration: 0.8, stagger: 0.09 },
          0
        );
        tl.fromTo(
          sub,
          { opacity: 0, y: 16, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
          0.4
        );
        tl.fromTo(
          rows,
          { opacity: 0, clipPath: "inset(0 100% 0 0)" },
          { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 0.9, stagger: 0.12, ease: "power3.inOut" },
          0.5
        );
        tl.fromTo(explain, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 1.05);
      };

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            play();
            io.disconnect();
          }
        },
        { threshold: 0.14 }
      );
      io.observe(el);
      // Fallback gateado por visibilidad real (no revelar fuera de pantalla).
      const t = window.setTimeout(() => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) play();
      }, 2500);
      return () => {
        io.disconnect();
        window.clearTimeout(t);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const focusRow = (i: number) => {
    setActive(i);
    pausedRef.current = true;
  };

  return (
    <section
      ref={sectionRef}
      id="distintos"
      data-nav="dark"
      className="relative w-full py-24 text-cream sm:py-32 md:py-36"
      onMouseLeave={() => (pausedRef.current = false)}
      style={{
        background:
          "linear-gradient(180deg, #1b130c 0%, #211309 46%, #140d07 100%)",
      }}
    >
      {/* Glow brasa (energía cálida sobre base oscura) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 48% at 84% 2%, rgba(241,84,28,0.16) 0%, transparent 60%)",
        }}
      />

      {/* ── Encabezado ── */}
      <div className="relative z-10 mx-auto mb-12 max-w-[1400px] px-6 sm:px-10 md:mb-16 md:px-14">
        <h2
          className="m-0 max-w-[20ch] font-display font-light"
          aria-label="¿Por qué somos distintos?"
          style={{
            fontSize: "clamp(1.9rem, 4vw, 3.4rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.06,
          }}
        >
          <span aria-hidden="true">
            {HEAD_WORDS.map((w, i) => (
              <span
                key={i}
                data-word
                className="mr-[0.24em] inline-block"
                style={{ opacity: 0, transform: "translateY(0.9em)" }}
              >
                {w}
              </span>
            ))}
            <span
              data-word
              className="inline-block font-medium text-orange"
              style={{ opacity: 0, transform: "translateY(0.9em)" }}
            >
              {HEAD_ACCENT}
            </span>
          </span>
        </h2>
        <p
          data-sub
          className="mt-5 max-w-[52ch] font-body text-base font-light leading-relaxed text-cream/60 sm:text-lg"
          style={{ opacity: 0 }}
        >
          Lo que no se diseña desde un escritorio en Santiago: cuatro razones que
          nacen del territorio.
        </p>
      </div>

      {/* ── Ríos de palabras (a sangre) ── */}
      <div className="relative z-10">
        {REASONS.map((r, i) => {
          const on = active === i;
          return (
            <button
              key={r.key}
              type="button"
              data-row
              onMouseEnter={() => focusRow(i)}
              onFocus={() => focusRow(i)}
              aria-label={`${r.title}. ${r.desc}`}
              className="group block w-full overflow-hidden py-1 text-left outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-orange/50"
              style={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }}
            >
              <div
                ref={(el) => {
                  trackRefs.current[i] = el;
                }}
                className="flex w-max"
                style={{ transform: "translate3d(0,0,0)", willChange: "transform" }}
              >
                {[0, 1].map((g) => (
                  <div
                    key={g}
                    aria-hidden="true"
                    ref={
                      g === 0
                        ? (el) => {
                            groupRefs.current[i] = el;
                          }
                        : undefined
                    }
                    className="flex shrink-0"
                  >
                    {Array.from({ length: copies }).map((_, k) => (
                      <span key={k} className="flex items-center">
                        <span
                          className={`font-display font-semibold transition-colors duration-500 ${
                            on ? "text-orange" : "text-cream/[0.08]"
                          }`}
                          style={{
                            fontSize: RIVER_FONT,
                            letterSpacing: "-0.02em",
                            lineHeight: 1.1,
                          }}
                        >
                          {r.key}
                        </span>
                        <span
                          className={`mx-[0.32em] font-display transition-colors duration-500 ${
                            on ? "text-ember" : "text-cream/[0.08]"
                          }`}
                          style={{ fontSize: RIVER_FONT, lineHeight: 1.1 }}
                        >
                          ·
                        </span>
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Explicación sincronizada (aria-hidden: el contenido vive en el
          aria-label de cada fila) ── */}
      <div
        data-explain
        aria-hidden="true"
        className="relative z-10 mx-auto mt-12 max-w-[1400px] px-6 sm:px-10 md:mt-16 md:px-14"
        style={{ opacity: 0 }}
      >
        {/* Capas apiladas → alto = el de la explicación más larga (sin saltos) */}
        <div className="grid">
          {REASONS.map((r, i) => {
            const on = active === i;
            return (
              <div
                key={r.key}
                className={`col-start-1 row-start-1 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  on
                    ? "opacity-100 translate-y-0"
                    : "pointer-events-none translate-y-2 opacity-0"
                }`}
              >
                <div className="flex items-baseline gap-4 sm:gap-6">
                  <span className="font-mono text-sm tabular-nums text-orange">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-medium text-cream sm:text-2xl">
                      {r.title}
                    </h3>
                    <p className="mt-2 max-w-[60ch] font-body text-base leading-relaxed text-cream/65 sm:text-lg">
                      {r.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
