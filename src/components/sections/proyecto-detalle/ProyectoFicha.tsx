"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { ProyectoFact } from "@/lib/proyectos";

export default function ProyectoFicha({ facts }: { facts: ProyectoFact[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sectionLabel = section.querySelector<HTMLElement>("[data-section-label]");
    const rows = Array.from(section.querySelectorAll<HTMLElement>("[data-row]"));

    if (reduce) {
      if (sectionLabel) gsap.set(sectionLabel, { opacity: 1, y: 0 });
      rows.forEach((r) => gsap.set(r, { opacity: 1, y: 0 }));
      return;
    }

    const played = { done: false };
    const play = () => {
      if (played.done) return;
      played.done = true;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (sectionLabel) {
        tl.fromTo(
          sectionLabel,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 },
          0
        );
      }
      tl.fromTo(
        rows,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: { amount: 0.35, from: "start" },
        },
        0.1
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(section);

    const t = window.setTimeout(() => {
      const r = section.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) play();
    }, 2600);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav="light"
      style={{
        background: "#EECEA1",
        padding: "clamp(56px,9vh,88px) clamp(24px,5vw,80px)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Label de sección */}
        <p
          data-section-label
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "rgba(26,26,26,0.38)",
            margin: "0 0 28px",
            opacity: 0,
          }}
        >
          Ficha técnica
        </p>

        {/* Tabla — líneas horizontales, sin borde externo */}
        <div style={{ borderTop: "1px solid rgba(26,26,26,0.10)" }}>
          {facts.map((fact, i) => (
            <div
              key={i}
              data-row
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(140px,18vw,200px) 1fr",
                gap: "clamp(16px,3vw,48px)",
                padding: "clamp(16px,2vh,22px) 0",
                borderBottom: "1px solid rgba(26,26,26,0.10)",
                alignItems: "baseline",
                opacity: 0,
                transform: "translateY(24px)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: "rgba(26,26,26,0.42)",
                  flexShrink: 0,
                }}
              >
                {fact.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(14px,1.15vw,16px)",
                  color: "rgba(26,26,26,0.85)",
                  lineHeight: 1.55,
                }}
              >
                {fact.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
