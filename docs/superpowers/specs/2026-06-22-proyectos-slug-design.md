# Design: `/proyectos/[slug]` — Página de detalle de proyecto

**Fecha:** 2026-06-22
**Estado:** Aprobado por el usuario

---

## Contexto

La mini-landing `/proyectos` está completa y pusheada. Las cards ya enlazan a `/proyectos/[slug]`, que da 404 intencional hasta este trabajo. Hay 3 proyectos con datos en `src/lib/proyectos.ts`; la turbina eólica es el primero y el más rico en datos. El patrón de ruta que se construye aquí sirve para los 3 slugs.

---

## Arquitectura de archivos

```
src/app/proyectos/[slug]/
  page.tsx                          ← ruta servidor (await params, generateStaticParams,
                                       generateMetadata, notFound)

src/components/sections/proyecto-detalle/
  ProyectoHero.tsx                  ← sección hero 2-col
  ProyectoFicha.tsx                 ← ficha técnica (tabla de facts)
  ProyectoCuerpo.tsx                ← cuerpo narrativo + capacidades
  ProyectoNav.tsx                   ← navegación prev/next
```

Los 4 componentes reciben el objeto `Proyecto` (y `ProyectoNav` recibe `{ prev, next }`) como props desde la ruta. Son `'use client'` para GSAP.

---

## Ruta: `app/proyectos/[slug]/page.tsx`

- `async function` con `params: Promise<{ slug: string }>` → `const { slug } = await params` (Next.js 16).
- `generateStaticParams`: retorna los 3 slugs de `PROYECTOS` (`turbina-eolica-baja-escala`, `estudios-energeticos-ciep`, `biodiesel-regional`).
- `generateMetadata`: título = `proyecto.title`, descripción = `proyecto.lead`.
- Si `getProyecto(slug)` devuelve `undefined` → `notFound()`.
- Árbol de render: `NavBar` + `main` (4 secciones) + `Footer`.

---

## Sección 1: ProyectoHero

**Fondo:** `#F3DDBC` (arena). `data-nav="light"`.

**Layout desktop:** grid `1fr 1fr`, gap `clamp(40px, 6vw, 80px)`, `alignItems: center`.
**Layout móvil:** columna única, imagen debajo.

**Columna izquierda:**
- Pill de dominio: Outfit uppercase 11px, letterSpacing 0.14em, color `#F1541C` (brasa), fondo `rgba(241,84,28,0.08)`, border `1px solid rgba(241,84,28,0.20)`, border-radius 100px, padding `4px 12px`. Fade-up primero (IO).
- H1: Manrope 300, `clamp(44px, 6vw, 84px)`, lineHeight 0.97, letterSpacing `-0.03em`, color ink `#1A1A1A`. Entra como bloque (fade-up + translateY 40px). Estado inicial inline `opacity:0, transform:'translateY(40px)'`.
- Lead: Outfit 17px (desktop) / 15px (móvil), color `rgba(26,26,26,0.55)`, lineHeight 1.65, maxWidth `52ch`. Fade-up con delay.
- Link "← Proyectos": Outfit uppercase 11px, letterSpacing 0.12em, color ink/45%, hover → brasa. Flecha se desplaza `−4px` en hover. Fade-up último.

**Columna derecha:**
- `<Image>` de `proyecto.image`, fill, `objectFit: cover`.
- Contenedor: `aspectRatio: '3/2'` desktop / `'16/9'` móvil, `borderRadius: 20px`, `overflow: hidden`, `boxShadow: 0 4px 24px rgba(26,26,26,0.10)`. Opacity+scale leve (0.96→1) al aparecer.

**Motion (IntersectionObserver, `threshold: 0.15`):**
```
pill:        fade-up 28px, dur 0.7s, ease power3.out, delay 0s
H1:          fade-up 40px, dur 0.9s, ease power3.out, delay 0.1s
lead:        fade-up 28px, dur 0.8s, ease power3.out, delay 0.25s
link ←:      fade-up 20px, dur 0.7s, ease power3.out, delay 0.35s
imagen:      opacity 0→1 + scale 0.96→1, dur 1.0s, ease power3.out, delay 0.15s
```
`prefers-reduced-motion`: `gsap.set` inmediato a estado final, sin animación.

---

## Sección 2: ProyectoFicha

**Fondo:** `#EECEA1` (arena más oscura). `data-nav="light"`.

**Estructura:**
- Label "FICHA TÉCNICA": Outfit uppercase 10px, letterSpacing 0.16em, color ink/40%. Aparece como bloque antes de la tabla.
- Tabla: `display: grid`, `gridTemplateColumns: '180px 1fr'` desktop / `'1fr'` móvil.
- Cada fila: 2 celdas.
  - Celda label: Outfit uppercase 11px, color ink/45%, letterSpacing 0.10em.
  - Celda valor: Outfit 16px, color ink/85%, lineHeight 1.5.
  - Separador: `borderBottom: '1px solid rgba(26,26,26,0.09)'`.
  - En móvil: cada fila se apila (label arriba, valor abajo), `paddingTop/Bottom: 16px`.

