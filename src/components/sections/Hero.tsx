"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import HeroVideo from "@/components/hero/HeroVideo";

// TODO: reemplazar con video propio de Enma (Patagonia / proceso / I+D).
// Debe servirse con CORS o desde /public/video para reemplazar este placeholder.
const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4";

const LINES = ["Energía y", "manufactura"];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Reduced motion: revelar todo sin animar (lore/animation FOUC-safe).
      if (reduce) {
        gsap.set("[data-reveal]", { y: "0%", filter: "blur(0px)", opacity: 1 });
        gsap.set("[data-fade]", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // H1 — reveal clip+blur por línea (lore/animation: translateY(108%)+blur, fromTo)
      tl.fromTo(
        "[data-reveal]",
        { yPercent: 108, filter: "blur(10px)" },
        { yPercent: 0, filter: "blur(0px)", duration: 1.0, stagger: 0.16 },
        0.35
      );

      tl.fromTo("[data-fade]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.85);
    },
    { scope: heroRef }
  );

  return (
    <section
      ref={heroRef}
      id="inicio"
      data-nav="dark"
      className="relative w-full min-h-[100svh] overflow-hidden"
      style={{
        // Fallback cálido: si el video tarda o falla, nunca se ve negro frío.
        background: "linear-gradient(150deg, #15110e 0%, #3a1305 60%, #5a1f08 100%)",
      }}
    >
      {/* Video full-bleed (placeholder) — el gradiente cálido queda detrás */}
      <HeroVideo src={HERO_VIDEO} />

      {/* ── Grade cálido + scrim direccional (contraste corregido) ──
          1) tinte cálido (multiply terra) para alejar el frío del video
          2) scrim oscuro desde la izq-abajo donde vive el texto                   */}
      <div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-multiply pointer-events-none"
        style={{ background: "linear-gradient(120deg, #1a1a1a 0%, rgba(177,44,0,0.35) 60%, rgba(254,169,79,0.15) 100%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(95deg, rgba(20,16,12,0.82) 0%, rgba(20,16,12,0.45) 38%, rgba(20,16,12,0.05) 70%), linear-gradient(to top, rgba(20,16,12,0.6) 0%, transparent 35%)",
        }}
      />

      {/* ── Contenido — alineado a la izquierda, editorial ── */}
      <div className="relative z-10 flex min-h-[100svh] flex-col justify-center px-6 pt-28 sm:px-10 md:px-14">
        <h1
          className="max-w-[14ch] font-display font-light text-cream"
          style={{
            fontSize: "clamp(2.75rem, 8vw, 6.5rem)",
            lineHeight: 1.04,
            letterSpacing: "-0.035em",
            textShadow: "0 2px 30px rgba(0,0,0,0.35)",
          }}
        >
          {LINES.map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span data-reveal style={{ display: "block", transform: "translateY(108%)", filter: "blur(10px)" }}>
                {line}
              </span>
            </span>
          ))}
          <span className="block overflow-hidden pb-[0.06em]">
            <span
              data-reveal
              style={{ display: "block", transform: "translateY(108%)", filter: "blur(10px)" }}
              className="font-semibold text-orange"
            >
              sustentable
            </span>
          </span>
        </h1>

        <p data-fade style={{ opacity: 0 }} className="mt-9 flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-7 bg-ember" />
          <span className="eyebrow text-cream/80">Energía · Manufactura · Patagonia</span>
        </p>

        <p
          data-fade
          style={{ opacity: 0 }}
          className="mt-3 max-w-md font-body text-base font-light leading-relaxed text-cream/85 sm:text-lg"
        >
          Soluciones de ingeniería en energía limpia y manufactura, diseñadas
          desde la Patagonia chilena para un territorio complejo.
        </p>

        {/* ── CTAs — Golden Path 4.1 / 4.2 ── */}
        <div data-fade style={{ opacity: 0 }} className="mt-10 flex flex-wrap items-center gap-5">
          <a
            href="mailto:contacto@enmachile.com"
            className="group inline-flex items-center gap-2 rounded-full bg-ember px-7 py-3 font-body text-sm font-medium text-cream shadow-lg shadow-ember/20 transition-colors duration-300 hover:bg-terra"
          >
            Hablemos de tu proyecto
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </a>
          <Link
            href="/proyectos"
            className="font-body text-sm font-medium text-cream/80 underline-offset-4 transition-colors duration-200 hover:text-cream hover:underline"
          >
            Ver proyectos →
          </Link>
        </div>
      </div>

      {/* ── Indicador de scroll — bottom-right ── */}
      <div
        data-fade
        style={{ opacity: 0 }}
        className="absolute bottom-9 right-6 z-10 hidden items-center gap-2 text-cream/45 sm:flex md:right-14"
      >
        <span className="eyebrow !tracking-[0.2em] text-cream/45">scroll</span>
        <span className="block h-8 w-px overflow-hidden bg-cream/25">
          <span
            className="block h-full w-full bg-cream/70"
            style={{ animation: "hero-scroll 1.8s ease-in-out infinite" }}
          />
        </span>
      </div>
    </section>
  );
}
