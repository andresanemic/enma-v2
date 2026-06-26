# H4 — Rediseño páginas de lectura del Blog — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Subir la página de lectura `/blog/[slug]` de "plantilla simplona" al estándar de la landing: rich text inline (negrita/cursiva/links), bloques editoriales (PullQuote, DataFact) y tipografía de lectura más generosa.

**Architecture:** Cambio totalmente contenido en dos archivos. `src/lib/blog.ts` define un modelo de bloques extendido (spans inline + `quote`/`fact`) y los cuerpos enriquecidos de los 3 artículos. `src/components/sections/BlogArticle.tsx` renderiza los 4 tipos de bloque y aplica la nueva escala tipográfica. Ningún otro archivo consume `ArticleBlock`/`.body`, así que `app/blog/[slug]/page.tsx`, `PrevNext.tsx`, `Metrics.tsx` y `About.tsx` quedan intactos.

**Tech Stack:** Next.js 16 (App Router) · TypeScript · Tailwind v4 · GSAP.

## Global Constraints

- Solo fuentes `Manrope` (display/títulos) y `Outfit` (body). **Sin tipografía monospace.**
- **Sin eyebrows** numerados.
- Paleta: cálidos dominantes sobre crema (`#f8eddd` / `#f7e6cf`); teal (`#205358`) como acento de marca. DataFact usa fondo `#f3ddbc`.
- **Motion nivel bajado:** conservar clip-wipe de portada + `fade-up` sobrios. Sin blur en entradas, sin rebotes. Los nuevos bloques entran con el mismo `data-fade` del cuerpo (sin efecto propio nuevo).
- FOUC-safe: `gsap.fromTo`, estado inicial `opacity:0` inline. Respetar `prefers-reduced-motion`.
- El `role` (socio fundador) **se mantiene** en el byline de la lectura.
- Cursor nativo — no reintroducir cursor custom.
- **No inventar datos:** todo claim/cifra debe existir en `que-es-enma.txt` o en los cuerpos actuales.
- **Verificación del proyecto = typecheck + build + Golden Paths manuales.** Este proyecto NO usa tests unitarios ni Playwright.
- `git push` solo cuando el usuario lo indique.
- Comandos de build (lección operativa del proyecto): parar dev → `rm -rf .next` → `npm run build`.

---

### Task 1: Modelo de datos + plumbing de render

Cambia el tipo `ArticleBlock`, migra todos los párrafos existentes de `text` a `spans`, y actualiza `BlogArticle.tsx` para renderizar los 4 tipos de bloque con la nueva tipografía. Tras esta tarea el contenido es el mismo de hoy (solo texto plano en spans de un elemento), pero con el nuevo estilo de lectura y la maquinaria lista para enriquecer.

**Files:**
- Modify: `src/lib/blog.ts` (tipos en líneas ~10-33; cuerpos de los 3 artículos)
- Modify: `src/components/sections/BlogArticle.tsx` (import línea 7, fallback línea 24, render líneas ~184-214, lead/topic/columna)

**Interfaces:**
- Produces (consumido por Tasks 2-4 y por `BlogArticle.tsx`):
  ```ts
  export type InlineSpan =
    | string
    | { text: string; bold?: true; italic?: true }
    | { text: string; href: string; external?: true };
  export type RichText = InlineSpan[];
  export type ArticleBlock =
    | { type: "p"; spans: RichText }
    | { type: "h2"; text: string }
    | { type: "quote"; text: string; cite?: string }
    | { type: "fact"; value: string; label: string };
  ```

- [ ] **Step 1: Reemplazar el tipo `ArticleBlock` en `src/lib/blog.ts`**

Reemplaza el bloque actual (líneas ~10-13):
```ts
/** Bloque de cuerpo de un artículo (se compone en la Minifase 2). */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string };
```
por:
```ts
/** Texto inline enriquecido. `string` es el atajo para texto sin formato. */
export type InlineSpan =
  | string
  | { text: string; bold?: true; italic?: true }
  | { text: string; href: string; external?: true };

export type RichText = InlineSpan[];

/** Bloque de cuerpo de un artículo. */
export type ArticleBlock =
  | { type: "p"; spans: RichText }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "fact"; value: string; label: string };
```

- [ ] **Step 2: Migrar todos los párrafos `p` de los 3 artículos a `spans`**

En `src/lib/blog.ts`, dentro de `ARTICLES`, convierte **cada** bloque `{ type: "p", text: "…" }` a `{ type: "p", spans: ["…"] }`. Los bloques `{ type: "h2", text: "…" }` **no cambian**. Ejemplo (artículo 1, primer párrafo):

