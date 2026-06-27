# Vinculación — Columna de opinión "DeNota" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir al repositorio de `/vinculacion` la columna de opinión de DeNota como primera entrada `medios`, mostrando al abrir el acordeón una tarjeta editorial en vivo (cita + autor + isotipo + CTA a DeNota), no una foto.

**Architecture:** Extensión retrocompatible del modelo `Aparicion` (dos campos opcionales `link` y `quote`), una entrada de datos nueva, una rama de render en el panel del acordeón, y un componente local `OpinionCard` hermano de `ImageSlider`. Todo dentro de `components/sections/Vinculacion.tsx`.

**Tech Stack:** Next.js 16 (App Router), TypeScript, Tailwind v4 (tokens en `globals.css`), `next/image`. Sin GSAP nuevo (motion vía transición CSS, igual al fade de fotos existente).

## Global Constraints

- **Sin Playwright** en ningún punto (dev, test ni validación). Validación = `typecheck`/`build` + revisión manual humana.
- **Sin tipografía monospace.** Lo que antes era mono va en **Outfit uppercase**. Solo Manrope (`font-display`) y Outfit (`font-body`).
- **Sin eyebrows.** No agregar etiquetas superiores tipo "(0X)".
- **Paleta cálida protagonista.** `medios` usa **terra** (`text-terra` / `TAG_TONE.medios`). No introducir verde de fondo ni teal dominante.
- **Respetar `prefers-reduced-motion`** en toda animación (sin transición cuando `reduceMotion`).
- **Motion sobrio** ("menos es más"): un efecto suave de entrada + hover, nada de blur/rebote/pulso.
- **`git push` solo cuando el usuario lo indique.** Commits locales OK.
- **Fuente de verdad de copy:** no inventar datos. Patricio Campos = cofundador de Enma (consistente con material de marca).

---

### Task 1: Extender el modelo `Aparicion` y agregar la entrada de datos

**Files:**
- Modify: `src/components/sections/Vinculacion.tsx` (type `Aparicion`, ~líneas 20-29; array `APARICIONES`, ~líneas 31-93)

**Interfaces:**
- Produces: `Aparicion` con dos campos opcionales nuevos: `link?: string`, `quote?: string`. Una entrada con `id: "columna-denota-no-convencional"`, `kind: "medios"`, `quote` y `link` definidos, `images: []`.

- [ ] **Step 1: Añadir los campos opcionales al type `Aparicion`**

En la definición del type (después de `description?: string;`):

```ts
type Aparicion = {
  id: string;
  year: string;
  kind: Kind;
  tag: string;
  title: string;
  outlet: string;
  images: string[];
  description?: string;
  link?: string; // URL externa (p. ej. la columna publicada)
  quote?: string; // pull quote; si existe (e images vacío) → tarjeta editorial
};
```

- [ ] **Step 2: Insertar la entrada nueva como primera de 2025**

En `APARICIONES`, **inmediatamente después** del objeto `congreso-jovenes-aysen` (cierra en `},` tras la línea de `images:` con `congreso-jovenes-futuro-v3.webp`) y **antes** de `camara-construccion-coyhaique`:

```ts
  {
    id: "columna-denota-no-convencional",
    year: "2025",
    kind: "medios",
    tag: "Medios",
    title: "Más allá de lo no convencional: el verdadero desafío energético",
    outlet: "DeNota · periodismo independiente de Aysén",
    images: [],
    description:
      "Patricio Campos, cofundador de Enma, sobre la generación eléctrica comunitaria como camino a la soberanía energética en Aysén.",
    quote:
      "Aprovechar las renovables convencionales de una manera menos convencional, mediante la generación colectiva, es dar pasos concretos hacia una mayor soberanía energética.",
    link: "https://denota.cl/opinion/mas-alla-de-lo-no-convencional-el-verdadero-desafio-energetico",
  },
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (sin errores). Confirma que los campos opcionales no rompen las otras entradas.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Vinculacion.tsx
git commit -m "feat(vinculacion): modelo link/quote + entrada columna DeNota"
```

---

### Task 2: Componente `OpinionCard`

**Files:**
- Modify: `src/components/sections/Vinculacion.tsx` (añadir función al final del archivo, tras `ImageSlider`)

**Interfaces:**
- Consumes: tokens de color de `globals.css` (`terra`, `ink`, `cream`), `next/image`, asset `public/isotipos/isotipo-verde.webp`.
- Produces: `function OpinionCard(props: { quote: string; source: string; author: string; role: string; link?: string; active: boolean; reduceMotion: boolean }): JSX.Element`

- [ ] **Step 1: Implementar `OpinionCard` al final del archivo**

Añadir tras el cierre de la función `ImageSlider`:

