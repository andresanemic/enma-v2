# H6 — Hero de la landing: video → imagen HD con Ken Burns

> Spec de diseño · 2026-06-26 · Fase H (road to Namecheap), Minifase H6

## Objetivo

Reemplazar el `<video>` de fondo del Hero de la landing (placeholder en CloudFront,
un render con zoom-out de ~8s en loop) por **imagen(es) HD con efecto Ken Burns**.
Beneficios: sitio más liviano y rápido, cambio de imagen trivial, y arquitectura
lista para **varias imágenes al azar**.

## Alcance (quirúrgico — solo el medio de fondo)

**Cambia:**
- El fondo del Hero pasa de `<video>` a imagen HD (`next/image`) con Ken Burns lento en CSS.

**Se mantiene intacto (no se rediseña):**
- Todo el contenido del Hero: H1 ("Energía y / Manufactura / Sustentable"), subtítulo,
  CTAs (WhatsApp + "Ver proyectos"), indicador de scroll.
- La **coreografía de entrada orquestada** con GSAP (título con máscara+blur, acento
  letra-por-letra, subtítulo, pop de WhatsApp/pill, fade del scroll).
- Los overlays de **grade cálido (mix-blend-multiply terra) + scrim direccional** que
  dan contraste real al texto blanco.
- El **gradiente cálido de fallback** del `<section>` (se ve bajo la imagen mientras carga).

## Diseño técnico

### 1. Componente de fondo — `HeroBackdrop.tsx`

Renombrar/reemplazar `src/components/hero/HeroVideo.tsx` por `HeroBackdrop.tsx`:

- `next/image` con `fill`, `priority`, `sizes="100vw"`, `object-cover`.
- Imagen **decorativa**: `alt=""` + `aria-hidden="true"` (vive detrás de scrims densos;
  el contenido semántico es el H1, no la foto).
- Wrapper interno (`<div>`) que recibe la animación Ken Burns, para no animar el
  contenedor `fill` directamente.

### 2. Efecto Ken Burns (CSS)

Keyframes en `globals.css`:

```css
@keyframes hero-kenburns {
  from { transform: scale(1.04) translate3d(0, 0, 0); }
  to   { transform: scale(1.12) translate3d(-1.5%, -1%, 0); }
}
```

- Aplicado al wrapper interno: `animation: hero-kenburns 28s ease-in-out infinite alternate;`
- `will-change: transform;` (solo transform — patrón de `lore/animation.md`/performance).
- El `scale` base ≥ 1.04 garantiza que el paneo nunca muestre bordes vacíos.
- Guard de accesibilidad:
  ```css
  @media (prefers-reduced-motion: reduce) {
    .hero-kenburns { animation: none; }
  }
  ```

### 3. Selección al azar (sin hydration mismatch)

- Array `HERO_IMAGES` (hoy **1 entrada**), cada item `{ src, alt? }`.
- **SSR / primer paint:** índice `0` fijo (estable entre server y cliente → sin mismatch).
- **En montaje (`useEffect`):** elegir índice aleatorio; si difiere de `0`, hacer
  **crossfade** a la nueva imagen (opacidad). Con 1 imagen es no-op.
- Sumar imágenes en el futuro = agregar entradas al array; cero cambios de lógica.
- La imagen es decorativa (detrás de scrims), así que el LCP real es el H1: un swap por
  crossfade no penaliza métricas.

### 4. Integración en `Hero.tsx`

Único cambio: sustituir el import y el render de `<HeroVideo src={...} />` por
`<HeroBackdrop />`. Eliminar la constante `HERO_VIDEO`. **Nada más** del archivo se toca
(coreografía GSAP, overlays, fallback, CTAs, indicador de scroll quedan idénticos).

### 5. Asset

- Imagen de prueba: **Patagonia / Aysén en hora dorada** (tonos cálidos + zonas oscuras
  hacia la izquierda, donde vive el texto blanco).
- Origen: banco tipo **Unsplash** → descargar → optimizar a `.webp` → guardar **local**.
- Ruta: `public/hero/hero-patagonia-v1.webp` (versionado `-vN` por la convención de caché
  de `next/image` del proyecto).

### 6. Nota de export estático (H8)

`next/image` con imagen **local** es export-safe una vez que H8 active
`images: { unoptimized: true }`. No se introducen loaders ni dominios remotos en H6.

## Criterios de cierre

- El Hero se ve y se siente igual o mejor que con el video; el texto blanco mantiene
  contraste real sobre la imagen.
- `prefers-reduced-motion`: sin Ken Burns (imagen estática).
- Build de producción + typecheck OK.
- Golden Paths del Hero intactos: CTA WhatsApp (`wa.me/...`) y "Ver proyectos" (`/proyectos`).
- Validación visual humana (sin Playwright).

## Fuera de alcance

- Sumar las imágenes definitivas reales (esto se hace agregando al array luego).
- Activar `images.unoptimized` para el export (es trabajo de H8).
- Cualquier cambio al contenido, copy o coreografía del Hero.
