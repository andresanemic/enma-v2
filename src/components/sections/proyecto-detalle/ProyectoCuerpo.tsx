"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface Props {
  context: string;
  did: string;
  capabilities: string[];
}

export default function ProyectoCuerpo({ context, did, capabilities }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const [hoveredChip, setHoveredChip] = useState<number | null>(null);

  // IO para las columnas narrativas
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const colLeft = section.querySelector<HTMLElement>("[data-col-left]");
    const colRight = section.querySelector<HTMLElement>("[data-col-right]");

    if (reduce) {
      if (colLeft) gsap.set(colLeft, { opacity: 1, y: 0 });
      if (colRight) gsap.set(colRight, { opacity: 1, y: 0 });
      return;
    }

    const played = { done: false };
    const play = () => {
      if (played.done) return;
      played.done = true;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (colLeft) {
        tl.fromTo(colLeft, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9 }, 0);
      }
      if (colRight) {
        tl.fromTo(colRight, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9 }, 0.12);
      }
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

  // IO separado para chips — entran más tarde que las columnas
  useEffect(() => {
    const chips = chipsRef.current;
    if (!chips) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chipEls = Array.from(chips.querySelectorAll<HTMLElement>("[data-chip]"));

    if (reduce) {
      chipEls.forEach((el) => gsap.set(el, { opacity: 1, scale: 1 }));
      return;
    }

    const played = { done: false };
    const play = () => {
      if (played.done) return;
      played.done = true;
      gsap.fromTo(
        chipEls,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: { amount: 0.30, from: "start" },
        }
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(chips);

    const t = window.setTimeout(() => {
      const r = chips.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) play();
    }, 3000);

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
        background: "#F3DDBC",
        padding: "clamp(56px,9vh,88px) clamp(24px,5vw,80px)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Grid narrativo 2 columnas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
            gap: "clamp(40px,6vw,80px)",
            alignItems: "start",
          }}
        >
          {/* El contexto */}
          <div
            data-col-left
            style={{ opacity: 0, transform: "translateY(32px)" }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(26,26,26,0.38)",
                margin: "0 0 16px",
              }}
            >
              El contexto
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(15px,1.2vw,17px)",
                color: "rgba(26,26,26,0.72)",
                lineHeight: 1.72,
                margin: 0,
              }}
            >
              {context}
            </p>
          </div>

          {/* Qué hicimos */}
          <div
            data-col-right
            style={{ opacity: 0, transform: "translateY(32px)" }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(26,26,26,0.38)",
                margin: "0 0 16px",
              }}
            >
              Qué hicimos
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(15px,1.2vw,17px)",
                color: "rgba(26,26,26,0.72)",
                lineHeight: 1.72,
                margin: 0,
              }}
            >
              {did}
            </p>
          </div>
        </div>

        {/* Separador + Capacidades */}
        <div
          ref={chipsRef}
          style={{
            borderTop: "1px solid rgba(26,26,26,0.10)",
            marginTop: "clamp(40px,6vh,64px)",
            paddingTop: "clamp(28px,4vh,44px)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(26,26,26,0.38)",
              margin: "0 0 18px",
            }}
          >
            Capacidades empleadas
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {capabilities.map((cap, i) => (
              <span
                key={cap}
                data-chip
                onMouseEnter={() => setHoveredChip(i)}
                onMouseLeave={() => setHoveredChip(null)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase",
                  color: "rgba(241,84,28,0.75)",
                  border: "1px solid rgba(241,84,28,0.25)",
                  borderRadius: "100px",
                  padding: "5px 14px",
                  background:
                    hoveredChip === i ? "rgba(241,84,28,0.07)" : "transparent",
                  transition: "background 0.18s ease",
                  cursor: "default",
                  opacity: 0,
                  display: "inline-block",
                }}
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
