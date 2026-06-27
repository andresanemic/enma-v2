"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import SignalMarquee from "./SignalMarquee";

// ─────────────────────────────────────────────────────────────────────────────
// VINCULACIÓN — "EN VIVO: la señal de Enma"
// Repositorio vivo de presencia pública: medios, charlas y entrevistas.
// Fuente de verdad: que-es-enma.txt ("Charlas y difusión" + "Qué debe lograr la
// presencia de Enma") y la voz de los fundadores (entrevistas). La marca es
// "comunicativa, activa, intrusa pero profesional, entra por la vista".
//
// Contenido real actualizado 2026-06-26. Añadir nuevas apariciones según ocurran.
// ─────────────────────────────────────────────────────────────────────────────

type Kind = "medios" | "charlas" | "entrevistas";

type Aparicion = {
  id: string;
  year: string;
  kind: Kind;
  tag: string;
  title: string;
  outlet: string;
  images: string[];
  description?: string;
  link?: string; // URL externa (p. ej. la columna publicada)
  quote?: string; // pull quote; si existe (e images vacío) → tarjeta editorial
};

const APARICIONES: Aparicion[] = [
  {
    id: "congreso-jovenes-aysen",
    year: "2026",
    kind: "charlas",
    tag: "Charla",
    title: "Congreso Jóvenes Futuro Aysén",
    outlet: "Congreso Jóvenes Futuro Aysén",
    images: ["/vinculacion/participaciones/congreso-jovenes-futuro-v3.webp"],
  },
  {
    id: "columna-denota-no-convencional",
    year: "2025",
    kind: "medios",
    tag: "Medios",
    title: "Más allá de lo no convencional: el verdadero desafío energético",
    outlet: "DeNota · periodismo independiente de Aysén",
    images: [],
    description:
      "Patricio Campos, cofundador de Enma, sobre la generación eléctrica comunitaria como camino a la soberanía energética en Aysén.",
    quote:
      "Aprovechar las renovables convencionales de una manera menos convencional, mediante la generación colectiva, es dar pasos concretos hacia una mayor soberanía energética.",
    link: "https://denota.cl/opinion/mas-alla-de-lo-no-convencional-el-verdadero-desafio-energetico",
  },
  {
    id: "camara-construccion-coyhaique",
    year: "2025",
    kind: "charlas",
    tag: "Charla",
    title: "Eficiencia energética en la construcción",
    outlet: "Cámara Chilena de la Construcción · Coyhaique",
    images: [
      "/vinculacion/participaciones/camara-construccion-coyhaique-1.webp",
      "/vinculacion/participaciones/camara-construccion-coyhaique-2.webp",
      "/vinculacion/participaciones/camara-construccion-coyhaique-3.webp",
      "/vinculacion/participaciones/camara-construccion-coyhaique-4.webp",
    ],
    description:
      "Hablamos del contexto energético de Aysén y de lo que la eficiencia energética aporta al rubro de la construcción. Una instancia gestionada por la Seremi de Energía de Aysén y CORFO Aysén.",
  },
  {
    id: "rocco-tv",
    year: "2025",
    kind: "entrevistas",
    tag: "TV",
    title: "Estudios energéticos regionales",
    outlet: "Rocco TV",
    images: ["/vinculacion/participaciones/patricio-rocco-tv-v2.webp"],
  },
  {
    id: "radio-santa-maria",
    year: "2025",
    kind: "entrevistas",
    tag: "Radio",
    title: "Estudios energéticos regionales",
    outlet: "Radio Santa María",
    images: ["/vinculacion/participaciones/patricio-radio-santa-maria-v2.webp"],
  },
  {
    id: "contexto-energetico-aysen",
    year: "2025",
    kind: "charlas",
    tag: "Charla",
    title: "Contexto energético en la Región de Aysén",
    outlet: "Charla pública · Aysén",
    images: ["/vinculacion/participaciones/charla-patricio-contexto-energetico-v2.webp"],
  },
  {
    id: "litoral-aysen",
    year: "2025",
    kind: "charlas",
    tag: "Charla",
    title: "Difusión de estudios energéticos en el litoral",
    outlet: "Litoral de Aysén",
    images: ["/vinculacion/participaciones/patricio-charla-litoral.webp"],
  },
];

