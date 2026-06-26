# H7 — Optimización SEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dejar `web2` optimizado para SEO y GEO/AEO (robots, sitemap, metadata completa, OG images branded, JSON-LD) y dejar la documentación/placeholders listos para la indexación rápida en Google Search Console de la Fase I, todo con APIs nativas de Next.js compatibles con el export estático de H8.

**Architecture:** Constantes y helpers SEO centralizados en `src/lib/seo.ts` (única fuente de verdad de datos de marca, metadata por página y builders de JSON-LD). Archivos de metadata nativos de Next App Router (`robots.ts`, `sitemap.ts`, `opengraph-image.tsx`) generados en build. JSON-LD inyectado vía un componente server `JsonLd`. El plugin `claude-seo` se corre al final como auditor (lo instala el usuario).

**Tech Stack:** Next.js 16.2.9 (App Router), TypeScript, `next/og` (`ImageResponse`), Tailwind v4. Sin tests unitarios ni Playwright (regla del proyecto): la verificación de cada tarea es `npx tsc --noEmit` + `npm run build` (revisar lista de rutas) + grep, y Golden Paths manuales al cierre.

## Global Constraints

- **Dominio:** `https://enmachile.com` (ya en `metadataBase`).
- **Datos de marca reales (no inventar):** Enma SPA · fundada 2022, Puerto Cisnes/Región de Aysén · fundadores Bruno Ortega y Patricio Campos · email `contacto@enmachile.com` · WhatsApp `+56 9 9337 7935` (E.164 `+56993377935`, wa.me `56993377935`) · ubicación Footer Coyhaique, Región de Aysén, Chile · **sin redes sociales** (sin `sameAs`).
- **Copy:** alineado a `docs/que-es-enma.txt`; sin claims/métricas/clientes nuevos.
- **No tocar** layout/visual/motion de secciones existentes. Sin Playwright.
- **`git push` solo cuando el usuario lo indique** (commits locales OK).
- **No activar** `images:{ unoptimized:true }` (eso es H8); solo dejarlo anotado.
- **Sin eyebrows ni tipografía mono** en páginas (regla del proyecto); no aplica a la composición interna de una OG image.
- Mensaje WhatsApp pre-cargado: `"Hola Enma 👋 Vengo desde su sitio web y me gustaría conversar sobre un proyecto."`

---

## File Structure

```
src/lib/seo.ts                                 (nuevo — constantes + pageMetadata() + builders JSON-LD)
src/lib/og.tsx                                 (nuevo — renderOgImage(): plantilla ImageResponse compartida)
src/components/seo/JsonLd.tsx                  (nuevo — <script type=application/ld+json>)
src/app/robots.ts                              (nuevo)
src/app/sitemap.ts                             (nuevo)
src/app/opengraph-image.tsx                    (nuevo — OG default del sitio)
src/app/blog/[slug]/opengraph-image.tsx        (nuevo)
src/app/proyectos/[slug]/opengraph-image.tsx   (nuevo)
src/app/layout.tsx                             (editar — OG/twitter/verification + JSON-LD sitio)
src/app/page.tsx                               (editar — metadata propia + canonical)
src/app/nosotros/page.tsx                      (editar — pageMetadata + breadcrumb)
src/app/vinculacion/page.tsx                   (editar — pageMetadata + breadcrumb)
src/app/proyectos/page.tsx                     (editar — pageMetadata + breadcrumb)
src/app/blog/page.tsx                          (editar — pageMetadata + breadcrumb)
src/app/blog/[slug]/page.tsx                   (editar — pageMetadata + Article + breadcrumb JSON-LD)
src/app/proyectos/[slug]/page.tsx              (editar — pageMetadata + breadcrumb JSON-LD)
src/components/sections/Hero.tsx               (editar — usar WHATSAPP_URL de lib/seo)
src/components/layout/Footer.tsx               (editar — usar WHATSAPP_URL/DISPLAY de lib/seo)
docs/seo/google-search-console.md              (nuevo)
docs/seo/geo-aeo-notas.md                      (nuevo)
public/og/og-default.png                       (solo si se activa el fallback estático — ver Task 7)
```

---

