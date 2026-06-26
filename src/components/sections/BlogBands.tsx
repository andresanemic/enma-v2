"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { ARTICLES } from "@/lib/blog";

// ─────────────────────────────────────────────────────────────────────────────
// BlogBands — franjas editoriales (imagen alternada izq/der) que listan todas
// las publicaciones desde lib/blog.ts. Compartido por la sección Blog del landing
// (acento terra) y la mini-landing /blog (acento teal). Cada franja enlaza a
// /blog/[slug]. Reveal propio: un único fundido + leve subida por franja
// (FOUC-safe, IO + fallback gateado por visibilidad real, reduce-motion).
// ─────────────────────────────────────────────────────────────────────────────

type Accent = "terra" | "teal";

// Clases literales (Tailwind JIT no resuelve clases compuestas en runtime).
const ACCENT: Record<Accent, { hover: string; more: string; rule: string }> = {
  terra: { hover: "group-hover:text-terra", more: "text-terra", rule: "bg-terra" },
  teal: { hover: "group-hover:text-teal", more: "text-teal", rule: "bg-teal" },
};

// Curva de nivel — hairline ondulada entre franjas (guiño naturaleza/topografía).
function ContourRule() {
  return (
    <div data-rule className="origin-left" style={{ transform: "scaleX(0)" }} aria-hidden="true">
      <svg viewBox="0 0 1200 12" preserveAspectRatio="none" className="h-3 w-full text-ink/20" fill="none">
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

export default function BlogBands({ accent = "terra" }: { accent?: Accent }) {
  const ref = useRef<HTMLDivElement>(null);
  const a = ACCENT[accent];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Selecciones SCOPED a este contenedor (las animaciones corren en callbacks
    // async del IO → nunca usar selectores string en GSAP, lore/animation).
    const q = <T extends Element>(root: ParentNode, sel: string) =>
      Array.from(root.querySelectorAll<T>(sel));

    if (reduce) {
      gsap.set(q(el, "[data-band]"), { opacity: 1, y: 0 });
      gsap.set(q(el, "[data-bcover]"), { clipPath: "inset(0 0% 0 0 round 20px)" });
      gsap.set(q(el, "[data-btitle], [data-bsum], [data-bmeta], [data-bmore]"), { opacity: 1, x: 0, y: 0 });
      gsap.set(q(el, "[data-rule]"), { scaleX: 1 });
      return;
    }

    // Reveal SIN gsap.context/revert: en su lugar, cada nodo se marca como revelado
    // con un data-attr en el propio DOM, que SOBREVIVE al doble montaje de StrictMode
    // (dev). Así, si el reveal ya corrió en el primer montaje, el segundo lo omite y
    // NO se revierte → desaparece el parpadeo de las cards que quedan sobre el pliegue
    // (caso /blog). En la landing (cards bajo el pliegue) y en producción el resultado
    // es idéntico: cada elemento se revela una sola vez al entrar en viewport.
    // Se pasan NODOS reales a GSAP (no selectores string) → scope seguro sin context.
    const cleanups: Array<() => void> = [];

    // Dispara fn una sola vez. Guard por data-attr en el nodo + fallback por timeout
    // GATEADO por visibilidad real (no revelar fuera de pantalla, lore).
    const observeOnce = (target: Element, fn: () => void) => {
      const node = target as HTMLElement;
      if (node.dataset.revealed) return;
      const run = () => {
        if (node.dataset.revealed) return;
        node.dataset.revealed = "1";
        fn();
      };
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            run();
            io.disconnect();
          }
        },
        { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(target);
      const t = window.setTimeout(() => {
        const r = target.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          run();
          io.disconnect();
        }
      }, 2600);
      cleanups.push(() => {
        io.disconnect();
        window.clearTimeout(t);
      });
    };

    // Cada franja entra como un solo bloque (fundido + leve subida); su contenido
    // interno se fija en estado final y la portada termina de descubrirse.
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
  }, []);

  return (
    <div ref={ref} className="flex flex-col">
      {ARTICLES.map((art, i) => (
        <div key={art.slug}>
          {i > 0 && (
            <div className="py-10 sm:py-12 md:py-14">
              <ContourRule />
            </div>
          )}

          <article data-band>
            <Link
              href={`/blog/${art.slug}`}
              className="group grid items-center gap-7 md:grid-cols-2 md:gap-12 lg:gap-16"
              aria-label={`Leer: ${art.title}`}
            >
              {/* Portada — estática (sin hover); velo cálido fijo que unifica la paleta */}
              <div
                data-bcover
                className={`relative aspect-[4/3] w-full overflow-hidden rounded-[20px] md:aspect-[3/2] ${
                  art.imageSide === "right" ? "md:order-2" : "md:order-1"
                }`}
                style={{ clipPath: "inset(0 100% 0 0 round 20px)" }}
              >
                <Image
                  src={art.cover}
                  alt={art.coverAlt}
                  fill
                  sizes="(min-width: 768px) 44vw, 92vw"
                  className="object-cover"
                />
                {/* Velo cálido terracota (unifica la paleta, igual en todo el sitio) */}
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
              <div className={art.imageSide === "right" ? "md:order-1" : "md:order-2"}>
                <h3
                  data-btitle
                  className={`m-0 font-display font-light leading-[1.1] text-ink transition-colors duration-300 ${a.hover}`}
                  style={{ fontSize: "clamp(1.45rem, 2.8vw, 2.25rem)", letterSpacing: "-0.02em", opacity: 0, transform: "translateY(16px)" }}
                >
                  {art.title}
                </h3>

                <p data-bsum className="mt-4 max-w-[46ch] font-body text-base font-light leading-relaxed text-ink/70 sm:text-lg" style={{ opacity: 0 }}>
                  {art.summary}
                </p>

                <div data-bmeta className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1" style={{ opacity: 0 }}>
                  <span className="font-body text-[15px] font-medium text-ink sm:text-base">Por {art.author}</span>
                </div>

                {/* "Leer nota" — subrayado que se traza + flecha que desliza */}
                <span data-bmore className={`mt-5 inline-flex items-center gap-2 font-body text-[13px] font-medium uppercase tracking-[0.16em] ${a.more}`} style={{ opacity: 0 }}>
                  <span className="relative">
                    Leer nota
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100 ${a.rule}`}
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
  );
}
