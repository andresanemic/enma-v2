"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const WHATSAPP = "https://wa.me/56993377835";

const NAV_PAGES = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/blog", label: "Blog" },
];

const NAV_CONTACT = [
  { href: "mailto:contacto@enmachile.com", label: "contacto@enmachile.com", external: false },
  { href: "https://wa.me/56993377835", label: "+56 9 9337 7835", external: true },
];

const LOCATION = ["Coyhaique", "Región de Aysén", "Chile"];

// Bloque de cierre unificado: el CTA y el footer son una sola composición sobre
// un único gradiente verde (claro arriba → oscuro abajo). El titular del CTA es
// la voz editorial; las columnas de navegación/contacto/ubicación conversan a su
// lado; abajo, el logo gigante + la línea legal.
export default function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  // Reveal robusto: IntersectionObserver + fallback que SOLO revela si la
  // sección está en viewport (patrón probado de About/FAQ — nunca queda en blanco).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -4% 0px" }
    );
    io.observe(el);
    const t = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) setShown(true);
    }, 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  const reveal = () =>
    `transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
      shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    }`;
  const delay = (i: number) => ({ transitionDelay: `${i * 80}ms` });

  // Etiqueta utilitaria de columna (no es un eyebrow editorial de sección)
  const colLabel = "mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-cream/35";

  const year = new Date().getFullYear();

  return (
    <footer
      ref={ref}
      id="contacto"
      data-nav="dark"
      role="contentinfo"
      className="relative z-10 w-full overflow-hidden text-cream"
      // Un único bloque verde: claro arriba (donde vive el CTA) → oscuro abajo.
      // Su borde superior continúa el del FAQ sin costura percibida.
      style={{ background: "linear-gradient(to bottom, #3e7c6c 0%, #245049 34%, #163834 64%, #0c2220 100%)" }}
    >
      {/* ── Chispas cálidas que derivan — entrada del bloque (energía en movimiento) ── */}
      <div className="relative h-[96px] overflow-hidden sm:h-[112px]" aria-hidden="true">
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "50%",
            width: "200%",
            height: "70px",
            opacity: 0.7,
            backgroundImage: [
              "radial-gradient(circle, rgba(247,223,186,0.55) 1.5px, transparent 2px)",
              "radial-gradient(circle, rgba(254,169,79,0.45) 1.2px, transparent 1.8px)",
              "radial-gradient(circle, rgba(241,84,28,0.32) 1.2px, transparent 1.8px)",
            ].join(", "),
            backgroundPosition: "0 8px, 24px 22px, 48px 14px",
            backgroundSize: "72px 38px, 110px 44px, 160px 52px",
            animation: "footer-sparks 18s linear infinite",
          }}
        />
      </div>

      {/* ── Contenedor (alineado a la grilla de la landing) ── */}
      <div className="mx-auto max-w-[1400px] px-6 pb-[clamp(24px,2.5vw,40px)] pt-[clamp(8px,2vw,28px)] sm:px-10 md:px-14">
        {/* ── Grilla superior: CTA editorial (col 1) · navegación / contacto / ubicación ── */}
        <div className="grid grid-cols-1 gap-x-[clamp(28px,4vw,64px)] gap-y-12 sm:grid-cols-2 lg:[grid-template-columns:minmax(320px,1.35fr)_repeat(3,minmax(130px,0.4fr))]">
          {/* Col 1 — voz editorial + acción */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2
              className={`${reveal()} m-0 max-w-[16ch] font-display font-light`}
              style={{
                ...delay(0),
                fontSize: "clamp(1.9rem, 3.6vw, 3.4rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.04,
              }}
            >
              Pongamos tu proyecto{" "}
              <span className="font-medium text-orange">en movimiento</span>.
            </h2>

            <p
              className={`${reveal()} mt-5 max-w-[44ch] font-body text-base font-light leading-relaxed text-cream/70 sm:text-lg`}
              style={delay(1)}
            >
              Cuéntanos qué necesitas resolver en energía, manufactura o
              medioambiente. Diseñamos cada solución a la medida de tu
              territorio —y partimos por escuchar.
            </p>

            {/* Acción — WhatsApp directo (el correo vive en la columna Contacto) */}
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noopener noreferrer"
              className={`${reveal()} group mt-7 inline-flex items-center gap-3 font-display text-xl font-medium text-cream transition-colors duration-200 hover:text-orange sm:text-2xl`}
              style={delay(2)}
            >
              {/* Glifo WhatsApp */}
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-6 w-6 shrink-0"
                fill="currentColor"
              >
                <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.51 5.26l-.999 3.648 3.978-1.039zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414z" />
              </svg>
              <span className="relative">
                Escríbenos por WhatsApp
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-orange transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100"
                />
              </span>
            </a>
          </div>

          {/* Col 2 — Navegación */}
          <nav
            aria-label="Navegación del footer"
            className={`${reveal()} lg:pt-2`}
            style={delay(2)}
          >
            <p className={colLabel}>Navegación</p>
            <div className="flex flex-col items-start gap-[clamp(11px,1.2vw,16px)]">
              {NAV_PAGES.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group inline-flex items-center gap-2 font-body text-[17px] font-medium text-cream/70 transition-colors duration-200 hover:text-orange"
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-0 bg-orange transition-all duration-300 ease-out group-hover:w-4"
                  />
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                    {link.label}
                  </span>
                </Link>
              ))}
            </div>
          </nav>

          {/* Col 3 — Contacto */}
          <nav
            aria-label="Contacto"
            className={`${reveal()} lg:pt-2`}
            style={delay(3)}
          >
            <p className={colLabel}>Contacto</p>
            <div className="flex flex-col items-start gap-[clamp(11px,1.2vw,16px)]">
              {NAV_CONTACT.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group inline-flex items-center gap-2 font-body text-[17px] font-medium text-cream/70 transition-colors duration-200 hover:text-orange"
                >
                  <span
                    aria-hidden="true"
                    className="h-px w-0 bg-orange transition-all duration-300 ease-out group-hover:w-4"
                  />
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </nav>

          {/* Col 4 — Ubicación */}
          <div className={`${reveal()} lg:pt-2`} style={delay(4)}>
            <p className={colLabel}>Ubicación</p>
            <div className="flex flex-col items-start gap-[clamp(11px,1.2vw,16px)]">
              {LOCATION.map((line) => (
                <span
                  key={line}
                  className="cursor-default font-body text-[17px] font-medium text-cream/55"
                >
                  {line}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Zona meta: logo gigante + legal, separada por una hairline sutil ── */}
        <div
          className={`${reveal()} mt-[clamp(48px,7vw,104px)] border-t border-cream/12 pt-[clamp(20px,2.5vw,38px)]`}
          style={delay(5)}
        >
          <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            {/* Logo blanco de Enma */}
            <Link
              href="/"
              aria-label="Enma — página de inicio"
              className="group inline-block no-underline"
            >
              <span className="relative block h-[clamp(40px,8vw,128px)] w-[clamp(140px,32vw,480px)] origin-left transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]">
                <Image
                  src="/logos/logo-blanco-hd.webp"
                  alt="Enma"
                  fill
                  quality={95}
                  sizes="(max-width:560px) 60vw, 32vw"
                  className="object-contain object-left"
                />
              </span>
            </Link>

            {/* Línea legal — derecha, alineada al borde inferior del logo */}
            <div className="flex shrink-0 flex-col gap-1 sm:items-end sm:text-right">
              <span className="font-mono text-[14px] uppercase leading-[1.4] tracking-[0.2em] text-orange/70">
                <span className="text-orange">EN</span>ergía · <span className="text-orange">MA</span>nufactura
              </span>
              <p className="m-0 font-body text-[15px] leading-[1.4] text-cream/45">
                © {year} Enma SPA. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
