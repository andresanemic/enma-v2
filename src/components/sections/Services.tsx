"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

// Copy real, derivado de que-es-enma.txt ("Servicios de Enma"). En el orden del
// documento: consultoría (base) → formulación → ejecución → CFD → túnel de viento
// → huella de carbono → charlas. Sin inventar datos ni cifras.
type Service = {
  n: string;
  title: string;
  desc: string;
  // TODO: reemplazar por fotografía propia de Enma (Aysén / proceso / equipo).
  // Placeholders Unsplash; el duotono homogeniza la paleta y cubre fallos de carga.
  img: string; // id de foto Unsplash
  duoFrom: string; // duotono — color base/sombra (par de marca del servicio)
  duoTo: string; // duotono — color de realce
};

const SERVICES: Service[] = [
  {
    n: "01",
    title: "Consultoría y estudios energéticos",
    desc: "El servicio base, y el que abre la puerta a todos los demás: estudios de soluciones energéticas para empresas y sector público. Su mayor valor es intangible: el conocimiento técnico y el del territorio.",
    img: "photo-1469474968028-56623f02e42e",
    duoFrom: "#b12c00",
    duoTo: "#fea94f",
  },
  {
    n: "02",
    title: "Formulación y acompañamiento",
    desc: "Formulamos y acompañamos proyectos para apalancar recursos públicos —Corfo, ANID, GORE— con foco energético o ambiental. Desde la idea hasta la presentación y ejecución de la iniciativa.",
    img: "photo-1501785888041-af3ef285b470",
    duoFrom: "#f1541c",
    duoTo: "#fea94f",
  },
  {
    n: "03",
    title: "Ejecución, operación y mantenimiento",
    desc: "Apoyados en una red sólida de socios y colaboradores, ejecutamos proyectos de energía y manufactura de forma efectiva, y nos hacemos cargo de su posterior operación y mantenimiento.",
    img: "photo-1466611653911-95081537e5b7",
    duoFrom: "#b12c00",
    duoTo: "#f1541c",
  },
  {
    n: "04",
    title: "Simulaciones CFD",
    desc: "Simulaciones fluidodinámicas que optimizan el diseño de sistemas que interactúan con fluidos —turbinas, sistemas hidráulicos, embarcaciones—. Traducen el análisis en soluciones más rápidas y confiables.",
    img: "photo-1518770660439-4636190af475",
    duoFrom: "#205358",
    duoTo: "#8fb8c4",
  },
  {
    n: "05",
    title: "Ensayos en túnel de viento",
    desc: "Un túnel de viento propio —en construcción en Santiago— que complementa al CFD en todo lo referente al aire, permitiendo validar físicamente los diseños antes de fabricarlos.",
    img: "photo-1470071459604-3b5ec3a7fe05",
    duoFrom: "#fea94f",
    duoTo: "#f7dfba",
  },
  {
    n: "06",
    title: "Cuantificación de huella de carbono",
    desc: "Medimos las emisiones de gases de efecto invernadero de empresas y municipios, camino a los sellos de calidad que entrega el Ministerio del Medio Ambiente.",
    img: "photo-1441974231531-c6227db76b6e",
    duoFrom: "#205358",
    duoTo: "#3e7c6c",
  },
  {
    n: "07",
    title: "Charlas y difusión",
    desc: "Charlas sobre eficiencia energética y cambio climático, presentaciones ante consejos regionales, comunidades y juntas de vecinos, y difusión de estudios en medios de la región.",
    img: "photo-1475721027785-f74eccf877e2",
    duoFrom: "#f1541c",
    duoTo: "#b12c00",
  },
];

// ── Coreografía de la card del panel ────────────────────────────────────────
// Cada card se "monta" con efectos propios y escalonados (filosofía del Footer):
// la foto hace clip-wipe + settle de escala, el título se dibuja (clip-wipe) y la
// descripción entra con fade. Vale para la entrada (con delay) y para el cambio
// de servicio (snappy). Las cards van apiladas en una celda de grid → todas miden
// lo del servicio más alto; autoAlpha (visibility) conserva ese alto al ocultarlas.
function cardParts(c: HTMLElement) {
  return {
    media: c.querySelector<HTMLElement>("[data-card-media]")!,
    img: c.querySelector<HTMLElement>("[data-card-img]")!,
    title: c.querySelector<HTMLElement>("[data-card-title]")!,
    desc: c.querySelector<HTMLElement>("[data-card-desc]")!,
  };
}