Antes:
```ts
{ type: "p", text: `Vivir en la Región de Aysén significa pagar caro…` },
```
Después:
```ts
{ type: "p", spans: [`Vivir en la Región de Aysén significa pagar caro…`] },
```
Aplica esta conversión a **todos** los `type: "p"` de los 3 artículos (energia-mas-cara-aysen, patagonia-se-resuelve-desde-la-patagonia, enma-explicado-en-facil). No toques `summary`, `topic`, ni los `h2`.

- [ ] **Step 3: Actualizar import y fallback en `BlogArticle.tsx`**

Línea 7 — añade `type RichText`:
```tsx
import { formatArticleDate, type Article, type RichText } from "@/lib/blog";
```
Línea 24 — el fallback pasa a usar `spans`:
```tsx
const body = article.body ?? [{ type: "p" as const, spans: [article.summary] }];
```

- [ ] **Step 4: Añadir el helper `renderSpans` en `BlogArticle.tsx`**

Justo antes del `return (` del componente (después del `useEffect`), añade:
```tsx
  const renderSpans = (spans: RichText) =>
    spans.map((s, i) => {
      if (typeof s === "string") return <span key={i}>{s}</span>;
      if ("href" in s) {
        const ext = s.external;
        return (
          <a
            key={i}
            href={s.href}
            {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="font-medium text-teal underline decoration-teal/40 underline-offset-4 transition-colors duration-200 hover:decoration-teal"
          >
            {s.text}
            {ext && <span aria-hidden="true" className="ml-0.5 text-[0.85em]">↗</span>}
          </a>
        );
      }
      let cls = "";
      if (s.bold) cls += " font-semibold text-ink";
      if (s.italic) cls += " italic";
      return (
        <span key={i} className={cls.trim() || undefined}>
          {s.text}
        </span>
      );
    });
```

- [ ] **Step 5: Reemplazar el render del cuerpo (los 4 tipos de bloque)**

En `BlogArticle.tsx`, reemplaza el `<div className="mt-9">{body.map(...)}</div>` actual (líneas ~194-214) por:
```tsx
          <div className="mt-9">
            {body.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <div key={i} data-fade className="mt-12 first:mt-0" style={{ opacity: 0 }}>
                    <span aria-hidden="true" className="mb-3 block h-px w-10 bg-teal/60" />
                    <h2 className="m-0 font-display font-medium text-ink" style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.05rem)", lineHeight: 1.18, letterSpacing: "-0.02em" }}>
                      {block.text}
                    </h2>
                  </div>
                );
              }
              if (block.type === "quote") {
                return (
                  <figure key={i} data-fade className="mt-11 mb-2 border-l-4 border-teal pl-6 sm:pl-8" style={{ opacity: 0 }}>
                    <blockquote className="m-0 font-display font-light italic text-ink/85" style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", lineHeight: 1.3, letterSpacing: "-0.015em" }}>
                      {block.text}
                    </blockquote>
                    {block.cite && (
                      <figcaption className="mt-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                        {block.cite}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              if (block.type === "fact") {
                return (
                  <div key={i} data-fade className="my-10 rounded-2xl bg-[#f3ddbc] px-7 py-6 ring-1 ring-ink/8" style={{ opacity: 0 }}>
                    <p className="m-0 font-display font-medium text-teal" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.2rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                      {block.value}
                    </p>
                    <p className="mt-2 font-body text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
                      {block.label}
                    </p>
                  </div>
                );
              }
              return (
                <p key={i} data-fade className="mt-6 font-body text-xl font-light text-ink/80 first:mt-0" style={{ opacity: 0, lineHeight: 1.8 }}>
                  {renderSpans(block.spans)}
                </p>
              );
            })}
          </div>
```

- [ ] **Step 6: Subir la escala del lead y ampliar la columna**

Lead (línea ~186) — sube a `text-2xl`/`sm:text-3xl`:
```tsx
          <p data-fade className="m-0 font-body text-2xl font-light leading-relaxed text-ink/75 sm:text-3xl" style={{ opacity: 0 }}>
            {article.summary}
          </p>
```
Columna del cuerpo (línea ~184) — `max-w-[68ch]` → `max-w-[72ch]`:
```tsx
        <div data-reveal="body" className="mx-auto max-w-[72ch] px-6 pb-20 pt-12 sm:px-8 md:pb-24 md:pt-16">
```

