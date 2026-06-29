"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";
import Sparks from "@/components/ui/Sparks";

const NAV_LINKS = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/vinculacion", label: "Vinculación" },
  { href: "/blog", label: "Blog" },
];

// En desktop el logo cumple la función de "Inicio"; en el drawer móvil no hay
// logo, así que el menú lleva "Inicio" como primer enlace.
const MOBILE_NAV_LINKS = [{ href: "/", label: "Inicio" }, ...NAV_LINKS];

const CONTACT = "mailto:contacto@enmachile.com";

export default function NavBar() {
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === null;

  const [menuOpen, setMenuOpen] = useState(false);
  // light = el navbar está sobre un fondo claro → contenido oscuro (logo verde,
  // texto ink). Sobre fondo oscuro = contenido cream. Lo decide la sección que
  // queda DEBAJO del navbar, no un umbral ciego de scroll.
  const [light, setLight] = useState(!isHome);
  const headerRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const drawerLinksRef = useRef<(HTMLSpanElement | null)[]>([]);
  const drawerFootRef = useRef<HTMLDivElement>(null);

  // Detección de tono por sección: cada sección declara data-nav="light|dark".
  // El navbar adapta SOLO el color de su contenido (nunca añade fondo sólido),
  // por eso es legible sobre cualquier sección sin parches caso a caso.
  useEffect(() => {
    const update = () => {
      const probe = (headerRef.current?.offsetHeight ?? 64) / 2;
      let mode: string | null = null;
      for (const el of document.querySelectorAll<HTMLElement>("[data-nav]")) {
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom > probe) {
          mode = el.getAttribute("data-nav");
          break;
        }
      }
      setLight((mode ?? (isHome ? "dark" : "light")) === "light");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname, isHome]);

  // Entrada del navbar al montar: slide-down + fade (combina con la cascada del
  // Hero). Delay corto porque corre en TODAS las páginas (lore/animation: no
  // dejar invisible con delay largo en rutas no-target). Respeta reduced-motion.
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(bar, { opacity: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      bar,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.15 }
    );
  }, []);

  // Reveal del menú al abrir: cada link entra con máscara (slide-up dentro de un
  // overflow-hidden) en cascada, y el bloque inferior sube con fade. Respeta
  // prefers-reduced-motion (lore/animation).
  useEffect(() => {
    if (!menuOpen) return;
    const links = drawerLinksRef.current.filter(Boolean) as HTMLElement[];
    const foot = drawerFootRef.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      gsap.set(links, { yPercent: 0, opacity: 1 });
      if (foot) gsap.set(foot, { y: 0, opacity: 1 });
      return;
    }
    const tl = gsap.timeline({ delay: 0.12 });
    tl.fromTo(
      links,
      { yPercent: 115, opacity: 0 },
      { yPercent: 0, opacity: 1, stagger: 0.08, duration: 0.7, ease: "power4.out" }
    );
    if (foot) {
      tl.fromTo(
        foot,
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" },
        "-=0.25"
      );
    }
  }, [menuOpen]);

  const openMenu = () => {
    setMenuOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeMenu = () => {
    // lore/scroll: '' (no 'auto') evita el flash de scrollbar
    document.body.style.overflow = "";
    setMenuOpen(false);
  };
  const toggleMenu = () => (menuOpen ? closeMenu() : openMenu());

  return (
    <>
      <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 bg-transparent">
        <div
          ref={barRef}
          style={{ opacity: 0 }}
          className="flex items-center justify-between px-6 py-4 sm:px-10 md:px-14"
        >
          {/* Logo — crossfade verde↔blanco según el fondo (sin salto brusco).
              El blanco (sobre el hero) lleva sombra para destacar.
              Oculto en móvil (solo desde md): pedido del usuario. */}
          <Link href="/" aria-label="Enma — inicio" className="relative hidden h-7 sm:h-8 md:block">
            {/* Define la caja en el flujo (sin layout shift) */}
            <Image
              src="/logos/logo-verde-v2.webp"
              alt="Enma"
              width={112}
              height={36}
              priority
              className="h-7 w-auto sm:h-8"
              style={{ opacity: 0 }}
            />
            <Image
              src="/logos/logo-verde-v2.webp"
              alt=""
              aria-hidden="true"
              width={112}
              height={36}
              className={`absolute left-0 top-0 h-7 w-auto transition-opacity duration-300 sm:h-8 ${
                light ? "opacity-100" : "opacity-0"
              }`}
            />
            <Image
              src="/logos/logo-blanco.webp"
              alt=""
              aria-hidden="true"
              width={112}
              height={36}
              priority
              className={`absolute left-0 top-0 h-7 w-auto transition-opacity duration-300 sm:h-8 ${
                light ? "opacity-0" : "opacity-100"
              }`}
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.45))" }}
            />
          </Link>

          {/* ── Nav desktop ── */}
          <nav className="hidden items-center gap-3 md:flex" aria-label="Navegación principal">
            {/* Pill transparente que agrupa los links */}
            <div
              className={`flex items-center gap-1 rounded-full border px-1.5 py-1 backdrop-blur-sm transition-colors duration-300 ${
                light ? "border-ink/10 bg-transparent" : "border-cream/25 bg-cream/[0.06]"
              }`}
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-1.5 font-body text-[15px] font-medium transition-colors duration-300 ${
                    light
                      ? "text-ink/75 hover:bg-ember/10 hover:text-ember"
                      : "text-cream/85 hover:bg-cream/12 hover:text-cream"
                  }`}
                  style={light ? undefined : { textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <a
              href={CONTACT}
              className="group inline-flex items-center gap-1.5 rounded-full bg-ember px-5 py-2.5 font-body text-[15px] font-medium text-cream transition-colors duration-300 hover:bg-terra"
            >
              Hablemos
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
            </a>
          </nav>

          {/* ── Hamburguesa ── */}
          <button
            onClick={toggleMenu}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            className="ml-auto flex flex-col gap-[5px] p-2 md:hidden"
          >
            <span
              className={`block h-[2px] w-6 origin-center rounded-full transition-all duration-300 ${
                menuOpen ? "bg-cream" : light ? "bg-ink" : "bg-cream"
              } ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`block h-[2px] w-6 rounded-full transition-all duration-300 ${
                menuOpen ? "bg-cream" : light ? "bg-ink" : "bg-cream"
              } ${menuOpen ? "scale-x-0 opacity-0" : ""}`}
            />
            <span
              className={`block h-[2px] w-6 origin-center rounded-full transition-all duration-300 ${
                menuOpen ? "bg-cream" : light ? "bg-ink" : "bg-cream"
              } ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* ── Menú móvil — overlay full-screen con la estética del bloque CTA+Footer
          (gradiente verde) y chispas cálidas a la deriva como efecto diferenciador ── */}
      <div
        aria-hidden={!menuOpen}
        // inert cuando está cerrado: saca el drawer (y sus links enfocables) del
        // tab order y del árbol de accesibilidad. Sin esto, un contenedor
        // aria-hidden con descendientes enfocables falla la regla axe
        // "aria-hidden-focus" (Accesibilidad + Navegación con agentes en Lighthouse).
        inert={!menuOpen}
        className={`fixed inset-0 z-40 transition-opacity duration-500 ease-out md:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Fondo — mismo gradiente verde del bloque CTA+Footer (estética aprobada) */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, #3e7c6c 0%, #245049 34%, #163834 64%, #0c2220 100%)",
          }}
        />
        {/* Chispas cálidas a la deriva — el efecto diferenciador (lenguaje del footer) */}
        <Sparks className="pointer-events-none absolute inset-0" />

        {/* Contenido */}
        <div className="relative flex h-full flex-col px-8 pb-12 pt-28">
          <nav className="flex flex-col" aria-label="Menú móvil">
            {MOBILE_NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="group relative flex items-center justify-between border-b border-cream/12 py-5"
              >
                <span className="overflow-hidden pt-1 pb-3">
                  <span
                    ref={(el) => {
                      drawerLinksRef.current[i] = el;
                    }}
                    className="flex items-baseline gap-4"
                    style={{ opacity: 0 }}
                  >
                    <span className="font-body text-sm font-light tracking-wide text-orange/70">
                      0{i + 1}
                    </span>
                    <span className="font-display text-[2.4rem] font-light leading-[1.02] text-cream transition-colors duration-300 group-hover:text-orange">
                      {link.label}
                    </span>
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-xl text-cream/35 transition-all duration-300 group-hover:translate-x-1 group-hover:text-orange"
                >
                  →
                </span>
              </Link>
            ))}
          </nav>

          <div ref={drawerFootRef} className="mt-auto" style={{ opacity: 0 }}>
            <a
              href={CONTACT}
              onClick={closeMenu}
              className="group flex items-center justify-center gap-2 rounded-full bg-orange px-6 py-4 font-body text-base font-medium text-ink transition-colors duration-300 hover:bg-cream"
            >
              Hablemos de tu proyecto
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </a>
            <div className="mt-6 flex items-center justify-end">
              <p className="font-body text-xs uppercase tracking-[0.2em] text-cream/30">
                Aysén · Patagonia
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
