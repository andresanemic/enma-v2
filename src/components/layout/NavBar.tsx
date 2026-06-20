"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

const NAV_LINKS = [
  { href: "/nosotros", label: "Nosotros" },
  { href: "/servicios", label: "Servicios" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/blog", label: "Blog" },
];

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
  const drawerLinksRef = useRef<(HTMLAnchorElement | null)[]>([]);

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

  // Stagger de entrada de los links del drawer al abrir (lore/animation)
  useEffect(() => {
    if (!menuOpen) return;
    const links = drawerLinksRef.current.filter(Boolean) as HTMLAnchorElement[];
    gsap.fromTo(
      links,
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.07, duration: 0.5, ease: "power3.out", delay: 0.12 }
    );
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
        <div className="flex items-center justify-between px-6 py-4 sm:px-10 md:px-14">
          {/* Logo — crossfade verde↔blanco según el fondo (sin salto brusco).
              El blanco (sobre el hero) lleva sombra para destacar. */}
          <Link href="/" aria-label="Enma — inicio" className="relative block h-7 sm:h-8">
            {/* Define la caja en el flujo (sin layout shift) */}
            <Image
              src="/logos/logo-verde.webp"
              alt="Enma"
              width={112}
              height={36}
              priority
              className="h-7 w-auto sm:h-8"
              style={{ opacity: 0 }}
            />
            <Image
              src="/logos/logo-verde.webp"
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
            className="flex flex-col gap-[5px] p-2 md:hidden"
          >
            <span
              className={`block h-[2px] w-6 origin-center rounded-full transition-all duration-300 ${
                light || menuOpen ? "bg-ink" : "bg-cream"
              } ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`}
            />
            <span
              className={`block h-[2px] w-6 rounded-full transition-all duration-300 ${
                light || menuOpen ? "bg-ink" : "bg-cream"
              } ${menuOpen ? "scale-x-0 opacity-0" : ""}`}
            />
            <span
              className={`block h-[2px] w-6 origin-center rounded-full transition-all duration-300 ${
                light || menuOpen ? "bg-ink" : "bg-cream"
              } ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* ── Backdrop móvil ── */}
      <div
        onClick={closeMenu}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* ── Drawer móvil ── */}
      <aside
        aria-hidden={!menuOpen}
        className={`fixed inset-y-0 right-0 z-[45] w-[85%] max-w-sm bg-cream shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col px-8 pb-8 pt-24">
          <nav className="flex flex-col" aria-label="Menú móvil">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => {
                  drawerLinksRef.current[i] = el;
                }}
                onClick={closeMenu}
                style={{ opacity: 0 }}
                className="border-b border-ink/10 py-4 font-display text-2xl font-light text-ink transition-colors duration-200 hover:text-ember"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <a
            href={CONTACT}
            onClick={closeMenu}
            className="mt-8 flex items-center justify-center gap-2 rounded-full bg-ember px-6 py-3.5 font-body text-base font-medium text-cream transition-colors duration-300 hover:bg-terra"
          >
            Hablemos de tu proyecto →
          </a>

          <p className="mt-auto eyebrow text-ink/35">contacto@enmachile.com</p>
        </div>
      </aside>
    </>
  );
}
