# "Cómo lo abordamos" — Línea de cota (rediseño)

**Fecha:** 2026-06-27
**Componente:** bloque 4 (`data-reveal="rail"`) de `src/components/sections/ProyectoDetalle.tsx`
**Ruta:** `/proyectos/[slug]`

## Problema

El bloque "Cómo lo abordamos" en desktop es una fila de cards colgando de una
curva fina, con un único cambio de color en hover. Queda por debajo del estándar
del resto del sitio (Ficha técnica, CTA+Footer). El móvil (columna vertical con
conector) se ve mejor; el resultado final debe ser igual de bueno en ambos.

## Decisión de concepto

Los pasos son, hoy, capacidades/herramientas, pero se decidió leerlos como
**secuencia/recorrido** (proceso ordenado). Eso justifica numerarlos (01..0N) y
darles narrativa de "ruta".

## Dirección: A · Línea de cota

El bloque se lee como una **línea de cota de plano** (dimension line): un eje
horizontal *medido* con end-caps, cada fase es una **estación numerada** sobre el
eje y su contenido cuelga como **callout con línea guía**. Los callouts
**alternan arriba/abajo** (zig-zag) para aprovechar el alto. Es el mismo
vocabulario de cotas del Hero y la Ficha técnica → coherencia de dossier.

### Tokens (dentro de la paleta del proyecto)

- **Color:** eje y guías `ink/30–40` (hairline); nodo `terra`; encendido/hover
  `ember`; número `ink/30 → terra` en hover; panel del callout levanta a
  `sand/cream`. **Sin teal** (reservado al "Qué hicimos" de la narrativa).
- **Tipografía:** número y label en **Manrope** (display), detalle en **Outfit**
  (body). El número es el dispositivo estructural (secuencia real). Sin mono, sin
  eyebrow. El encabezado "Cómo lo abordamos" se mantiene como en las hermanas.
- **Fondo:** conserva el gradiente cálido y el empalme actual
  (`#e8c08e → #f3ddbc` última sección / `→ #edca9c` si hay "Más proyectos").
- **Detalle de oficio:** witness lines (líneas guía) hairline que se encienden en
  hover, eco de la Ficha técnica.

### Anatomía de estación (desktop)

```
   ┌──────────────────────┐
   │ 01                    │  número (Manrope light, ink/30)
   │ Estaciones meteo.     │  label (Manrope medium)
   │ Caracterización...    │  detalle (Outfit light, ink/55)
   └──────────┬───────────┘
              ┊                witness line (hairline)
 ◀════════════●════════════▶   eje acotado · nodo
```

Implementación: cada `<li>` es `grid grid-rows-[1fr_auto_1fr]` con el nodo en la
fila central (auto) → todos los nodos quedan centrados verticalmente y alinean
con el eje (absoluto a `top-1/2`). El callout va arriba (índice par) o abajo
(índice impar) con su witness line tocando el nodo. End-caps = ticks verticales
en los extremos del eje (no escalan con el trazo).

## Motion (sobrio, un momento orquestado)

Reusa `case "rail"` del reveal IO existente (sin cambios de JS):
1. el eje se traza izq→der (`scaleX 0→1`, ~0.9s `power2.inOut`);
2. nodos + guías acompañan;
3. callouts (número→texto) con fade-up + stagger.

**Hover:** nodo crece y va a `ember`, guía a `terra`, número a `terra`, panel
levanta + fondo cálido + ring terra.
**reduced-motion:** estado final (extiende la rama `reduce` ya presente; usa los
mismos hooks `data-rail` / `data-rail-v` / `data-step`).

## Responsive + reúso

- **Móvil (`< sm`):** mismo concepto rotado 90° → eje vertical a la izquierda,
  estaciones bajando, callouts a la derecha en una columna (sin zig-zag). Es el
  móvil actual + números y guías.
- **Reúso (4–7 pasos):** eje en N segmentos iguales; zig-zag y numeración
  (01..0N) válidos para cualquier N; ancho de callout acotado (`max-w` ~164px
  desktop) y el label envuelve. Se alimenta de `proyecto.approach` (label+detalle)
  con **fallback a `capabilities`** (solo número+label).

## Datos

Se **reordena** `approach[]` en `lib/proyectos.ts` a orden de proceso lógico
(misma forma, solo orden):
1. Estaciones meteorológicas · Caracterización del viento
2. Diseño CAD · Fusion 360 · Inventor · AutoCAD
3. Simulaciones CFD · Optimización del diseño en aire
4. Túnel de viento propio · En construcción · Santiago
5. Manufactura avanzada · Impresión 3D · corte CNC
6. Analizador de redes Clase A · Medición para netbilling

## Alcance / archivos

- `src/components/sections/ProyectoDetalle.tsx` — bloque 4: reemplazar el interior
  (curva + `<ol>`); conservar wrapper, gradiente/`hasMore`, encabezado, id de
  reveal y rama `reduce`. Añadir helper `StationCallout` (módulo).
- `src/lib/proyectos.ts` — reordenar `approach[]`.

## Verificación

- `typecheck` + `build` OK.
- Golden Paths manual: `/proyectos/turbina-eolica-baja-escala` 200, sin errores
  JS, navbar/navegación intactos. Sin Playwright.
- Revisión visual humana desktop + móvil.

## Evolución durante la implementación (estado final aprobado)

Iterado con el usuario hasta un "10":

- **Sin card:** las anotaciones no usan panel (sin fondo/ring/sombra). El texto
  va enmarcado por **dos esquineros de registro** (crop marks) en vértices
  opuestos. Todo el bloque es líneas + texto (dibujo técnico).
- **Número inline con el header** (mismo renglón y altura que el label), muted
  (`ink/40`) y enciende a terra en hover. Todo el texto alineado a la izquierda.
- **Detalle más legible:** `14px`, peso normal, `ink/70`, leading relajado.
- **Nodos = punto mínimo** (~5px) en vez del círculo con anillo. En reposo
  `terra/60`; en hover crece (`scale-150`) y va a `terra`.
- **Hover de estación:** se encienden número + línea guía + punto del eje (misma
  familia terra); el resto queda estático (sin movimiento de bloque ni glows).
- **Reveal sincronizado:** el eje se traza y las estaciones entran solapadas con
  el trazo (stagger `0.08` desde `0.25`; eje `0.15→1.10`). Un solo momento,
  respeta `reduced-motion`.
- **Descartados:** flechas de cota en los extremos (se mantienen ticks) y la
  textura de curva de nivel de fondo (restaba limpieza).
