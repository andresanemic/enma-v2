"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { WHATSAPP_URL, WHATSAPP_DISPLAY } from "@/lib/seo";

const NAV_PAGES = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/vinculacion", label: "Vinculación" },
  { href: "/blog", label: "Blog" },
];

const NAV_CONTACT = [
  { href: "mailto:contacto@enmachile.com", label: "contacto@enmachile.com", external: false },
  { href: WHATSAPP_URL, label: WHATSAPP_DISPLAY, external: true },
];

const LOCATION = ["Coyhaique", "Región de Aysén", "Chile"];

// Titular separado en tokens: palabras normales (máscara) + acento por letras.
const HEAD_WORDS = ["Pongamos", "tu", "proyecto"];
const HEAD_ACCENT = "en movimiento";

// ── Chispas: dispersión irregular (no cuadrícula) ──
// PRNG determinista (mulberry32) → genera la MISMA nube de chispas en servidor y
// cliente, sin hydration mismatch ni Math.random() en render. Posición, tamaño,
// alpha y parpadeo aleatorios rompen el patrón de grilla del gradiente tileado.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SPARK_BAND_H = 70; // alto de la banda de dispersión (px)
const SPARK_RGB = [
  [247, 223, 186], // arena
  [254, 169, 79], // naranja
  [241, 84, 28], // brasa
] as const;

type Spark = { x: number; y: number; size: number; color: string; dur: number; delay: number };

// Nube fija de chispas (un "viewport"; se renderiza dos veces para el loop sin costuras).
const SPARKS: Spark[] = (() => {
  const rnd = mulberry32(0x5e3a91);
  return Array.from({ length: 58 }, () => {
    const c = SPARK_RGB[(rnd() * SPARK_RGB.length) | 0];
    const alpha = 0.3 + rnd() * 0.45;
    return {
      x: rnd() * 100, // % dentro del grupo
      y: rnd() * SPARK_BAND_H, // px vertical
      size: 1 + rnd() * 2.4, // 1–3.4px
      color: `rgba(${c[0]},${c[1]},${c[2]},${alpha.toFixed(3)})`,
      dur: 3 + rnd() * 4, // s — parpadeo
      delay: -rnd() * 6, // s — desfase del parpadeo
    };
  });
})();