## Task 1: Constantes y helpers SEO (`lib/seo.ts`) + DRY del WhatsApp

**Files:**
- Create: `src/lib/seo.ts`
- Modify: `src/components/sections/Hero.tsx` (consts WhatsApp añadidas en pre-spec → reemplazar por import)
- Modify: `src/components/layout/Footer.tsx` (idem + label)

**Interfaces:**
- Produces: `SITE_URL`, `SITE_NAME`, `LEGAL_NAME`, `DEFAULT_TITLE`, `DEFAULT_DESCRIPTION`, `CONTACT_EMAIL`, `WHATSAPP_NUMBER`, `WHATSAPP_DISPLAY`, `WHATSAPP_MESSAGE`, `WHATSAPP_URL`, `TELEPHONE`, `LOCALITY`, `REGION`, `COUNTRY`, `FOUNDERS`, `FOUNDING_DATE`, `LOGO_PATH`; `absoluteUrl(path)`, `pageMetadata({...})`, `organizationJsonLd()`, `websiteJsonLd()`, `articleJsonLd(article)`, `breadcrumbJsonLd(items)`.

- [ ] **Step 1: Crear `src/lib/seo.ts`**

```ts
import type { Metadata } from "next";
import type { Article } from "@/lib/blog";

// ── Datos de marca (fuente: docs/que-es-enma.txt + Footer) ──────────────────
export const SITE_URL = "https://enmachile.com";
export const SITE_NAME = "Enma";
export const LEGAL_NAME = "Enma SPA";
export const DEFAULT_TITLE =
  "Enma — Energía y manufactura sustentable desde la Patagonia";
export const DEFAULT_DESCRIPTION =
  "Empresa chilena de base científico-tecnológica en energía y manufactura sustentable. Consultoría, simulaciones CFD y proyectos de energías renovables desde la Región de Aysén.";

export const CONTACT_EMAIL = "contacto@enmachile.com";
export const WHATSAPP_NUMBER = "56993377935";
export const WHATSAPP_DISPLAY = "+56 9 9337 7935";
export const TELEPHONE = "+56993377935";
export const WHATSAPP_MESSAGE =
  "Hola Enma 👋 Vengo desde su sitio web y me gustaría conversar sobre un proyecto.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

export const LOCALITY = "Coyhaique";
export const REGION = "Región de Aysén";
export const COUNTRY = "CL";
export const FOUNDERS = ["Bruno Ortega", "Patricio Campos"];
export const FOUNDING_DATE = "2022";
export const LOGO_PATH = "/logos/logo-verde.webp";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

// ── Metadata por página (consistencia OG/twitter/canonical) ─────────────────
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const { title, description, path, type = "website" } = opts;
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "es_CL",
      siteName: SITE_NAME,
      url,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

// ── Builders JSON-LD (datos propios y controlados) ──────────────────────────
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    logo: absoluteUrl(LOGO_PATH),
    email: CONTACT_EMAIL,
    telephone: TELEPHONE,
    foundingDate: FOUNDING_DATE,
    founder: FOUNDERS.map((name) => ({ "@type": "Person", name })),
    areaServed: { "@type": "AdministrativeArea", name: REGION },
    address: {
      "@type": "PostalAddress",
      addressLocality: LOCALITY,
      addressRegion: REGION,
      addressCountry: COUNTRY,
    },
    description: DEFAULT_DESCRIPTION,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "es-CL",
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function articleJsonLd(article: Article) {
  const url = absoluteUrl(`/blog/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    image: absoluteUrl(article.cover),
    datePublished: article.date,
    dateModified: article.date,
    articleSection: article.topic,
    inLanguage: "es-CL",
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl(LOGO_PATH) },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
```

- [ ] **Step 2: Refactor `src/components/layout/Footer.tsx`**

Reemplazar el bloque de consts WhatsApp (añadido en pre-spec) por el import. Quitar:
```ts
const WHATSAPP_NUMBER = "56993377935";
const WHATSAPP_MESSAGE =
  "Hola Enma 👋 Vengo desde su sitio web y me gustaría conversar sobre un proyecto.";