- [ ] **Step 7: Quitar la pill del topic → label limpio (sin contenedor)**

Reemplaza el bloque del topic en el Hero (líneas ~122-127) por:
```tsx
          {/* Topic — label limpio (sin pill, sin eyebrow numerado) */}
          <p data-fade className="mb-5 font-body text-xs font-semibold uppercase tracking-[0.18em] text-teal" style={{ opacity: 0 }}>
            {article.topic}
          </p>
```

- [ ] **Step 8: Typecheck**

Run: `cd "C:/proyectos/enma/web2" && npx tsc --noEmit`
Expected: sin errores. (Si aparece un error de `block.text` en un `p`, falta migrar algún párrafo a `spans` en el Step 2.)

- [ ] **Step 9: Commit**

```bash
cd "C:/proyectos/enma/web2"
git add src/lib/blog.ts src/components/sections/BlogArticle.tsx
git commit -m "feat(h4): modelo rich-text + render de lectura del Blog

ArticleBlock con spans inline + tipos quote/fact; BlogArticle renderiza
los 4 tipos, cuerpo text-xl/72ch, lead mayor y topic sin pill.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Enriquecer Artículo 1 — "En Aysén pagamos la energía más cara"

**Files:**
- Modify: `src/lib/blog.ts` (body del artículo `energia-mas-cara-aysen`)

**Interfaces:**
- Consumes: tipos `InlineSpan`/`RichText`/`ArticleBlock` de Task 1.

- [ ] **Step 1: Añadir énfasis inline y link externo**

En el `body` de `energia-mas-cara-aysen`:

a) Párrafo que empieza "Durante años se habló…" → en la frase "Al año 2026 la energía eólica, solar, geotérmica e hidráulica son tecnologías probadas", parte el span para poner en negrita la enumeración:
```ts
{ type: "p", spans: [
  `Durante años se habló de energías renovables «no convencionales». Ese apellido ya sobra. Al año 2026 la `,
  { text: `energía eólica, solar, geotérmica e hidráulica`, bold: true },
  ` son tecnologías probadas, con décadas de operación en el mundo. Lo digo desde la experiencia de haber trabajado en proyectos de cada una de ellas: sabemos qué funciona, qué tiene más riesgo y cómo evaluar ese riesgo antes de invertir un peso.`,
] },
```

b) Párrafo "Para un hogar o una empresa de Aysén…" → cursiva en *netbilling*:
```ts
{ type: "p", spans: [
  `Para un hogar o una empresa de Aysén, esto se traduce en algo muy concreto: autogenerar parte de su energía y, cuando hay red disponible, inyectar el excedente para bajar la cuenta de luz mediante `,
  { text: `netbilling`, italic: true },
  `. No es ciencia ficción; es ingeniería aplicada al territorio.`,
] },
```

c) Párrafo "En esa línea estamos desarrollando…" → link externo en "Agencia Nacional de Investigación y Desarrollo (ANID)":
```ts
{ type: "p", spans: [
  `En esa línea estamos desarrollando, con financiamiento de la `,
  { text: `Agencia Nacional de Investigación y Desarrollo (ANID)`, href: `https://anid.cl`, external: true },
  `, una turbina eólica de baja escala con un diseño resiliente a condiciones que aquí son la norma: vientos excesivos, ráfagas que pasan de la calma a la furia en segundos y turbulencia que cambia de dirección. Son máquinas de baja potencia pensadas para instalarse de a muchas, en granjas, ideales para campos, electrificación rural y también para la industria.`,
] },
```

- [ ] **Step 2: Insertar PullQuote tras el 2º párrafo**

Justo después del párrafo que termina en "Perdemos la oportunidad, el empleo y el círculo virtuoso completo." (el 2º `p`, sobre la boleta/reciclaje), inserta:
```ts
{ type: "quote", text: `La energía cara no se queda en la boleta. Encarece todo lo demás.`, cite: `Bruno Ortega` },
```

- [ ] **Step 3: Insertar DataFact antes del h2 "Una turbina pensada…"**

Justo antes del bloque `{ type: "h2", text: "Una turbina pensada para el viento patagónico" }`, inserta:
```ts
{ type: "fact", value: `Al norte de Puerto Montt`, label: `VIAJAN HOY LOS RESIDUOS RECICLABLES DE AYSÉN` },
```

- [ ] **Step 4: Typecheck**

Run: `cd "C:/proyectos/enma/web2" && npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 5: Commit**

