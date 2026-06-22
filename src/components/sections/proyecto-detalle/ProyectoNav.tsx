"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import type { Proyecto } from "@/lib/proyectos";

interface Props {
  prev: Proyecto;
  next: Proyecto;
}

function NavSide({
  proyecto,
  direction,
}: {
  proyecto: Proyecto;
  direction: "prev" | "next";
}) {
  const [hovered, setHovered] = useState(false);
  const isPrev = direction === "prev";

  return (
    <Link
      href={`/proyectos/${proyecto.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        textDecoration: "none",
        padding: "clamp(28px,4vh,44px) clamp(24px,4vw,56px)",
        alignItems: isPrev ? "flex-start" : "flex-end",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "rgba(26,26,26,0.38)",
        }}
      >
        {isPrev ? "Proyecto anterior" : "Proyecto siguiente"}
      </span>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexDirection: isPrev ? "row" : "row-reverse",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "20px",
            color: hovered ? "#F1541C" : "rgba(26,26,26,0.40)",
            transform: hovered
              ? `translateX(${isPrev ? "-5px" : "5px"})`
              : "translateX(0)",
            transition: "transform 0.2s ease, color 0.2s ease",
            display: "inline-block",
            lineHeight: 1,
          }}
        >
          {isPrev ? "←" : "→"}
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(17px,1.5vw,22px)",
            letterSpacing: "-0.02em",
            color: hovered ? "#F1541C" : "rgba(26,26,26,0.82)",
            transition: "color 0.2s ease",
            lineHeight: 1.2,
          }}
        >
          {proyecto.title}
        </span>
      </span>
    </Link>
  );
}

export default function ProyectoNav({ prev, next }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set(section, { opacity: 1, y: 0 });
      return;
    }

    const played = { done: false };
    const play = () => {
      if (played.done) return;
      played.done = true;
      gsap.fromTo(
        section,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
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
    }, 3200);

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
        background: "#F8EDDD",
        borderTop: "1px solid rgba(26,26,26,0.09)",
        opacity: 0,
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <div style={{ borderRight: "1px solid rgba(26,26,26,0.09)" }}>
          <NavSide proyecto={prev} direction="prev" />
        </div>
        <div>
          <NavSide proyecto={next} direction="next" />
        </div>
      </div>
    </section>
  );
}