const WHATSAPP = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
```
y añadir junto a los otros imports:
```ts
import { WHATSAPP_URL, WHATSAPP_DISPLAY } from "@/lib/seo";
```
Reemplazar usos: `WHATSAPP` → `WHATSAPP_URL`. En `NAV_CONTACT`, la fila WhatsApp queda:
```ts
  { href: WHATSAPP_URL, label: WHATSAPP_DISPLAY, external: true },
```
(verificar que la referencia `href={WHATSAPP}` del botón pase a `href={WHATSAPP_URL}`).

- [ ] **Step 3: Refactor `src/components/sections/Hero.tsx`**

Quitar el bloque de consts WhatsApp (añadido en pre-spec) y añadir el import:
```ts
import { WHATSAPP_URL } from "@/lib/seo";
```
Reemplazar `href={WHATSAPP}` por `href={WHATSAPP_URL}`.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0, sin errores.

- [ ] **Step 5: Verificar que no queda el número viejo ni consts duplicadas**

Run: `grep -rn "7835\|wa.me/5699" src/`
Expected: 0 resultados (todo pasa por `WHATSAPP_URL`).

- [ ] **Step 6: Commit** (incluye la corrección de teléfono + mensaje pre-cargado, fundida en H7)

```bash
git add src/lib/seo.ts src/components/layout/Footer.tsx src/components/sections/Hero.tsx
git commit -m "feat(h7): consts/helpers SEO en lib/seo.ts + WhatsApp DRY (nº +56 9 9337 7935 + mensaje template)"
```

---

## Task 2: `robots.txt` (`app/robots.ts`)

**Files:**
- Create: `src/app/robots.ts`

**Interfaces:**
- Consumes: `SITE_URL`, `absoluteUrl` de `@/lib/seo`.

- [ ] **Step 1: Crear `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { SITE_URL, absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: SITE_URL,
  };
}
```

- [ ] **Step 2: Build y verificar la ruta**

Run: `npm run build 2>&1 | grep -E "robots|sitemap"`
Expected: la lista de rutas del build incluye `/robots.txt` (y, tras Task 3, `/sitemap.xml`).

- [ ] **Step 3: Commit**

```bash
git add src/app/robots.ts
git commit -m "feat(h7): robots.txt vía app/robots.ts (allow all + sitemap + host)"
```

---

## Task 3: `sitemap.xml` (`app/sitemap.ts`)

**Files:**
- Create: `src/app/sitemap.ts`

**Interfaces:**
- Consumes: `absoluteUrl` de `@/lib/seo`; `ARTICLES` de `@/lib/blog`; `PROYECTOS` de `@/lib/proyectos`.

- [ ] **Step 1: Crear `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { ARTICLES } from "@/lib/blog";
import { PROYECTOS } from "@/lib/proyectos";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/nosotros"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/proyectos"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/vinculacion"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: absoluteUrl(`/blog/${a.slug}`),
    lastModified: new Date(a.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const proyectoRoutes: MetadataRoute.Sitemap = PROYECTOS.map((p) => ({
    url: absoluteUrl(`/proyectos/${p.slug}`),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes, ...proyectoRoutes];
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Build y verificar contenido del sitemap**

Run: `npm run build 2>&1 | grep -E "sitemap"`
Expected: `/sitemap.xml` aparece en la lista de rutas.
(Verificación de contenido completa = manual tras `npm run dev` → abrir `/sitemap.xml` y confirmar que están las 5 rutas estáticas + 3 artículos + 1 proyecto.)

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(h7): sitemap.xml dinámico (rutas estáticas + blog + proyectos)"
```

---

## Task 4: Componente `JsonLd` + metadata global y JSON-LD del sitio (`layout.tsx`)

**Files:**
- Create: `src/components/seo/JsonLd.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: `<JsonLd data={...} />` (default export).
- Consumes: `DEFAULT_TITLE`, `DEFAULT_DESCRIPTION`, `SITE_NAME`, `SITE_URL`, `organizationJsonLd`, `websiteJsonLd` de `@/lib/seo`.

- [ ] **Step 1: Crear `src/components/seo/JsonLd.tsx`**

```tsx
// Inyecta datos estructurados JSON-LD. `data` es siempre contenido propio y
// controlado (no entrada de usuario); se escapa "<" por seguridad defensiva.
export default function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
```

- [ ] **Step 2: Editar `src/app/layout.tsx` — ampliar `metadata`**

Añadir imports:
```ts
import JsonLd from "@/components/seo/JsonLd";
import {
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  organizationJsonLd,
  websiteJsonLd,
} from "@/lib/seo";
```
Reemplazar el objeto `metadata` por (mantiene `metadataBase`, `title`, `description` actuales y suma OG/twitter/verification/canonical base):
```ts
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s · Enma",
  },
  description: DEFAULT_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CL",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  verification: { google: "REEMPLAZAR_EN_FASE_I" },
};
```
> Nota: NO se setea `openGraph.images` aquí. La convención de archivo `opengraph-image.tsx` (Task 6/7) inyecta `og:image`/`twitter:image` automáticamente.

- [ ] **Step 3: Editar `src/app/layout.tsx` — JSON-LD del sitio en `<body>`**

Dentro de `<body>`, antes de `{children}`:
```tsx
      <body>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        {children}
      </body>
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add src/components/seo/JsonLd.tsx src/app/layout.tsx
git commit -m "feat(h7): metadata global OG/twitter/verification + JSON-LD Organization/WebSite"
```

---

## Task 5: Metadata de la Home (`app/page.tsx`)

**Files:**
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `pageMetadata`, `DEFAULT_TITLE`, `DEFAULT_DESCRIPTION` de `@/lib/seo`.

- [ ] **Step 1: Editar `src/app/page.tsx`**

Añadir al inicio (la Home es server component, puede exportar `metadata`):
```ts
import type { Metadata } from "next";
import { pageMetadata, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({ title: DEFAULT_TITLE, description: DEFAULT_DESCRIPTION, path: "/" }),
  // La Home usa el title por defecto (sin plantilla "· Enma" duplicada):
  title: DEFAULT_TITLE,
};
```
> `pageMetadata` pone `alternates.canonical:"/"`, OG y twitter propios de la Home. Se sobreescribe `title` para no aplicar la plantilla (quedaría "Enma — … · Enma").

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(h7): metadata propia + canonical en la Home"
```

---

## Task 6: Metadata + breadcrumbs en páginas internas estáticas

**Files:**
- Modify: `src/app/nosotros/page.tsx`
- Modify: `src/app/vinculacion/page.tsx`
- Modify: `src/app/proyectos/page.tsx`
- Modify: `src/app/blog/page.tsx`

**Interfaces:**
- Consumes: `pageMetadata`, `breadcrumbJsonLd` de `@/lib/seo`; `JsonLd`.

Patrón por archivo (cada uno conserva su `title`/`description` actuales como argumentos):

- [ ] **Step 1: `nosotros/page.tsx`**

Reemplazar el `export const metadata` actual por:
```ts
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = pageMetadata({
  title: "Nosotros",
  description: /* MISMA description que ya tiene el archivo */ "",
  path: "/nosotros",
});
```
(copiar el texto exacto de `description` que ya está en el archivo). Y en el JSX, justo dentro del fragmento de retorno, añadir:
```tsx
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Nosotros", path: "/nosotros" },
        ])}
      />
