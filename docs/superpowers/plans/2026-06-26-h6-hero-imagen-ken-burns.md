# H6 — Hero landing: video → imagen HD con Ken Burns — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el `<video>` de fondo del Hero de la landing por una imagen HD local con efecto Ken Burns lento en CSS, dejando la arquitectura lista para varias imágenes al azar.

**Architecture:** Un nuevo componente cliente `HeroBackdrop` renderiza la imagen con `next/image` (`fill`, `priority`, `object-cover`) dentro de un wrapper animado con `@keyframes hero-kenburns`. La selección de imagen sale de un array `HERO_IMAGES`; el primer paint usa el índice 0 (estable, sin hydration mismatch) y un `useEffect` elige un índice aleatorio al montar. `Hero.tsx` solo cambia el import/render del fondo; el resto (coreografía GSAP, overlays, CTAs) queda intacto.

**Tech Stack:** Next.js 16 (App Router) · React (client component) · `next/image` · Tailwind v4 · CSS keyframes. Sin librerías nuevas.

## Global Constraints

- **No usar Playwright** en ningún punto. Validación visual = revisión humana directa.
- **No tests / sin framework de test:** verificación por `npx tsc --noEmit` + `npm run build` + revisión visual + Golden Paths manuales.
- **`git push` solo cuando el usuario lo indique.** Commits locales sí.
- **Imágenes:** locales `.webp` en `public/[seccion]/`, vía `next/image`, versionadas `-vN`. Nunca reusar un nombre de archivo (caché de `next/image`).
- **Sin tipografía monospace y sin eyebrows nuevos.** (No aplica directamente aquí, pero se respeta el `.eyebrow` ya existente del indicador de scroll, que NO se toca.)
- **Respetar `prefers-reduced-motion`** (quality floor). Ya existe un bloque global en `globals.css` que neutraliza animaciones; el Ken Burns añade además un override explícito a `animation: none`.
- **El contenido y la coreografía de entrada del Hero NO se rediseñan** — solo cambia el medio de fondo.

---

### Task 1: Conseguir y colocar la imagen del Hero (Patagonia hora dorada)

Tarea separada y con checkpoint humano porque la elección de la foto es subjetiva: el revisor debe poder aprobar/rechazar la imagen antes de construir el componente.

**Files:**
- Create: `public/hero/hero-patagonia-v1.webp`

**Interfaces:**
- Consumes: nada.
- Produces: el asset `public/hero/hero-patagonia-v1.webp` (referenciable como `/hero/hero-patagonia-v1.webp`), un `.webp` de orientación apaisada, ~2400px de ancho, con zona oscura/baja luminancia hacia la **izquierda** (donde vive el texto blanco) y tonos cálidos (hora dorada).

- [ ] **Step 1: Crear la carpeta de destino**

```bash
mkdir -p public/hero
```

- [ ] **Step 2: Descargar una foto Patagonia/Aysén hora dorada de Unsplash, ya en webp**

Unsplash entrega webp con `?fm=webp&w=2400&q=80`. Candidato (Patagonia, luz cálida, lado izquierdo en sombra):

```bash
curl -L "https://images.unsplash.com/photo-1490598000245-3aa31d4d9efc?fm=webp&w=2400&q=80&fit=crop" -o public/hero/hero-patagonia-v1.webp
```

Si la foto no calza (no es hora dorada, o el lado izquierdo no es lo bastante oscuro para el texto), elegir otra de Unsplash con el mismo patrón de URL (`images.unsplash.com/photo-<id>?fm=webp&w=2400&q=80&fit=crop`) y volver a descargar al **mismo** path. Criterios: apaisada, cálida, zona oscura a la izquierda, paisaje patagónico (montaña/agua/viento), sin texto ni marcas de agua.

- [ ] **Step 3: Verificar que el archivo se descargó y es una imagen válida**

