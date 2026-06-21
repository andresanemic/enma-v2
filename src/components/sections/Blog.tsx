"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";

// ── Notas reales (resúmenes derivados de los .docx de \blog, sin inventar datos) ──
// Bloque de landing: solo título + resumen + autor. Las notas individuales son Fase E,
// por eso cada franja enlaza al índice /blog (stub 200) como afordancia honesta.
type Article = {
  href: string;
  cover: string;
  coverAlt: string;
  title: string;
  summary: string;
  author: string;
  role?: string; // etiqueta — Outfit uppercase (lo "técnico" no va en mono)
  imageSide: "left" | "right";
};

const ARTICLES: Article[] = [
  {
    href: "/blog",
    cover: "/blog/blog-cover-1.jpg",
    coverAlt: "Parque eólico recortado contra una bruma dorada al atardecer",
    title: "En Aysén pagamos la energía más cara. Y tenemos cómo cambiarlo",
    summary:
      "La lejanía encarece cada kilovatio de la región. Por qué el costo energético frena a la Patagonia —y qué ingeniería ya tenemos para revertirlo hoy.",
    author: "Bruno Ortega",
    role: "Socio fundador",
    imageSide: "left",
  },
  {
    href: "/blog",
    cover: "/blog/blog-cover-2.jpg",
    coverAlt: "Lago turquesa, montañas nevadas y vegetación otoñal de la Patagonia",
    title: "La Patagonia no se entiende desde Santiago",
    summary:
      "La pertenencia territorial no es un eslogan: es una ventaja técnica. Por qué la realidad de Aysén no se entiende —ni se resuelve— a control remoto.",
    author: "Patricio Campos",
    role: "Socio fundador",
    imageSide: "right",
  },
  {
    href: "/blog",
    cover: "/blog/blog-cover-3.jpg",
    coverAlt: "Impresora 3D junto a piezas de turbina prototipadas y herramientas",
    title: "Enma explicado en fácil: energía y tecnología hechas en la Patagonia",
    summary:
      "Qué somos, qué hacemos y a quién ayudamos, contado en simple: energía y tecnología hechas en la Patagonia para bajar costos y abrir oportunidades.",
    author: "Equipo Enma",
    imageSide: "left",
  },
];

// Título de sección → palabras (rise+blur, sin clip → seguro al hacer wrap, lore/animation).
const HEAD_WORDS = ["Ideas", "desde", "el"];
const HEAD_ACCENT = "territorio";

