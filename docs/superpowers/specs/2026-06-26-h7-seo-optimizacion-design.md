# H7 — Optimización SEO (GEO/AEO incluido) · Diseño

> Fase H — Road to Namecheap · Minifase H7
> Fecha: 2026-06-26
> Estado: aprobado por el usuario (pendiente revisión del spec escrito)

## Objetivo

Dejar el sitio de Enma (`web2`, Next.js 16 App Router) **optimizado para motores de búsqueda
(SEO) y para herramientas de IA con búsqueda en internet (GEO/AEO)**, y dejar preparados todos
los archivos necesarios para que en la **Fase I** se ejecute la indexación rápida en Google
Search Console.

Todo se implementa con APIs **nativas de Next.js**, de modo que sobreviva al **export estático**
de H8 (FTP a Namecheap). El plugin `claude-seo` se usa al cierre como **auditor de control de
calidad**, no como base.

### Fuera de alcance (no se toca en H7)
- Cambios visuales / de layout / de motion en secciones existentes.
- Activar `images: { unoptimized: true }` en `next.config.ts` (eso es H8; solo se deja anotado).
- Ejecutar la verificación real en Google Search Console o subir el sitemap (eso es Fase I).
- Crear/editar contenido editorial (copy) más allá de descripciones meta alineadas a
  `que-es-enma.txt`.

## Contexto / estado de partida

Ya existe (no rehacer, solo afinar):
- `src/app/layout.tsx`: `metadataBase = https://enmachile.com`, `title.default` + `title.template`,
  `description` global. `lang="es"`.
- Metadata estática (title + description) en: `nosotros`, `vinculacion`, `proyectos`, `blog`.
- `generateMetadata` dinámico (title + description) en `proyectos/[slug]` y `blog/[slug]`, con
  `generateStaticParams`.

Falta (lo que agrega H7):
- `robots.txt`, `sitemap.xml`.
- `openGraph` / `twitter` / `canonical` (en layout y por página).
- Imágenes Open Graph.
- JSON-LD (datos estructurados).
- Placeholder de verificación de Google Search Console + documentación.
- Notas GEO/AEO.

### Decisiones tomadas (brainstorming)
- **OG images:** generadas por código (branded) — default de sitio + por artículo/proyecto con su
  título. Fallback a estática si `ImageResponse` no compila bajo `output: export`.
- **JSON-LD:** completo — `Organization` + `WebSite` (sitio), `Article` (blog), `BreadcrumbList`
  (internas).
- **Verificación GSC:** placeholder de meta tag + documentar también el método de archivo HTML.
- **Redes sociales:** ninguna por ahora → sin `sameAs`.
- **GEO/AEO:** incluir `docs/seo/geo-aeo-notas.md`.

### Datos de marca reales (fuente: `docs/que-es-enma.txt` + Footer)
- Razón social: **Enma SPA** (marca: **Enma**).
- Rubro: empresa chilena de base científico-tecnológica — energía y manufactura sustentable.
- Origen: fundada ~2022 en Puerto Cisnes, Región de Aysén, Patagonia chilena.
- Fundadores: **Bruno Ortega**, **Patricio Campos** (ingenieros mecánicos).
- Ubicación operativa declarada en el Footer: **Coyhaique, Región de Aysén, Chile**.
- Contacto: **contacto@enmachile.com** · WhatsApp **+56 9 9337 7935**.
- Dominio: **https://enmachile.com**.
- Sin perfiles sociales.

