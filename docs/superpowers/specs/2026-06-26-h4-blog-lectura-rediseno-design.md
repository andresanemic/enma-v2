# H4 — Rediseño de las páginas de lectura `/blog/[slug]`

> Mini-fase H4 del proyecto Enma web2. Diseño aprobado por el usuario el 2026-06-26.
> Objetivo: subir la página de lectura del Blog del nivel "plantilla estándar simplona"
> al estándar de calidad de la landing, con contenido editorial enriquecido.

## Contexto

- **Componente actual:** `src/components/sections/BlogArticle.tsx`
- **Datos:** `src/lib/blog.ts` (tipos `Article`, `ArticleBlock` + cuerpos de los 3 artículos)
- **Ruta:** `app/blog/[slug]/page.tsx` (server: `generateStaticParams`, `generateMetadata`, `notFound`)
- **Problema raíz:** `ArticleBlock` solo admite `{ type: "p" | "h2", text: string }` → texto
  plano, sin negritas, cursivas, links ni componentes editoriales. La lectura se siente
  plana y la tipografía de cuerpo es pequeña para una página dedicada 100% a leer.

## Restricciones (no negociables)

- Solo `Manrope` (títulos) y `Outfit` (cuerpo). **Sin mono.**
- **Sin eyebrows** numerados.
- Paleta: teal/verde como acento sobre fondo crema (`#f8eddd` / `#f7e6cf`). Cálidos
  dominantes; teal como acento de marca. No romper este acuerdo.
- **Motion nivel bajado:** se conservan el clip-wipe de portada y los `fade-up` sobrios.
  Sin blur en entradas, sin rebotes. Los nuevos bloques entran con el mismo `data-fade`
  del cuerpo, sin efecto propio nuevo.
- El `role` (socio fundador) **se mantiene** en el byline de la página de lectura
  (la H3 solo lo quitó de las listas y del hero del índice).
- Cursor nativo — no reintroducir cursor custom.
- FOUC-safe (`gsap.fromTo`, estado inicial inline), `prefers-reduced-motion` respetado.
- **No inventar datos.** Todo claim/cifra debe existir en `que-es-enma.txt` o en los
  cuerpos actuales de los artículos.

## Decisiones de diseño

### 1 · Modelo de datos (`lib/blog.ts`)

Se extiende `ArticleBlock` con spans inline y dos nuevos tipos de bloque:

```ts
// Texto inline enriquecido
type InlineSpan =
  | string                                            // texto plano (atajo)
  | { text: string; bold?: true; italic?: true }      // énfasis
  | { text: string; href: string; external?: true };  // hipervínculo

type RichText = InlineSpan[];

export type ArticleBlock =
  | { type: "p"; spans: RichText }
  | { type: "h2"; text: string }                       // h2 queda texto plano
  | { type: "quote"; text: string; cite?: string }     // PullQuote
  | { type: "fact"; value: string; label: string };    // DataFact
```

- `InlineSpan` admite `string` directo como atajo: los párrafos sin formato no se vuelven
  verbosos. Solo donde hay énfasis/link se usa el objeto.
- **Migración:** los párrafos `{ type: "p", text }` actuales pasan a
  `{ type: "p", spans: [text] }`.

### 2 · Render (`BlogArticle.tsx`)

Sub-helper `renderSpans(spans: RichText)` → JSX; el `.map()` del cuerpo cubre 4 tipos.

- **`p`** — cuerpo `text-xl` (20px), `leading-[1.8]`, `font-light text-ink/80`.
  - `bold` → `font-semibold text-ink` (sube opacidad para que el peso se note)
  - `italic` → `italic`
  - `link` → `<a>` con `underline decoration-teal/40 underline-offset-4`, hover a teal
    sólido; externos con `target="_blank" rel="noopener noreferrer"` (+ icono `↗` discreto)
- **`h2`** — se mantiene (Manrope, hairline teal arriba); crece levemente para acompañar el
  nuevo cuerpo.
