"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import type { Proyecto } from "@/lib/proyectos";

export default function ProyectoHero({ proyecto }: { proyecto: Proyecto }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [backHovered, setBackHovered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rises = Array.from(section.querySelectorAll<HTMLElement>("[data-rise]"));
    const imgs = Array.from(section.querySelectorAll<HTMLElement>("[data-img]"));

    if (reduce) {
      rises.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      imgs.forEach((el) => gsap.set(el, { opacity: 1, scale: 1 }));
      return;
    }

    const played = { done: false };
    const play = () => {
      if (played.done) return;
      played.done = true;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        section.querySelectorAll("[data-rise='pill']"),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7 },
        0
      );
      tl.fromTo(
        section.querySelectorAll("[data-rise='h1']"),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9 },
        0.1
      );
      tl.fromTo(
        section.querySelectorAll("[data-rise='lead']"),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.25
      );
      tl.fromTo(
        section.querySelectorAll("[data-rise='back']"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.35
      );
      tl.fromTo(
        section.querySelectorAll("[data-img]"),
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 1.0 },
        0.15
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
        background: "#F3DDBC",
        padding:
          "clamp(120px,16vh,160px) clamp(24px,5vw,80px) clamp(64px,10vh,96px)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))",
          gap: "clamp(40px,6vw,80px)",
          alignItems: "center",
        }}
      >
        {/* Columna izquierda */}
        <div>
          {/* ← Proyectos — arriba del pill para anclar la jerarquía */}
          <Link
            href="/proyectos"
            data-rise="back"
            onMouseEnter={() => setBackHovered(true)}
            onMouseLeave={() => setBackHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: backHovered ? "#F1541C" : "rgba(26,26,26,0.45)",
              textDecoration: "none",
              transition: "color 0.2s ease",
              marginBottom: "32px",
              opacity: 0,
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: backHovered ? "translateX(-4px)" : "translateX(0)",
                transition: "transform 0.2s ease",
              }}
            >
              ←
            </span>
            <span>Proyectos</span>
          </Link>

          {/* Pill de dominio */}
          <div
            data-rise="pill"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 12px",
              borderRadius: "100px",
              background: "rgba(241,84,28,0.08)",
              border: "1px solid rgba(241,84,28,0.22)",
              marginBottom: "20px",
              opacity: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#F1541C",
              }}
            >
              {proyecto.domain}
            </span>
          </div>

          {/* H1 — masa tipográfica expresiva */}
          <h1
            data-rise="h1"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(44px,6vw,84px)",
              lineHeight: 0.97,
              letterSpacing: "-0.03em",
              color: "#1A1A1A",
              margin: "0 0 28px",
              opacity: 0,
              transform: "translateY(40px)",
            }}
          >
            {proyecto.title}
          </h1>

          {/* Lead */}
          <p
            data-rise="lead"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(15px,1.2vw,17px)",
              color: "rgba(26,26,26,0.55)",
              lineHeight: 1.65,
              maxWidth: "52ch",
              margin: 0,
              opacity: 0,
            }}
          >
            {proyecto.lead}
          </p>
        </div>

        {/* Columna derecha — imagen */}
        <div
          data-img
          style={{
            position: "relative",
            aspectRatio: "3/2",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow:
              "0 2px 12px rgba(26,26,26,0.08), 0 12px 40px rgba(26,26,26,0.10)",
            opacity: 0,
          }}
        >
          <Image
            src={proyecto.image}
            alt={proyecto.imageAlt}
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </section>
  );
}