```tsx
// ─────────────────────────────────────────────────────────────────────────────
// OPINION CARD — tarjeta editorial para columnas/medios sin foto de evento.
// Reemplaza el slot de imagen del acordeón cuando la aparición trae `quote`.
// Vive dentro de la fila clickeable: el CTA detiene la propagación para no
// cerrar el panel al navegar a la fuente externa.
// ─────────────────────────────────────────────────────────────────────────────
function OpinionCard({
  quote,
  source,
  author,
  role,
  link,
  active,
  reduceMotion,
}: {
  quote: string;
  source: string;
  author: string;
  role: string;
  link?: string;
  active: boolean;
  reduceMotion: boolean;
}) {
  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();
  return (
    <div
      className="mt-5 max-w-[640px] rounded-xl bg-cream/70 p-7 ring-1 ring-ink/10 sm:p-8"
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : "translateY(8px)",
        transition: reduceMotion
          ? "none"
          : "opacity 460ms ease-out, transform 520ms ease-out",
      }}
    >
      {/* Meta */}
      <p className="m-0 font-body text-xs font-semibold uppercase tracking-[0.18em] text-terra">
        {source}
      </p>

      {/* Cita */}
      <blockquote className="relative m-0 mt-4">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -left-1 -top-6 font-display text-6xl leading-none text-terra/35"
        >
          &ldquo;
        </span>
        <p
          className="relative m-0 font-display font-light text-ink"
          style={{
            fontSize: "clamp(1.25rem, 2.4vw, 1.9rem)",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
          }}
        >
          {quote}
        </p>
      </blockquote>

      {/* Pie: autor + isotipo */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="m-0 font-body text-sm font-medium text-ink">{author}</p>
          <p className="m-0 font-body text-sm font-light text-ink/55">{role}</p>
        </div>
        <Image
          src="/isotipos/isotipo-verde.webp"
          alt=""
          aria-hidden="true"
          width={32}
          height={32}
          className="h-8 w-8 shrink-0 opacity-70"
        />
      </div>

      {/* CTA externo */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={active ? 0 : -1}
          onClick={stop}
          onKeyDown={stop}
          className="group/cta mt-6 inline-flex items-center gap-2 font-body text-sm font-medium text-terra focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/50"
        >
          <span className="relative">
            Leer en DeNota
            <span
              aria-hidden="true"
              className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-terra transition-transform duration-300 ease-out group-hover/cta:scale-x-100"
            />
          </span>
          <span
            aria-hidden="true"
            className="transition-transform duration-300 ease-out group-hover/cta:translate-x-1"
          >
            &rarr;
          </span>
          <span className="sr-only">(se abre en una nueva pestaña)</span>
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS. (El componente aún no se usa; solo valida tipos e imports — `Image` ya está importado en el archivo.)

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/Vinculacion.tsx
git commit -m "feat(vinculacion): componente OpinionCard (tarjeta editorial)"
```

---

### Task 3: Conectar `OpinionCard` en el panel del acordeón

**Files:**
- Modify: `src/components/sections/Vinculacion.tsx` (panel expandido, ~líneas 458-489)

**Interfaces:**
- Consumes: `OpinionCard` (Task 2), entrada con `quote`/`link` (Task 1), estado `openId`, `reduceMotion`.

- [ ] **Step 1: Añadir la rama `a.quote` antes de la lógica de imágenes**

Reemplazar el bloque condicional actual de render de imagen:

```tsx
                      {a.images.length > 1 ? (
                        <ImageSlider
                          images={a.images}
                          title={a.title}
                          active={openId === a.id}
                          reduceMotion={reduceMotion}
                        />
                      ) : (
                        a.images[0] && (
                          <Image
```

…por la versión con la rama de la tarjeta editorial al inicio:

```tsx
                      {a.quote ? (
                        <OpinionCard
                          quote={a.quote}
                          source="Columna de opinión · DeNota"
                          author="Patricio Campos"
                          role="Cofundador de Enma"
                          link={a.link}
                          active={openId === a.id}
                          reduceMotion={reduceMotion}
                        />
                      ) : a.images.length > 1 ? (
                        <ImageSlider
                          images={a.images}
                          title={a.title}
                          active={openId === a.id}
                          reduceMotion={reduceMotion}
                        />
                      ) : (
                        a.images[0] && (
                          <Image
```

(El resto del `<Image ... />` y los paréntesis de cierre del ternario quedan igual.)

- [ ] **Step 2: Typecheck + build**

Run: `npx tsc --noEmit && npm run build`
Expected: PASS. Build completa sin errores; `/vinculacion` se prerenderiza.

- [ ] **Step 3: Verificación manual (humana, sin Playwright)**

Run: `npm run dev` → abrir `http://localhost:3000/vinculacion`. Confirmar:
- Aparece el filtro **"Medios"**; al pulsarlo queda solo la columna DeNota.
- La fila "Más allá de lo no convencional…" abre/cierra.
- Al abrir se ve la **tarjeta editorial**: meta terra, cita grande con comilla, "Patricio Campos · Cofundador de Enma", isotipo E, y "Leer en DeNota →".
- Hover del CTA: subrayado crece + flecha avanza.
- Click en el CTA abre denota.cl en **pestaña nueva** y **no** colapsa la fila.
- (Opcional) DevTools → emular `prefers-reduced-motion: reduce`: contenido visible, sin transición.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/Vinculacion.tsx
git commit -m "feat(vinculacion): render de OpinionCard al abrir la columna DeNota"
```

---

## Self-Review

**Spec coverage:**
- Modelo `link`/`quote` → Task 1 ✅
- Entrada `medios` que activa filtro Medios → Task 1 ✅
- Render condicional `quote` → tarjeta → Task 3 ✅
- `OpinionCard` (meta terra, cita+comilla, autor+isotipo, CTA pestaña nueva, stopPropagation, tabIndex) → Task 2 ✅
- Motion fade+rise + hover, reduce-motion → Task 2 ✅
- Description framing arriba → ya existente en el panel (no requiere cambio; se renderiza vía `a.description`) ✅
- Fuera de alcance (marquee, otras entradas, OG/screenshot) → respetado ✅

**Placeholder scan:** sin TBD/TODO; todo el código está completo.

**Type consistency:** `OpinionCard` definido con `{ quote, source, author, role, link?, active, reduceMotion }` en Task 2 y consumido con esas mismas props en Task 3 ✅. Campos `quote`/`link` opcionales del type (Task 1) usados en Task 3 (`a.quote`, `a.link`) ✅.

**Nota de verificación de comandos:** `package.json` no define script `typecheck`; el typecheck canónico es `npx tsc --noEmit` (y `npm run build` también valida tipos).
