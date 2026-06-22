# `/proyectos/[slug]` — Página de Detalle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear la ruta dinámica `/proyectos/[slug]` con 4 secciones (Hero, Ficha, Cuerpo, Nav) que sirva los 3 proyectos de `lib/proyectos.ts`, eliminando el 404 actual.

**Architecture:** Un Server Component raíz (`app/proyectos/[slug]/page.tsx`) con `await params`, `generateStaticParams` y `generateMetadata` orquesta 4 Client Components independientes en `components/sections/proyecto-detalle/`. Cada componente recibe sus props del Server Component y maneja su propio IO + GSAP reveal.

**Tech Stack:** Next.js 16 App Router · TypeScript · Tailwind CSS v4 · GSAP vía `@/lib/gsap` · IntersectionObserver (sin ScrollTrigger) · `next/image` · `next/link`

## Global Constraints

- `params` es `Promise<{ slug: string }>` → siempre `const { slug } = await params` (Next.js 16, lore/routing.md)
- Sin eyebrows editoriales · Sin tipografía monospace · Labels técnicos en Outfit uppercase
- Tipografías: `var(--font-display)` = Manrope, `var(--font-body)` = Outfit (definidas en `globals.css` y `layout.tsx`)
- Paleta: fondo Hero/Cuerpo `#F3DDBC`, Ficha `#EECEA1`, Nav `#F8EDDD`; acento brasa `#F1541C`; ink `#1A1A1A`
- `data-nav="light"` en cada `<section>` (NavBar lo lee para modo claro)
- FOUC-safe: todo elemento animado lleva `opacity: 0` (y `transform` si aplica) en `style` inline del JSX; GSAP usa `fromTo` siempre, nunca `from`
- GSAP import: `import { gsap } from "@/lib/gsap"` — nunca desde `'gsap'` directamente
- IO pattern: `useEffect` + `useRef` + `IntersectionObserver` (threshold 0.15, rootMargin "-8% 0px") + `WeakSet` para one-shot + fallback `setTimeout` gateado por `getBoundingClientRect` — igual que `Nosotros.tsx`
- `prefers-reduced-motion`: al inicio de cada `useEffect`, si `true` → `gsap.set` a estado final en todos los elementos y `return`; sin registrar IO ni fallback
- Selectores GSAP en callbacks IO: resolver con `sectionRef.current.querySelectorAll(...)` (nodos reales, no strings globales)
- Copy/datos exclusivamente desde `src/lib/proyectos.ts` — no inventar nada
- No Playwright · `git push` solo cuando el usuario lo indique

---

## File Structure

| Archivo | Acción | Responsabilidad |
|---|---|---|
| `src/app/proyectos/[slug]/page.tsx` | Crear | Ruta Server Component: await params, generateStaticParams, generateMetadata, notFound, orquesta los 4 componentes |
| `src/components/sections/proyecto-detalle/ProyectoHero.tsx` | Crear | Hero 2-col: pill + H1 + lead + link ← + imagen |
| `src/components/sections/proyecto-detalle/ProyectoFicha.tsx` | Crear | Ficha técnica: tabla de facts con stagger cascade |
| `src/components/sections/proyecto-detalle/ProyectoCuerpo.tsx` | Crear | Cuerpo: narrativa 2-col (contexto + qué hicimos) + chips de capacidades |
| `src/components/sections/proyecto-detalle/ProyectoNav.tsx` | Crear | Navegación prev/next circular con hover |

**No se modifica ningún archivo existente.** Todos los tipos vienen de `src/lib/proyectos.ts` (ya existe).

---

## Task 1: Ruta Server Component

**Files:**
- Crear: `src/app/proyectos/[slug]/page.tsx`

**Interfaces:**
- Consume: `PROYECTOS`, `getProyecto`, `getProyectoNav`, `Proyecto` de `@/lib/proyectos`
- Produce: props a los 4 componentes de detalle (ver Tasks 2–5)