```

- [ ] **Step 2: `vinculacion/page.tsx`** — igual, con:
```ts
export const metadata = pageMetadata({
  title: "Vinculación",
  description: /* la actual del archivo */ "",
  path: "/vinculacion",
});
```
Breadcrumb: `{ name: "Inicio", path: "/" }, { name: "Vinculación", path: "/vinculacion" }`.

- [ ] **Step 3: `proyectos/page.tsx`** — igual, con:
```ts
export const metadata = pageMetadata({
  title: "Proyectos",
  description: /* la actual del archivo */ "",
  path: "/proyectos",
});
```
Breadcrumb: `{ name: "Inicio", path: "/" }, { name: "Proyectos", path: "/proyectos" }`.

- [ ] **Step 4: `blog/page.tsx`** — igual, con:
```ts
export const metadata = pageMetadata({
  title: "Blog",
  description: /* la actual del archivo */ "",
  path: "/blog",
});
```
Breadcrumb: `{ name: "Inicio", path: "/" }, { name: "Blog", path: "/blog" }`.

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/app/nosotros/page.tsx src/app/vinculacion/page.tsx src/app/proyectos/page.tsx src/app/blog/page.tsx
git commit -m "feat(h7): canonical/OG + BreadcrumbList en páginas internas"
```

---

