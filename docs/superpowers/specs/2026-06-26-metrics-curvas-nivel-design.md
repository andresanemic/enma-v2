# Métricas — Curvas de nivel + foto fría (Opción A, fase 2)

**Fecha:** 2026-06-26
**Sección:** `components/sections/Metrics.tsx` (landing)
**Estado:** diseño aprobado por el usuario ("lets goo")

## Contexto

La sección Métricas pasó a fondo fotográfico (Opción A): foto real de Villa
Cerro Castillo, Aysén (Carter Obasohan) con grade dorado-oscuro + scrim y el
`WindField` (CFD canvas) encima. Al usuario le encantó el fondo, pero el
`WindField` (líneas de viento claras, vida perpetua) **no conviven con la
fotografía**. Se decide reemplazar el efecto y enfriar la imagen.

## Objetivo

1. Reemplazar `WindField` por un efecto que **conviva con la foto**, refuerce el
   tono **dark/frío** y signifique algo para una sección de *métricas/medición*.
2. Enfriar la foto (más azul/teal) para que lea como sección "dark" de la landing,
   conservando la luz dorada de las cumbres como único acento cálido.

## Decisiones (brainstorming)

- **Efecto (FINAL):** **nieve fina a la deriva**. Primero se implementaron curvas
  de nivel (trazo + latido), pero al verlas el usuario las descartó y pidió la
  opción nieve. El tratamiento de color frío (abajo) se mantiene intacto.
- **Curvas de nivel (descartadas):** SVG de cumbres de anillos que se trazaban al
  entrar + latido de opacidad. Componente `ContourField` eliminado.
- **Nieve (implementada):** canvas liviano — motas pequeñas que caen lento con
  vaivén lateral (viento) y profundidad por capas. Calma, ambiente frío,
  movimiento perpetuo suave (la nieve deriva por naturaleza). `SnowField`.

## Diseño

### Componente nuevo: `SnowField` (`components/metrics/SnowField.tsx`)

- **Canvas liviano**, `absolute inset-0`, `pointer-events-none`, `aria-hidden`.
  Reemplaza a `WindField` en `Metrics.tsx`.
- **Partículas:** motas pequeñas (r 0.5–2.2) que caen lento con vaivén lateral
  (sin) + leve deriva (viento). Profundidad por capas: las grandes caen algo más
  rápido y opacas; las diminutas, lentas y tenues. Cantidad sobria (~40–90 según
  ancho), no ventisca.
- **Color:** paleta fría — blancos-cielo, azul pálido, teal claro y un crema
  escaso. Sin naranjas (no rompe el frío).
- **Movimiento:** deriva perpetua suave (la nieve cae por naturaleza; es calma).
  Pausa fuera de viewport con `IntersectionObserver`; `ResizeObserver` para
  recalcular.
- **`prefers-reduced-motion`:** esparcido estático (un frame), sin animación.

### Tratamiento de color (foto más fría) — `Metrics.tsx` + `MetricsBackdrop.tsx`

- Grade `mix-blend-multiply`: de dorado → **azul/teal profundo** (frío). Scrim
  azul para contraste de texto.
- Desaturar apenas la imagen (`filter: saturate(<1)` en `MetricsBackdrop`) para
  que el frío domine.
- **Conservar la luz dorada de las cumbres:** la banda superior se enfría menos
  (gradiente direccional) → contraste cálido/frío deliberado, no azul plano.
- Mantener un respaldo dark (gradiente de la `section`) por si la foto falla.

### Recalibración de acentos + impacto (iteración posterior)

- **Acentos:** unificados a dorado cálido suave `#f4c98c` (luz del amanecer);
  se retiró el teal (teal-sobre-teal) y el naranja saturado (zumbaba con el frío).
- **Paso de impacto (anti-"deslavado"):** saturación de la foto `0.74 → 0.96`
  (el frío lo da el grade, no el lavado); brillo de cumbre más presente; **viñeta**
  para drama/foco; número hero con `text-shadow` cálido (glow).
- **Disposición (se mantiene HORIZONTAL):** columnas reveladas. En reposo cada
  columna muestra número + barra + label; el **hint** de las secundarias se revela
  en **hover** (la hero lo lleva abierto = tesis). Hover: glow cálido detrás,
  número vira a dorado, la barra de acento **crece**. Colapso del hint solo en
  dispositivos con hover (`@media (hover:hover)`), espacio reservado (sin reflow);
  touch/lectores ven el texto. `prefers-reduced-motion` respetado.

### Lo que NO cambia

- Foto elegida, layout horizontal, números (escala original, count-up apagado),
  reveal sobrio del título, Golden Paths.

### Archivos

- **Nuevo:** `components/metrics/SnowField.tsx`
- **Editar:** `components/sections/Metrics.tsx` (swap efecto + grade frío),
  `components/metrics/MetricsBackdrop.tsx` (desaturación).
- `components/metrics/WindField.tsx` queda **sin uso** (junto a `Ridge.tsx` y
  `WindTurbine.tsx`); limpieza de los tres se decide aparte. `ContourField.tsx`
  (curvas descartadas) se eliminó.

## Verificación

- `tsc --noEmit` + `npm run build` OK.
- Golden Paths sin riesgo (cambio visual, sección sin links).
- Revisión visual humana del usuario (sin Playwright).
