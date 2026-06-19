# CLAUDE.md — Proyecto Enma (Sitio Web v2 — Rediseño desde cero)

> Fuente de verdad para Claude Code en este proyecto. Leer completo antes de cualquier tarea.
> Este es un proyecto **nuevo, construido desde cero** en la carpeta `\web2`, usando `\web` (versión primitiva) solo como referencia de aprendizaje — NO como base de código a copiar.

---

## ⚠️ Workflows obsoletos — IGNORAR POR COMPLETO

Los siguientes archivos existieron en el proyecto anterior y **no deben leerse, citarse ni aplicarse bajo ninguna circunstancia** en este proyecto:

- `engineering-workflow.md`
- `awwwards-workflow.md`
- Cualquier subagente "verifier"
- La carpeta `referencias-awwwards-fotos\` y sus `.md` asociados

Estos workflows perjudicaron el desarrollo anterior (lentitud, sobre-proceso, fricción). Si en algún momento aparecen referenciados en memoria o en archivos antiguos, ignóralos explícitamente. Este CLAUDE.md reemplaza por completo al anterior en todo lo demás.

**Excepción importante: `golden-paths.md` SÍ se mantiene** (ver sección dedicada más abajo). No es parte de los workflows descartados — es una verificación funcional independiente que sigue siendo obligatoria.

---

## Descripción General

**Enma** es una empresa chilena de base científico-tecnológica (energía + manufactura sustentable), nacida en Aysén, Patagonia. Sitio web a desarrollar en **https://enmachile.com**.

### Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- GSAP (animaciones)
- **NO usar Playwright en ningún momento del desarrollo** (ni para testing, ni para validación visual, ni para scraping de referencias). Toda validación visual es revisión humana directa por el usuario. La verificación de Golden Paths (ver abajo) se hace manualmente, no con Playwright.
- Hosting: cPanel Namecheap (dominio y deploy final) · Vercel (previews para cliente)

### Misión del proyecto

Construir el sitio de Enma **desde cero**, con el objetivo explícito de que sea un sitio **destacado en Awwwards**: creativo, disruptivo, con motion design de nivel premiado — no una landing corporativa genérica. La versión anterior (`\web`) es funcional pero está muy lejos del estándar visual buscado; ese análisis debe usarse para **entender qué evitar**, no para heredar decisiones.

---

## Paso 0 — Análisis obligatorio antes de escribir código

Antes de crear un solo archivo en `\web2`, Claude Code debe:

1. **Analizar la versión primitiva en `\web`**: recorrer su estructura, componentes y estilos actuales. El objetivo NO es reutilizar código, sino identificar:
   - Qué decisiones de layout, color y tipografía hay que dejar atrás
   - Qué partes del Hero + NavBar están aprobadas y deben preservarse conceptualmente (ver sección "Lo que se mantiene" más abajo)
   - Qué problemas de contraste, jerarquía o estructura ya se conocen y no se deben repetir
2. **Leer `golden-paths.md`** para entender qué rutas de navegación y comportamientos críticos del sitio deben preservarse funcionalmente en la versión nueva, independientemente del rediseño visual.
3. **Investigar el estándar Awwwards actual**: revisar awwwards.com (Site of the Day, Developer Awards, criterios de evaluación: diseño, usabilidad, creatividad, contenido) para entender qué patrones de 2026 distinguen a un sitio premiado — no replicar un sitio específico, sino extraer principios (tipografía expresiva, motion con propósito, microinteracciones, transiciones de página, composición no convencional).
4. **Leer todo el material de marca e investigación de este proyecto** (detallado abajo) antes de tomar cualquier decisión de diseño.

No avanzar a Setup (Fase A) sin completar este análisis.

---

## Dirección Creativa (CRÍTICO)

El sitio debe ser **innovador, disruptivo, con potencial real de ser destacado en Awwwards**. Se basa en:

- **Visión de la diseñadora** (`disenadora-vision-sitio-web.txt`) — dirección de diseño obligatoria, no negociable
- **Qué es Enma** (`que-es-enma.txt`) — fuente de verdad de copy, servicios, datos y personalidad de marca
- **Entrevistas a los fundadores** (`respuestas-bruno-ortega.txt`, `respuestas-patricio-campos.txt`) — contexto adicional, no copy directo, pero deben informar tono y énfasis
- **Moodboard** (`moodboard.txt`) — huellas, patrones silvestres, texturas naturales, equilibrio empresa/medioambiente
- **Enma Vibes** (`enma-vibes.txt`) — análisis estético de 7 referencias del rubro cleantech/energía
- **Paleta de colores** (`paleta.txt`)
- **Tipografías** (`tipografías.txt`)
- **Wireframe** (`wireframe.pdf`) — estructura de páginas y secciones de referencia
- **Golden Paths** (`golden-paths.md`) — rutas de navegación críticas que deben funcionar siempre, sin excepción

### Paleta — corrección de rumbo respecto a la versión anterior

La versión primitiva (`\web`) quedó demasiado cargada de verde, con una sensación seria y corporativa que no refleja la personalidad de marca declarada ("activa, enérgica, en constante movimiento, colores no apagados", según `que-es-enma.txt`).

Paleta completa (`paleta.txt`):

`#F8EDDD` — crema cálido (base)
`#FEA94F` — naranja vibrante
`#F7DFBA` — hueso/arena
`#F1541C` — naranja-rojo intenso
`#B12C00` — terracota oscuro
`#3E7C6C` — verde (acento secundario, no protagonista)
`#304B3D` — verde oscuro (usar con moderación, solo detalles puntuales)
`#205358` — teal (color de marca/logo, hilo conductor, no fondo dominante)

