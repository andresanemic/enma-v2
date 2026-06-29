"use client";

import Image from "next/image";
import Link from "next/link";

// ─────────────────────────────────────────────────────────────────────────────
// PrevNextCard — "lámina" de navegación anterior/siguiente: tarjeta con imagen +
// scrim + hover vivo (zoom lento + flecha que desliza). Extraída del detalle de
// Proyectos (antes `PlateCard`) para compartirla con la lectura del Blog.
//
// Conserva el aspecto EXACTO del detalle de Proyectos cuando se usa con los
// valores por defecto (acento naranja, ring terra). El padre anima [data-card]
// (estado inicial opacity:0 inline → FOUC-safe; reveal por el efecto del padre).
// ─────────────────────────────────────────────────────────────────────────────

export type PrevNextItem = {
  href: string;
  image: string;
  imageAlt: string;
  /** Línea superior pequeña (dominio / sección). Outfit uppercase. */
  eyebrow: string;
  title: string;
};

export default function PrevNextCard({
  item,
  dir,
  accentHover = "group-hover:text-orange",
  ariaNoun = "Proyecto",
  hideEyebrow = false,
  labelPill = false,
  pillClass = "bg-teal text-cream",
}: {
  item: PrevNextItem;
  dir: "prev" | "next";
  /** Color del eyebrow al hover (acento por página). */
  accentHover?: string;
  /** Sustantivo para el aria-label ("Proyecto" / "Nota"). */
  ariaNoun?: string;
  /** Oculta la línea de dominio/sección (eyebrow) bajo el scrim. */
  hideEyebrow?: boolean;
  /** Envuelve la etiqueta "Anterior/Siguiente" en una pill (mejor lectura). */
  labelPill?: boolean;
  /** Color de la pill (fondo + texto) por página. Default teal (Blog); terra en Proyectos. */
  pillClass?: string;
}) {
  const isPrev = dir === "prev";
  const arrow = isPrev ? "M17 10H4M9 5l-5 5 5 5" : "M3 10h13M11 5l5 5-5 5";
  return (
    <Link
      data-card
      href={item.href}
      aria-label={`${isPrev ? `${ariaNoun} anterior` : `${ariaNoun} siguiente`}: ${item.title}`}
      className="group relative block aspect-[16/10] overflow-hidden rounded-[18px] outline-none ring-1 ring-ink/12 transition-shadow duration-500 focus-visible:ring-2 focus-visible:ring-terra/60"
      // willChange: capa GPU estable → el recorte rounded del padre no se pierde
      // cuando la imagen interior se compone aparte al hacer zoom en hover (lore/layout).
      style={{ opacity: 0, willChange: "transform" }}
    >
      <Image
        src={item.image}
        alt={item.imageAlt}
        fill
        sizes="(min-width: 768px) 560px, 90vw"
        className="object-cover object-center transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(26,26,26,0.15) 0%, transparent 40%, rgba(26,26,26,0.4) 60%, rgba(26,26,26,0.82) 100%)" }}
      />
      <div className={`absolute inset-0 flex flex-col justify-between p-6 ${isPrev ? "items-start text-left" : "items-end text-right"}`}>
        <span
          className={`flex items-center gap-2 font-body text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200 ${
            labelPill
              ? `rounded-full px-3 py-1.5 shadow-[0_8px_22px_-12px_rgba(26,26,26,0.7)] ${pillClass}`
              : `text-cream/85 ${accentHover}`
          } ${isPrev ? "" : "flex-row-reverse"}`}
        >
          <svg viewBox="0 0 20 20" className={`h-3.5 w-3.5 transition-transform duration-300 ease-out ${isPrev ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} fill="none" aria-hidden="true">
            <path d={arrow} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {isPrev ? "Anterior" : "Siguiente"}
        </span>
        <div>
          {!hideEyebrow && <p className="font-body text-[11px] uppercase tracking-[0.14em] text-cream/65">{item.eyebrow}</p>}
          <p className="mt-1 font-display font-medium leading-tight text-cream" style={{ fontSize: "clamp(1.35rem, 2.4vw, 1.9rem)", letterSpacing: "-0.02em" }}>
            {item.title}
          </p>
        </div>
      </div>
    </Link>
  );
}