function animateCardIn(c: HTMLElement, delay = 0) {
  const { media, img, title, desc } = cardParts(c);
  gsap.killTweensOf([c, media, img, title, desc]);
  gsap.set(c, { zIndex: 10 });
  const tl = gsap.timeline({ delay, defaults: { ease: "power3.out" } });
  tl.to(c, { autoAlpha: 1, duration: 0.25 }, 0)
    // Foto — clip-wipe (izq → der) + leve settle de escala
    .fromTo(
      media,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 0.7, ease: "power3.inOut" },
      0
    )
    .fromTo(img, { scale: 1.04 }, { scale: 1, duration: 0.8, ease: "power2.out" }, 0)
    // Título — se "dibuja" con clip-wipe
    .fromTo(
      title,
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 0.55, ease: "power2.inOut" },
      0.16
    )
    // Descripción — fade + leve subida
    .fromTo(desc, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.55 }, 0.28);
  return tl;
}

// Crossfade de ENTRADA al cambiar de servicio (el efecto "de antes"): la card
// aparece completa (su contenido ya dibujado, sin clip-wipe) y solo cruza con
// fundido + leve subida + desenfoque que se aclara.
function crossfadeCardIn(c: HTMLElement) {
  const { media, img, title, desc } = cardParts(c);
  gsap.killTweensOf([c, media, img, title, desc]);
  // Contenido en estado final (la coreografía bonita es solo para la entrada).
  gsap.set(media, { clipPath: "inset(0 0% 0 0)" });
  gsap.set(img, { scale: 1 });
  gsap.set(title, { clipPath: "inset(0 0% 0 0)" });
  gsap.set(desc, { opacity: 1, y: 0 });
  gsap.set(c, { zIndex: 10 });
  gsap.fromTo(
    c,
    { autoAlpha: 0, y: 8, filter: "blur(5px)" },
    { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.out" }
  );
}

// Salida al cambiar de servicio (crossfade): fundido + baja + desenfoque.
function animateCardOut(c: HTMLElement) {
  gsap.killTweensOf(c);
  gsap.to(c, {
    autoAlpha: 0,
    y: 8,
    filter: "blur(5px)",
    duration: 0.5,
    ease: "power3.out",
    onComplete: () => gsap.set(c, { zIndex: 0, y: 0, filter: "blur(0px)" }),
  });
}

function setCardFinal(c: HTMLElement, on: boolean) {
  const { media, img, title, desc } = cardParts(c);
  gsap.set(c, { autoAlpha: on ? 1 : 0, zIndex: on ? 10 : 0 });
  gsap.set(media, { clipPath: "inset(0 0% 0 0)" });
  gsap.set(img, { scale: 1 });
  gsap.set(title, { clipPath: "inset(0 0% 0 0)" });
  gsap.set(desc, { opacity: 1, y: 0 });
}

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  // Servicio activo del índice (0 = consultoría, el base). Hover/foco/tap lo cambia.
  const [active, setActive] = useState(0);
  // Refs a cada card apilada del panel (para coreografiar entrada y cambios).
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Servicio anterior (-1 = aún no se reveló la sección → la primera vez es entrada).
  const prevActive = useRef(-1);
  // La sección entró en viewport (dispara la entrada del panel y habilita cambios).
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const q = <T extends Element>(sel: string) =>
      Array.from(el.querySelectorAll<T>(sel));

    const ctx = gsap.context(() => {
      const words = q("[data-word]");
      const letters = q("[data-letter]");
      const sub = q("[data-sub]");
      const items = q("[data-item]");
      const panel = q("[data-panel]");
      const cards = cardRefs.current;

      if (reduce) {
        gsap.set([words, letters, sub, items, panel], {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        });
        // En el montaje el servicio activo siempre es 0 (los cambios posteriores
        // los maneja el efecto de cambio). Fijar 0 evita re-correr todo el setup.
        cards.forEach((c, i) => c && setCardFinal(c, i === 0));
        setRevealed(true);
        return;
      }

      // Estado inicial de las cards: ocultas y "sin dibujar" hasta que el panel
      // entra (la entrada y los cambios las animan después).
      cards.forEach((c) => {
        if (!c) return;
        const { media, img, title, desc } = cardParts(c);
        gsap.set(c, { autoAlpha: 0, zIndex: 0 });
        gsap.set(media, { clipPath: "inset(0 100% 0 0)" });
        gsap.set(img, { scale: 1.04 });
        gsap.set(title, { clipPath: "inset(0 100% 0 0)" });
        gsap.set(desc, { opacity: 0, y: 10 });
      });

      let played = false;
      const play = () => {
        if (played) return;
        played = true;
        setRevealed(true);

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        // Título — entra como UN bloque (subida limpia, sin cascada palabra-a-palabra
        // ni blur). La coreografía palabra+letras queda reservada a Hero y Footer.
        tl.fromTo(
          [...words, ...letters],
          { opacity: 0, y: "0.5em" },
          { opacity: 1, y: "0em", duration: 0.8, ease: "power3.out" },
          0
        );
        // Subhead — fade + leve subida (sin blur)
        tl.fromTo(
          sub,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.8 },
          0.55
        );
        // Filas del índice — cascada
        tl.fromTo(
          items,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.06 },
          0.65
        );
        // Panel (marco) — entra primero como contenedor; el CONTENIDO de la card
        // (foto, título, descripción) se coreografía aparte, justo después, vía el
        // efecto de cambio de servicio (con delay en la primera aparición).
        tl.fromTo(
          panel,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.75 },
          0.5
        );
      };

      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            play();
            io.disconnect();
          }
        },
        { threshold: 0.14 }
      );
      io.observe(el);
      // Fallback: SOLO si está realmente en viewport (no animar fuera de pantalla).
      const t = window.setTimeout(() => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) play();
      }, 2500);
      return () => {
        io.disconnect();
        window.clearTimeout(t);
      };
    }, ref);

    return () => ctx.revert();
  }, []);

  // Entrada + cambio de servicio: una sola coreografía. La primera vez (tras
  // revelarse la sección) entra con delay → la card aparece DESPUÉS de la lista;
  // en los cambios posteriores responde al instante.
  useEffect(() => {
    if (!revealed) return;
    const cur = active;
    const old = prevActive.current;
    if (cur === old) return;
    const firstReveal = old === -1;
    prevActive.current = cur;

    const cCur = cardRefs.current[cur];
    const cOld = old >= 0 ? cardRefs.current[old] : null;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      if (cOld) setCardFinal(cOld, false);
      if (cCur) setCardFinal(cCur, true);
      return;
    }
    if (cOld) animateCardOut(cOld);
    // Primera aparición → coreografía bonita (clip-wipe); cambios → crossfade.
    if (cCur) {
      if (firstReveal) animateCardIn(cCur, 0.85);
      else crossfadeCardIn(cCur);
    }
  }, [active, revealed]);

  // ── Slider móvil ── la lista (índice) se oculta < lg; las cards se navegan con
  // swipe del dedo o con los controles. Wrap-around para que el recorrido sea
  // circular como un carrusel.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const goTo = (dir: number) =>
    setActive((a) => (a + dir + SERVICES.length) % SERVICES.length);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchStart.current;
    if (!s) return;
    touchStart.current = null;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    // Solo si el gesto es claramente horizontal (no interferir con el scroll).
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy) * 1.4) goTo(dx < 0 ? 1 : -1);
  };

  const HEAD_WORDS = ["De", "la", "consultoría", "al"];
  const HEAD_ACCENT = "prototipo físico";

  return (
    <section
      ref={ref}
      id="servicios"
      data-nav="light"
      className="relative w-full overflow-hidden px-6 py-20 sm:px-10 sm:py-28 md:px-14 md:py-32"
    >
      <div className="relative z-10 mx-auto max-w-[1400px]">
        {/* ── Encabezado ── */}
        <div className="mb-12 md:mb-16">
          <h2
            className="m-0 max-w-[20ch] font-display font-light text-ink"
            aria-label="De la consultoría al prototipo físico."
            style={{
              fontSize: "clamp(1.9rem, 4vw, 3.4rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.06,
            }}
          >
            <span aria-hidden="true">
              {HEAD_WORDS.map((w, i) => (
                <span
                  key={i}
                  data-word
                  className="mr-[0.24em] inline-block"
                  style={{ opacity: 0, transform: "translateY(0.9em)" }}
                >
                  {w}
                </span>
              ))}
              <span className="inline-block font-medium text-ember">
                {Array.from(HEAD_ACCENT).map((ch, i) =>
                  ch === " " ? (
                    <span key={i} className="inline-block w-[0.28em]" />
                  ) : (
                    <span
                      key={i}
                      data-letter
                      className="inline-block"
                      style={{ opacity: 0, transform: "translateY(0.45em)" }}
                    >
                      {ch}
                    </span>
                  )
                )}
              </span>
              <span
                data-letter
                className="inline-block"
                style={{ opacity: 0, transform: "translateY(0.45em)" }}
              >
                .
              </span>
            </span>
          </h2>

          <p
            data-sub
            className="mt-5 max-w-[56ch] font-body text-base font-light leading-relaxed text-ink/60 sm:text-lg"
            style={{ opacity: 0 }}
          >
            Siete líneas de servicio, una misma lógica: entender el territorio y
            resolver con ingeniería a la medida. Consultoría, innovación y
            desarrollo.
          </p>
        </div>

        {/* ── Índice interactivo (izq) ↔ panel sincronizado (der) ── */}
        <div className="grid grid-cols-1 gap-x-[clamp(28px,4vw,72px)] gap-y-10 lg:[grid-template-columns:1.35fr_1fr] lg:items-start">
          {/* Índice interactivo — oculto en móvil (las cards pasan a ser slider) */}
          <ul className="hidden border-b border-ink/12 lg:block">
            {SERVICES.map((s, i) => {
              const isActive = active === i;
              return (
                <li
                  key={s.n}
                  data-item
                  style={{ opacity: 0 }}
                  className="border-t border-ink/12"
                >
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className="group relative isolate flex w-full items-center gap-4 py-5 pl-4 pr-1 text-left outline-none transition-[padding] duration-300 ease-out focus-visible:pl-5 sm:gap-6 sm:py-6"
                  >
                    {/* Wash cálido del estado activo (wipe izq → der) */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ember/[0.07] via-ember/[0.03] to-transparent transition-opacity duration-500 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {/* Acento vertical brasa a la izquierda (crece scaleY) —
                        eje distinto al sweep horizontal de FAQ/About */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute left-0 top-1/2 h-[58%] w-[3px] -translate-y-1/2 rounded-full bg-ember transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"
                      }`}
                    />
                    {/* Número del índice */}
                    <span
                      className={`font-body text-xs font-medium tabular-nums transition-colors duration-300 ${
                        isActive ? "text-ember" : "text-ink/35 group-hover:text-ink/55"
                      }`}
                    >
                      {s.n}
                    </span>
                    {/* Título */}
                    <span
                      className={`flex-1 font-display font-light leading-tight transition-all duration-300 ${
                        isActive
                          ? "translate-x-1 text-ink"
                          : "text-ink/55 group-hover:translate-x-1 group-hover:text-ink"
                      }`}
                      style={{
                        fontSize: "clamp(1.1rem, 2.3vw, 1.6rem)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {s.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Panel sincronizado */}
          <div
            data-panel
            style={{ opacity: 0 }}
            className="lg:sticky lg:top-28"
          >
            <div
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              className="relative overflow-hidden rounded-3xl border border-ink/10 bg-cream/70 shadow-[0_18px_50px_-26px_rgba(177,44,0,0.35)] backdrop-blur-sm lg:[touch-action:auto] [touch-action:pan-y]"
            >
              {/* Capas apiladas en una sola celda de grid: la card mide lo del
                  servicio MÁS ALTO, así TODAS las cards quedan del mismo tamaño
                  (sin alturas mágicas). autoAlpha (visibility) oculta las inactivas
                  conservando ese alto. La activa se coreografía con GSAP. */}
              <div className="relative grid">
                {SERVICES.map((s, i) => {
                  const on = i === active;
                  return (
                    <div
                      key={s.n}
                      ref={(el) => {
                        cardRefs.current[i] = el;
                      }}
                      aria-hidden={!on}
                      className="col-start-1 row-start-1"
                      style={{ opacity: 0, visibility: "hidden" }}
                    >
                      {/* ── MEDIA: foto duotono a sangre + trazo CFD encima ── */}
                      <div
                        data-card-media
                        className="relative isolate h-44 w-full overflow-hidden sm:h-52"
                        style={{
                          backgroundColor: s.duoFrom,
                          clipPath: "inset(0 100% 0 0)",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          data-card-img
                          src={`https://images.unsplash.com/${s.img}?w=900&q=80&auto=format&fit=crop`}
                          alt=""
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          className="absolute inset-0 h-full w-full object-cover grayscale"
                          style={{ transform: "scale(1.08)" }}
                        />
                        {/* Duotono — colorea la imagen con el par de marca del servicio */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 mix-blend-color"
                          style={{
                            background: `linear-gradient(135deg, ${s.duoFrom}, ${s.duoTo})`,
                          }}
                        />
                        {/* Profundidad — oscurece levemente bordes (lectura premium) */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(180deg, rgba(20,30,30,0.10) 0%, transparent 32%, rgba(15,25,24,0.42) 100%)",
                          }}
                        />
                      </div>

                      {/* ── TEXTO ── */}
                      <div className="relative p-7 sm:p-8">
                        {/* Blueprint tenue bajo el texto (mesa de dibujo / CAD) */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0"
                          style={{
                            backgroundImage:
                              "linear-gradient(rgba(26,26,26,0.04) 1px, transparent 1px)," +
                              "linear-gradient(90deg, rgba(26,26,26,0.04) 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                            maskImage:
                              "radial-gradient(120% 120% at 85% 0%, #000 25%, transparent 75%)",
                            WebkitMaskImage:
                              "radial-gradient(120% 120% at 85% 0%, #000 25%, transparent 75%)",
                          }}
                        />
                        <h3
                          data-card-title
                          className="relative font-display font-medium text-ink"
                          style={{
                            fontSize: "clamp(1.35rem, 2.6vw, 1.85rem)",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.12,
                            paddingBottom: "0.18em",
                            clipPath: "inset(0 100% 0 0)",
                          }}
                        >
                          {s.title}
                        </h3>

                        <p
                          data-card-desc
                          className="relative mt-3 max-w-[44ch] font-body text-base leading-relaxed text-ink/65 sm:text-[1.05rem]"
                          style={{ opacity: 0 }}
                        >
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Controles del slider (solo móvil) ── flechas discretas + dots
                de posición; las cards también responden a swipe. */}
            <div className="mt-5 flex items-center justify-between gap-4 lg:hidden">
              <button
                type="button"
                onClick={() => goTo(-1)}
                aria-label="Servicio anterior"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 text-lg text-ink transition-colors duration-300 hover:border-ember hover:text-ember active:scale-95"
              >
                ←
              </button>

              <div className="flex flex-1 items-center justify-center gap-2" role="tablist" aria-label="Servicios">
                {SERVICES.map((s, i) => {
                  const on = i === active;
                  return (
                    <button
                      key={s.n}
                      type="button"
                      onClick={() => setActive(i)}
                      role="tab"
                      aria-selected={on}
                      aria-label={`Servicio ${s.n}: ${s.title}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                        on ? "w-6 bg-ember" : "w-1.5 bg-ink/20 hover:bg-ink/40"
                      }`}
                    />
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => goTo(1)}
                aria-label="Servicio siguiente"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 text-lg text-ink transition-colors duration-300 hover:border-ember hover:text-ember active:scale-95"
              >
                →
              </button>
            </div>

            {/* CTA → página de Vinculación (Golden Path) */}
            <Link
              href="/vinculacion"
              className="group relative mt-6 inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-ink px-7 py-3.5 font-body text-base font-medium text-cream transition-shadow duration-500 ease-out hover:shadow-[0_10px_34px_-8px_rgba(241,84,28,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              <span
                aria-hidden="true"
                className="absolute left-5 top-1/2 h-8 w-8 -translate-y-1/2 scale-0 rounded-full bg-[radial-gradient(circle,#f1541c,#b12c00)] transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[22]"
              />
              <span className="relative z-10">Míranos en medios y charlas</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