Run:
```bash
ls -la public/hero/hero-patagonia-v1.webp && file public/hero/hero-patagonia-v1.webp
```
Expected: el archivo existe, pesa > 50 KB, y `file` reporta `RIFF (little-endian) data, Web/P image`. Si pesa unos pocos bytes o no es WebP, la descarga falló (URL inválida) — elegir otra foto y reintentar.

- [ ] **Step 4: Checkpoint humano — aprobar la imagen**

Mostrar/abrir `public/hero/hero-patagonia-v1.webp` para que el usuario confirme que la foto es la correcta (tono cálido, lado izquierdo oscuro, sensación Patagonia). No avanzar a Task 2 sin su OK. Si la rechaza, repetir Steps 2–3 con otra foto.

- [ ] **Step 5: Commit**

```bash
git add public/hero/hero-patagonia-v1.webp
git commit -m "feat(h6): imagen Patagonia hora dorada para el Hero de la landing"
```

---

### Task 2: Componente `HeroBackdrop` + Ken Burns CSS + integración en `Hero.tsx`

**Files:**
- Create: `src/components/hero/HeroBackdrop.tsx`
- Delete: `src/components/hero/HeroVideo.tsx`
- Modify: `src/app/globals.css` (añadir keyframes `hero-kenburns` y override de reduced-motion, tras el bloque `hero-scroll` ~línea 66)
- Modify: `src/components/sections/Hero.tsx` (quitar `HERO_VIDEO` + `<HeroVideo>`, usar `<HeroBackdrop>`)

**Interfaces:**
- Consumes: el asset `/hero/hero-patagonia-v1.webp` (de Task 1).
- Produces: componente `HeroBackdrop` (default export, sin props). Renderiza el fondo absoluto del Hero (`absolute inset-0`, decorativo `aria-hidden`). Reemplaza 1:1 a `<HeroVideo src=... />`.

- [ ] **Step 1: Añadir los keyframes Ken Burns + override de reduced-motion en `globals.css`**

Insertar justo **después** del bloque `@keyframes hero-scroll { ... }` (termina en la línea ~66):

```css
/* Hero — Ken Burns lento del fondo (reemplaza el zoom del video placeholder).
   Animamos un wrapper DIV (no el <img>) con will-change → capa de compositor (GPU).
   El scale base ≥ 1.04 evita que el paneo muestre bordes vacíos. */
@keyframes hero-kenburns {
  from { transform: scale(1.04) translate3d(0, 0, 0); }
  to   { transform: scale(1.12) translate3d(-1.5%, -1%, 0); }
}
.hero-kenburns {
  transform: scale(1.04);
  animation: hero-kenburns 28s ease-in-out infinite alternate;
  will-change: transform;
}
/* Reduced motion: imagen quieta (el bloque global ya frena animaciones; este
   override la deja en un estado limpio y centrado en vez de saltar al frame final). */
@media (prefers-reduced-motion: reduce) {
  .hero-kenburns { animation: none !important; transform: scale(1.04); }
}
```

- [ ] **Step 2: Crear `src/components/hero/HeroBackdrop.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Fondo del Hero — imagen HD con Ken Burns lento (reemplaza el <video> placeholder).
 * Decorativo (aria-hidden): el contenido semántico del Hero es el H1, no la foto.
 *
 * Arquitectura lista para varias imágenes al azar:
 *  · SSR/primer paint → índice 0 (estable, sin hydration mismatch).
 *  · En montaje → índice aleatorio (con 1 imagen es no-op).
 * Sumar imágenes = agregar entradas a HERO_IMAGES; cero cambios de lógica.
 */
const HERO_IMAGES = [
  { src: "/hero/hero-patagonia-v1.webp" },
] as const;

export default function HeroBackdrop() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (HERO_IMAGES.length > 1) {
      setIndex(Math.floor(Math.random() * HERO_IMAGES.length));
    }
  }, []);

  const active = HERO_IMAGES[index];

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="hero-kenburns absolute inset-0">
        <Image
          src={active.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Integrar en `src/components/sections/Hero.tsx`**

Cambiar el import (línea 7):

```tsx
import HeroBackdrop from "@/components/hero/HeroBackdrop";
```

Borrar el bloque del placeholder de video (líneas ~9-12), o sea estas líneas completas:

```tsx
// TODO: reemplazar con video propio de Enma (Patagonia / proceso / I+D).
// Debe servirse con CORS o desde /public/video para reemplazar este placeholder.
const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_131941_d136af49-e243-493a-be14-6ff3f24e09e6.mp4";
```

Reemplazar el render del video (línea ~117-118):

```tsx
      {/* Imagen full-bleed con Ken Burns lento — el gradiente cálido queda detrás */}
      <HeroBackdrop />
