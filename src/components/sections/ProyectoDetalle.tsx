"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import type { Proyecto } from "@/lib/proyectos";
import PrevNextCard from "./PrevNext";
import ImageSlider from "./ImageSlider";

// ─────────────────────────────────────────────────────────────────────────────
// PROYECTO — página de detalle (/proyectos/[slug]). Concepto "Lámina viva del
// viento": la hoja de un dossier de ingeniería que el viento —aquello para lo que
// la turbina está diseñada— atraviesa. Habla con el resto del sitio:
//   · WindField (el MISMO motor de flujo de la sección Métricas, paleta cálida).
//   · Vocabulario blueprint/cota (leaders que se trazan, nodos) en TODOS los bloques.
//   · Reveals IO + fallback, hovers vivos, gradiente cálido anclado → Footer verde.
//
// Bloques: Hero (espécimen acotado en su viento) · Narrativa asimétrica (Contexto /
// Qué hicimos) · Ficha técnica = "lámina de cotas" (incluye la validación CFD →
// túnel → prototipo) · "Cómo lo abordamos" (riel conectado) · "Siguiente lámina"
// (prev/next con imagen). Copy desde lib/proyectos.ts.
// ─────────────────────────────────────────────────────────────────────────────

type NavPair = { prev: Proyecto; next: Proyecto };

