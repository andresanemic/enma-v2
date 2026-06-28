"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import HeroBackdrop from "@/components/hero/HeroBackdrop";
import { WHATSAPP_URL } from "@/lib/seo";

const LINES = ["Energía y", "Medio Ambiente"];
const ACCENT = "Sustentable";

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  // Coreografía de entrada ORQUESTADA: cada tipo de elemento entra con su propio
  // efecto (no un fade-up genérico), al nivel del Footer/About del sitio:
  //  · líneas del título → máscara (clip) + blur que se aclara
  //  · acento "sustentable" → letra por letra (rise + fade)
  //  · subtítulo → fade + desenfoque + leve subida
  //  · WhatsApp → ícono pop (back.out) + texto desliza
  //  · pill → pop de escala (back.out)
  //  · indicador de scroll → fade final
  // Estado inicial SOLO `opacity:0` inline (sin transform): GSAP controla los
  // transforms con immediateRender, evitando el bug de translateY(%) leído como px.
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        gsap.set("[data-line]", { opacity: 1, yPercent: 0, filter: "blur(0px)" });
        gsap.set("[data-letter]", { opacity: 1, yPercent: 0 });
        gsap.set("[data-sub]", { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set("[data-wa-icon]", { opacity: 1, scale: 1, rotate: 0 });
        gsap.set("[data-wa-text]", { opacity: 1, x: 0 });
        gsap.set("[data-pill]", { opacity: 1, scale: 1, y: 0 });
        gsap.set("[data-scroll]", { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1) Título — cada línea sube tras su máscara con desenfoque que se aclara.
      tl.fromTo(
        "[data-line]",
        { yPercent: 110, opacity: 0, filter: "blur(12px)" },
        { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 1.0, stagger: 0.14, ease: "expo.out" },
        0.15
      );

      // 2) Acento "sustentable" — letra por letra (rise + fade) → puntúa el cierre.
      tl.fromTo(
        "[data-letter]",
        { yPercent: 70, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.55, stagger: 0.03, ease: "power3.out" },
        0.78
      );

      // 3) Subtítulo — fade + desenfoque + leve subida.
      tl.fromTo(
        "[data-sub]",
        { opacity: 0, y: 22, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
        1.0
      );

      // 4) WhatsApp — ícono pop (back.out) + texto desliza desde la izquierda.
      tl.fromTo(
        "[data-wa-icon]",
        { opacity: 0, scale: 0, rotate: -45 },
        { opacity: 1, scale: 1, rotate: 0, duration: 0.7, ease: "back.out(2.2)", transformOrigin: "center" },
        1.15
      );
      tl.fromTo(
        "[data-wa-text]",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, duration: 0.5 },
        1.28
      );

      // 5) Pill — pop de escala.
      tl.fromTo(
        "[data-pill]",
        { opacity: 0, scale: 0.8, y: 8 },
        { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.8)" },
        1.4
      );

      // 6) Indicador de scroll — fade final.
      tl.fromTo(
        "[data-scroll]",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.65
      );
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
        // Último seguro de contraste: el blur-up de HeroBackdrop ya pinta los colores
        // reales de la foto al instante, así que este gradiente cálido-oscuro solo se ve
        // si la imagen falla por completo. Mantiene el H1/subtítulo crema legibles
        // (nunca crema-sobre-crema) sin volver a un negro frío.
        background: "linear-gradient(150deg, #15110e 0%, #3a1305 60%, #5a1f08 100%)",
      }}
    >
      {/* Imagen full-bleed con Ken Burns lento + blur-up — el gradiente cálido queda detrás */}
      <HeroBackdrop />

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
          aria-label="Energía y Medio Ambiente Sustentable"
          style={{
            fontSize: "clamp(2.75rem, 8vw, 6.5rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.035em",
            // Sombra proporcional al tamaño (em, no px fijos): en móvil el texto es
            // más chico y un blur fijo de 30px creaba un halo denso —sobre todo
            // tras la palabra semibold "sustentable", que se leía como fondo oscuro.
            textShadow: "0 0.02em 0.28em rgba(0,0,0,0.3)",
          }}
        >
          <span aria-hidden="true">
            {LINES.map((line) => (
              <span key={line} className="block overflow-hidden pb-[0.2em] -mb-[0.18em]">
                <span data-line style={{ display: "block", opacity: 0 }}>
                  {line}
                </span>
              </span>
            ))}
            <span className="block font-semibold text-orange">
              {Array.from(ACCENT).map((ch, i) => (
                <span key={i} data-letter className="inline-block" style={{ opacity: 0 }}>
                  {ch}
                </span>
              ))}
            </span>
          </span>
        </h1>

        <p
          data-sub
          style={{ opacity: 0 }}
          className="mt-7 max-w-xl font-body text-lg font-light leading-relaxed text-cream/85 sm:text-xl"
        >
          Soluciones interdisciplinarias para un desarrollo sostenible, diseñadas
          desde la Patagonia chilena.
        </p>

        {/* ── CTAs — Golden Path 4.1 / 4.2 ── */}
        <div className="mt-10 flex flex-wrap items-center gap-6 sm:gap-8">
          {/* WhatsApp — botón de texto del footer (sin pill, subrayado animado).
              El ícono hace pop y el texto desliza en la entrada. */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 font-display text-base font-medium text-cream transition-colors duration-200 hover:text-orange sm:text-lg"
          >
            <svg
              data-wa-icon
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-[18px] w-[18px] shrink-0"
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

          {/* Ver proyectos — pill */}
          <Link
            href="/proyectos"
            data-pill
            style={{ opacity: 0 }}
            className="group inline-flex items-center gap-1.5 rounded-full bg-ember px-5 py-2.5 font-body text-sm font-medium text-cream shadow-lg shadow-ember/20 transition-colors duration-300 hover:bg-terra"
          >
            Ver proyectos
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>

      {/* ── Crédito de la foto — bottom-right (sustituye al indicador de scroll) ── */}
      <div
        data-scroll
        style={{ opacity: 0 }}
        className="absolute bottom-9 right-6 z-10 hidden sm:block md:right-14"
      >
        <p className="font-body text-[11px] font-light leading-tight tracking-[0.04em] text-cream/55">
          Foto de{" "}
          <a
            href="https://unsplash.com/@carter_obasohan"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative font-normal text-cream/85 transition-colors duration-200 hover:text-cream"
          >
            Carter Obasohan
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-0 bg-cream/70 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100"
            />
          </a>
          , Cerro Castillo, Aysén.
        </p>
      </div>
    </section>
  );
}