- [ ] **Step 1: Crear el directorio y el archivo de ruta**

Crear `src/app/proyectos/[slug]/page.tsx` con el siguiente contenido completo:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { PROYECTOS, getProyecto, getProyectoNav } from "@/lib/proyectos";
import ProyectoHero from "@/components/sections/proyecto-detalle/ProyectoHero";
import ProyectoFicha from "@/components/sections/proyecto-detalle/ProyectoFicha";
import ProyectoCuerpo from "@/components/sections/proyecto-detalle/ProyectoCuerpo";
import ProyectoNav from "@/components/sections/proyecto-detalle/ProyectoNav";

export function generateStaticParams() {
  return PROYECTOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const proyecto = getProyecto(slug);
  if (!proyecto) return {};
  return {
    title: proyecto.title,
    description: proyecto.lead,
  };
}

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proyecto = getProyecto(slug);
  if (!proyecto) notFound();

  const nav = getProyectoNav(slug)!;

  return (
    <>
      <NavBar />
      <main>
        <ProyectoHero proyecto={proyecto} />
        <ProyectoFicha facts={proyecto.facts} />
        <ProyectoCuerpo
          context={proyecto.context}
          did={proyecto.did}
          capabilities={proyecto.capabilities}
        />
        <ProyectoNav prev={nav.prev} next={nav.next} />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Crear stubs mínimos para los 4 componentes (para que compile)**

Crear `src/components/sections/proyecto-detalle/ProyectoHero.tsx`:
```tsx
"use client";
import type { Proyecto } from "@/lib/proyectos";
export default function ProyectoHero({ proyecto }: { proyecto: Proyecto }) {
  return <section data-nav="light" style={{ background: "#F3DDBC", minHeight: "60vh" }}>{proyecto.title}</section>;
}
```

Crear `src/components/sections/proyecto-detalle/ProyectoFicha.tsx`:
```tsx
"use client";
import type { ProyectoFact } from "@/lib/proyectos";
export default function ProyectoFicha({ facts }: { facts: ProyectoFact[] }) {
  return <section data-nav="light" style={{ background: "#EECEA1" }}>{facts.length} facts</section>;
}
```

Crear `src/components/sections/proyecto-detalle/ProyectoCuerpo.tsx`:
```tsx
"use client";
export default function ProyectoCuerpo({ context, did, capabilities }: { context: string; did: string; capabilities: string[] }) {
  return <section data-nav="light" style={{ background: "#F3DDBC" }}>{context}</section>;
}
```

Crear `src/components/sections/proyecto-detalle/ProyectoNav.tsx`:
```tsx
"use client";
import type { Proyecto } from "@/lib/proyectos";
export default function ProyectoNav({ prev, next }: { prev: Proyecto; next: Proyecto }) {
  return <section data-nav="light" style={{ background: "#F8EDDD" }}>{prev.title} | {next.title}</section>;
}
```

- [ ] **Step 3: Verificar typecheck**

```bash
cd C:/proyectos/enma/web2 && npx tsc --noEmit
```

Esperado: 0 errores. Si hay error de tipo en `nav = getProyectoNav(slug)!`, verificar que el `!` (non-null assertion) está presente — `notFound()` garantiza que `slug` es válido antes de llegar ahí.

- [ ] **Step 4: Verificar en dev server que las 3 rutas devuelven contenido**

```bash
npm run dev
```

Navegar a:
- `http://localhost:3000/proyectos/turbina-eolica-baja-escala` → debe mostrar "Turbina eólica de baja escala" (stub)
- `http://localhost:3000/proyectos/estudios-energeticos-ciep` → debe mostrar el título del CIEP
- `http://localhost:3000/proyectos/biodiesel-regional` → debe mostrar el título del biodiésel
- `http://localhost:3000/proyectos/slug-invalido` → debe mostrar la página 404 de Next.js

- [ ] **Step 5: Commit**

```bash
git add src/app/proyectos/[slug]/page.tsx src/components/sections/proyecto-detalle/
git commit -m "feat(proyectos): ruta /proyectos/[slug] con stubs (3 slugs estáticos, notFound)"
```

---

## Task 2: ProyectoHero

**Files:**
- Modificar: `src/components/sections/proyecto-detalle/ProyectoHero.tsx` (reemplazar stub)

**Interfaces:**
- Consume: `Proyecto` de `@/lib/proyectos` (campos: `domain`, `title`, `lead`, `image`, `imageAlt`)
- Produce: sección `data-nav="light"`, fondo `#F3DDBC`, elementos con `data-rise` y `data-img` inline

- [ ] **Step 1: Reemplazar el stub con la implementación completa**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import type { Proyecto } from "@/lib/proyectos";

export default function ProyectoHero({ proyecto }: { proyecto: Proyecto }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [backHovered, setBackHovered] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const rises = Array.from(section.querySelectorAll<HTMLElement>("[data-rise]"));
    const imgs = Array.from(section.querySelectorAll<HTMLElement>("[data-img]"));

    if (reduce) {
      rises.forEach((el) => gsap.set(el, { opacity: 1, y: 0 }));
      imgs.forEach((el) => gsap.set(el, { opacity: 1, scale: 1 }));
      return;
    }

    const played = { done: false };
    const play = () => {
      if (played.done) return;
      played.done = true;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        section.querySelectorAll("[data-rise='pill']"),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7 },
        0
      );
      tl.fromTo(
        section.querySelectorAll("[data-rise='h1']"),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9 },
        0.1
      );
      tl.fromTo(
        section.querySelectorAll("[data-rise='lead']"),
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.8 },
        0.25
      );
      tl.fromTo(
        section.querySelectorAll("[data-rise='back']"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7 },
        0.35
      );
      tl.fromTo(
        section.querySelectorAll("[data-img]"),
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 1.0 },
        0.15
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(section);

    const t = window.setTimeout(() => {
      const r = section.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) play();
    }, 2600);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav="light"
      style={{
        background: "#F3DDBC",
        padding:
          "clamp(120px,16vh,160px) clamp(24px,5vw,80px) clamp(64px,10vh,96px)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))",
          gap: "clamp(40px,6vw,80px)",
          alignItems: "center",
        }}
      >
        {/* Columna izquierda */}
        <div>
          {/* Pill de dominio */}
          <div
            data-rise="pill"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 12px",
              borderRadius: "100px",
              background: "rgba(241,84,28,0.08)",
              border: "1px solid rgba(241,84,28,0.20)",
              marginBottom: "24px",
              opacity: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.14em",
                textTransform: "uppercase" as const,
                color: "#F1541C",
              }}
            >
              {proyecto.domain}
            </span>
          </div>

          {/* H1 */}
          <h1
            data-rise="h1"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(44px,6vw,84px)",
              lineHeight: 0.97,
              letterSpacing: "-0.03em",
              color: "#1A1A1A",
              margin: "0 0 24px",
              opacity: 0,
              transform: "translateY(40px)",
            }}
          >
            {proyecto.title}
          </h1>

          {/* Lead */}
          <p
            data-rise="lead"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(15px,1.2vw,17px)",
              color: "rgba(26,26,26,0.55)",
              lineHeight: 1.65,
              maxWidth: "52ch",
              margin: "0 0 40px",
              opacity: 0,
            }}
          >
            {proyecto.lead}
          </p>

          {/* ← Proyectos */}
          <Link
            href="/proyectos"
            data-rise="back"
            onMouseEnter={() => setBackHovered(true)}
            onMouseLeave={() => setBackHovered(false)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase" as const,
              color: backHovered ? "#F1541C" : "rgba(26,26,26,0.45)",
              textDecoration: "none",
              transition: "color 0.2s ease",
              opacity: 0,
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: backHovered ? "translateX(-4px)" : "translateX(0)",
                transition: "transform 0.2s ease",
              }}
            >
              ←
            </span>
            <span>Proyectos</span>
          </Link>
        </div>

        {/* Columna derecha — imagen */}
        <div
          data-img
          style={{
            position: "relative",
            aspectRatio: "3/2",
            borderRadius: "20px",
            overflow: "hidden",
            boxShadow:
              "0 4px 24px rgba(26,26,26,0.10), 0 16px 56px rgba(26,26,26,0.07)",
            opacity: 0,
          }}
        >
          <Image
            src={proyecto.image}
            alt={proyecto.imageAlt}
            fill
            priority
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar typecheck**