**Regla de uso:**

- Los **naranjas y terracotas** (#FEA94F, #F1541C, #B12C00) y los **tonos crema/hueso pastel** (#F8EDDD, #F7DFBA) deben ser protagonistas: fondos cálidos, acentos de CTA, hovers, detalles gráficos.
- El **teal** (#205358) se mantiene como color de marca (logo, algún acento puntual de alto contraste) pero **no debe ser el color dominante de fondos ni secciones completas**.
- Los verdes oscuros (#3E7C6C, #304B3D) se usan como detalle o contraste puntual, nunca como base de sección.
- Validar cada sección nueva: si al verla en conjunto predomina el verde, corregir antes de avanzar.

### Tipografía

- **Manrope**: títulos y subtítulos
- **Outfit**: cuerpo de texto

---

## Lo que se mantiene (no se rediseña desde cero)

1. **Hero + NavBar**: estructura y concepto aprobados. Ajustes obligatorios:
   - Mejorar el **contraste entre el texto y el fondo** del Hero (legibilidad real, no solo estética).
   - Añadir **sombra al logo blanco de Enma** en el NavBar para que se distinga sobre fondos claros o variables.
   - El NavBar debe rediseñarse visualmente acorde a la nueva estética del sitio (manteniendo su rol y comportamiento funcional), no copiarse literalmente de `\web`.
2. El **monograma "E" de Enma** (lineal, geométrico, tipo circuito) se mantiene como activo de marca, recoloreado según la paleta cálida.
3. **Golden Paths**: las rutas de navegación y comportamientos críticos definidos en `golden-paths.md` se mantienen funcionalmente, sin importar cuánto cambie el diseño visual de cada sección.

Todo lo demás del sitio (About, Servicios, Por qué somos distintos, Proyectos, Equipo, CTA, Footer, páginas internas, Blog) se diseña **desde cero**, sin arrastrar layout, estructura ni estilos de `\web`.

---

## Elementos nuevos obligatorios

- **Cursor personalizado / efectos de puntero estilizado**: el sitio debe incorporar un cursor custom con interacciones (cambios de estado en hovers de links, botones, imágenes, etc.), coherente con el estándar Awwwards. Ver `responsive.md` en Lore antes de implementarlo (guard táctil obligatorio).
- **Barra de navegación rediseñada**: acorde a la nueva estética visual y de marca (no genérica, no plantilla), preservando los Golden Paths de navegación.
- Motion design con **propósito narrativo**, no decorativo: transiciones, scroll storytelling, microinteracciones que refuercen el mensaje de marca (cercanía + tecnología).

---

## Golden Paths — Verificación obligatoria

> A diferencia de los workflows descartados, `golden-paths.md` **se mantiene como parte del proceso de este proyecto**.

- Leer `golden-paths.md` durante el Paso 0, antes de diseñar la navegación y la estructura de rutas.
- Antes de cerrar cualquier fase (Setup, Hero/Navbar, Landing, Páginas internas, Blog, Pulido), **verificar manualmente** que cada Golden Path sigue funcionando correctamente en `\web2`.
- Esta verificación es manual/humana, igual que el resto de la validación visual — no se usa Playwright para ello.
- Si un Golden Path deja de cumplirse por una decisión de diseño nueva, no se descarta el Golden Path: se ajusta el diseño para que el camino crítico se mantenga, o se marca explícitamente el conflicto para que el usuario decida.

---

## Recursos del Proyecto y Cómo Usarlos

| Recurso                           | Ruta                                                                                                             | Uso                                                                                                                                                                                    |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Web primitiva (solo análisis)     | `\web\`                                                                                                          | Punto de partida a analizar, NO a copiar. Ver "Paso 0"                                                                                                                                 |
| Wireframe                         | `wireframe.pdf`                                                                                                  | Estructura de páginas y secciones (Landing, Blog, Nosotros, Proyectos, Servicios)                                                                                                      |
| **Qué es Enma**                   | **`que-es-enma.txt`**                                                                                            | **Fuente de verdad de copy y datos reales. Leer SIEMPRE antes de escribir texto, cifras o claims sobre Enma.**                                                                         |
| Copy antiguo                      | `copy-antiguo.txt`                                                                                               | Referencia de copy previo (no usar tal cual, sí como insumo)                                                                                                                           |
| Visión diseñadora                 | `disenadora-vision-sitio-web.txt`                                                                                | Dirección de diseño obligatoria                                                                                                                                                        |
| Enma Vibes                        | `enma-vibes.txt`                                                                                                 | Análisis estético de referencia                                                                                                                                                        |
| Referencias web (research previo) | `referencias-web.txt`                                                                                            | Ya analizado en fase previa. No re-visitar con Playwright                                                                                                                              |
| Entrevistas                       | `respuestas-bruno-ortega.txt`, `respuestas-patricio-campos.txt`, `preguntas.txt`                                 | Contexto sobre fundadores y origen de la empresa                                                                                                                                       |
| Blog                              | (según estructura de `\web`)                                                                                     | 3 artículos a integrar como contenido del blog                                                                                                                                         |
| Paleta                            | `paleta.txt`                                                                                                     | Colores del sitio — ver regla de uso arriba                                                                                                                                            |
| Tipografías                       | `tipografías.txt`                                                                                                | Fuentes del sitio (Google Fonts)                                                                                                                                                       |
| **Golden Paths**                  | **`golden-paths.md`**                                                                                            | **Rutas de navegación y comportamientos críticos. Se mantienen y se verifican manualmente al cerrar cada fase.**                                                                       |
| **Lore**                          | **`\lore\`** (`index.md`, `animation.md`, `layout.md`, `responsive.md`, `routing.md`, `scroll.md`, `testing.md`) | **Base de conocimiento de errores reales del proyecto anterior. Son pistas, no recetas — validar contra el código nuevo antes de actuar. Leer `index.md` primero como índice rápido.** |

---

## Deploy

- **URL de producción (preview):** definir nueva URL de Vercel para `\web2` (no reutilizar la anterior salvo indicación explícita)
- **Repositorio:** confirmar con el usuario si `\web2` vive en el mismo repo (rama nueva) o en repo separado, antes de hacer el primer commit
- **CI/CD:** Vercel conectado al repo — cada push a la rama de despliegue dispara deploy automático
- ⚠️ Cualquier cambio futuro se refleja en producción tras el push. Verificar antes de pushear.
- `git push` solo cuando el usuario lo indique explícitamente. Crear el commit localmente está bien; el push es decisión del usuario.

---

## Estructura del Sitio (según wireframe.pdf, como referencia, no camisa de fuerza)

**Landing Page**, secciones:

- Hero (se mantiene, con ajustes — ver arriba)
- About
- Lo que ofrecemos
- ¿Por qué somos distintos?
- Proyectos
- Equipo
- CTA section
- Footer

**Páginas internas:**

- Nosotros
- Proyectos
- Servicios
- Blog (índice) → artículos individuales

El wireframe define contenido y orden lógico, no el layout visual final — el layout visual se diseña desde cero buscando el estándar Awwwards.

---

## Convenciones para Claude Code

1. Leer este archivo completo antes de empezar. **No leer ni aplicar** `engineering-workflow.md` ni `awwwards-workflow.md` aunque aparezcan en memoria o en archivos antiguos del proyecto. `golden-paths.md` SÍ se lee y se aplica.
2. **Antes de escribir cualquier copy, cifra o claim sobre Enma**, leer `que-es-enma.txt`. Es la única fuente de verdad para datos reales de la empresa. No inventar proyectos, clientes, métricas ni logros que no estén documentados ahí.
3. Antes de implementar animaciones, scroll, layout, responsive, cursor custom o routing, consultar el archivo correspondiente en `\lore\` (ver tabla abajo). Son pistas de errores ya vividos, no instrucciones literales — validar contra el código nuevo.
4. **No usar Playwright** en ningún punto del proyecto (ni desarrollo, ni testing, ni validación, ni verificación de Golden Paths). Toda validación visual y funcional es manual, por el usuario.
5. No crear subagente "verifier".
6. `git push` solo cuando el usuario lo indique explícitamente.
7. Priorizar avance por fases completas y coherentes (Setup → Hero/Navbar ajustado → Landing → Páginas internas → Blog → Pulido), no microtareas inconexas.
8. Toda decisión de diseño debe alinearse con: Visión Diseñadora + Qué es Enma + Moodboard + Paleta (regla de uso cálida/naranja) + Tipografías.
9. Estilo objetivo: **Awwwards 2026** — composición disruptiva, tipografía expresiva, motion con propósito, cursor estilizado, no plantillas genéricas.
10. Validar contraste de color (texto/fondo) en cada sección nueva, especialmente en el Hero ajustado.
11. **Verificar Golden Paths manualmente antes de cerrar cualquier fase.** No marcar una fase como completa si algún Golden Path se rompió.

### Cuándo consultar cada archivo de Lore

| Área                                 | Archivo              | Cuándo leerlo                                                                                       |
| ------------------------------------ | -------------------- | --------------------------------------------------------------------------------------------------- |
| GSAP / ScrollTrigger / CSS animation | `lore/animation.md`  | Antes de escribir cualquier animación con GSAP, pin, stagger, marquee o reveal de texto             |
| Layout / posicionamiento / efectos   | `lore/layout.md`     | Antes de usar `overflow:hidden`, `backgroundAttachment:fixed`, glow de cursor o gradientes animados |
| Responsive / móvil                   | `lore/responsive.md` | Antes de añadir cursor custom, `<br/>` manuales en títulos, o `clamp()` de padding                  |
| Routing / Next.js App Router         | `lore/routing.md`    | Antes de configurar Tailwind, GSAP plugins, rutas dinámicas, OG images o metadata                   |
| Scroll / Lenis / scroll nativo       | `lore/scroll.md`     | Antes de integrar Lenis, usar `100vh` en secciones full-height, o programar `scrollTo`              |
| Testing                              | `lore/testing.md`    | Solo si se añaden tests en algún momento                                                            |

### Patrones críticos para este stack (resumen ejecutivo, ver detalle en Lore)

- **Tailwind v4**: sin `tailwind.config.ts` — tokens de color en `@theme {}` dentro del CSS (`globals.css`).
- **GSAP + SSR**: centralizar imports y registro de plugins en `lib/gsap.ts` con guard `if (typeof window !== 'undefined')`.
- **FOUC de animación**: elementos con animación de entrada deben tener estado inicial como `style` inline antes de que GSAP corra. Usar `gsap.fromTo`, nunca `gsap.from`.
- **`100vh` en iOS Safari**: usar `100svh` en secciones full-height.
- **Pin en móvil**: desactivar `pin:true` completamente en mobile con guard `isMobile`.
- **`anticipatePin: 1`**: obligatorio en secciones con fondo oscuro + `pin:true`.
- **`overflow-x: hidden`**: aplicar en `html` y `body` para bloquear deriva lateral en móvil.
- **Cursor custom**: guard obligatorio con `window.matchMedia('(pointer: fine)')` para no romper táctil.
- **`<br/>` en H2**: no usar en componentes responsive — usar JSX condicional.
- **Next.js 16 `params`**: son `Promise` — hacer `await params` en rutas dinámicas.

---

## Estado del Proyecto

### ✅ Completado (heredado, como insumo)

- Investigación de marca (entrevistas, benchmark, identidad visual, copy, blog)
- Wireframe del sitio (`wireframe.pdf`)
- Paleta, tipografías, moodboard definidos
- Versión primitiva funcional en `\web` (referencia de aprendizaje, no de código)
- Golden Paths definidos en `golden-paths.md` (se mantienen)

### ⏳ Fase Actual

- [x] **Paso 0** — Análisis de `\web`, `golden-paths.md`, estándar Awwwards actual, y material de marca completo
- [x] **Fase A** — Setup del proyecto en `\web2`: Next.js 16 + TypeScript + Tailwind v4 + GSAP + tokens cálidos + fuentes (Manrope/Outfit/JetBrains Mono). Build de producción OK.
- [x] **Fase B** — Hero + NavBar: contraste corregido (grade cálido + scrim + fondo de respaldo), logo con drop-shadow + crossfade, NavBar rediseñado (pill transparente, modo claro/oscuro, drawer móvil), rutas stub para no romper navegación. Golden Paths funcionales verificados (rutas 200, CTA mailto, sin errores).
- [ ] **Fase C** — Landing completa (resto de secciones, diseñadas desde cero), verificar Golden Paths
- [ ] **Fase D** — Páginas internas (Nosotros, Proyectos, Servicios), verificar Golden Paths
- [ ] **Fase E** — Blog, verificar Golden Paths
- [ ] **Fase F** — Cursor custom + pulido de motion + revisión de contraste y coherencia de paleta + verificación final de Golden Paths en todo el sitio
