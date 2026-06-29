"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import SignalMarquee from "./SignalMarquee";
import BlogBands from "./BlogBands";

// ─────────────────────────────────────────────────────────────────────────────
// BLOG — índice (/blog). Hermana de Vinculación: mismo Hero (texto + imagen +
// marquee al pie) y mismo bloque de CIERRE, pero la sección central son las
// franjas editoriales compartidas (BlogBands) con todas las publicaciones.
//
// Diferenciación tonal vs. Vinculación: el FONDO cálido es idéntico (crema/arena);
// lo que cambia son los ACENTOS → teal (#205358) y verdes, no ember/terra. Así el
// Blog se lee distinto y respeta la regla de paleta (base cálida, teal como acento).
// Reveals: IO + fallback gateado por visibilidad real, FOUC-safe, reduce-motion.
// ─────────────────────────────────────────────────────────────────────────────

// Temas recurrentes del blog → marquee perpetuo al pie del hero (punto teal).
const MARQUEE = [
  "Energía",
  "Territorio",
  "Aysén",
  "Medio ambiente",
  "El costo de la luz",
  "Patagonia",
  "Columnas de los fundadores",
  "Notas del equipo",
];

export default function BlogIndex() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const q = <T extends Element>(s: string, ctx: ParentNode) =>
      Array.from(ctx.querySelectorAll<T>(s));

    if (reduce) {
      blocks.forEach((b) => {
        q("[data-fade]", b).forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
        q("[data-clip]", b).forEach((e) => gsap.set(e, { clipPath: "inset(0 0% 0 0)", opacity: 1 }));
        q("[data-panel]", b).forEach((e) => gsap.set(e, { clipPath: "inset(0% 0 0 0 round 18px)" }));
        q("[data-rule]", b).forEach((e) => gsap.set(e, { scaleX: 1 }));
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
          // Showcase: las líneas del titular y la foto se descubren con clip-wipe;
          // el resto (bajada, temas) sube en fundido.
          tl.fromTo(
            q("[data-clip]", b),
            { clipPath: "inset(0 100% 0 0)", opacity: 1 },
            { clipPath: "inset(0 0% 0 0)", duration: 0.9, stagger: 0.14, ease: "power3.inOut" },
            0
          );
          tl.fromTo(
            q("[data-panel]", b),
            { clipPath: "inset(100% 0 0 0 round 18px)" },
            { clipPath: "inset(0% 0 0 0 round 18px)", duration: 0.95, ease: "power3.inOut" },
            0.2
          );
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.14 }, 0.45);
          break;
        }
        case "head": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0);
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
      {/* ════════ 1 · HERO — la tesis del blog ════════ */}
      <section
        data-reveal="hero"
        data-nav="light"
        className="relative w-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, #f8eddd 0%, #f7e6cf 58%, #f3ddbc 100%)" }}
      >
        <div className="relative mx-auto max-w-[1400px] px-6 pb-10 pt-36 sm:px-10 sm:pt-44 md:px-14">
          <div className="grid min-h-[64svh] grid-cols-1 items-center gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-12">
            {/* ── Texto ── */}
            <div>
              <h1
                aria-label="Pensamos en voz alta."
                className="m-0 max-w-[12ch] font-display font-light text-ink"
                style={{ fontSize: "clamp(2.6rem, 8vw, 6rem)", lineHeight: 1.0, letterSpacing: "-0.04em" }}
              >
                <span aria-hidden="true" className="block overflow-hidden">
                  <span data-clip className="block" style={{ clipPath: "inset(0 100% 0 0)" }}>
                    Pensamos en
                  </span>
                </span>
                <span aria-hidden="true" className="block overflow-hidden">
                  <span data-clip className="block font-medium text-teal" style={{ clipPath: "inset(0 100% 0 0)" }}>
                    voz alta.
                  </span>
                </span>
              </h1>

              <p
                data-fade
                className="mt-7 max-w-[46ch] font-body text-lg font-light leading-relaxed text-ink/70 sm:text-xl"
                style={{ opacity: 0 }}
              >
                Columnas de los fundadores y notas del equipo. Lo que aprendemos
                sobre energía, medio ambiente y la vida en la Patagonia, contado por
                quienes lo viven de cerca.
              </p>

            </div>

            {/* ── Imagen del hero — atmósfera patagónica con velo cálido y clip-wipe ── */}
            <div data-fade className="relative mx-auto w-full max-w-[460px]" style={{ opacity: 0 }}>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
                style={{ background: "radial-gradient(58% 52% at 50% 46%, rgba(32,83,88,0.14) 0%, transparent 68%)" }}
              />
              <div
                data-panel
                className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] ring-1 ring-ink/15 shadow-[0_30px_70px_-40px_rgba(26,26,26,0.6)]"
                style={{ clipPath: "inset(100% 0 0 0 round 18px)" }}
              >
                <Image
                  src="/blog/hero-blog-v2.webp"
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 768px) 460px, 90vw"
                  className="object-cover object-center"
                />
                {/* Velo cálido (unifica la paleta; el acento teal vive en el texto) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(150deg, rgba(177,44,0,0.30) 0%, rgba(219,135,70,0.14) 55%, rgba(241,84,28,0.26) 100%)",
                    mixBlendMode: "multiply",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Marquee perpetuo al pie del hero (punto teal) */}
        <div data-fade className="relative border-t border-ink/10" style={{ opacity: 0 }}>
          <SignalMarquee items={MARQUEE} dotClassName="bg-teal/70" />
        </div>
      </section>

      {/* ════════ 2 · TODAS LAS NOTAS — franjas editoriales (acento teal) ════════ */}
      <section
        data-nav="light"
        className="relative w-full"
        style={{ background: "linear-gradient(180deg, #f3ddbc 0%, #f8eddd 22%, #f8eddd 100%)" }}
      >
        <div className="mx-auto max-w-[1180px] px-6 pb-20 pt-20 sm:px-10 md:px-14 md:pb-24 md:pt-28">
          <div data-reveal="head" className="mb-14 md:mb-20">
            <h2
              data-fade
              className="m-0 max-w-[20ch] font-display font-light text-ink"
              style={{ opacity: 0, fontSize: "clamp(1.8rem, 3.8vw, 2.9rem)", lineHeight: 1.08, letterSpacing: "-0.03em" }}
            >
              Lo que <span className="font-medium text-teal">escribimos</span>.
            </h2>
            <p
              data-fade
              className="mt-5 max-w-[52ch] font-body text-base font-light leading-relaxed text-ink/65 sm:text-lg"
              style={{ opacity: 0 }}
            >
              Lecturas para entender desde dónde y para qué trabajamos. Vamos
              sumando columnas y notas a medida que las escribimos.
            </p>
          </div>

          <BlogBands accent="teal" />
        </div>
      </section>

      {/* ════════ 3 · CIERRE — claro cálido, centrado (tono CTA) que entrega al Footer ════════ */}
      <section
        data-reveal="cierre"
        data-nav="light"
        className="relative w-full"
        style={{ background: "linear-gradient(180deg, #f8eddd 0%, #f3ddbc 100%)" }}
      >
        <div className="mx-auto max-w-[900px] px-6 pb-24 pt-12 text-center sm:px-10 md:px-14 md:pb-32 md:pt-16">
          {/* Curva de nivel que se traza (mismo divider que las franjas) */}
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
            className="m-0 mx-auto max-w-[26ch] font-display font-light text-ink md:max-w-none"
            style={{ opacity: 0, fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            <span className="md:block md:whitespace-nowrap">Escribimos para abrir la conversación, </span>
            <span className="md:block md:whitespace-nowrap font-medium text-teal">no para cerrarla.</span>
          </h2>
          <p
            data-fade
            className="mx-auto mt-6 max-w-[56ch] font-body text-base font-light leading-relaxed text-ink/65 sm:text-lg"
            style={{ opacity: 0 }}
          >
            Las mejores ideas siempre nacen conversando.
          </p>
        </div>
      </section>
    </div>
  );
}