```bash
cd "C:/proyectos/enma/web2"
git add src/lib/blog.ts
git commit -m "feat(h4): enriquece artículo 'energía más cara' (cita, dato, links)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: Enriquecer Artículo 2 — "La Patagonia se resuelve desde la Patagonia"

**Files:**
- Modify: `src/lib/blog.ts` (body del artículo `patagonia-se-resuelve-desde-la-patagonia`)

**Interfaces:**
- Consumes: tipos de Task 1.

- [ ] **Step 1: Añadir énfasis inline y link externo**

a) Párrafo "Trabajamos principalmente en consultoría…" → link externo en "CORFO" y negrita en "simulaciones computacionales fluidodinámicas (CFD)":
```ts
{ type: "p", spans: [
  `Trabajamos principalmente en consultoría, formulación y acompañamiento de proyectos para instrumentos públicos como `,
  { text: `CORFO`, href: `https://www.corfo.cl`, external: true },
  `, ANID y los Gobiernos Regionales, con foco energético o ambiental. A eso sumamos dos servicios que veo con enorme potencial: las `,
  { text: `simulaciones computacionales fluidodinámicas (CFD)`, bold: true },
  ` para optimizar el diseño de sistemas que interactúan con fluidos, y la cuantificación de huella de carbono para empresas y municipalidades.`,
] },
```

b) Párrafo "No me gusta la palabra experto…" → cursiva en *especialista*:
```ts
{ type: "p", spans: [
  `No me gusta la palabra experto; prefiero `,
  { text: `especialista`, italic: true },
  `. Un socio tecnológico estratégico al que recurres porque sabe lo que hace y porque está donde tú estás.`,
] },
```

- [ ] **Step 2: Insertar PullQuote tras el párrafo de "Pertenencia"**

Justo después del párrafo que termina en "...el día que nos expandamos a otros mercados igualmente desafiantes." (bajo el h2 "Pertenencia como ventaja competitiva"), inserta:
```ts
{ type: "quote", text: `La pertenencia territorial no es una postal turística que ponemos en la presentación: es conocimiento operativo.`, cite: `Patricio Campos` },
```

- [ ] **Step 3: Insertar DataFact tras el párrafo que menciona CORFO/ANID**

Justo después del párrafo "Trabajamos principalmente en consultoría…" (el que editaste en Step 1a), inserta:
```ts
{ type: "fact", value: `CORFO · ANID`, label: `INSTRUMENTOS PÚBLICOS QUE FORMULAMOS Y ACOMPAÑAMOS` },
```

- [ ] **Step 4: Typecheck**

Run: `cd "C:/proyectos/enma/web2" && npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 5: Commit**

```bash
cd "C:/proyectos/enma/web2"
git add src/lib/blog.ts
git commit -m "feat(h4): enriquece artículo 'Patagonia' (cita, dato, links)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: Enriquecer Artículo 3 — "Enma explicado en fácil"

**Files:**
- Modify: `src/lib/blog.ts` (body del artículo `enma-explicado-en-facil`)

**Interfaces:**
- Consumes: tipos de Task 1.

- [ ] **Step 1: Añadir énfasis inline y links externos**

a) Párrafo "En Aysén la energía es cara…" → negrita en "bajar ese costo energético":
```ts
{ type: "p", spans: [
  `En Aysén la energía es cara, porque la región está aislada y todo cuesta más caro de traer. Eso golpea a las familias en la boleta de la luz y vuelve difícil que muchas industrias funcionen. Enma trabaja, ante todo, para `,
  { text: `bajar ese costo energético`, bold: true },
  `, porque cuando la energía es más barata aumenta la productividad y aparecen nuevas oportunidades.`,
] },
```

b) Párrafo "Enma acompaña proyectos de principio a fin…" → links externos en "CORFO" y "ANID":
```ts
{ type: "p", spans: [
  `Enma acompaña proyectos de principio a fin. Lo más importante es la consultoría y los estudios de soluciones energéticas, que abren la puerta a todo lo demás. También formula y acompaña proyectos para postular a fondos públicos (como `,
  { text: `CORFO`, href: `https://www.corfo.cl`, external: true },
  ` o `,
  { text: `ANID`, href: `https://anid.cl`, external: true },
  `), realiza simulaciones por computador para optimizar diseños (CFD), mide la huella de carbono de empresas y municipios, y ejecuta y mantiene proyectos junto a una red de socios. A eso suma charlas y difusión sobre energía y medioambiente.`,
] },
```

- [ ] **Step 2: Insertar PullQuote tras el 1er párrafo**

Justo después del párrafo "Enma es una empresa chilena nacida en la Región de Aysén…" (1er `p`), inserta (sin `cite`, es Equipo Enma):
```ts
{ type: "quote", text: `Ayudamos a personas, comunidades y empresas a resolver problemas de energía, reciclaje o calefacción con soluciones hechas a la medida.` },
```

- [ ] **Step 3: Insertar DataFact tras el párrafo "bajar ese costo energético"**

Justo después del párrafo que editaste en Step 1a (bajo el h2 "¿Qué problema resuelve?"), inserta:
```ts
{ type: "fact", value: `ENergía + MAnufactura`, label: `EL ORIGEN DEL NOMBRE ENMA` },
```

- [ ] **Step 4: Typecheck**

Run: `cd "C:/proyectos/enma/web2" && npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 5: Commit**