## Task 7: Plantilla OG compartida (`lib/og.tsx`) + OG default del sitio

**Files:**
- Create: `src/lib/og.tsx`
- Create: `src/app/opengraph-image.tsx`
- (Fallback) Create: `public/og/og-default.png` — solo si `ImageResponse` rompe el build (ver Step 4).

**Interfaces:**
- Produces: `renderOgImage(opts: { title: string; kicker?: string }): Promise<ImageResponse>`; `OG_SIZE = { width: 1200, height: 630 }`; `OG_CONTENT_TYPE = "image/png"`.

- [ ] **Step 1: Crear `src/lib/og.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Paleta cálida Enma + acento teal.
const BG = "#f8eddd";
const INK = "#1f2a26";
const TEAL = "#205358";
const TERRA = "#b12c00";

// Manrope estática (Fontsource CDN). Si la red falla en build, se omite la
// fuente y ImageResponse usa la default (el build NO se cae).
async function loadFont(
  weight: "400" | "700",
): Promise<{ name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" } | null> {
  try {
    const url = `https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/latin-${weight}-normal.ttf`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return {
      name: "Manrope",
      data: await res.arrayBuffer(),
      weight: weight === "700" ? 700 : 400,
      style: "normal",
    };
  } catch {
    return null;
  }
}

export async function renderOgImage(opts: { title: string; kicker?: string }) {
  const { title, kicker = "Enma" } = opts;
  const fonts = (await Promise.all([loadFont("700"), loadFont("400")])).filter(
    (f): f is NonNullable<typeof f> => f !== null,
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "72px 80px",
          fontFamily: "Manrope, sans-serif",
          color: INK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 56,
              background: TEAL,
              borderRadius: 4,
            }}
          />
          <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: 1 }}>
            enma
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: TERRA,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginLeft: 8,
            }}
          >
            {kicker}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", fontSize: 26, fontWeight: 400, color: TEAL }}>
          Energía y manufactura sustentable · Región de Aysén, Patagonia
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
```

- [ ] **Step 2: Crear `src/app/opengraph-image.tsx`**

```tsx
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { DEFAULT_DESCRIPTION } from "@/lib/seo";

export const alt = DEFAULT_DESCRIPTION;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    title: "Energía y manufactura sustentable desde la Patagonia",
    kicker: "Enma",
  });
}
```

- [ ] **Step 3: Build y verificar la ruta OG**

Run: `npm run build 2>&1 | grep -iE "opengraph|error"`
Expected: aparece `/opengraph-image` en la lista de rutas, sin errores.

- [ ] **Step 4: Plan B si el build falla por `ImageResponse`**

Si Step 3 falla (incompatibilidad de `next/og` con el build): 
1. Borrar `src/app/opengraph-image.tsx` y los OG dinámicos del Task 8.
2. Crear `public/og/og-default.png` (1200×630, de marca; se puede exportar una vez con `renderOgImage` en dev y guardar el PNG, o generar una imagen branded estática).
3. En `layout.tsx` `metadata`, añadir `openGraph.images: ["/og/og-default.png"]` y `twitter.images: ["/og/og-default.png"]`.
4. Documentar el cambio en el commit. La fase NO se bloquea.

- [ ] **Step 5: Commit**

```bash
git add src/lib/og.tsx src/app/opengraph-image.tsx
git commit -m "feat(h7): OG image branded del sitio (next/og, plantilla compartida)"
```

---

## Task 8: OG images dinámicas (Blog y Proyectos)

**Files:**
- Create: `src/app/blog/[slug]/opengraph-image.tsx`
- Create: `src/app/proyectos/[slug]/opengraph-image.tsx`

**Interfaces:**
- Consumes: `renderOgImage`, `OG_SIZE`, `OG_CONTENT_TYPE` de `@/lib/og`; `ARTICLES`/`getArticle` de `@/lib/blog`; `PROYECTOS`/`getProyecto` de `@/lib/proyectos`.