```bash
npx tsc --noEmit
```

Esperado: 0 errores.

- [ ] **Step 3: Verificar visualmente en dev server**

`http://localhost:3000/proyectos/turbina-eolica-baja-escala`: hero en arena cálida, pill "EÓLICA" en brasa, H1 grande Manrope, lead en gris, flecha ← Proyectos, turbina.jpg a la derecha. En móvil: apilado (imagen debajo). Animación al cargar la página (aparece en secuencia).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/proyecto-detalle/ProyectoHero.tsx
git commit -m "feat(proyectos): ProyectoHero — hero 2-col con pill, H1, lead, ← y imagen"
```

---

## Task 3: ProyectoFicha

**Files:**
- Modificar: `src/components/sections/proyecto-detalle/ProyectoFicha.tsx` (reemplazar stub)

**Interfaces:**
- Consume: `facts: ProyectoFact[]` donde `ProyectoFact = { label: string; value: string }`
- Produce: sección `data-nav="light"`, fondo `#EECEA1`, filas con `data-row` para stagger cascade

- [ ] **Step 1: Reemplazar el stub con la implementación completa**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import type { ProyectoFact } from "@/lib/proyectos";

export default function ProyectoFicha({ facts }: { facts: ProyectoFact[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const label = section.querySelector<HTMLElement>("[data-section-label]");
    const rows = Array.from(section.querySelectorAll<HTMLElement>("[data-row]"));

    if (reduce) {
      if (label) gsap.set(label, { opacity: 1, y: 0 });
      rows.forEach((r) => gsap.set(r, { opacity: 1, y: 0 }));
      return;
    }

    const played = { done: false };
    const play = () => {
      if (played.done) return;
      played.done = true;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (label) {
        tl.fromTo(label, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
      }
      tl.fromTo(
        rows,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: { amount: 0.35, from: "start" } },
        0.1
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(section);

    const t = window.setTimeout(() => {
      const r = section.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) play();
    }, 2600);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav="light"
      style={{
        background: "#EECEA1",
        padding: "clamp(64px,10vh,96px) clamp(24px,5vw,80px)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Label de sección */}
        <p
          data-section-label
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "10px",
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase" as const,
            color: "rgba(26,26,26,0.40)",
            margin: "0 0 32px",
            opacity: 0,
          }}
        >
          Ficha técnica
        </p>

        {/* Tabla */}
        <div
          style={{
            borderTop: "1px solid rgba(26,26,26,0.09)",
          }}
        >
          {facts.map((fact, i) => (
            <div
              key={i}
              data-row
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(140px,18vw,200px) 1fr",
                gap: "clamp(16px,3vw,40px)",
                padding: "clamp(14px,2vh,20px) 0",
                borderBottom: "1px solid rgba(26,26,26,0.09)",
                alignItems: "baseline",
                opacity: 0,
                transform: "translateY(24px)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase" as const,
                  color: "rgba(26,26,26,0.45)",
                }}
              >
                {fact.label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(14px,1.1vw,16px)",
                  color: "rgba(26,26,26,0.85)",
                  lineHeight: 1.5,
                }}
              >
                {fact.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Nota de responsive:** en pantallas muy estrechas (<400px), `gridTemplateColumns: 'clamp(140px,18vw,200px) 1fr'` puede apretar la columna de valor. Si en móvil se ve cortado, cambiar a columna única con media query CSS o `@media` inline — pero primero verificar visualmente en 390px.

- [ ] **Step 2: Verificar typecheck + dev server**

```bash
npx tsc --noEmit
```

Visual: 5 filas de la turbina con label en uppercase arena y valor en ink. Stagger cascade al scroll. En móvil las dos columnas ajustan por clamp.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/proyecto-detalle/ProyectoFicha.tsx
git commit -m "feat(proyectos): ProyectoFicha — tabla técnica con stagger cascade"
```

---

## Task 4: ProyectoCuerpo

**Files:**
- Modificar: `src/components/sections/proyecto-detalle/ProyectoCuerpo.tsx` (reemplazar stub)

**Interfaces:**
- Consume: `context: string`, `did: string`, `capabilities: string[]`
- Produce: sección `data-nav="light"`, fondo `#F3DDBC`, col izquierda `data-col-left`, col derecha `data-col-right`, chips `data-chip`

- [ ] **Step 1: Reemplazar el stub con la implementación completa**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

interface Props {
  context: string;
  did: string;
  capabilities: string[];
}

export default function ProyectoCuerpo({ context, did, capabilities }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const [hoveredChip, setHoveredChip] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const colLeft = section.querySelector<HTMLElement>("[data-col-left]");
    const colRight = section.querySelector<HTMLElement>("[data-col-right]");

    if (reduce) {
      if (colLeft) gsap.set(colLeft, { opacity: 1, y: 0 });
      if (colRight) gsap.set(colRight, { opacity: 1, y: 0 });
      return;
    }

    const played = { done: false };
    const play = () => {
      if (played.done) return;
      played.done = true;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      if (colLeft) {
        tl.fromTo(colLeft, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9 }, 0);
      }
      if (colRight) {
        tl.fromTo(colRight, { opacity: 0, y: 32 }, { opacity: 1, y: 0, duration: 0.9 }, 0.12);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(section);

    const t = window.setTimeout(() => {
      const r = section.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) play();
    }, 2600);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  // IO separado para los chips (pueden entrar más tarde que las columnas)
  useEffect(() => {
    const chips = chipsRef.current;
    if (!chips) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chipEls = Array.from(chips.querySelectorAll<HTMLElement>("[data-chip]"));

    if (reduce) {
      chipEls.forEach((el) => gsap.set(el, { opacity: 1, scale: 1 }));
      return;
    }

    const played = { done: false };
    const play = () => {
      if (played.done) return;
      played.done = true;
      gsap.fromTo(
        chipEls,
        { opacity: 0, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: { amount: 0.3, from: "start" },
        }
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(chips);

    const t = window.setTimeout(() => {
      const r = chips.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) play();
    }, 3000);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav="light"
      style={{
        background: "#F3DDBC",
        padding: "clamp(64px,10vh,96px) clamp(24px,5vw,80px)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Grid 2 columnas */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",
            gap: "clamp(40px,6vw,80px)",
            alignItems: "start",
          }}
        >
          {/* Contexto */}
          <div data-col-left style={{ opacity: 0, transform: "translateY(32px)" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: "rgba(26,26,26,0.40)",
                margin: "0 0 16px",
              }}
            >
              El contexto
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(15px,1.2vw,17px)",
                color: "rgba(26,26,26,0.70)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {context}
            </p>
          </div>

          {/* Qué hicimos */}
          <div data-col-right style={{ opacity: 0, transform: "translateY(32px)" }}>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase" as const,
                color: "rgba(26,26,26,0.40)",
                margin: "0 0 16px",
              }}
            >
              Qué hicimos
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(15px,1.2vw,17px)",
                color: "rgba(26,26,26,0.70)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {did}
            </p>
          </div>
        </div>

        {/* Separador + Capacidades */}
        <div
          ref={chipsRef}
          style={{
            borderTop: "1px solid rgba(26,26,26,0.10)",
            marginTop: "clamp(40px,6vh,64px)",
            paddingTop: "clamp(32px,5vh,48px)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "10px",
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase" as const,
              color: "rgba(26,26,26,0.40)",
              margin: "0 0 20px",
            }}
          >
            Capacidades empleadas
          </p>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px" }}>
            {capabilities.map((cap, i) => (
              <span
                key={cap}
                data-chip
                onMouseEnter={() => setHoveredChip(i)}
                onMouseLeave={() => setHoveredChip(null)}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.10em",
                  textTransform: "uppercase" as const,
                  color: "rgba(241,84,28,0.75)",
                  border: "1px solid rgba(241,84,28,0.28)",
                  borderRadius: "100px",
                  padding: "5px 14px",
                  background: hoveredChip === i ? "rgba(241,84,28,0.07)" : "transparent",
                  transition: "background 0.18s ease",
                  opacity: 0,
                  display: "inline-block",
                }}
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar typecheck + dev server**

```bash
npx tsc --noEmit
```

Visual: dos columnas "El contexto" / "Qué hicimos" con texto real. Debajo, separador + chips en brasa. Chips con hover de fondo sutil. En móvil: columnas apiladas, chips en flexwrap.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/proyecto-detalle/ProyectoCuerpo.tsx
git commit -m "feat(proyectos): ProyectoCuerpo — narrativa 2-col + chips de capacidades"
```

---

## Task 5: ProyectoNav

**Files:**
- Modificar: `src/components/sections/proyecto-detalle/ProyectoNav.tsx` (reemplazar stub)

**Interfaces:**
- Consume: `prev: Proyecto`, `next: Proyecto` (de `getProyectoNav`)
- Produce: sección `data-nav="light"`, fondo `#F8EDDD`, navegación circular prev/next

- [ ] **Step 1: Reemplazar el stub con la implementación completa**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import type { Proyecto } from "@/lib/proyectos";

interface Props {
  prev: Proyecto;
  next: Proyecto;
}

function NavSide({
  proyecto,
  direction,
}: {
  proyecto: Proyecto;
  direction: "prev" | "next";
}) {
  const [hovered, setHovered] = useState(false);
  const isPrev = direction === "prev";

  return (
    <Link
      href={`/proyectos/${proyecto.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column" as const,
        gap: "10px",
        textDecoration: "none",
        padding: "clamp(28px,4vh,40px) clamp(24px,4vw,48px)",
        alignItems: isPrev ? "flex-start" : "flex-end",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          color: "rgba(26,26,26,0.40)",
        }}
      >
        {isPrev ? "Proyecto anterior" : "Proyecto siguiente"}
      </span>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexDirection: isPrev ? "row" : ("row-reverse" as const),
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "18px",
            color: hovered ? "#F1541C" : "rgba(26,26,26,0.45)",
            transform: hovered
              ? `translateX(${isPrev ? "-4px" : "4px"})`
              : "translateX(0)",
            transition: "transform 0.2s ease, color 0.2s ease",
            display: "inline-block",
          }}
        >
          {isPrev ? "←" : "→"}
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(18px,1.6vw,22px)",
            letterSpacing: "-0.02em",
            color: hovered ? "#F1541C" : "rgba(26,26,26,0.85)",
            transition: "color 0.2s ease",
          }}
        >
          {proyecto.title}
        </span>
      </span>
    </Link>
  );
}

export default function ProyectoNav({ prev, next }: Props) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      gsap.set(section, { opacity: 1, y: 0 });
      return;
    }

    const played = { done: false };
    const play = () => {
      if (played.done) return;
      played.done = true;
      gsap.fromTo(
        section,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(section);

    const t = window.setTimeout(() => {
      const r = section.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) play();
    }, 3200);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-nav="light"
      style={{
        background: "#F8EDDD",
        borderTop: "1px solid rgba(26,26,26,0.09)",
        opacity: 0,
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {/* Prev */}
        <div style={{ borderRight: "1px solid rgba(26,26,26,0.09)" }}>
          <NavSide proyecto={prev} direction="prev" />
        </div>
        {/* Next */}
        <div>
          <NavSide proyecto={next} direction="next" />
        </div>
      </div>
    </section>
  );
}
```

**Nota de responsive móvil:** el grid `1fr 1fr` en pantallas angostas puede quedar apretado con títulos largos. Si en 390px se solapa, cambiar a columna única con prev arriba y borderBottom en lugar de borderRight. Verificar visualmente.

- [ ] **Step 2: Verificar typecheck + dev server**

```bash
npx tsc --noEmit
```

Visual: dos columnas separadas por línea vertical. Izquierda: "← Biodiésel regional" (para la turbina). Derecha: "Estudios CIEP →". En hover: título y flecha viran a brasa. Confirmar también en `/proyectos/biodiesel-regional` (circular — prev debe ser CIEP, next debe ser turbina).

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/proyecto-detalle/ProyectoNav.tsx
git commit -m "feat(proyectos): ProyectoNav — navegación prev/next circular con hover brasa"
```

---

## Task 6: Integración, Golden Paths y typecheck final

**Files:**
- Sin archivos nuevos — verificación del conjunto

- [ ] **Step 1: Typecheck final completo**

```bash
npx tsc --noEmit
```

Esperado: 0 errores. Si hay errores de tipo en `ProyectoFicha` o `ProyectoCuerpo` por desestructuración de props, verificar que los tipos importados de `@/lib/proyectos` son correctos.

- [ ] **Step 2: Build de producción**

```bash
npm run build
```

Esperado: build OK sin errores. Las 3 rutas estáticas deben aparecer en el output:
```
○ /proyectos/turbina-eolica-baja-escala
○ /proyectos/estudios-energeticos-ciep
○ /proyectos/biodiesel-regional
```

- [ ] **Step 3: Verificar Golden Paths en dev server**

Con `npm run dev` corriendo, verificar manualmente:

| Ruta | Esperado |
|---|---|
| `/` | 200, sin errores JS en consola |
| `/nosotros` | 200, navbar y footer consistentes |
| `/vinculacion` | 200 |
| `/proyectos` | 200, cards flipean; "Ver proyecto →" del reverso enlaza al slug |
| `/proyectos/turbina-eolica-baja-escala` | 200, 4 secciones visibles (Hero, Ficha, Cuerpo, Nav) |
| `/proyectos/estudios-energeticos-ciep` | 200, 4 facts (CIEP tiene 4), imagen `ciep.jpg` |
| `/proyectos/biodiesel-regional` | 200, 3 facts (biodiésel tiene 3), imagen `biodiesel.jpg` |
| `/blog` | 200 |
| `/proyectos/slug-invalido` | Next.js 404 (no error 500) |
| `← Proyectos` en cualquier detalle | navega a `/proyectos` correctamente |
| prev/next en turbina | prev = biodiésel, next = CIEP |
| prev/next en CIEP | prev = turbina, next = biodiésel |
| prev/next en biodiésel | prev = CIEP, next = turbina |

- [ ] **Step 4: Verificar responsive en 390px**

Abrir DevTools → iPhone 14 Pro (390px). Verificar:
- Hero: imagen debajo del texto, no cortada
- Ficha: columnas label/value no se solapan (si se solapan, aplicar corrección de móvil del Step de ProyectoFicha)
- Cuerpo: columnas apiladas
- Nav: confirmar legibilidad (si hay solapamiento, cambiar a columna única con borderBottom)

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "feat(proyectos): páginas de detalle /proyectos/[slug] — Golden Paths OK"
```

> `git push` solo cuando el usuario lo indique.