// Curva de nivel — hairline ondulada entre franjas (guiño naturaleza/topografía).
function ContourRule() {
  return (
    <div data-rule className="origin-left" style={{ transform: "scaleX(0)" }} aria-hidden="true">
      <svg
        viewBox="0 0 1200 12"
        preserveAspectRatio="none"
        className="h-3 w-full text-ink/20"
        fill="none"
      >
        <path
          d="M0 6 C 100 1, 200 11, 300 6 S 500 1, 600 6 S 800 11, 900 6 S 1100 1, 1200 6"
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

export default function Blog() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Selecciones SCOPED a esta sección (las animaciones corren en callbacks async
    // del IO → nunca usar selectores string en GSAP, lore/animation).
    const q = <T extends Element>(root: ParentNode, sel: string) =>
      Array.from(root.querySelectorAll<T>(sel));

    // Reduced motion → todo en estado final, sin observers.
    if (reduce) {
      gsap.set(q(el, "[data-head-word], [data-btitle]"), { opacity: 1, y: 0, filter: "blur(0px)" });
      gsap.set(q(el, "[data-bcover]"), { clipPath: "inset(0 0% 0 0 round 20px)" });
      gsap.set(q(el, "[data-bsum], [data-bmeta], [data-bmore]"), { opacity: 1, x: 0, y: 0, filter: "blur(0px)" });
      gsap.set(q(el, "[data-rule]"), { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const cleanups: Array<() => void> = [];

      // Dispara fn una sola vez cuando el elemento entra en viewport. Fallback por
      // timeout GATEADO por visibilidad real (no revelar fuera de pantalla, lore).
      const observeOnce = (target: Element, fn: () => void) => {
        const io = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              fn();
              io.disconnect();
            }
          },
          { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
        );
        io.observe(target);
        const t = window.setTimeout(() => {
          const r = target.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) {
            fn();
            io.disconnect();
          }
        }, 2600);
        cleanups.push(() => {
          io.disconnect();
          window.clearTimeout(t);
        });
      };

      // Encabezado — palabra por palabra (rise, sin blur).
      const head = el.querySelector("[data-head]");
      if (head) {
        observeOnce(head, () => {
          gsap.fromTo(
            q(head, "[data-head-word]"),
            { opacity: 0, y: "0.5em" },
            { opacity: 1, y: "0em", duration: 0.7, stagger: 0.06, ease: "power3.out" }
          );
        });
      }

      // Cada franja entra con un único fundido + leve subida (efecto simple): su
      // contenido interno (portada, título, resumen, byline, "Leer nota") se fija
      // en estado final y la franja completa se revela como un solo bloque.
      q(el, "[data-band]").forEach((band) => {
        observeOnce(band, () => {
          const cover = band.querySelector("[data-bcover]");
          if (cover) gsap.set(cover, { clipPath: "inset(0 0% 0 0 round 20px)" });
          gsap.set(
            Array.from(band.querySelectorAll("[data-btitle], [data-bsum], [data-bmeta], [data-bmore]")),
            { opacity: 1, x: 0, y: 0 }
          );
          gsap.fromTo(band, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" });
        });
      });

      // Curvas de nivel — se trazan de izquierda a derecha.
      q(el, "[data-rule]").forEach((rule) => {
        observeOnce(rule, () => {
          gsap.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power2.inOut" });
        });
      });

      return () => cleanups.forEach((c) => c());
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="blog"
      data-nav="light"
      className="relative w-full overflow-hidden px-6 py-24 sm:px-10 sm:py-28 md:px-14 md:py-32"
      // Arena-terracota tostado → aclara hacia abajo para entrar suave a FAQ crema.
      // Familia terracota (no crema): más saturado que el sand de las otras secciones.
      style={{
        // Tramo final del degradado: encadena con Equipo (#f3ddbc) y termina
        // exactamente en el crema de FAQ (#f8eddd) → transición invisible.
        background: "linear-gradient(180deg, #f3ddbc 0%, #f8eddd 100%)",
      }}
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
            aria-label="Ideas desde el territorio."
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

        {/* ── Franjas editoriales (imagen alternada izq/der) ── */}
        <div className="flex flex-col">
          {ARTICLES.map((a, i) => (
            <div key={a.title}>
              {i > 0 && (
                <div className="py-10 sm:py-12 md:py-14">
                  <ContourRule />
                </div>
              )}

              <article data-band>
                <Link
                  href={a.href}
                  className="group grid items-center gap-7 md:grid-cols-2 md:gap-12 lg:gap-16"
                  aria-label={`Leer: ${a.title}`}
                >
                  {/* Portada — estática (sin hover); velo cálido fijo que unifica la paleta */}
                  <div
                    data-bcover
                    className={`relative aspect-[4/3] w-full overflow-hidden rounded-[20px] md:aspect-[3/2] ${
                      a.imageSide === "right" ? "md:order-2" : "md:order-1"
                    }`}
                    style={{ clipPath: "inset(0 100% 0 0 round 20px)" }}
                  >
                    <Image
                      data-bimg
                      src={a.cover}
                      alt={a.coverAlt}
                      fill
                      sizes="(min-width: 768px) 44vw, 92vw"
                      className="object-cover"
                    />
                    {/* Velo cálido terracota (unifica la paleta) — estático */}
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(150deg, rgba(177,44,0,0.34) 0%, rgba(219,135,70,0.16) 55%, rgba(241,84,28,0.30) 100%)",
                        mixBlendMode: "multiply",
                      }}
                    />
                  </div>

                  {/* Texto — título, resumen, byline, "Leer nota" */}
                  <div className={a.imageSide === "right" ? "md:order-1" : "md:order-2"}>
                    <h3
                      data-btitle
                      className="m-0 font-display font-light leading-[1.1] text-ink transition-colors duration-300 group-hover:text-terra"
                      style={{ fontSize: "clamp(1.45rem, 2.8vw, 2.25rem)", letterSpacing: "-0.02em", opacity: 0, transform: "translateY(16px)" }}
                    >
                      {a.title}
                    </h3>

                    <p data-bsum className="mt-4 max-w-[46ch] font-body text-base font-light leading-relaxed text-ink/70 sm:text-lg" style={{ opacity: 0 }}>
                      {a.summary}
                    </p>

                    <div data-bmeta className="mt-6 flex items-baseline gap-3" style={{ opacity: 0 }}>
                      <span className="font-body text-[15px] font-medium text-ink sm:text-base">Por {a.author}</span>
                      {a.role && (
                        <span className="font-body text-[11px] uppercase tracking-[0.18em] text-ink/50">{a.role}</span>
                      )}
                    </div>

                    {/* "Leer nota" — subrayado que se traza + flecha que desliza */}
                    <span data-bmore className="mt-5 inline-flex items-center gap-2 font-body text-[13px] font-medium uppercase tracking-[0.16em] text-terra" style={{ opacity: 0 }}>
                      <span className="relative">
                        Leer nota
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-terra transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100"
                        />
                      </span>
                      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" fill="none" aria-hidden="true">
                        <path d="M3 10h13M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
