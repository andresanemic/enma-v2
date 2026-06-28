"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import BlogBands from "./BlogBands";

// Sección Blog del landing: encabezado propio (palabra por palabra) + las franjas
// editoriales compartidas (BlogBands, acento terra). Los datos viven en lib/blog.ts;
// cada franja enlaza a /blog/[slug]. La mini-landing /blog reutiliza BlogBands con
// acento teal.

// Título de sección → palabras (rise+blur, sin clip → seguro al hacer wrap, lore).
const HEAD_WORDS = ["Ideas", "desde", "el"];
const HEAD_ACCENT = "sur";

export default function Blog() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const words = Array.from(el.querySelectorAll<HTMLElement>("[data-head-word]"));

    if (reduce) {
      gsap.set(words, { opacity: 1, y: 0 });
      return;
    }

    const head = el.querySelector("[data-head]");
    if (!head) return;

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      gsap.fromTo(
        words,
        { opacity: 0, y: "0.5em" },
        { opacity: 1, y: "0em", duration: 0.7, stagger: 0.06, ease: "power3.out" }
      );
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(head);
    const t = window.setTimeout(() => {
      const r = head.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) reveal();
    }, 2600);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <section
      ref={ref}
      id="blog"
      data-nav="light"
      className="relative w-full overflow-hidden px-6 pb-24 pt-12 sm:px-10 sm:pb-28 sm:pt-14 md:px-14 md:pb-32 md:pt-16"
      // Tramo final del degradado claro: encadena con Equipo (#f3ddbc) y termina
      // exactamente en el crema de FAQ (#f8eddd) → transición invisible.
      style={{ background: "linear-gradient(180deg, #f3ddbc 0%, #f8eddd 100%)" }}
    >
      {/* Textura de fondo — curvas de nivel finísimas (topografía patagónica) */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-16 h-[420px] w-[620px] text-ink/[0.05]"
        viewBox="0 0 600 400"
        fill="none"
      >
        {[0, 26, 52, 78, 104].map((o) => (
          <path
            key={o}
            d={`M-20 ${120 + o} C 140 ${40 + o}, 300 ${200 + o}, 460 ${90 + o} S 760 ${30 + o}, 900 ${140 + o}`}
            stroke="currentColor"
            strokeWidth="1.5"
          />
        ))}
      </svg>

      <div className="relative mx-auto max-w-[1180px]">
        {/* ── Encabezado (sin eyebrow: el título arranca directo) ── */}
        <div data-head className="mb-14 md:mb-20">
          <h2
            className="m-0 max-w-[18ch] font-display font-light text-ink"
            aria-label="Ideas desde el sur."
            style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)", lineHeight: 1.06, letterSpacing: "-0.03em" }}
          >
            <span aria-hidden="true">
              {HEAD_WORDS.map((w, i) => (
                <span key={i} data-head-word className="mr-[0.26em] inline-block" style={{ opacity: 0, transform: "translateY(0.8em)" }}>
                  {w}
                </span>
              ))}
              <span data-head-word className="inline-block font-medium text-terra" style={{ opacity: 0, transform: "translateY(0.8em)" }}>
                {HEAD_ACCENT}
              </span>
              <span data-head-word className="inline-block text-terra" style={{ opacity: 0, transform: "translateY(0.8em)" }}>
                .
              </span>
            </span>
          </h2>
          <p className="mt-5 max-w-[52ch] font-body text-base font-light leading-relaxed text-ink/65 sm:text-lg">
            Columnas de los fundadores y notas del equipo sobre energía, manufactura y la vida en la Patagonia.
          </p>
        </div>

        {/* ── Franjas editoriales (compartidas con /blog) ── */}
        <BlogBands accent="terra" />
      </div>
    </section>
  );
}
