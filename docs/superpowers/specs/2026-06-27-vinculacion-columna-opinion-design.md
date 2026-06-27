# Vinculación — Columna de opinión "DeNota" (tarjeta editorial)

**Fecha:** 2026-06-27
**Área:** `/vinculacion` · `components/sections/Vinculacion.tsx`
**Tipo:** Contenido nuevo + extensión mínima de modelo

---

## Objetivo

Añadir al repositorio de Vinculación una **columna de opinión** publicada por Patricio
Campos (cofundador de Enma) en DeNota. Es la **primera entrada de tipo `medios`** del
sitio, por lo que activará el filtro "Medios" (hoy oculto por no tener entradas).

Como una columna de opinión **no tiene foto de evento**, al abrir su fila del acordeón
NO se muestra una imagen sino una **tarjeta editorial en vivo** (bloque React on-brand),
no un `.webp` ni un screenshot. Decisión tomada en brainstorming.

Fuente del contenido: `Vinculación/2025 - Columna de opinión - .../Nota y link.txt`.

---

## Decisiones (cerradas en brainstorming)

- **Visual del acordeón:** tarjeta editorial renderizada en vivo (no imagen).
- **Cita destacada (pull quote):** el cierre / tesis de la columna —
  *"Aprovechar las renovables convencionales de una manera menos convencional, mediante
  la generación colectiva, es dar pasos concretos hacia una mayor soberanía energética."*
  (parafraseo fiel y condensado de la última frase del artículo).
- **Etiqueta (tag corto):** **MEDIOS** → toma `text-terra` vía `TAG_TONE.medios`.
- **Enlace externo:** botón "Leer en DeNota →" a la URL publicada, nueva pestaña.

---

## Cambios

### 1. Modelo `Aparicion` (extensión mínima, retrocompatible)

Añadir dos campos **opcionales** al type — no rompe ninguna entrada existente:

```ts
type Aparicion = {
  // ...campos actuales...
  images: string[];
  description?: string;
  link?: string;   // URL externa (p. ej. la columna publicada)
  quote?: string;  // pull quote; si existe (e images vacío) → tarjeta editorial
};
```

### 2. Nueva entrada en `APARICIONES`

Insertar como **primera entrada de 2025** (justo después de `congreso-jovenes-aysen`,
2026), para que el canal "Medios" estrene con presencia:

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

> Nota de copy: la `description` afirma que Patricio Campos es **cofundador de Enma**
> (consistente con el material de marca: entrevistas a los fundadores incluyen
> `respuestas-patricio-campos.txt`). El autor se acredita en la tarjeta, no se inventa rol.

### 3. Render del panel desplegable

En el bloque `{/* Panel expandido — imagen real */}`, añadir una rama **antes** de la
lógica de imágenes existente:

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
  <ImageSlider ... />
) : (
  a.images[0] && <Image ... />
)}
```

La `description` se mantiene renderizándose **encima** (como en `camara-construccion`),
como framing breve; la cita es el golpe.

### 4. Componente `OpinionCard` (local, junto a `ImageSlider`)

Props: `{ quote, source, author, role, link?, active, reduceMotion }`.

Layout (ancho máx **640px**, mismo slot que las fotos):

- Contenedor cálido: `rounded-xl ring-1 ring-ink/10`, fondo `cream`/tinte suave, padding
  generoso. `mt-5`.
- **Meta (arriba):** `source` en Outfit **uppercase**, `tracking` ancho, **terra**
  (`text-terra`), tamaño `text-xs`/`sm`.
- **Cita:** `font-display font-light text-ink`, `clamp(1.25rem, 2.4vw, 1.9rem)`,
  `leading-snug`. Comilla de apertura grande (glifo "...") en **terra** como ancla gráfica.
- **Pie (fila):** izquierda `author` (medium) + `role` (`text-ink/55`); derecha isotipo
  **E** vía `next/image` `public/isotipos/isotipo-verde.webp` (~28-32px, `aria-hidden`).
- **CTA** (si hay `link`): ancla "Leer en DeNota →"
  - `target="_blank"`, `rel="noopener noreferrer"`.
  - `<span className="sr-only">(se abre en una nueva pestaña)</span>`.
  - `onClick`/`onKeyDown` → `stopPropagation` (no cerrar la fila del acordeón).
  - Hover: subrayado animado + flecha que avanza (microinteracción).
  - `tabIndex={active ? 0 : -1}` (igual que los controles del `ImageSlider`, para no ser
    foco cuando el panel está colapsado).

### 5. Motion

- La tarjeta entra con **fade + rise suave** al abrir (`opacity`/`translateY` vía
  transición CSS keyed en `active`), mismo patrón que el fade de las fotos del acordeón.
- Hover del CTA: subrayado + nudge de flecha.
- Respetar `prefers-reduced-motion` (sin transición cuando `reduceMotion`).
- Sobrio, acorde al estándar "menos es más" del proyecto.

---

## Fuera de alcance (YAGNI)

- No se toca el `SignalMarquee` ni el copy del hero/cierre.
- No se modifican otras entradas ni el `ImageSlider`.
- No se genera ningún `.webp`/OG ni se captura denota.cl (se descartó en brainstorming).
- No se incrusta el cuerpo completo del artículo (solo cita + link a la fuente).

---

## Verificación

- **Typecheck/build OK.**
- Filtro **"Medios"** aparece y filtra correctamente la nueva entrada.
- Fila abre/cierra; la tarjeta renderiza cita, autor, isotipo y CTA.
- CTA abre denota.cl en pestaña nueva y **no** colapsa la fila al clickear.
- `prefers-reduced-motion`: sin transiciones, contenido visible.
- **Golden Paths** de `/vinculacion` siguen 200 (verificación manual, sin Playwright).