type Channel = "todo" | Kind;
const CHANNELS: { id: Channel; label: string }[] = [
  { id: "todo", label: "Todo" },
  { id: "medios", label: "Medios" },
  { id: "charlas", label: "Charlas" },
  { id: "entrevistas", label: "Entrevistas" },
];

// Color del tag por tipo (cálidos protagonistas; teal solo acento de marca puntual).
const TAG_TONE: Record<Kind, string> = {
  charlas: "text-ember",
  medios: "text-terra",
  entrevistas: "text-teal",
};

// Nombres que derivan en el marquee perpetuo del hero (tribunas y medios donde
// aparece Enma). Continuo, sin números inventados.
const MARQUEE = [
  "Radio local",
  "Consejo Regional",
  "Junta de vecinos",
  "Televisión local",
  "Cámara de comercio",
  "Charlas comunitarias",
  "Difusión de estudios",
  "Prensa digital",
];

export default function Vinculacion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const repoRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [channel, setChannel] = useState<Channel>("todo");
  const [repoIn, setRepoIn] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  // Imágenes ya decodificadas: la foto del acordeón es lazy y solo carga al
  // expandir; sin esto aparecería de golpe (rompe el tono premium en móvil).
  // Arranca en opacity:0 y entra con fade al terminar de cargar (onLoad).
  const [loadedImg, setLoadedImg] = useState<Set<string>>(new Set());
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const shown = APARICIONES.filter((a) => channel === "todo" || a.kind === channel);

  // ── Reveals de los bloques narrativos (hero, destacada, cierre): IO + fallback
  // gateado por visibilidad real (lore/animation). Cada bloque, su firma. ──
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const q = <T extends Element>(s: string, ctx: ParentNode) =>
      Array.from(ctx.querySelectorAll<T>(s));

    if (reduce) {
      blocks.forEach((b) => {
        q("[data-fade]", b).forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
        q("[data-clip]", b).forEach((e) =>
          gsap.set(e, { clipPath: "inset(0 0% 0 0)", opacity: 1 })
        );
        q("[data-rule]", b).forEach((e) => gsap.set(e, { scaleX: 1 }));
      });
      return;
    }

    const played = new WeakSet<HTMLElement>();
    const play = (b: HTMLElement) => {
      if (played.has(b)) return;
      played.add(b);
      const id = b.dataset.reveal;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      switch (id) {
        case "hero": {
          tl.fromTo(
            q("[data-clip]", b),
            { clipPath: "inset(0 100% 0 0)", opacity: 1 },
            { clipPath: "inset(0 0% 0 0)", duration: 0.9, stagger: 0.14, ease: "power3.inOut" },
            0
          );
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.14 }, 0.45);
          break;
        }
        case "cierre": {
          tl.fromTo(q("[data-rule]", b), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" }, 0);
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.15);
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

  // ── Repositorio: detectar entrada en viewport (revela cabecera + canales + filas).
  // Separado de los bloques narrativos porque las filas se re-animan al filtrar. ──
  useEffect(() => {
    const el = repoRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setRepoIn(true);
      el.querySelectorAll<HTMLElement>("[data-repo-head]").forEach((e) =>
        gsap.set(e, { opacity: 1, y: 0 })
      );
      return;
    }
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      gsap.fromTo(
        el.querySelectorAll<HTMLElement>("[data-repo-head]"),
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" }
      );
      setRepoIn(true);
    };
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          reveal();
          io.disconnect();
        }
      },
      { threshold: 0.14 }
    );
    io.observe(el);
    const t = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) reveal();
    }, 2600);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // ── Filas: entran (y re-entran al cambiar de canal) con cascada fade+rise. ──
  useEffect(() => {
    if (!repoIn) return;
    const list = listRef.current;
    if (!list) return;
    const rows = Array.from(list.querySelectorAll<HTMLElement>("[data-row]"));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(rows, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      rows,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.07, ease: "power3.out" }
    );
  }, [channel, repoIn]);

  return (
    <div ref={rootRef} className="w-full">
      {/* ════════ 1 · HERO — "la señal" (más diseño que Nosotros) ════════ */}
      <section
        data-reveal="hero"
        data-nav="light"
        className="relative w-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, #f8eddd 0%, #f7e6cf 58%, #f3ddbc 100%)" }}
      >
        <div className="relative mx-auto max-w-[1400px] px-6 pb-10 pt-36 sm:px-10 sm:pt-44 md:px-14">
          <div className="grid min-h-[64svh] grid-cols-1 items-center gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-12">
            {/* ── Texto ── */}
            <div>
              <h1
                aria-label="Salimos a hablar."
                className="m-0 max-w-[14ch] font-display font-light text-ink"
                style={{ fontSize: "clamp(2.6rem, 8vw, 6rem)", lineHeight: 1.0, letterSpacing: "-0.04em" }}
              >
                <span aria-hidden="true" className="block overflow-hidden">
                  <span data-clip className="block" style={{ clipPath: "inset(0 100% 0 0)" }}>
                    Salimos a
                  </span>
                </span>
                <span aria-hidden="true" className="block overflow-hidden">
                  <span data-clip className="block font-medium text-ember" style={{ clipPath: "inset(0 100% 0 0)" }}>
                    hablar.
                  </span>
                </span>
              </h1>

              <p
                data-fade
                className="mt-7 max-w-[46ch] font-body text-lg font-light leading-relaxed text-ink/70 sm:text-xl"
                style={{ opacity: 0 }}
              >
                Charlas, prensa y comunidad. Porque la mejor tecnología no sirve de
                nada si nadie sabe que existe, y porque la confianza se construye
                hablando de frente.
              </p>
            </div>

            <div data-fade className="relative mx-auto w-full max-w-[460px]" style={{ opacity: 0 }}>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10"
                style={{ background: "radial-gradient(58% 52% at 50% 46%, rgba(241,84,28,0.14) 0%, transparent 68%)" }}
              />
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] ring-1 ring-ink/15 shadow-[0_30px_70px_-40px_rgba(26,26,26,0.6)]">
                <Image
                  src="/vinculacion/hero-v1.webp"
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 768px) 460px, 90vw"
                  className="object-cover object-top"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "linear-gradient(150deg, rgba(177,44,0,0.22) 0%, rgba(219,135,70,0.10) 55%, rgba(241,84,28,0.18) 100%)",
                    mixBlendMode: "multiply",
                  }}
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

      {/* ════════ 2 · REPOSITORIO — lista editorial filtrable por canal ════════ */}
      <section
        ref={repoRef}
        data-nav="light"
        className="relative w-full"
        style={{ background: "linear-gradient(180deg, #f3ddbc 0%, #f8eddd 22%, #f8eddd 100%)" }}
      >
        <div className="mx-auto max-w-[1400px] px-6 pb-12 pt-20 sm:px-10 md:px-14 md:pb-16 md:pt-28">
          {/* Cabecera + canales */}
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <h2
              data-repo-head
              className="m-0 max-w-[18ch] font-display font-light text-ink"
              style={{ opacity: 0, fontSize: "clamp(1.8rem, 3.8vw, 2.9rem)", lineHeight: 1.08, letterSpacing: "-0.03em" }}
            >
              Dónde nos han <span className="font-medium text-ember">escuchado</span>.
            </h2>

            <div
              data-repo-head
              role="tablist"
              aria-label="Filtrar por canal"
              className="flex flex-wrap items-center gap-2"
              style={{ opacity: 0 }}
            >
              {CHANNELS.filter(
                (c) => c.id === "todo" || APARICIONES.some((a) => a.kind === c.id)
              ).map((c) => {
                const on = channel === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => setChannel(c.id)}
                    className={`rounded-full border px-4 py-2 font-body text-sm font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/50 ${
                      on
                        ? "border-ember bg-ember text-cream shadow-[0_8px_24px_-12px_rgba(241,84,28,0.7)]"
                        : "border-ink/15 text-ink/60 hover:border-ember/50 hover:text-ink"
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lista */}
          <div ref={listRef} className="mt-12 flex flex-col md:mt-16">
            <span aria-hidden="true" className="block border-t border-ink/12" />
            {shown.map((a) => (
              <article
                key={a.id}
                data-row
                style={{ opacity: 0 }}
                role="button"
                tabIndex={0}
                aria-expanded={openId === a.id}
                onClick={() => setOpenId(openId === a.id ? null : a.id)}
                onKeyDown={(e) => {
                  // Solo togglear si el foco está en la fila misma, no en un
                  // control interno (flechas/puntos del slider).
                  if (e.target !== e.currentTarget) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenId(openId === a.id ? null : a.id);
                  }
                }}
                className="group relative grid cursor-pointer grid-cols-1 items-baseline gap-x-8 gap-y-2 border-b border-ink/12 py-7 transition-[padding] duration-300 ease-out hover:pl-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/50 md:grid-cols-[150px_1fr] md:py-8"
              >
                {/* Año + tag */}
                <div className="flex items-center gap-3">
                  <span className="font-body text-sm font-medium tabular-nums text-ink/45">
                    {a.year}
                  </span>
                  <span className="hidden h-3 w-px bg-ink/20 md:block" />
                  <span className={`font-body text-xs font-semibold uppercase tracking-[0.18em] ${TAG_TONE[a.kind]}`}>
                    {a.tag}
                  </span>
                </div>

                {/* Título + outlet + imagen expandida */}
                <div className="min-w-0 md:px-4">
                  <h3
                    className="m-0 font-display font-light text-ink transition-colors duration-300 group-hover:text-ember"
                    style={{ fontSize: "clamp(1.2rem, 2.4vw, 1.7rem)", letterSpacing: "-0.02em", lineHeight: 1.15 }}
                  >
                    {a.title}
                  </h3>
                  <p className="mt-1 font-body text-sm font-light text-ink/55">{a.outlet}</p>

                  {/* Panel expandido — imagen real */}
                  <div
                    className="grid overflow-hidden"
                    style={{
                      gridTemplateRows: openId === a.id ? "1fr" : "0fr",
                      opacity: openId === a.id ? 1 : 0,
                      transition: reduceMotion ? "none" : "grid-template-rows 320ms ease-out, opacity 280ms ease-out",
                    }}
                  >
                    <div className="overflow-hidden">
                      {a.description && (
                        <p className="mt-4 max-w-[60ch] font-body text-base font-light leading-relaxed text-ink/70">
                          {a.description}
                        </p>
                      )}
                      {a.quote ? (
                        <OpinionCard
                          quote={a.quote}
                          source="Columna de opinión · DeNota"
                          author="Patricio Campos"
                          role="Cofundador de Enma"
                          link={a.link}
                          active={openId === a.id}
                          reduceMotion={reduceMotion}
                        />
                      ) : a.images.length > 1 ? (
                        <ImageSlider
                          images={a.images}
                          title={a.title}
                          active={openId === a.id}
                          reduceMotion={reduceMotion}
                        />
                      ) : (
                        a.images[0] && (
                          <Image
                            src={a.images[0]}
                            alt={a.title}
                            width={0}
                            height={0}
                            sizes="(min-width: 768px) 55vw, 90vw"
                            onLoad={() =>
                              setLoadedImg((prev) =>
                                prev.has(a.id) ? prev : new Set(prev).add(a.id)
                              )
                            }
                            className="mt-5 w-full max-w-[640px] rounded-xl"
                            style={{
                              height: "auto",
                              opacity: loadedImg.has(a.id) ? 1 : 0,
                              transform: loadedImg.has(a.id) ? "scale(1)" : "scale(1.02)",
                              transition: reduceMotion
                                ? "none"
                                : "opacity 600ms ease-out, transform 700ms ease-out",
                            }}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>

              </article>
            ))}
          </div>

          {/* Nota de repositorio en construcción (placeholder transparente) */}
          <p className="mt-10 font-body text-sm font-light text-ink/40">
            {/* TODO(enma): quitar esta nota cuando el listado real esté completo. */}
            Registro en crecimiento: vamos sumando cada charla, nota y entrevista a
            medida que ocurren.
          </p>
        </div>
      </section>

      {/* ════════ 3 · CIERRE — claro cálido, centrado (tono CTA) que entrega al Footer ════════ */}
      <section
        data-reveal="cierre"
        data-nav="light"
        className="relative w-full"
        style={{ background: "linear-gradient(180deg, #f8eddd 0%, #f3ddbc 100%)" }}
      >
        <div className="mx-auto max-w-[900px] px-6 pb-24 pt-12 text-center sm:px-10 md:px-14 md:pb-32 md:pt-16">
          {/* Curva de nivel que se traza (mismo divider que las franjas del Blog) */}
          <div
            data-rule
            aria-hidden="true"
            className="mx-auto mb-10 w-full max-w-[440px] origin-left"
            style={{ transform: "scaleX(0)" }}
          >
            <svg viewBox="0 0 1200 12" preserveAspectRatio="none" className="h-3 w-full text-ink/20" fill="none">
              <path
                d="M0 6 C 100 1, 200 11, 300 6 S 500 1, 600 6 S 800 11, 900 6 S 1100 1, 1200 6"
                stroke="currentColor"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
          <h2
            data-fade
            className="m-0 mx-auto max-w-[26ch] font-display font-light text-ink md:max-w-none"
            style={{ opacity: 0, fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
          >
            <span className="md:block md:whitespace-nowrap">
              ¿Tienes un espacio, un micrófono{" "}
            </span>
            <span className="md:block md:whitespace-nowrap">
              o una comunidad?{" "}
              <span className="font-medium text-ember">Conversemos</span>.
            </span>
          </h2>
          <p
            data-fade
            className="mx-auto mt-6 max-w-[56ch] font-body text-base font-light leading-relaxed text-ink/65 sm:text-lg"
            style={{ opacity: 0 }}
          >
            Damos charlas de eficiencia energética y cambio climático, y conversamos
            con medios y comunidades sobre lo que se puede hacer desde la Patagonia.
          </p>
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDER de fotos — una a la vez, tamaño FIJO (3:2, igual al de las fotos).
// Vive dentro de la fila clickeable del repositorio, así que cada control
// detiene la propagación para no cerrar el panel al navegar las imágenes.
// ─────────────────────────────────────────────────────────────────────────────
function ImageSlider({
  images,
  title,
  active,
  reduceMotion,
}: {
  images: string[];
  title: string;
  active: boolean;
  reduceMotion: boolean;
}) {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(new Set());
  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();
  const go = (n: number) =>
    setIdx((p) => (n + images.length) % images.length);

  return (
    <div className="mt-5 max-w-[640px]">
      <div className="relative aspect-[3/2] w-full overflow-hidden rounded-xl bg-ink/5 ring-1 ring-ink/10">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${title} — imagen ${i + 1} de ${images.length}`}
            fill
            sizes="(min-width: 768px) 55vw, 90vw"
            onLoad={() =>
              setLoaded((prev) => (prev.has(i) ? prev : new Set(prev).add(i)))
            }
            className="object-cover"
            style={{
              opacity: i === idx && loaded.has(i) ? 1 : 0,
              transition: reduceMotion ? "none" : "opacity 500ms ease-out",
            }}
          />
        ))}

        {/* Flechas */}
        <button
          type="button"
          aria-label="Foto anterior"
          tabIndex={active ? 0 : -1}
          onClick={(e) => {
            stop(e);
            go(idx - 1);
          }}
          onKeyDown={stop}
          className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-cream/85 text-ink shadow-[0_8px_20px_-10px_rgba(26,26,26,0.7)] backdrop-blur-sm transition-all duration-300 ease-out hover:bg-ember hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Foto siguiente"
          tabIndex={active ? 0 : -1}
          onClick={(e) => {
            stop(e);
            go(idx + 1);
          }}
          onKeyDown={stop}
          className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-cream/85 text-ink shadow-[0_8px_20px_-10px_rgba(26,26,26,0.7)] backdrop-blur-sm transition-all duration-300 ease-out hover:bg-ember hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Contador */}
        <span className="absolute bottom-3 right-3 rounded-full bg-ink/55 px-2.5 py-1 font-body text-xs font-medium tabular-nums text-cream backdrop-blur-sm">
          {idx + 1} / {images.length}
        </span>
      </div>

      {/* Puntos */}
      <div className="mt-3 flex items-center justify-center gap-2.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir a la foto ${i + 1}`}
            aria-current={i === idx}
            tabIndex={active ? 0 : -1}
            onClick={(e) => {
              stop(e);
              setIdx(i);
            }}
            onKeyDown={stop}
            className={`h-2.5 rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 ${
              i === idx ? "w-6 bg-ember" : "w-2.5 bg-ink/25 hover:bg-ink/45"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OPINION CARD — tarjeta editorial para columnas/medios sin foto de evento.
// Reemplaza el slot de imagen del acordeón cuando la aparición trae `quote`.
// Vive dentro de la fila clickeable: el CTA detiene la propagación para no
// cerrar el panel al navegar a la fuente externa.
// ─────────────────────────────────────────────────────────────────────────────
function OpinionCard({
  quote,
  source,
  author,
  role,
  link,
  active,
  reduceMotion,
}: {
  quote: string;
  source: string;
  author: string;
  role: string;
  link?: string;
  active: boolean;
  reduceMotion: boolean;
}) {
  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();
  return (
    <div
      className="mt-5 max-w-[640px] rounded-xl bg-cream/70 p-7 ring-1 ring-ink/10 sm:p-8"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(8px)",
        transition: reduceMotion
          ? "none"
          : "opacity 460ms ease-out, transform 520ms ease-out",
      }}
    >
      {/* Meta */}
      <p className="m-0 font-body text-xs font-semibold uppercase tracking-[0.18em] text-terra">
        {source}
      </p>

      {/* Cita */}
      <blockquote className="relative m-0 mt-4">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-1 -top-6 font-display text-6xl leading-none text-terra/35"
        >
          &ldquo;
        </span>
        <p
          className="relative m-0 font-display font-light text-ink"
          style={{
            fontSize: "clamp(1.25rem, 2.4vw, 1.9rem)",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        >
          {quote}
        </p>
      </blockquote>

      {/* Pie: autor + isotipo */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="m-0 font-body text-sm font-medium text-ink">{author}</p>
          <p className="m-0 font-body text-sm font-light text-ink/55">{role}</p>
        </div>
        <Image
          src="/isotipos/isotipo-verde.webp"
          alt=""
          aria-hidden="true"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 opacity-70"
        />
      </div>

      {/* CTA externo */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={active ? 0 : -1}
          onClick={stop}
          onKeyDown={stop}
          className="group/cta mt-6 inline-flex items-center gap-2 font-body text-sm font-medium text-terra focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/50"
        >
          <span className="relative">
            Leer en DeNota
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-terra transition-transform duration-300 ease-out group-hover/cta:scale-x-100"
            />
          </span>
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
          >
            &rarr;
          </span>
          <span className="sr-only">(se abre en una nueva pestaña)</span>
        </a>
      )}
    </div>
  );
}