// Realce mínimo en los valores de la ficha: `**texto**` → <strong>. Mantiene el
// valor como string plano en los datos y lo enfatiza al renderizar (sin HTML crudo).
function renderRich(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// Acento por métrica: color del dato + barra. Cálidos primero (regla de paleta):
// brasa → teal → terracota. Sin movimiento ni glow (fichas rectas y estáticas).
const METRIC_ACCENTS = [
  { fg: "text-ember", bar: "bg-ember" },
  { fg: "text-teal", bar: "bg-teal" },
  { fg: "text-terra", bar: "bg-terra" },
] as const;

// Anotación de la "línea de cota" (sin caja): número (Manrope, dispositivo de
// secuencia) + label + detalle, enmarcados por dos esquineros de registro (crop
// marks) en vértices opuestos — encuadre técnico sin el peso de una card.
// `center` → desktop (centrado, angosto); sin él → móvil (alineado a la
// izquierda, más ancho). El group-hover del número depende del `.group` ancestro.
function StationCallout({ n, label, detail, center }: { n: string; label: string; detail: string; center?: boolean }) {
  return (
    <div className={`w-full ${center ? "max-w-[192px] text-center" : "max-w-[340px] text-left"}`}>
      <div className={`inline-block max-w-full px-4 py-3 ${center ? "" : "text-left"}`}>
        {/* Número inline con el header (mismo renglón y altura que el label) */}
        <span className="block font-display text-base font-medium leading-snug text-ink">
          <span className="mr-2 font-light text-ink/40 transition-colors duration-200 group-hover:text-terra">{n}</span>
          {label}
        </span>
        {detail && <span className="mt-1.5 block whitespace-pre-line font-body text-sm font-normal leading-relaxed text-ink/70">{detail}</span>}
      </div>
    </div>
  );
}

export default function ProyectoDetalle({ proyecto, nav }: { proyecto: Proyecto; nav: NavPair }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Riel "Cómo lo abordamos": usa el enriquecido (label + detalle) si existe;
  // si no, cae a las capabilities simples (CIEP / biodiésel).
  const steps = proyecto.approach ?? proyecto.capabilities.map((label) => ({ label, detail: "" }));

  // Con un solo proyecto, getProyectoNav es circular y prev/next serían el mismo
  // proyecto apuntándose a sí mismo (H5): ocultamos "Más proyectos". Vuelve solo
  // cuando se sumen proyectos.
  const hasMore = nav.prev.slug !== proyecto.slug && nav.next.slug !== proyecto.slug;

  // Galería del proyecto en orden ALEATORIO. Se baraja en el cliente tras montar
  // (useEffect) para no romper la hidratación: el primer render usa el orden de
  // los datos y se reordena un instante después. Si no hay fotos, no se renderiza.
  const gallery = proyecto.gallery ?? [];
  const [shuffledGallery, setShuffledGallery] = useState<string[]>(gallery);
  useEffect(() => {
    if (gallery.length < 2) return;
    const arr = [...gallery];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledGallery(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyecto.slug]);

  // Título con realce: parte el título alrededor de titleAccent (solo énfasis).
  const renderTitle = () => {
    const acc = proyecto.titleAccent;
    if (!acc || !proyecto.title.includes(acc)) return proyecto.title;
    const [before, after] = proyecto.title.split(acc);
    return (
      <>
        {before}
        <span className="text-terra">{acc}</span>
        {after}
      </>
    );
  };

  // ── Reveals por bloque (IO + fallback gateado por visibilidad real, lore/animation).
  //    Cada bloque su firma; FOUC-safe (fromTo + estado inicial inline). ──
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const q = <T extends Element>(s: string, ctx: ParentNode) => Array.from(ctx.querySelectorAll<T>(s));

    if (reduce) {
      blocks.forEach((b) => {
        q("[data-fade]", b).forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
        q("[data-panel]", b).forEach((e) => gsap.set(e, { clipPath: "inset(0% 0 0 0 round 18px)" }));
        q("[data-rail]", b).forEach((e) => gsap.set(e, { scaleX: 1 }));
        q("[data-rail-v]", b).forEach((e) => gsap.set(e, { scaleY: 1 }));
        q("[data-step]", b).forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
        q("[data-card]", b).forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
        q("[data-metric]", b).forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
      });
      return;
    }

    const played = new WeakSet<HTMLElement>();
    const play = (b: HTMLElement) => {
      if (played.has(b)) return;
      played.add(b);
      const id = b.dataset.reveal;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Orquestación en 2 tiers (acorde al sitio, sin sobrecarga):
      //   · Showcase → clip-wipe: la foto del espécimen en el Hero.
      //   · Tranquilo → fade-up (y:16/18, ~0.7s) como base; el trazo-firma (líneas
      //     que se dibujan) aparece en la Ficha (líneas de cota) y en "Cómo" (curva).
      switch (id) {
        case "hero": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.85, stagger: 0.12 }, 0);
          tl.fromTo(q("[data-panel]", b), { clipPath: "inset(100% 0 0 0 round 18px)" }, { clipPath: "inset(0% 0 0 0 round 18px)", duration: 0.9, ease: "power3.inOut" }, 0.25);
          break;
        }
        case "ficha": {
          // Registro de datos: el header entra y los valores hacen fade-up en cascada
          // (un solo momento, sin líneas que se tracen — quedó más limpio y junto).
          // Las métricas de cierre entran después, sobrias (fade-up); su vida está en
          // el color y el hover, no en la entrada (estándar de efectos bajados).
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
          tl.fromTo(q("[data-card]", b), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.07 }, 0.12);
          tl.fromTo(q("[data-metric]", b), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.32);
          break;
        }
        case "narrativa": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.12 }, 0);
          break;
        }
        case "galeria": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.12 }, 0);
          break;
        }
        case "rail": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
          // El eje se traza y cada estación aparece a medida que el trazo la cruza:
          // el stagger se solapa con el trazo (reveal sincronizado, un solo momento).
          tl.fromTo(q("[data-rail]", b), { scaleX: 0 }, { scaleX: 1, duration: 0.95, ease: "power2.inOut" }, 0.15);
          tl.fromTo(q("[data-rail-v]", b), { scaleY: 0 }, { scaleY: 1, duration: 0.95, ease: "power2.inOut" }, 0.15);
          tl.fromTo(q("[data-step]", b), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, 0.25);
          break;
        }
        case "next": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
          tl.fromTo(q("[data-card]", b), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 }, 0.12);
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
      {/* ════════ 1 · HERO — el espécimen en su viento ════════ */}
      <section
        data-reveal="hero"
        data-nav="light"
        className="relative w-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, #f8eddd 0%, #f3ddbc 100%)" }}
      >
        <div className="relative z-10 mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-6 pb-12 pt-32 sm:px-10 sm:pt-40 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:px-14 md:pb-16 md:pt-40">
          {/* Texto */}
          <div>
            <Link
              data-fade
              href="/proyectos"
              className="group mb-7 inline-flex items-center gap-2 font-body text-sm font-medium uppercase tracking-[0.14em] text-ink/55 transition-colors duration-200 hover:text-terra"
              style={{ opacity: 0 }}
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-x-1" fill="none" aria-hidden="true">
                <path d="M17 10H4M9 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Todos los proyectos
            </Link>

            <h1
              data-fade
              className="m-0 font-display font-light text-ink"
              style={{ opacity: 0, fontSize: "clamp(2.5rem, 6.2vw, 4.6rem)", lineHeight: 1.0, letterSpacing: "-0.04em" }}
            >
              {renderTitle()}
            </h1>
            <p data-fade className="mt-6 max-w-[50ch] font-body text-lg font-light leading-relaxed text-ink/70 sm:text-xl" style={{ opacity: 0 }}>
              {proyecto.lead}
            </p>
          </div>

          {/* Espécimen — imagen con cotas que se trazan */}
          <div data-fade className="relative" style={{ opacity: 0 }}>
            <div data-panel className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] ring-1 ring-ink/15 shadow-[0_30px_70px_-40px_rgba(26,26,26,0.6)]" style={{ clipPath: "inset(100% 0 0 0 round 18px)" }}>
              <Image src={proyecto.image} alt={proyecto.imageAlt} fill priority sizes="(min-width: 768px) 520px, 90vw" className="object-cover object-center" />
              {/* Scrim inferior tenue → el borde de la foto se asienta sobre el panel */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{ background: "linear-gradient(0deg, rgba(26,26,26,0.22) 0%, transparent 20%)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ════════ 2 · NARRATIVA — Contexto / Qué hicimos (asimétrica) ════════ */}
      <section
        data-reveal="narrativa"
        data-nav="light"
        className="relative w-full"
        style={{ background: "linear-gradient(180deg, #f3ddbc 0%, #edcfa4 100%)" }}
      >
        <div className="mx-auto max-w-[1180px] px-6 py-12 sm:px-10 md:px-14 md:py-16">
          {/* El contexto */}
          <div className="grid grid-cols-1 gap-x-10 gap-y-4 md:grid-cols-12">
            <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-terra md:col-span-3" style={{ opacity: 0 }}>
              El contexto
            </h2>
            <p data-fade className="font-body text-xl font-light leading-relaxed text-ink/80 md:col-span-9 md:text-2xl" style={{ opacity: 0 }}>
              {proyecto.context}
            </p>
          </div>

          {/* Qué hicimos — desplazado, acento teal */}
          <div className="mt-14 grid grid-cols-1 gap-x-10 gap-y-4 md:mt-20 md:grid-cols-12">
            <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-teal md:col-span-3" style={{ opacity: 0 }}>
              Qué hicimos
            </h2>
            <p data-fade className="font-body text-base font-light leading-relaxed text-ink/75 md:col-span-9 md:text-lg" style={{ opacity: 0 }}>
              {proyecto.did}
            </p>
          </div>
        </div>
      </section>

      {/* ════════ 3 · FICHA TÉCNICA + MÉTRICAS — hoja de cuaderno de ingeniería ════════ */}
      {/* Una sola sección hace doble función (ficha + impacto): la "hoja" técnica con
          los datos y, al cierre, las métricas. La hoja se desordena un poco a propósito
          —ligeramente inclinada, con margen, perforaciones y grano de papel— para que
          se sienta una página real, no una recreación pulcra. */}
      <section
        data-reveal="ficha"
        data-nav="light"
        className="relative w-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, #edcfa4 0%, #e8c08e 100%)" }}
      >
        <div className="relative mx-auto max-w-[1180px] px-6 py-12 sm:px-10 md:px-14 md:py-16">
          <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ember" style={{ opacity: 0 }}>
            Ficha técnica
          </h2>

          {/* La hoja: borde hairline, levísima inclinación + sombra de "página apoyada",
              papel cuadriculado fino, margen rojo de cuaderno con perforaciones y un
              grano de papel sutil. El header queda afuera/arriba; los datos respiran
              dentro, pasada la columna de margen. */}
          <div className="relative mt-8 overflow-hidden rounded-[4px] border border-ink/25 bg-cream/85 px-5 py-[32px] shadow-[0_20px_55px_-44px_rgba(26,26,26,0.65)] sm:mt-10 sm:px-8 md:px-10">
            {/* Papel cuadriculado fino (35px → 4 celdas por el módulo de fila de 70px).
                background-position 32px alinea las líneas horizontales con los divisores. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(26,26,26,0.055) 1px, transparent 1px)," +
                  "linear-gradient(90deg, rgba(26,26,26,0.055) 1px, transparent 1px)",
                backgroundSize: "35px 35px",
                backgroundPosition: "0px 32px",
              }}
            />
            {/* Grano de papel — textura analógica muy tenue */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                opacity: 0.06,
                mixBlendMode: "multiply",
              }}
            />
            {/* Crop marks de registro en las 4 esquinas */}
            <span aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-3 w-3 border-l border-t border-ink/30" />
            <span aria-hidden="true" className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-ink/30" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-3 left-3 h-3 w-3 border-b border-l border-ink/30" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-3 h-3 w-3 border-b border-r border-ink/30" />

            {/* Contenido: en desktop, columna de margen con regla roja de cuaderno;
                en móvil se omite el margen y los datos ocupan todo el ancho de la hoja
                (más legible en pantalla angosta). */}
            <div className="relative z-10 flex">
              {/* Margen de cuaderno (solo desktop): regla roja al borde derecho */}
              <div aria-hidden="true" className="relative hidden w-11 shrink-0 sm:block">
                <span className="absolute bottom-0 right-0 top-0 w-px bg-terra/35" />
              </div>

              <div className="min-w-0 flex-1 sm:pl-7">
                {/* ── Desktop ≥ sm: label (con tick) · valor, en dos columnas juntas ── */}
                <dl className="hidden flex-col sm:flex">
                  {proyecto.facts.map((f) => (
                    <div key={f.label} className="group flex min-h-[70px] items-center gap-8 border-b border-ink/25 last:border-b-0">
                      <dt className="flex w-40 shrink-0 items-baseline gap-2.5 font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/55 transition-colors duration-200 group-hover:text-terra lg:w-48">
                        <span aria-hidden="true" className="h-3 w-px shrink-0 self-center bg-terra/70 transition-colors duration-300 group-hover:bg-ember" />
                        {f.label}
                      </dt>
                      <dd
                        data-card
                        className="m-0 max-w-[58ch] flex-1 font-body text-lg font-normal leading-relaxed text-ink"
                        style={{ opacity: 0 }}
                      >
                        {renderRich(f.value)}
                      </dd>
                    </div>
                  ))}
                </dl>

                {/* ── Móvil < sm: label (con tick) sobre valor ── */}
                <dl className="flex flex-col sm:hidden">
                  {proyecto.facts.map((f) => (
                    <div key={f.label} className="group flex min-h-[70px] flex-col justify-center gap-1.5 border-b border-ink/25 last:border-b-0">
                      <dt className="flex items-center gap-2.5 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/55">
                        <span aria-hidden="true" className="h-3 w-px shrink-0 bg-terra/70 transition-colors duration-300 group-hover:bg-ember" />
                        {f.label}
                      </dt>
                      <dd
                        data-card
                        className="m-0 font-body text-base font-normal leading-relaxed text-ink"
                        style={{ opacity: 0 }}
                      >
                        {renderRich(f.value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          {/* ── Métricas de impacto — cierre de la hoja. Fichas de papel propias, con el
              dato grande a color y un hover libre (se levanta, se endereza, se tiñe). ── */}
          {proyecto.metrics && proyecto.metrics.length > 0 && (
            <div className="mt-14 sm:mt-16">
              <h3 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-teal" style={{ opacity: 0 }}>
                Métricas de impacto
              </h3>
              <ul className="mt-7 grid grid-cols-1 gap-5 sm:mt-8 sm:grid-cols-3">
                {proyecto.metrics.map((m, i) => {
                  const a = METRIC_ACCENTS[i % METRIC_ACCENTS.length];
                  return (
                    <li key={m.label} data-metric style={{ opacity: 0 }}>
                      <div className="group relative h-full overflow-hidden rounded-[4px] border border-ink/25 bg-cream/85 px-6 py-7 shadow-[0_12px_32px_-32px_rgba(26,26,26,0.55)]">
                        {/* Barra de acento — crece un poco en hover */}
                        <span aria-hidden="true" className={`pointer-events-none absolute left-0 top-0 h-[3px] w-9 origin-left ${a.bar} transition-transform duration-300 group-hover:scale-x-[2.6]`} />
                        {/* Crop mark inferior derecho — guiño a la hoja técnica */}
                        <span aria-hidden="true" className="pointer-events-none absolute bottom-2.5 right-2.5 h-2.5 w-2.5 border-b border-r border-ink/30" />

                        <span
                          className={`relative block font-display font-light leading-none ${a.fg} transition-transform duration-300 group-hover:scale-[1.06]`}
                          style={{ fontSize: "clamp(2.3rem, 4.6vw, 3.1rem)", letterSpacing: "-0.02em", transformOrigin: "left center" }}
                        >
                          {m.figure}
                        </span>
                        <span className="relative mt-3 block font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-ink/70">
                          {m.label}
                        </span>
                        <span className="relative mt-1.5 block font-body text-sm font-light leading-relaxed text-ink/60">
                          {m.detail}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ════════ 4 · IMÁGENES DEL PROYECTO — galería (caja fija, orden al azar) ════════ */}
      {/* Solo aparece si el proyecto tiene fotos. Caja de alto fijo con fit=contain:
          encaja 16:9 y 9:16 sin redimensionar el slider ni recortar la foto. */}
      {shuffledGallery.length > 0 && (
        <section
          data-reveal="galeria"
          data-nav="light"
          className="relative w-full"
          style={{ background: "linear-gradient(180deg, #e8c08e 0%, #e3b478 100%)" }}
        >
          <div className="mx-auto max-w-[1180px] px-6 py-12 sm:px-10 md:px-14 md:py-16">
            <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-terra" style={{ opacity: 0 }}>
              Fotografías del proyecto
            </h2>
            <div data-fade className="mx-auto mt-8 max-w-[960px] sm:mt-10" style={{ opacity: 0 }}>
              <ImageSlider
                images={shuffledGallery}
                title={proyecto.title}
                reduceMotion={reduceMotion}
                fit="contain"
                sizes="(min-width: 768px) 60vw, 90vw"
                showCounter={false}
                accent="terra"
              />
            </div>
          </div>
        </section>
      )}

      {/* ════════ 5 · CÓMO LO ABORDAMOS — riel conectado (ex-pills) ════════ */}
      {/* Última sección cálida cuando no hay "Más proyectos": su gradiente sube de
          vuelta a #f3ddbc para empalmar con el verde del Footer sin costura. */}
      <section
        data-reveal="rail"
        data-nav="light"
        className="relative w-full"
        style={{ background: `linear-gradient(180deg, ${shuffledGallery.length > 0 ? "#e3b478" : "#e8c08e"} 0%, ${hasMore ? "#edca9c" : "#f3ddbc"} 100%)` }}
      >
        <div className="mx-auto max-w-[1180px] px-6 py-12 sm:px-10 md:px-14 md:py-16">
          <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-teal" style={{ opacity: 0 }}>
            Cómo lo abordamos
          </h2>

          {/* ── Desktop ≥ sm: eje horizontal acotado + callouts en zig-zag ── */}
          <div className="relative mt-12 hidden sm:block md:mt-16">
            {/* Eje acotado: hairline que se traza (data-rail) entre dos end-caps
                de medición (ticks que NO escalan con el trazo). */}
            <div aria-hidden="true" className="pointer-events-none absolute left-0 right-0 top-1/2 -translate-y-1/2">
              <div data-rail className="h-px w-full origin-left bg-ink/30" style={{ transform: "scaleX(0)" }} />
              <span className="absolute left-0 top-1/2 h-3 w-px -translate-y-1/2 bg-ink/40" />
              <span className="absolute right-0 top-1/2 h-3 w-px -translate-y-1/2 bg-ink/40" />
            </div>

            <ol className="relative flex items-stretch">
              {steps.map((s, i) => {
                const up = i % 2 === 0; // par arriba, impar abajo (zig-zag)
                const n = String(i + 1).padStart(2, "0");
                return (
                  <li key={s.label} data-step className="group grid min-h-[280px] flex-1 grid-rows-[1fr_auto_1fr]" style={{ opacity: 0 }}>
                    {/* Callout arriba: panel + witness line bajando al nodo */}
                    {up && (
                      <div className="row-start-1 flex flex-col items-center justify-end gap-2 px-2">
                        <StationCallout n={n} label={s.label} detail={s.detail} center />
                        <span className="h-6 w-px bg-ink/30 transition-colors duration-300 group-hover:bg-terra" />
                      </div>
                    )}
                    {/* Nodo: punto mínimo sobre el eje — se enciende en hover */}
                    <span className="row-start-2 mx-auto h-[5px] w-[5px] rounded-full bg-terra/60 transition-all duration-300 group-hover:scale-150 group-hover:bg-terra" />
                    {/* Callout abajo: witness line subiendo al nodo + panel */}
                    {!up && (
                      <div className="row-start-3 flex flex-col items-center justify-start gap-2 px-2">
                        <span className="h-6 w-px bg-ink/30 transition-colors duration-300 group-hover:bg-terra" />
                        <StationCallout n={n} label={s.label} detail={s.detail} center />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          {/* ── Móvil < sm: mismo concepto rotado — eje vertical + callouts a la derecha ── */}
          <ol className="relative mt-10 flex flex-col gap-6 sm:hidden">
            <span data-rail-v aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-px origin-top bg-ink/30" style={{ transform: "scaleY(0)" }} />
            {steps.map((s, i) => {
              const n = String(i + 1).padStart(2, "0");
              return (
                <li key={s.label} data-step className="group relative flex items-start gap-4" style={{ opacity: 0 }}>
                  <span className="relative z-10 mt-1 flex h-[22px] w-[22px] shrink-0 items-center justify-center">
                    <span className="h-[5px] w-[5px] rounded-full bg-terra/60 transition-all duration-300 group-hover:scale-150 group-hover:bg-terra" />
                  </span>
                  <StationCallout n={n} label={s.label} detail={s.detail} />
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ════════ 6 · SIGUIENTE LÁMINA — prev / next con imagen (solo si hay más) ════════ */}
      {hasMore && (
        <section
          data-reveal="next"
          data-nav="light"
          className="relative w-full"
          style={{ background: "linear-gradient(180deg, #edca9c 0%, #f3ddbc 100%)" }}
        >
          <div className="mx-auto max-w-[1180px] px-6 pb-20 pt-4 sm:px-10 md:px-14 md:pb-24">
            <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink/55" style={{ opacity: 0 }}>
              Más proyectos
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <PrevNextCard
                item={{ href: `/proyectos/${nav.prev.slug}`, image: nav.prev.image, imageAlt: nav.prev.imageAlt, eyebrow: nav.prev.domain, title: nav.prev.title }}
                dir="prev"
              />
              <PrevNextCard
                item={{ href: `/proyectos/${nav.next.slug}`, image: nav.next.image, imageAlt: nav.next.imageAlt, eyebrow: nav.next.domain, title: nav.next.title }}
                dir="next"
              />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