// Bloque de cierre unificado (CTA + Footer): una sola composición sobre un único
// gradiente verde, con una coreografía de entrada orquestada con GSAP — cada tipo
// de elemento entra con un efecto propio (máscara, letras, blur, wipe, pop).
export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const sparksRef = useRef<HTMLDivElement>(null);

  // Deriva de las chispas: rAF + módulo sobre el ancho real (un "viewport" = un
  // grupo). Velocidad constante y wrap pixel-perfecto → nunca "resetea a 0"
  // (evita el desfase sub-pixel del translateX(%) en bucle CSS).
  useEffect(() => {
    const drift = sparksRef.current;
    if (!drift) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // estático centrado

    const band = drift.parentElement;
    let w = band ? band.clientWidth : window.innerWidth;
    const onResize = () => {
      w = band ? band.clientWidth : window.innerWidth;
    };
    window.addEventListener("resize", onResize);

    const SECS_PER_VIEWPORT = 22; // tiempo en cruzar un viewport (derecha→izquierda)
    let raf = 0;
    let visible = true;
    const tick = (now: number) => {
      if (visible && w > 0) {
        // Posición ligada al reloj global → continua aunque se pause fuera de viewport.
        const pos = ((now / 1000) * (w / SECS_PER_VIEWPORT)) % w;
        drift.style.transform = `translate3d(${-pos}px, -50%, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Pausa fuera de viewport (perf). Al volver retoma según el reloj, sin reset visible.
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
      },
      { threshold: 0 }
    );
    io.observe(band ?? drift);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Selecciones SCOPED a esta sección (play() corre en callback async del IO).
    const q = <T extends Element>(sel: string) => Array.from(el.querySelectorAll<T>(sel));

    const ctx = gsap.context(() => {
      const words = q("[data-word]");
      const letters = q("[data-letter]");
      const body = q("[data-body]");
      const labels = q("[data-label]");
      const items = q("[data-col-item]");
      const waIcon = q("[data-wa-icon]");
      const waText = q("[data-wa-text]");
      const logo = q("[data-logo]");
      const legal = q("[data-legal]");

      // Reduced motion: todo en estado final, sin animar.
      if (reduce) {
        gsap.set(words, { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(letters, { opacity: 1, y: 0 });
        gsap.set(body, { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(labels, { clipPath: "inset(0 0% 0 0)" });
        gsap.set(items, { opacity: 1, y: 0 });
        gsap.set(waIcon, { opacity: 1, scale: 1, rotate: 0 });
        gsap.set(waText, { opacity: 1, x: 0 });
        gsap.set(logo, { clipPath: "inset(0 0% 0 0)" });
        gsap.set(legal, { opacity: 1, y: 0 });
        return;
      }

      let played = false;
      const play = () => {
        if (played) return;
        played = true;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        // Titular — palabra por palabra (rise + blur → nítido)
        tl.fromTo(words, { opacity: 0, y: "0.9em", filter: "blur(6px)" }, { opacity: 1, y: "0em", filter: "blur(0px)", duration: 0.8, stagger: 0.09 }, 0);
        // Acento "en movimiento" — letra por letra (fade + rise rápido)
        tl.fromTo(letters, { opacity: 0, y: "0.45em" }, { opacity: 1, y: "0em", duration: 0.5, stagger: 0.035, ease: "power2.out" }, 0.5);
        // Párrafo — fade + blur → nítido
        tl.fromTo(body, { opacity: 0, y: 16, filter: "blur(8px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.95 }, 0.65);
        // Labels de columna — clip-wipe de izquierda a derecha
        tl.fromTo(labels, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 0.7, stagger: 0.12, ease: "power2.inOut" }, 0.7);
        // Links de columnas — cascada ítem por ítem
        tl.fromTo(items, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.9);
        // WhatsApp — ícono pop (back.out) + texto desliza
        tl.fromTo(waIcon, { opacity: 0, scale: 0, rotate: -35 }, { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: "back.out(2.4)", transformOrigin: "center" }, 1.05);
        tl.fromTo(waText, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.5 }, 1.2);
        // Logo — clip-wipe (la marca se "dibuja" de izquierda a derecha)
        tl.fromTo(logo, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: 1.0, ease: "power3.inOut" }, 1.25);
        // Legal — fade suave
        tl.fromTo(legal, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.7 }, 1.55);
      };

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            play();
            io.disconnect();
          }
        },
        { threshold: 0.12 }
      );
      io.observe(el);
      // Fallback: SOLO si está realmente en viewport (evita animar fuera de pantalla).
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

  // Etiqueta utilitaria de columna (no es un eyebrow editorial de sección)
  const colLabel = "mb-4 inline-block font-body text-[11px] font-medium uppercase tracking-[0.2em] text-cream/35";

  const year = new Date().getFullYear();

  return (
    <footer
      ref={ref}
      id="contacto"
      data-nav="dark"
      role="contentinfo"
      className="relative z-10 w-full overflow-hidden text-cream"
      // Un único bloque verde: claro arriba (donde vive el CTA) → oscuro abajo.
      style={{ background: "linear-gradient(to bottom, #3e7c6c 0%, #245049 34%, #163834 64%, #0c2220 100%)" }}
    >
      {/* ── Chispas cálidas que derivan — entrada del bloque (energía en movimiento).
          Dispersión irregular (SPARKS), no cuadrícula. Se renderiza dos veces para
          que la deriva derecha→izquierda haga loop sin costuras. ── */}
      <div className="relative h-[96px] overflow-hidden sm:h-[112px]" aria-hidden="true">
        <div
          ref={sparksRef}
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            width: "200%",
            height: `${SPARK_BAND_H}px`,
            transform: "translate3d(0, -50%, 0)",
            willChange: "transform",
          }}
        >
          {[0, 50].map((offset) => (
            <div
              key={offset}
              style={{ position: "absolute", top: 0, left: `${offset}%`, width: "50%", height: "100%" }}
            >
              {SPARKS.map((s, i) => (
                <span
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    left: `${s.x}%`,
                    top: `${s.y}px`,
                    width: `${s.size}px`,
                    height: `${s.size}px`,
                    background: s.color,
                    animation: `spark-twinkle ${s.dur}s ease-in-out ${s.delay}s infinite`,
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Contenedor (alineado a la grilla de la landing) ── */}
      <div className="mx-auto max-w-[1400px] px-6 pb-[clamp(24px,2.5vw,40px)] pt-[clamp(8px,2vw,28px)] sm:px-10 md:px-14">
        {/* ── Grilla superior: CTA editorial (col 1) · navegación / contacto / ubicación ── */}
        <div className="grid grid-cols-1 gap-x-[clamp(28px,4vw,64px)] gap-y-12 sm:grid-cols-2 lg:[grid-template-columns:minmax(320px,1.35fr)_repeat(3,minmax(130px,0.4fr))]">
          {/* Col 1 — voz editorial + acción */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2
              className="m-0 max-w-[16ch] font-display font-light"
              aria-label="Pongamos tu proyecto en movimiento."
              style={{
                fontSize: "clamp(1.9rem, 3.6vw, 3.4rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.06,
              }}
            >
              <span aria-hidden="true">
                {/* Palabras normales — rise + blur, una por una */}
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
                {/* Acento — letra por letra */}
                <span className="inline-block font-medium text-orange">
                  {Array.from(HEAD_ACCENT).map((ch, i) =>
                    ch === " " ? (
                      <span key={i} className="inline-block w-[0.3em]" />
                    ) : (
                      <span key={i} data-letter className="inline-block" style={{ opacity: 0, transform: "translateY(0.45em)" }}>
                        {ch}
                      </span>
                    )
                  )}
                </span>
                <span data-letter className="inline-block" style={{ opacity: 0, transform: "translateY(0.45em)" }}>
                  .
                </span>
              </span>
            </h2>

            <p
              data-body
              className="mt-5 max-w-[44ch] font-body text-base font-light leading-relaxed text-cream/70 sm:text-lg"
              style={{ opacity: 0 }}
            >
              Cuéntanos qué necesitas resolver en energía, manufactura o
              medioambiente. Diseñamos cada solución a la medida de tu
              territorio, y partimos por escuchar.
            </p>

            {/* Acción — WhatsApp directo (el correo vive en la columna Contacto) */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-3 font-display text-xl font-medium text-cream transition-colors duration-200 hover:text-orange sm:text-2xl"
            >
              {/* Glifo WhatsApp */}
              <svg
                data-wa-icon
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0"
                fill="currentColor"
                style={{ opacity: 0 }}
              >
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.039zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414z" />
              </svg>
              <span data-wa-text className="relative" style={{ opacity: 0 }}>
                Escríbenos por WhatsApp
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-orange transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100"
                />
              </span>
            </a>
          </div>

          {/* Col 2 — Navegación */}
          <nav aria-label="Navegación del footer" className="lg:pt-2">
            <p data-label className={colLabel} style={{ clipPath: "inset(0 100% 0 0)" }}>
              Navegación
            </p>
            <div className="flex flex-col items-start gap-[clamp(11px,1.2vw,16px)]">
              {NAV_PAGES.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-col-item
                  className="group inline-flex items-center gap-2 font-body text-[17px] font-medium text-cream/70 transition-colors duration-200 hover:text-orange"
                  style={{ opacity: 0 }}
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-0 bg-orange transition-all duration-300 ease-out group-hover:w-4"
                  />
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Col 3 — Contacto */}
          <nav aria-label="Contacto" className="lg:pt-2">
            <p data-label className={colLabel} style={{ clipPath: "inset(0 100% 0 0)" }}>
              Contacto
            </p>
            <div className="flex flex-col items-start gap-[clamp(11px,1.2vw,16px)]">
              {NAV_CONTACT.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  data-col-item
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group inline-flex items-center gap-2 font-body text-[17px] font-medium text-cream/70 transition-colors duration-200 hover:text-orange"
                  style={{ opacity: 0 }}
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-0 bg-orange transition-all duration-300 ease-out group-hover:w-4"
                  />
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </nav>

          {/* Col 4 — Ubicación */}
          <div className="lg:pt-2">
            <p data-label className={colLabel} style={{ clipPath: "inset(0 100% 0 0)" }}>
              Ubicación
            </p>
            <div className="flex flex-col items-start gap-[clamp(11px,1.2vw,16px)]">
              {LOCATION.map((line) => (
                <span
                  key={line}
                  data-col-item
                  className="cursor-default font-body text-[17px] font-medium text-cream/55"
                  style={{ opacity: 0 }}
                >
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Zona meta: logo gigante + legal, separada por una hairline sutil ── */}
        <div className="mt-[clamp(48px,7vw,104px)] border-t border-cream/12 pt-[clamp(20px,2.5vw,38px)]">
          <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            {/* Logo blanco de Enma — clip-wipe en la entrada */}
            <Link
              href="/"
              aria-label="Enma — página de inicio"
              className="group inline-block no-underline"
            >
              <span
                data-logo
                className="relative block h-[clamp(40px,8vw,128px)] w-[clamp(140px,32vw,480px)] origin-left transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                style={{ clipPath: "inset(0 100% 0 0)" }}
              >
                <Image
                  src="/logos/logo-blanco-hd.webp"
                  alt="Enma"
                  fill
                  quality={95}
                  sizes="(max-width:560px) 60vw, 32vw"
                  className="object-contain object-left"
                />
              </span>
            </Link>

            {/* Línea legal — derecha, alineada al borde inferior del logo */}
            <div data-legal className="flex shrink-0 flex-col gap-1 sm:items-end sm:text-right" style={{ opacity: 0 }}>
              <span className="font-body text-[14px] font-medium uppercase leading-[1.4] tracking-[0.2em] text-orange/70">
                <span className="text-orange">EN</span>ergía · <span className="text-orange">M</span>edio <span className="text-orange">A</span>mbiente
              </span>
              <p className="m-0 font-body text-[15px] leading-[1.4] text-cream/45">
                © {year} Enma SPA. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
