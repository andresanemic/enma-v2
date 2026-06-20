"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

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
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
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
  const delay = (i: number) => ({ transitionDelay: `${i * 90}ms` });

  const year = new Date().getFullYear();

  return (
    <footer
      ref={ref}
      data-nav="dark"
      role="contentinfo"
      className="relative z-10 w-full overflow-hidden text-cream"
      style={{
        background: [
          "radial-gradient(120% 90% at 10% 0%, rgba(62,124,108,0.85) 0%, transparent 52%)",
          "radial-gradient(120% 120% at 96% 102%, rgba(32,83,88,0.95) 0%, transparent 58%)",
          "linear-gradient(168deg, #2f5045 0%, #20393a 58%, #15302d 100%)",
        ].join(", "),
      }}
    >
      {/* ── Chispas cálidas que derivan sobre la base fría (energía en movimiento) ── */}
      <div className="relative h-[110px] overflow-hidden" aria-hidden="true">
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
        {/* Hairline cálida de separación con la sección superior */}
        <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/40 to-transparent" />
      </div>

      {/* ── Contenedor ── */}
      <div className="mx-auto w-[min(calc(100%-48px),1820px)] pb-[clamp(18px,2vw,34px)] pt-[clamp(8px,1.5vw,20px)] md:w-[min(calc(100%-96px),1820px)]">
        {/* ── Grid superior: H2 + 3 columnas ── */}
        <div className="grid grid-cols-1 gap-[clamp(28px,4vw,76px)] md:grid-cols-2 lg:[grid-template-columns:minmax(300px,1.25fr)_repeat(3,minmax(140px,0.42fr))]">
          {/* H2 editorial */}
          <h2
            className={`${reveal()} m-0 max-w-[580px] font-display font-light md:col-span-2 lg:col-span-1`}
            style={{
              ...delay(0),
              fontSize: "clamp(30px, 3.5vw, 56px)",
              fontWeight: 300,
              letterSpacing: "-0.01em",
              lineHeight: 1.08,
            }}
          >
            Diseñamos soluciones sustentables en{" "}
            <span className="text-orange">energía</span> y manufactura desde la Patagonia.
          </h2>

          {/* Navegación */}
          <nav
            aria-label="Navegación del footer"
            className={`${reveal()} flex flex-col items-start gap-[clamp(12px,1.35vw,20px)]`}
            style={delay(1)}
          >
            {NAV_PAGES.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group inline-flex items-center gap-2 font-body text-[15px] font-medium text-cream/70 transition-colors duration-200 hover:text-orange"
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
          </nav>

          {/* Contacto */}
          <nav
            aria-label="Contacto"
            className={`${reveal()} flex flex-col items-start gap-[clamp(12px,1.35vw,20px)]`}
            style={delay(2)}
          >
            {NAV_CONTACT.map((item) => (
              <a
                key={item.href}
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group inline-flex items-center gap-2 font-body text-[15px] font-medium text-cream/70 transition-colors duration-200 hover:text-orange"
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
          </nav>

          {/* Ubicación */}
          <div
            className={`${reveal()} flex flex-col items-start gap-[clamp(12px,1.35vw,20px)]`}
            style={delay(3)}
          >
            {LOCATION.map((line) => (
              <span
                key={line}
                className="cursor-default font-body text-[15px] font-medium text-cream/55"
              >
                {line}
              </span>
            ))}
          </div>
        </div>

        {/* ── Fila de marca — logo blanco de Enma ── */}
        <div className={`${reveal()} mt-[clamp(18px,3vw,46px)] w-full`} style={delay(4)}>
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
        </div>

        {/* ── Línea legal ── */}
        <div
          className={`${reveal()} mt-[clamp(14px,1.4vw,24px)] flex flex-wrap items-center justify-start gap-x-[18px] gap-y-2`}
          style={delay(5)}
        >
          <p className="m-0 font-body text-[10px] leading-[1.35] text-cream/40">
            © {year} Enma SPA. Todos los derechos reservados.
          </p>
          <span className="font-body text-[10px] leading-[1.35] text-cream/40">
            Coyhaique, Región de Aysén, Chile
          </span>
          <span className="font-mono text-[10px] uppercase leading-[1.35] tracking-[0.2em] text-orange/70">
            <span className="text-orange">EN</span>ergía · <span className="text-orange">MA</span>nufactura
          </span>
        </div>
      </div>
    </footer>
  );
}
