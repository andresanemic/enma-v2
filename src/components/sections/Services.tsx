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
    desc: "El servicio base, y el que abre la puerta a todos los demás: estudios de soluciones energéticas para empresas y sector público. Su mayor valor es intangible —el conocimiento técnico y el del territorio.",
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

export default function Services() {
  const ref = useRef<HTMLElement>(null);
  // Servicio activo del índice (0 = consultoría, el base). Hover/foco/tap lo cambia.
  const [active, setActive] = useState(0);

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
      const contours = q<SVGPathElement>("[data-contour]");

      // Curvas de nivel: preparar el "dibujado" (stroke-dashoffset) sin plugin.
      contours.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = `${len}`;
        p.style.strokeDashoffset = reduce ? "0" : `${len}`;
      });

      if (reduce) {
        gsap.set([words, letters, sub, items, panel], {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        });
        return;
      }

      let played = false;
      const play = () => {
        if (played) return;
        played = true;

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        // Título — palabra por palabra (rise + blur → nítido)
        tl.fromTo(
          words,
          { opacity: 0, y: "0.9em", filter: "blur(6px)" },
          { opacity: 1, y: "0em", filter: "blur(0px)", duration: 0.8, stagger: 0.09 },
          0
        );
        // Acento "prototipo físico" — letra por letra
        tl.fromTo(
          letters,
          { opacity: 0, y: "0.45em" },
          { opacity: 1, y: "0em", duration: 0.5, stagger: 0.03, ease: "power2.out" },
          0.45
        );
        // Subhead — fade + blur
        tl.fromTo(
          sub,
          { opacity: 0, y: 16, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
          0.6
        );
        // Curvas de nivel — se dibujan (textura/territorio)
        tl.to(contours, { strokeDashoffset: 0, duration: 1.8, stagger: 0.25, ease: "power2.inOut" }, 0.3);
        // Filas del índice — cascada
        tl.fromTo(
          items,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.07 },
          0.7
        );
        // Panel — fade + blur + leve subida
        tl.fromTo(
          panel,
          { opacity: 0, y: 24, filter: "blur(8px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.95 },
          0.85
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

  const HEAD_WORDS = ["De", "la", "consultoría", "al"];
  const HEAD_ACCENT = "prototipo físico";

  return (
    <section
      ref={ref}
      id="servicios"
      data-nav="light"
      className="relative w-full overflow-hidden px-6 py-20 sm:px-10 sm:py-28 md:px-14 md:py-32"
      style={{
        background:
          "radial-gradient(70% 50% at 88% 8%, rgba(254,169,79,0.22) 0%, transparent 60%)," +
          "linear-gradient(180deg, #f7e9d4 0%, #f8eddd 42%, #faf1e2 100%)",
      }}
    >
      {/* Curvas de nivel (territorio/Patagonia) — se dibujan al entrar. Textura sutil. */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          data-contour
          d="M-50 240 C 250 160, 520 320, 820 230 S 1300 130, 1500 250"
          stroke="#f1541c"
          strokeOpacity="0.10"
          strokeWidth="1.4"
        />
        <path
          data-contour
          d="M-50 430 C 280 360, 560 520, 880 430 S 1320 330, 1500 450"
          stroke="#205358"
          strokeOpacity="0.09"
          strokeWidth="1.4"
        />
        <path
          data-contour
          d="M-50 640 C 240 560, 540 720, 860 620 S 1300 560, 1500 660"
          stroke="#f1541c"
          strokeOpacity="0.08"
          strokeWidth="1.4"
        />
      </svg>

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
            resolver con ingeniería a la medida —consultoría, innovación y
            desarrollo, en ese orden.
          </p>
        </div>

        {/* ── Índice interactivo (izq) ↔ panel sincronizado (der) ── */}
        <div className="grid grid-cols-1 gap-x-[clamp(28px,4vw,72px)] gap-y-10 lg:[grid-template-columns:1.35fr_1fr] lg:items-start">
          {/* Índice */}
          <ul className="border-b border-ink/12">
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
                    className="group relative isolate flex w-full items-center gap-4 py-5 pl-0 pr-1 text-left outline-none transition-[padding] duration-300 ease-out focus-visible:pl-3 sm:gap-6 sm:py-6"
                  >
                    {/* Wash cálido del estado activo (wipe izq → der) */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ember/[0.07] via-ember/[0.03] to-transparent transition-opacity duration-500 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {/* Línea-acento brasa que recorre el borde superior */}
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-0 h-px bg-ember transition-all duration-500 ease-out ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                    {/* Número técnico (mono) */}
                    <span
                      className={`font-mono text-xs tabular-nums transition-colors duration-300 ${
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
            <div className="relative overflow-hidden rounded-3xl border border-ink/10 bg-cream/70 shadow-[0_18px_50px_-26px_rgba(177,44,0,0.35)] backdrop-blur-sm">
              {/* Capas apiladas en una sola celda de grid: la card mide lo del
                  servicio MÁS ALTO, así TODAS las cards quedan del mismo tamaño
                  (sin alturas mágicas). Solo la activa es visible → crossfade. */}
              <div className="relative grid">
                {SERVICES.map((s, i) => {
                  const on = i === active;
                  return (
                    <div
                      key={s.n}
                      aria-hidden={!on}
                      className={`col-start-1 row-start-1 transition-[opacity,transform,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        on
                          ? "opacity-100 blur-0 translate-y-0"
                          : "pointer-events-none translate-y-2 opacity-0 blur-[5px]"
                      }`}
                    >
                      {/* ── MEDIA: foto duotono a sangre + trazo CFD encima ── */}
                      <div
                        className="relative isolate h-44 w-full overflow-hidden sm:h-52"
                        style={{ backgroundColor: s.duoFrom }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`https://images.unsplash.com/${s.img}?w=900&q=80&auto=format&fit=crop`}
                          alt=""
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          className="absolute inset-0 h-full w-full object-cover grayscale"
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
                          className="relative font-display font-medium text-ink"
                          style={{
                            fontSize: "clamp(1.35rem, 2.6vw, 1.85rem)",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.12,
                          }}
                        >
                          {s.title}
                        </h3>

                        <p className="relative mt-3 max-w-[44ch] font-body text-base leading-relaxed text-ink/65 sm:text-[1.05rem]">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA → página de Servicios (Golden Path) */}
            <Link
              href="/servicios"
              className="group relative mt-6 inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-ink px-7 py-3.5 font-body text-base font-medium text-cream transition-shadow duration-500 ease-out hover:shadow-[0_10px_34px_-8px_rgba(241,84,28,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              <span
                aria-hidden="true"
                className="absolute left-5 top-1/2 h-8 w-8 -translate-y-1/2 scale-0 rounded-full bg-[radial-gradient(circle,#f1541c,#b12c00)] transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[22]"
              />
              <span className="relative z-10">Conoce más de los servicios</span>
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