```

(El comentario de fallback del `<section>` y los overlays grade/scrim NO se tocan.)

- [ ] **Step 4: Borrar el componente de video obsoleto**

```bash
git rm src/components/hero/HeroVideo.tsx
```

- [ ] **Step 5: Verificar que no quedan referencias a `HeroVideo`**

Run:
```bash
grep -rn "HeroVideo\|HERO_VIDEO" src/
```
Expected: sin resultados (exit 1 / vacío). Si aparece algo, eliminar esa referencia.

- [ ] **Step 6: Typecheck**

Run:
```bash
npx tsc --noEmit
```
Expected: sin errores.

- [ ] **Step 7: Build de producción**

Run:
```bash
npm run build
```
Expected: build OK (compiled successfully), sin errores de tipo ni de imagen.

- [ ] **Step 8: Verificación visual humana + Golden Paths**

Levantar `npm run dev` y revisar en `/`:
- El Hero muestra la imagen Patagonia con un zoom/paneo **muy lento** (~28s), sin saltos ni bordes vacíos.
- El texto blanco del H1 mantiene **contraste real** sobre la imagen (gracias a grade + scrim, intactos).
- La coreografía de entrada (título, acento, subtítulo, WhatsApp, pill, scroll) corre igual que antes.
- Con `prefers-reduced-motion` activado, la imagen queda **estática**.
- Golden Paths del Hero: el CTA "Escríbenos por WhatsApp" abre `wa.me/56993377835`; "Ver proyectos" navega a `/proyectos`.

No avanzar sin OK visual del usuario.

- [ ] **Step 9: Commit**

```bash
git add src/components/hero/HeroBackdrop.tsx src/components/sections/Hero.tsx src/app/globals.css
git commit -m "feat(h6): Hero landing con imagen HD + Ken Burns (reemplaza video placeholder)"
```

---

## Self-Review

**Spec coverage:**
- Video → imagen HD con Ken Burns → Task 2 (Steps 1-3). ✅
- Componente `HeroBackdrop` (`next/image` fill/priority/object-cover, decorativo) → Task 2 Step 2. ✅
- Ken Burns CSS ~28s + reduced-motion → Task 2 Step 1. ✅
- Arquitectura random sin hydration mismatch (SSR índice 0 + random en useEffect) → Task 2 Step 2. ✅
- Se mantienen coreografía/overlays/fallback/CTAs intactos → Task 2 Step 3 (solo se toca el import + render del fondo). ✅
- Asset Patagonia hora dorada, local en `public/hero/`, `.webp`, versionado → Task 1. ✅
- Nota export H8 (no loaders remotos): cumplido — solo imagen local, sin dominios remotos. ✅
- Criterios de cierre (build/typecheck OK, Golden Paths, validación humana, sin Playwright) → Task 2 Steps 6-8. ✅

**Placeholder scan:** El "elegir otra foto" de Task 1 no es un placeholder de plan: es un criterio de aceptación con método concreto (patrón de URL Unsplash + checkpoint humano), porque la elección de imagen es inherentemente subjetiva. Todo el código (CSS, componente, edición de Hero.tsx) está completo y literal.

**Type consistency:** `HeroBackdrop` es default export sin props en Task 2 Step 2 y se usa así en Step 3. `HERO_IMAGES` array de `{ src }` consistente entre definición y uso (`active.src`). ✅