```bash
cd "C:/proyectos/enma/web2"
git add src/lib/blog.ts
git commit -m "feat(h4): enriquece artículo 'Enma en fácil' (cita, dato, links)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Verificación final + cierre de la mini-fase

**Files:**
- Modify: `C:/proyectos/enma/web2/CLAUDE.md` (marcar H4 completa)

- [ ] **Step 1: Build de producción limpio**

```bash
cd "C:/proyectos/enma/web2"
rm -rf .next
npm run build
```
Expected: build OK, las 3 rutas `/blog/[slug]` se generan (SSG vía `generateStaticParams`).

- [ ] **Step 2: Golden Paths manuales (revisión humana, sin Playwright)**

Levantar `npm run dev` y verificar con el usuario:
- `/blog/energia-mas-cara-aysen`, `/blog/patagonia-se-resuelve-desde-la-patagonia`, `/blog/enma-explicado-en-facil` → 200, cada una con su PullQuote, DataFact, negritas, cursivas y links.
- Links externos (ANID, CORFO) abren en pestaña nueva (`target="_blank"`).
- Slug inválido (`/blog/no-existe`) → 404.
- Prev/Next y NavBar funcionando; `/blog` (índice) intacto.
- Lectura cómoda (cuerpo `text-xl`, columna `72ch`), topic sin pill, sin mono, motion sobrio.
- Comprobar `prefers-reduced-motion` (estado final visible, sin animación).

- [ ] **Step 3: Marcar H4 como completa en CLAUDE.md**

En `C:/proyectos/enma/web2/CLAUDE.md`, cambia:
```
  - [ ] **H4** — Rediseño páginas de lectura `/blog/[slug]` (brainstorming previo obligatorio)
```
por:
```
  - [x] **H4** — Rediseño páginas de lectura `/blog/[slug]`: rich text inline (negrita/cursiva/links), PullQuote + DataFact, cuerpo text-xl/72ch, topic sin pill
```

- [ ] **Step 4: Commit de cierre**

```bash
cd "C:/proyectos/enma/web2"
git add CLAUDE.md
git commit -m "chore(h4): marca H4 (lectura del Blog) como completa

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Modelo rich-text inline (spans) → Task 1 Steps 1-2. ✅
- PullQuote + DataFact (tipos + render) → Task 1 Steps 1, 5. ✅
- Tipografía `text-xl` / columna `72ch` / lead mayor → Task 1 Steps 5-6. ✅
- Topic sin pill → Task 1 Step 7. ✅
- Links externos `rel="noopener noreferrer"` + SEO → Task 1 Step 4 (helper); Tasks 2-4 (datos). ✅
- Contenido enriquecido de los 3 artículos (citas/datos/inline verificados) → Tasks 2, 3, 4. ✅ (DataFact art.2 = "CORFO · ANID", sin GORE, según ajuste del usuario).
- Motion bajado, FOUC-safe, reduce-motion → respetado en Task 1 Step 5 (nuevos bloques con `data-fade`, sin efecto propio) + Task 5 Step 2. ✅
- `role` se mantiene en byline → no se toca el byline. ✅
- Verificación typecheck + build + Golden Paths → Tasks 1-4 (typecheck) + Task 5. ✅

**Placeholder scan:** Sin TBD/TODO/"handle edge cases". Todo el código está completo. ✅

**Type consistency:** `InlineSpan`/`RichText`/`ArticleBlock` definidos en Task 1 y consumidos verbatim en `renderSpans` y en Tasks 2-4. `quote` usa `text`+`cite?`; `fact` usa `value`+`label`; `p` usa `spans`. Coherente en todos los pasos. ✅