- **`quote` (PullQuote)** — borde izquierdo teal grueso (4px), Manrope italic `text-2xl/3xl`,
  `text-ink/85`, padding-left generoso, **dentro** de la columna. `cite` (si existe) debajo
  en Outfit uppercase teal `text-xs`.
- **`fact` (DataFact)** — card compacta inline: fondo `#f3ddbc`, `rounded-2xl`, padding
  cómodo, `value` grande en Manrope (teal) + `label` en Outfit uppercase debajo. **No** sale
  de columna.

- **Lead (summary):** sube a `text-2xl/3xl font-light text-ink/75`.
- **Columna de cuerpo:** `68ch` → `72ch`.
- **Topic:** se retira la pill → label en Outfit uppercase, `text-xs tracking-[0.18em]
  text-teal`, encima del título, sin contenedor.

### 3 · Contenido enriquecido de los 3 artículos

Densidad: **1 PullQuote + 1 DataFact por artículo** + énfasis/links inline. Todas las
frases de PullQuote ya existen en los cuerpos; los DataFact son verificables en
`que-es-enma.txt`.

**Artículo 1 — "En Aysén pagamos la energía más cara"**
- PullQuote: *"La energía cara no se queda en la boleta. Encarece todo lo demás."* —
  cite: Bruno Ortega
- DataFact: `value: "Al norte de Puerto Montt"` ·
  `label: "VIAJAN HOY LOS RESIDUOS RECICLABLES DE AYSÉN"`
- Inline: negrita en *energía eólica, solar, geotérmica e hidráulica*; link externo en
  **ANID** → `anid.cl`; cursiva en *netbilling*

**Artículo 2 — "La Patagonia se resuelve desde la Patagonia"**
- PullQuote: *"La pertenencia territorial no es una postal turística que ponemos en la
  presentación: es conocimiento operativo."* — cite: Patricio Campos
- DataFact: `value: "CORFO · ANID"` ·
  `label: "INSTRUMENTOS PÚBLICOS QUE FORMULAMOS Y ACOMPAÑAMOS"`
- Inline: link externo en **CORFO** → `corfo.cl`; negrita en *simulaciones computacionales
  fluidodinámicas (CFD)*; cursiva en *especialista*

**Artículo 3 — "Enma explicado en fácil"**
- PullQuote: *"Ayudamos a personas, comunidades y empresas a resolver problemas de energía,
  reciclaje o calefacción con soluciones hechas a la medida."* — sin cite (Equipo Enma)
- DataFact: `value: "ENergía + MAnufactura"` · `label: "EL ORIGEN DEL NOMBRE ENMA"`
- Inline: negrita en *bajar ese costo energético*; links externos en **CORFO** y **ANID**

**Links externos (SEO):** sitios institucionales oficiales (`anid.cl`, `corfo.cl`). Render
con `target="_blank" rel="noopener noreferrer"`. URLs exactas a confirmar con el usuario
antes de cerrar.

## Componentes afectados

| Archivo | Cambio |
|---|---|
| `src/lib/blog.ts` | Extender `ArticleBlock`, migrar cuerpos `p`, añadir `quote`/`fact` e inline a los 3 artículos |
| `src/components/sections/BlogArticle.tsx` | `renderSpans`, render de 4 tipos, escala tipográfica, columna `72ch`, topic sin pill |

Sin cambios en `app/blog/[slug]/page.tsx` (la firma de `Article` no cambia hacia afuera).

## Verificación al cierre

- `tsc` typecheck limpio.
- Build de producción OK (parar dev → limpiar `.next` → build).
- Golden Paths manuales: los 3 slugs → 200, slug inválido → 404, prev/next y NavBar
  funcionando, links externos abren en pestaña nueva.
- Revisión visual humana del usuario (sin Playwright).

## Fuera de scope

- El índice `/blog` (`BlogIndex.tsx`) y la sección Blog del landing (`BlogBands.tsx`) — no
  se tocan.
- Cambios de SEO técnico globales (sitemap/metadata) → corresponden a H6.