- [ ] **Step 1: Crear `src/app/blog/[slug]/opengraph-image.tsx`**

```tsx
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { ARTICLES, getArticle } from "@/lib/blog";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Artículo del blog de Enma";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  return renderOgImage({
    title: article?.title ?? "Blog de Enma",
    kicker: article?.topic ?? "Blog",
  });
}
```

- [ ] **Step 2: Crear `src/app/proyectos/[slug]/opengraph-image.tsx`**

```tsx
import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { PROYECTOS, getProyecto } from "@/lib/proyectos";

export function generateStaticParams() {
  return PROYECTOS.map((p) => ({ slug: p.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Proyecto de Enma";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proyecto = getProyecto(slug);
  return renderOgImage({
    title: proyecto?.title ?? "Proyectos de Enma",
    kicker: "Proyecto",
  });
}
```

- [ ] **Step 3: Build y verificar**

Run: `npm run build 2>&1 | grep -iE "opengraph|error"`
Expected: rutas OG por slug presentes, sin errores.
(Si se activó el Plan B del Task 7, omitir este task.)

- [ ] **Step 4: Commit**

```bash
git add src/app/blog/[slug]/opengraph-image.tsx src/app/proyectos/[slug]/opengraph-image.tsx
git commit -m "feat(h7): OG images dinámicas por artículo y por proyecto"
```

---

## Task 9: Metadata + JSON-LD en rutas dinámicas (`blog/[slug]`, `proyectos/[slug]`)

**Files:**
- Modify: `src/app/blog/[slug]/page.tsx`
- Modify: `src/app/proyectos/[slug]/page.tsx`

**Interfaces:**
- Consumes: `pageMetadata`, `articleJsonLd`, `breadcrumbJsonLd` de `@/lib/seo`; `JsonLd`.

- [ ] **Step 1: Editar `src/app/blog/[slug]/page.tsx` — `generateMetadata`**

Reemplazar el cuerpo de `generateMetadata` (mantiene firma actual):
```ts
import { pageMetadata, articleJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
// ...
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return pageMetadata({
    title: article.title,
    description: article.summary,
    path: `/blog/${slug}`,
    type: "article",
  });
}
```

- [ ] **Step 2: Editar el JSX de `blog/[slug]/page.tsx` — JSON-LD**

Dentro del fragmento de retorno (después de `<NavBar />` o antes de `<main>`), añadir:
```tsx
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: article.title, path: `/blog/${slug}` },
        ])}
      />
```
(`article` y `slug` ya están en scope tras el `notFound()` guard.)

- [ ] **Step 3: Editar `src/app/proyectos/[slug]/page.tsx` — `generateMetadata`**

```ts
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
// ...
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const proyecto = getProyecto(slug);
  if (!proyecto) return {};
  return pageMetadata({
    title: proyecto.title,
    description: proyecto.lead,
    path: `/proyectos/${slug}`,
  });
}
```

- [ ] **Step 4: Editar el JSX de `proyectos/[slug]/page.tsx` — breadcrumb**

```tsx
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Proyectos", path: "/proyectos" },
          { name: proyecto.title, path: `/proyectos/${slug}` },
        ])}
      />
```

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/app/blog/[slug]/page.tsx src/app/proyectos/[slug]/page.tsx
git commit -m "feat(h7): OG/canonical + Article/BreadcrumbList JSON-LD en rutas dinámicas"
```

---

## Task 10: Documentación SEO (GSC + GEO/AEO)

**Files:**
- Create: `docs/seo/google-search-console.md`
- Create: `docs/seo/geo-aeo-notas.md`

- [ ] **Step 1: Crear `docs/seo/google-search-console.md`**

Contenido (guía paso a paso para Fase I, con los 5 puntos del prompt + ambos métodos de verificación):

```markdown
# Indexación rápida en Google Search Console (Fase I)

> Requisito: el sitio ya debe estar en producción en https://enmachile.com (H9).
> H7 ya dejó listos: sitemap.xml, robots.txt y el placeholder de meta tag.

