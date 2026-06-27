"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import SignalMarquee from "./SignalMarquee";

// ─────────────────────────────────────────────────────────────────────────────
// 404 — "Esta página no existe"
// Reusa el lenguaje del hero de Vinculación (mismo marco, glow, marquee y reveal
// clip+fade) adaptado a una ruta no encontrada. La imagen es un guiño de marca:
// el "Rey Enma" (King Yemma), juez que revisa su registro y no encuentra la ruta.
// El personaje va de cuerpo entero sobre fondo transparente → object-contain
// sobre fondo cálido (no object-cover, que le cortaría las piernas).
// ─────────────────────────────────────────────────────────────────────────────

const MARQUEE = [
  "Página no encontrada",
  "Error 404",
  "Ruta inexistente",
  "Esta dirección no figura",
  "Volvamos al camino",
];

export default function NotFound() {
  const rootRef = useRef<HTMLDivElement>(null);

  // ── Reveal del hero: clip-wipe de los títulos + fade del resto. IO + fallback
  // gateado por visibilidad real (lore/animation). Misma firma que Vinculación. ──
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const block = root.querySelector<HTMLElement>("[data-reveal='hero']");
    if (!block) return;
    const q = <T extends Element>(s: string) =>
      Array.from(block.querySelectorAll<T>(s));

    if (reduce) {
      q("[data-fade]").forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
      q("[data-clip]").forEach((e) =>
        gsap.set(e, { clipPath: "inset(0 0% 0 0)", opacity: 1 })
      );
      return;
    }

    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        q("[data-clip]"),
        { clipPath: "inset(0 100% 0 0)", opacity: 1 },
        { clipPath: "inset(0 0% 0 0)", duration: 0.9, stagger: 0.14, ease: "power3.inOut" },
        0
      );
      tl.fromTo(
        q("[data-fade]"),
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.14 },
        0.45
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(block);

    const t = window.setTimeout(() => {
      const r = block.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) play();
    }, 2600);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div ref={rootRef} className="w-full">
      {/* ════════ HERO 404 — mismo marco que Vinculación ════════ */}
      <section
        data-reveal="hero"
        data-nav="light"
        className="relative flex min-h-[100svh] w-full flex-col overflow-hidden"
        style={{ background: "linear-gradient(180deg, #f8eddd 0%, #f7e6cf 58%, #f3ddbc 100%)" }}
      >
        <div className="relative mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 pb-10 pt-36 sm:px-10 sm:pt-44 md:px-14">
          <div className="grid min-h-[64svh] grid-cols-1 items-center gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-12">
            {/* ── Texto ── */}
            <div>
              <span
                data-fade
                className="block font-body text-sm font-semibold uppercase tracking-[0.22em] text-ember/80"
                style={{ opacity: 0 }}
              >
                Error 404
              </span>

              <h1
                aria-label="Esta página no existe."
                className="m-0 mt-5 max-w-[14ch] font-display font-light text-ink"
                style={{ fontSize: "clamp(2.6rem, 8vw, 6rem)", lineHeight: 1.0, letterSpacing: "-0.04em" }}
              >
                <span aria-hidden="true" className="block overflow-hidden">
                  <span data-clip className="block" style={{ clipPath: "inset(0 100% 0 0)" }}>
                    Esta página
                  </span>
                </span>
                <span aria-hidden="true" className="block overflow-hidden">
                  <span data-clip className="block font-medium text-ember" style={{ clipPath: "inset(0 100% 0 0)" }}>
                    no existe.
                  </span>
                </span>
              </h1>

              <p
                data-fade
                className="mt-7 max-w-[46ch] font-body text-lg font-light leading-relaxed text-ink/70 sm:text-xl"
                style={{ opacity: 0 }}
              >
                El enlace que seguiste no lleva a ninguna parte, o la dirección
                está mal escrita. El Rey Enma revisó su registro y esta ruta no
                figura. Nada grave: el camino de vuelta empieza aquí.
              </p>

              <Link
                data-fade
                href="/"
                className="group mt-9 inline-flex items-center gap-3 font-body text-base font-medium text-ink transition-colors duration-300 hover:text-ember"
                style={{ opacity: 0 }}
              >
                <span className="relative">
                  Volver al inicio
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-300 ease-out group-hover:scale-x-100"
                  />
                </span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 ease-out group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>

            {/* ── Imagen (Rey Enma) — mismo marco, encuadre contain sobre cálido ── */}
            <div data-fade className="relative mx-auto w-full max-w-[460px]" style={{ opacity: 0 }}>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
                style={{ background: "radial-gradient(58% 52% at 50% 46%, rgba(241,84,28,0.14) 0%, transparent 68%)" }}
              />
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/404/rey-enma-v1.webp"
                  alt="El Rey Enma, juez de su registro, no encuentra esta página."
                  fill
                  priority
                  sizes="(min-width: 768px) 460px, 90vw"
                  className="object-contain object-bottom drop-shadow-[0_18px_28px_rgba(26,26,26,0.28)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Marquee perpetuo al pie del hero */}
        <div data-fade className="relative border-t border-ink/10" style={{ opacity: 0 }}>
          <SignalMarquee items={MARQUEE} dotClassName="bg-ember/70" />
        </div>
      </section>
    </div>
  );
}