**Motion (IO, `threshold: 0.1`):**
```
label "FICHA TÉCNICA": fade-up 24px, dur 0.7s, delay 0s
filas (stagger):       fade-up 24px, dur 0.7s, ease power3.out,
                       stagger { amount: 0.35s, from: 'start' }, delay 0.1s
```
Estado inicial de cada fila: `opacity:0, transform:'translateY(24px)'` inline.

---

## Sección 3: ProyectoCuerpo

**Fondo:** `#F3DDBC`. `data-nav="light"`.

### Parte A — Narrativa 2-col

**Layout desktop:** grid `1fr 1fr`, gap `clamp(40px, 6vw, 80px)`, `alignItems: start`.
**Layout móvil:** columna única.

- Columna izquierda: label "EL CONTEXTO" (Outfit uppercase 10px, ink/40%) + párrafo `proyecto.context` (Outfit 17px, ink/70%, lineHeight 1.7).
- Columna derecha: label "QUÉ HICIMOS" + párrafo `proyecto.did`.

### Parte B — Capacidades

Separador: `borderTop: '1px solid rgba(26,26,26,0.10)'`, `marginTop: clamp(40px, 6vh, 64px)`, `paddingTop: clamp(32px, 5vh, 48px)`.

- Label "CAPACIDADES EMPLEADAS": Outfit uppercase 10px, ink/40%.
- Chips: `flex wrap`, gap 8px. Cada chip: Outfit 12px uppercase, letterSpacing 0.10em, color `rgba(241,84,28,0.75)` (brasa/75%), border `1px solid rgba(241,84,28,0.28)`, borderRadius 100px, padding `5px 14px`, fondo transparent. Hover: fondo `rgba(241,84,28,0.07)`, transición 0.18s.

**Motion (IO, `threshold: 0.1`):**
```
col izquierda:  fade-up 32px, dur 0.9s, ease power3.out, delay 0s
col derecha:    fade-up 32px, dur 0.9s, ease power3.out, delay 0.12s
chips (stagger): pop-in (opacity 0→1 + scale 0.92→1), dur 0.5s,
                 stagger { amount: 0.30s }, delay 0.1s (IO propio)
```

---

## Sección 4: ProyectoNav

**Fondo:** `#F8EDDD` (crema base). `data-nav="light"`. Entrega suavemente al Footer verde.

**Layout desktop:** grid `1fr 1fr`. Separador central: `borderRight: '1px solid rgba(26,26,26,0.09)'` en el lado prev.
**Layout móvil:** columna única, prev arriba con `borderBottom`.

**Cada lado:**
- Label: "PROYECTO ANTERIOR" / "PROYECTO SIGUIENTE" — Outfit uppercase 10px, ink/40%.
- Flecha + título: `←` / `→` + `vecino.title` en Manrope 300 ~22px, ink/85%.
- Hover: título → brasa `#F1541C`, flecha desplaza `translateX ±4px`, transición 0.2s.
- El lado "prev" tiene flecha a la izquierda del título; "next" a la derecha (flex + gap).
- Navegación circular: `getProyectoNav` ya la resuelve.

**Separador superior:** `borderTop: '1px solid rgba(26,26,26,0.09)'` al inicio de la sección.

**Motion (IO):** bloque completo fade-up 24px como una pieza, dur 0.7s, delay 0s.

---

## Reglas transversales

- **FOUC-safe:** todo elemento animado lleva `opacity:0` (y `transform` si aplica) como `style` inline en el JSX. GSAP usa `fromTo` siempre, nunca `from`.
- **prefers-reduced-motion:** en cada componente, antes de registrar observers, leer `window.matchMedia('(prefers-reduced-motion: reduce)').matches`. Si `true`: `gsap.set` inmediato a estado final de todos los elementos, sin registrar nada más.
- **IntersectionObserver scope:** no usar selectores string en callbacks IO — resolver nodos con `sectionRef.current.querySelectorAll(...)` y pasar nodos reales a GSAP.
- **Fonts ready:** llamar `document.fonts.ready.then(() => ScrollTrigger.refresh())` solo si hay ScrollTrigger en algún componente. Estos componentes no usan ScrollTrigger, solo IO — no es necesario.
- **Sin eyebrows editoriales, sin tipografía monospace.** Todo lo "técnico" va en Outfit uppercase.
- **Imágenes:** `priority` solo en ProyectoHero (above-the-fold). Los demás sin priority.

---

## Golden Paths a verificar al cerrar

- `/` → 200, sin errores JS
- `/nosotros` → 200
- `/vinculacion` → 200
- `/proyectos` → 200, cards flipean y enlazan al slug
- `/proyectos/turbina-eolica-baja-escala` → 200, 4 secciones visibles
- `/proyectos/estudios-energeticos-ciep` → 200
- `/proyectos/biodiesel-regional` → 200
- `/blog` → 200
- NavBar y Footer consistentes en todas las rutas
- `notFound()` para slug inválido (ej. `/proyectos/inexistente` → 404 de Next)
- `typecheck` sin errores