## 1. Sitemap (✅ ya creado en H7)
- Disponible en https://enmachile.com/sitemap.xml (generado por `src/app/sitemap.ts`).
- robots.txt apunta a él: https://enmachile.com/robots.txt

## 2. Agregar la propiedad
- Entrar a https://search.google.com/search-console
- Agregar propiedad → tipo "Prefijo de URL" → https://enmachile.com

## 3. Verificar la propiedad — dos métodos (elegir uno)
### Método A — Meta tag (recomendado para este sitio)
1. Search Console entrega un código `google-site-verification`.
2. Reemplazar el placeholder en `src/app/layout.tsx`:
   `verification: { google: "<CÓDIGO>" }` (hoy dice `"REEMPLAZAR_EN_FASE_I"`).
3. Rebuild + redeploy (H8/H9). El meta tag queda en el `<head>` de todas las páginas.
4. Pulsar "Verificar".
### Método B — Archivo HTML (alternativa Namecheap)
1. Descargar `googleXXXX.html` desde Search Console.
2. Subirlo a `public_html/` en el hosting Namecheap (cPanel File Manager o FTP).
   - En este proyecto equivale a poner el archivo en `public/` antes del build,
     o subirlo directo a `public_html` junto al sitio ya exportado.
3. Pulsar "Verificar".

## 4. Enviar el sitemap
- En Search Console → Sitemaps → añadir `sitemap.xml` → Enviar.

## 5. Inspección de URL ("Fetch as Google")
- Search Console → Inspección de URLs → pegar URL clave (home, /proyectos, /blog) →
  "Solicitar indexación". Repetir para las páginas más importantes.

## Checklist de cierre Fase I
- [ ] Propiedad verificada
- [ ] Sitemap enviado y "Correcto"
- [ ] Home + páginas clave solicitadas para indexación
- [ ] (Opcional) Bing Webmaster Tools con el mismo sitemap
```

- [ ] **Step 2: Crear `docs/seo/geo-aeo-notas.md`**

```markdown
# Notas GEO/AEO — que las IA con búsqueda entiendan y citen a Enma

GEO (Generative Engine Optimization) / AEO (Answer Engine Optimization): optimizar
para que asistentes con búsqueda (ChatGPT, Perplexity, Gemini, etc.) comprendan,
resuman y citen el contenido de Enma.

## Qué implementó H7 y por qué ayuda
- **JSON-LD `Organization`** (nombre, rubro, fundadores, contacto, ubicación): define
  la entidad de marca de forma legible por máquinas → respuestas más precisas sobre
  "qué es Enma".
- **JSON-LD `Article`** en el blog (autor, fecha, sección, imagen): permite citar las
  columnas con atribución correcta.
- **JSON-LD `BreadcrumbList`**: comunica la estructura del sitio.
- **Descripciones meta autoexplicativas**: cada página responde qué/quién/dónde sin
  depender del contexto de navegación.
- **Datos de contacto consistentes (NAP)**: mismo nombre, teléfono y región en sitio
  y en JSON-LD → refuerza la entidad.
- **Idioma `es-CL`** declarado (`<html lang>`, `inLanguage`): contexto regional claro.
- **Sitemap + contenido factual**: facilita el descubrimiento y la extracción.

## Buenas prácticas a mantener al crear contenido nuevo
- Encabezados semánticos (`h1`/`h2`) que enuncien la idea en una frase.
- Responder la pregunta principal en el primer párrafo (estilo "respuesta directa").
- Datos concretos y verificables (de `docs/que-es-enma.txt`), sin inflar claims.
- Texto real en HTML (no encerrar información clave solo en imágenes).
- Mantener `Organization`/`Article` actualizados si cambian datos de marca.