> **Cambio ya aplicado (pre-spec, a pedido del usuario):** corrección del teléfono a
> `+56 9 9337 7935` en `Hero.tsx` y `Footer.tsx`, y los links `wa.me` ahora llevan mensaje
> pre-cargado vía `?text=` ("Hola Enma 👋 Vengo desde su sitio web y me gustaría conversar sobre
> un proyecto."). Este número es el `telephone` del JSON-LD.

## Arquitectura de la solución

Se agrupa en módulos pequeños y de propósito único.

### 1. Constantes SEO centralizadas — `src/lib/seo.ts` (nuevo)
Única fuente de verdad para datos que se repiten en metadata + JSON-LD:
- `SITE_URL = "https://enmachile.com"`
- `SITE_NAME = "Enma"`, `LEGAL_NAME = "Enma SPA"`
- `DEFAULT_TITLE`, `DEFAULT_DESCRIPTION` (reusar los actuales del layout)
- `CONTACT_EMAIL`, `WHATSAPP_NUMBER` (`56993377935`), `WHATSAPP_DISPLAY` (`+56 9 9337 7935`)
- `LOCALITY` (Coyhaique), `REGION` (Región de Aysén), `COUNTRY` (CL)
- `FOUNDERS = ["Bruno Ortega", "Patricio Campos"]`
- Helper `absoluteUrl(path)` para canonicals/OG.

> Nota: las constantes de WhatsApp de `Hero.tsx`/`Footer.tsx` pueden migrar a `lib/seo.ts` para
> no duplicar, **sin cambiar el comportamiento visual** del botón. Si la migración añade riesgo,
> se deja la duplicación y se documenta. Decisión final en el plan.

### 2. Rastreo (build-time → archivos estáticos)
- **`src/app/robots.ts`** → `MetadataRoute.Robots`: `allow: "/"`, `sitemap: absoluteUrl("/sitemap.xml")`,
  `host: SITE_URL`. (Genera `/robots.txt` en el build, compatible con export estático.)
- **`src/app/sitemap.ts`** → `MetadataRoute.Sitemap`:
  - Rutas estáticas: `/`, `/nosotros`, `/vinculacion`, `/proyectos`, `/blog`.
  - Dinámicas: slugs de `lib/blog.ts` (`/blog/[slug]`) y de `lib/proyectos.ts` (`/proyectos/[slug]`).
  - `lastModified` (fecha de build o fecha del recurso si existe), `changeFrequency`/`priority`
    razonables por tipo (Home alta; internas media; artículos media-baja).

### 3. Metadata (afinar incrementalmente)
- **`layout.tsx`**: añadir a `metadata` los defaults heredables:
  - `openGraph`: `type: "website"`, `locale: "es_CL"`, `siteName`, `url`, `images` (default).
  - `twitter`: `card: "summary_large_image"`, `title`, `description`, `images`.
  - `verification: { google: "REEMPLAZAR_EN_FASE_I" }` (placeholder).
  - `alternates: { canonical: "/" }` (cada página la sobreescribe).
- **`page.tsx` (Home)**: exportar `metadata` propio con `openGraph` + `alternates.canonical: "/"`
  (hoy hereda todo de layout; se le da identidad explícita).
- **Internas estáticas** (`nosotros`, `vinculacion`, `proyectos`, `blog`): añadir
  `alternates.canonical` y, si aporta, `openGraph` específico (title/description ya existen).
- **`[slug]` dinámicas** (`blog`, `proyectos`): extender `generateMetadata` con `openGraph`
  (title, description, type `article` en blog), `twitter` y `alternates.canonical` al slug.
- Copy de descripciones alineado a `que-es-enma.txt`; **sin claims nuevos** (sin métricas,
  clientes ni logros no documentados).

### 4. OG images generadas por código
Plantilla branded compartida (fondo cálido `#F8EDDD`, acento teal `#205358` / terra, monograma
"E", logotipo Enma, título y bajada en **Manrope**), 1200×630.
- **`src/app/opengraph-image.tsx`**: OG por defecto del sitio (también referenciada como
  `twitter-image`).
- **`src/app/blog/[slug]/opengraph-image.tsx`**: misma plantilla con el **título del artículo**.
- **`src/app/proyectos/[slug]/opengraph-image.tsx`**: misma plantilla con el **título del proyecto**.
- Implementación con `next/og` (`ImageResponse`). Las fuentes se cargan en build (fetch del
  `.ttf`/`.woff` de Manrope o fuente embebida).

**Riesgo y mitigación (obligatorio validar en implementación):** confirmar que `ImageResponse`
compila y se genera como archivo estático bajo `output: export` en Next 16. Si **no** compila o
rompe el build estático, **fallback**: una imagen OG estática de marca en `public/og/` referenciada
desde `openGraph.images` (default del sitio) y se omiten las dinámicas. La fase no se cae por esto.

### 5. JSON-LD — `src/components/seo/JsonLd.tsx` (nuevo, server component)
Componente que serializa un objeto a `<script type="application/ld+json">` (con `JSON.stringify`,
sin `dangerouslySetInnerHTML` inseguro — datos propios y controlados).
- **Sitio (en `layout.tsx`, dentro de `<body>`):**
  - `Organization`: `name` (Enma), `legalName` (Enma SPA), `url`, `logo`, `email`, `telephone`
    (+56 9 9337 7935), `founder` (Bruno Ortega, Patricio Campos), `foundingDate` (2022),
    `areaServed` (Región de Aysén / Chile), `address` (Coyhaique, Aysén, CL),
    `description`. **Sin `sameAs`** (no hay redes).
  - `WebSite`: `name`, `url`, `inLanguage: "es-CL"`, `publisher` (ref a Organization).
- **Blog `[slug]`:** `Article` — `headline`, `description`, `image` (OG), `datePublished`/
  `dateModified` (si están en `lib/blog.ts`), `author` (autor de la nota), `publisher` (Enma),
  `mainEntityOfPage` (canonical), `articleSection` (topic).
- **Internas + detalle:** `BreadcrumbList` con la jerarquía real (Inicio → Sección → [detalle]).

> Render: en App Router el `<script>` de JSON-LD puede ir dentro del componente de página/layout;
> es válido y sobrevive al export estático (HTML pre-renderizado).

### 6. GEO/AEO
La cobertura principal viene del JSON-LD (`Organization`/`Article`), descripciones meta
autoexplicativas y el sitemap. Además:
- **`docs/seo/geo-aeo-notas.md`**: documento breve con las buenas prácticas aplicadas y por qué
  ayudan a que las IA con búsqueda entiendan y citen a Enma: entidad de marca clara (Organization),
  contenido factual y autoexplicativo, descripciones que responden "qué/quién/dónde", encabezados
  semánticos, datos de contacto consistentes (NAP: nombre, dirección, teléfono), e idioma `es-CL`.

### 7. Preparación Google Search Console (para Fase I)
- Placeholder de meta tag en `metadata.verification.google` (se rellena en Fase I).
- **`docs/seo/google-search-console.md`**: guía paso a paso de los 5 puntos del prompt:
  1. Sitemap creado (`/sitemap.xml`) — ya generado por H7.
  2. Agregar la propiedad en Google Search Console.
  3. Verificar dominio — documentar **ambos** métodos:
     - **Meta tag** `google-site-verification` (rellenar el placeholder y rebuild) —
     - **Archivo HTML** `googleXXXX.html` subido a `public_html` vía File Manager / FTP de
       Namecheap (alternativa que menciona el prompt).
  4. Enviar el sitemap en Search Console.
  5. Inspección de URL ("Fetch as Google") para forzar indexación de páginas clave.

### 8. Plugin `claude-seo` (auditoría de cierre)
Una vez instalado por el usuario (`/plugin marketplace add AgriciDaniel/claude-seo` +
`/plugin install claude-seo@agricidaniel-claude-seo`), se corre su auditoría sobre el sitio y se
aplica lo que sugiera que H7 no haya cubierto. Es control de calidad, no base.

## Estructura de archivos (resumen)

```
src/lib/seo.ts                                   (nuevo)
src/app/robots.ts                                (nuevo)
src/app/sitemap.ts                               (nuevo)
src/app/opengraph-image.tsx                      (nuevo)
src/app/blog/[slug]/opengraph-image.tsx          (nuevo)
src/app/proyectos/[slug]/opengraph-image.tsx     (nuevo)
src/components/seo/JsonLd.tsx                     (nuevo)
src/app/layout.tsx                               (editar: OG/twitter/verification/JSON-LD)
src/app/page.tsx                                 (editar: metadata propia + canonical)
src/app/nosotros|vinculacion|proyectos|blog/page.tsx   (editar: canonical/OG + breadcrumbs)
src/app/blog/[slug]/page.tsx                      (editar: OG/twitter/canonical + Article JSON-LD)
src/app/proyectos/[slug]/page.tsx                (editar: OG/twitter/canonical + breadcrumb JSON-LD)
docs/seo/google-search-console.md                (nuevo)
docs/seo/geo-aeo-notas.md                        (nuevo)
public/og/  (solo si se activa el fallback estático)
```

## Validación / criterios de aceptación

1. `npx tsc --noEmit` y `npm run build` terminan OK.
2. Tras el build, existen y son correctos: `/robots.txt` (con línea Sitemap), `/sitemap.xml`
   (lista todas las rutas estáticas + slugs reales de blog y proyectos), y las imágenes OG
   (o el fallback estático documentado).
3. El HTML de las páginas contiene: tags `og:*` y `twitter:*`, `<link rel="canonical">`, el meta
   `google-site-verification` (placeholder), y los `<script type="application/ld+json">`
   (Organization + WebSite en todas; Article en blog; BreadcrumbList donde corresponde).
4. JSON-LD válido (estructura conforme a schema.org; sin campos inventados; teléfono y email
   reales).
5. **Golden Paths** verificados manualmente: todas las rutas 200, slug inválido 404, navegación
   Home→Blog/Proyectos/Nosotros/Vinculación, navbar, CTA mailto y WhatsApp (con mensaje
   pre-cargado) funcionando. Sin Playwright.
6. Sin regresiones visuales ni de motion en secciones existentes.
7. `docs/seo/google-search-console.md` y `docs/seo/geo-aeo-notas.md` presentes y completos.

## Notas para fases siguientes
- **H8:** activar `images: { unoptimized: true }` en `next.config.ts` para el export estático FTP;
  re-verificar que OG/sitemap/robots salen en `out/`.
- **Fase I:** ejecutar la guía de `docs/seo/google-search-console.md` (verificación + submit
  sitemap + inspección de URL) contra `enmachile.com` ya en producción.