## Pendiente / futuro (no en H7)
- Agregar `sameAs` cuando existan redes sociales.
- Considerar una página `/faq` con `FAQPage` JSON-LD si se quiere capturar respuestas.
```

- [ ] **Step 3: Commit**

```bash
git add docs/seo/google-search-console.md docs/seo/geo-aeo-notas.md
git commit -m "docs(h7): guía Google Search Console (Fase I) + notas GEO/AEO"
```

---

## Task 11: Verificación final, auditoría con plugin y cierre

**Files:** ninguno nuevo (verificación + posibles fixes).

- [ ] **Step 1: Typecheck + build completos**

Run: `npx tsc --noEmit && npm run build`
Expected: exit 0; el build lista `/robots.txt`, `/sitemap.xml`, `/opengraph-image` y las rutas OG por slug; sin errores ni warnings nuevos.

- [ ] **Step 2: Verificación manual de SEO (vía dev, sin Playwright)**

Run (en background del usuario o en una terminal aparte): `npm run dev`
Comprobar manualmente (view-source):
- `/robots.txt` → contiene `Allow: /` y `Sitemap: https://enmachile.com/sitemap.xml`.
- `/sitemap.xml` → 5 rutas estáticas + 3 artículos + 1 proyecto.
- `/` view-source → `og:*`, `twitter:*`, `<link rel="canonical">`, meta `google-site-verification`, `<script type="application/ld+json">` con Organization + WebSite.
- `/blog/energia-mas-cara-aysen` view-source → Article JSON-LD + BreadcrumbList + canonical correcto + `og:type=article`.
- `/proyectos/turbina-eolica-baja-escala` view-source → BreadcrumbList + canonical.
- Abrir `/opengraph-image` y las OG por slug → la imagen branded se renderiza con el título correcto.

- [ ] **Step 3: Golden Paths (manual, regla del proyecto)**

Verificar: Home→Blog/Proyectos/Nosotros/Vinculación 200; slug inválido `/blog/no-existe` → 404; navbar; CTA mailto; botón WhatsApp abre wa.me con el mensaje pre-cargado y el número `+56 9 9337 7935`. Sin Playwright.

- [ ] **Step 4: Auditoría con plugin `claude-seo`**

Cuando el usuario lo instale (`/plugin marketplace add AgriciDaniel/claude-seo` + `/plugin install claude-seo@agricidaniel-claude-seo`), correr su auditoría sobre el sitio y aplicar lo que sugiera que no se haya cubierto. Registrar hallazgos relevantes. Es control de calidad final, no base.

- [ ] **Step 5: Cierre de fase**

- Si surgió un error genérico/reutilizable, evaluar agregarlo a `/lore`.
- Actualizar memoria (`fase-h-road-to-namecheap.md`) y `CLAUDE.md` (marcar H7 ✅, "siguiente H8").
- Commit final si quedaron cambios de docs/memoria.
- `git push` SOLO cuando el usuario lo indique.

---

## Self-Review (autor del plan)

**Spec coverage:**
- Robots → Task 2 ✅ · Sitemap → Task 3 ✅ · Metadata global (OG/twitter/verification/canonical) → Task 4 ✅ · Home → Task 5 ✅ · Internas → Task 6 ✅ · Dinámicas → Task 9 ✅ · OG images (default + dinámicas + fallback) → Tasks 7–8 ✅ · JSON-LD (Org/WebSite/Article/Breadcrumb) → Tasks 4, 6, 9 ✅ · GSC prep (placeholder + doc ambos métodos) → Tasks 4, 10 ✅ · GEO/AEO doc → Task 10 ✅ · Plugin auditor → Task 11 ✅ · WhatsApp DRY + nº corregido → Task 1 ✅ · Golden Paths → Task 11 ✅.
- Nota H8 (`unoptimized:true`) documentada en spec/plan, no implementada (correcto).

**Placeholder scan:** Los únicos placeholders son intencionales y documentados: `verification.google = "REEMPLAZAR_EN_FASE_I"` y `googleXXXX.html`. En Task 6 se indica "copiar la description exacta del archivo" — es una instrucción precisa, no un TODO.

**Type consistency:** `pageMetadata`, `organizationJsonLd`, `websiteJsonLd`, `articleJsonLd(article: Article)`, `breadcrumbJsonLd(items)`, `absoluteUrl`, `renderOgImage({title,kicker})`, `OG_SIZE`, `OG_CONTENT_TYPE`, `WHATSAPP_URL`, `WHATSAPP_DISPLAY` se definen en Task 1/7 y se consumen con esas firmas en Tasks 2–9. Coherente.
