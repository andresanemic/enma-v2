// ─────────────────────────────────────────────────────────────────────────────
// PROYECTOS — fuente de datos compartida (mini-landing /proyectos + detalle
// /proyectos/[slug]). Única fuente de verdad: que-es-enma.txt.
//
// ⚠ Honestidad de datos: cada proyecto se redacta desde fuentes reales —
// que-es-enma.txt y los informes técnicos originales de cada uno (turbina/ANID,
// upcycling de residuos salmoneros/Corfo, scouting de bombas de calor/Colbún).
// NO inventar cifras, fechas, alcances ni clientes fuera de esas fuentes.
// ─────────────────────────────────────────────────────────────────────────────

/** Valor admite realce con `**negrita**` (markdown mínimo) — se parsea en el render. */
export type ProyectoFact = { label: string; value: string };

/** Métrica de impacto destacable. Cualitativa y honesta: SIN cifras inventadas
 *  (que-es-enma.txt no documenta números duros del proyecto). `figure` es el dato
 *  grande (número o palabra), `label` su nombre, `detail` el respaldo. */
export type ProyectoMetric = { figure: string; label: string; detail: string };

export type Proyecto = {
  slug: string;
  /** Dominio del proyecto. Ya NO se renderiza como pill (H5): se conserva solo
   *  como eyebrow del prev/next cuando haya varios proyectos. Outfit uppercase. */
  domain: string;
  title: string;
  /** Fecha ISO de publicación/actualización de la página del proyecto (no de un
   *  hito inventado): alimenta el byline visible y el `datePublished`/`dateModified`
   *  del Article JSON-LD (señal de frescura para agentes de IA). */
  published: string;
  /** Substring del título a resaltar (acento terra) en el hero del detalle. Solo énfasis. */
  titleAccent?: string;
  /** Subtítulo corto de la cara frontal de la card. */
  kicker: string;
  /** Imagen de portada (cara frontal). */
  image: string;
  imageAlt: string;
  /** 2-3 líneas que se ven en el reverso (flip) de la card. */
  cardFacts: string[];
  // ── Página de detalle ──
  /** Bajada de una línea bajo el título del detalle. */
  lead: string;
  /** Ficha técnica (espécimen). */
  facts: ProyectoFact[];
  /** Párrafo "El contexto". */
  context: string;
  /** Párrafo "Qué hicimos". */
  did: string;
  /** Chips de capacidades empleadas (riel "Cómo lo abordamos"). */
  capabilities: string[];
  /** Riel enriquecido (etiqueta + detalle/herramienta real). Si falta, se usan `capabilities`. */
  approach?: { label: string; detail: string }[];
  /** Galería de fotos del proyecto (orientación mixta). Si falta o está vacía, la
   *  sección "Imágenes del proyecto" del detalle no se muestra. Orden mostrado al azar. */
  gallery?: string[];
  /** Métricas de impacto (cierre de la Ficha técnica). Si falta, el bloque no se muestra. */
  metrics?: ProyectoMetric[];
};

export const PROYECTOS: Proyecto[] = [
  {
    slug: "upcycling-residuos-salmoneros",
    domain: "Economía circular",
    title: "Upcycling de residuos salmoneros",
    published: "2026-06-28",
    titleAccent: "Upcycling",
    kicker: "Taller en Puerto Cisnes · financiado por Corfo",
    image: "/proyectos/upcycling-v1.webp",
    imageAlt: "Taller de upcycling de plástico HDPE reciclado en Puerto Cisnes, Aysén",
    cardFacts: [
      "Financiado por Corfo",
      "Boyas y tuberías salmoneras → tableros de HDPE",
      "Trituradora y prensa diseñadas por nosotros",
    ],
    lead:
      "Un taller que convierte el plástico de la industria salmonera —boyas y tuberías de HDPE— en tableros para la construcción, financiado por Corfo.",
    facts: [
      { label: "Financiamiento", value: "Corfo — programa **Conecta y Colabora** (21CYC-184203)" },
      { label: "Residuo de origen", value: "**HDPE** de la acuicultura: boyas y tuberías en desuso" },
      { label: "Producto", value: "Tableros de **1,22 × 1,22 m**, de 5 a 25 mm de espesor" },
      { label: "Maquinaria", value: "Una **trituradora** y una **prensa caliente**, rediseñadas por nosotros" },
      { label: "Ubicación", value: "Taller propio en **Puerto Cisnes**, Región de Aysén" },
      { label: "Control de proceso", value: "Termocuplas con **PID** y sensor de carga: temperatura y presión exactas" },
      { label: "Usos del material", value: "Madera plástica, mobiliario, revestimiento y hasta embarcaciones" },
    ],
    context:
      "En Aysén reciclar es caro: la región está lejos de las plantas de proceso del norte y mover los residuos cuesta muchísimo. Al mismo tiempo, la industria salmonera local genera grandes volúmenes de plástico —boyas y tuberías de HDPE— que suelen terminar en vertederos, mientras la construcción depende de una madera cada vez más cara en un clima que promedia 2.347 mm de lluvia al año. Vimos ahí una sola oportunidad: convertir ese residuo en un material durable para construir.",
    did:
      "Diseñamos y montamos un taller de upcycling en Puerto Cisnes. Caracterizamos el residuo, rediseñamos desde diseños abiertos una trituradora y una prensa caliente —la pieza clave, capaz de conformar tableros de hasta 1,22 × 1,22 m— y, tras una larga etapa de ensayo y error ajustando temperatura y presión, fabricamos las primeras planchas de HDPE 100% reciclado, listas para mobiliario, revestimiento y construcción.",
    capabilities: ["Análisis de residuos", "Diseño CAD", "Manufactura de maquinaria", "Termoconformado", "Economía circular"],
    approach: [
      { label: "Análisis de residuos", detail: "Boyas y tuberías\n· HDPE acuícola" },
      { label: "Rediseño CAD", detail: "Trituradora\n· prensa caliente" },
      { label: "Fabricación de maquinaria", detail: "Construcción\n· puesta en marcha" },
      { label: "Triturado", detail: "Trozado previo\n· reducción a hojuelas" },
      { label: "Prensado en caliente", detail: "Termocuplas + PID\n· sensor de carga" },
      { label: "Tableros de HDPE", detail: "Madera plástica\n· mobiliario · barcos" },
    ],
    gallery: [
      "/proyectos/galeria/upcycling-galeria-1-v2.webp",
      "/proyectos/galeria/upcycling-galeria-2-v2.webp",
      "/proyectos/galeria/upcycling-galeria-3-v2.webp",
      "/proyectos/galeria/upcycling-galeria-4-v2.webp",
      "/proyectos/galeria/upcycling-galeria-5-v2.webp",
    ],
    metrics: [
      { figure: "1,22 m", label: "Tablero fabricado", detail: "Planchas de hasta 1,22 × 1,22 m, 5–25 mm" },
      { figure: "Corfo", label: "Financiamiento", detail: "Programa Conecta y Colabora" },
      { figure: "100%", label: "Material reciclado", detail: "HDPE recuperado de la industria salmonera" },
    ],
  },
  {
    slug: "turbina-eolica-baja-escala",
    domain: "Eólica",
    title: "Turbina eólica de baja escala",
    published: "2026-06-26",
    titleAccent: "eólica",
    kicker: "Diseño propio · financiado por ANID",
    image: "/proyectos/turbina-v2.webp",
    imageAlt: "Turbina eólica de baja escala en un paisaje abierto de la Patagonia",
    cardFacts: [
      "Financiada por ANID",
      "Resiliente a vientos extremos",
      "Validada con túnel de viento y CFD",
    ],
    lead:
      "Una turbina de diseño propio, financiada por ANID, pensada para los vientos más difíciles de la Patagonia.",
    facts: [
      { label: "Financiamiento", value: "**Agencia Nacional de Investigación y Desarrollo** (ANID)" },
      { label: "Escala", value: "**Baja escala**: pensada para granjas de muchas unidades" },
      { label: "Diseñada para", value: "Vientos excesivos, **ráfagas súbitas** y alta turbulencia" },
      { label: "Aplicación", value: "Campo, casas, **electrificación rural** e industria: netbilling" },
      { label: "Modelado CFD", value: "Simulamos el **comportamiento aerodinámico** en aire antes de fabricar" },
      { label: "Túnel de viento", value: "Validación física con un **túnel propio**, en construcción en Santiago" },
      { label: "Prototipo físico", value: "**Construido y ensayado**, no solo simulado" },
    ],
    context:
      "Buena parte de Aysén tiene un viento difícil: en un mismo minuto puede pasar de una brisa baja a una ráfaga muy energética, y cambiar de dirección de golpe. Es un régimen que destruye a las máquinas pensadas para vientos estables. Quisimos una turbina que no solo tolerara esas condiciones, sino que naciera diseñada para ellas.",
    did:
      "Desarrollamos un diseño propio, resiliente a condiciones no convencionales de viento, y lo validamos de principio a fin, del modelo digital al prototipo físico. «Baja escala» significa que cada máquina es de baja potencia, pero pensada para instalarse en granjas de muchas unidades; para clientes conectados a la red, permite inyectar energía mediante netbilling y bajar la cuenta de luz.",
    capabilities: ["Simulaciones CFD", "Túnel de viento", "Diseño CAD", "Manufactura avanzada", "Prototipado 3D / CNC"],
    // Orden de proceso (secuencia): medir viento → diseñar → simular → validar
    // → fabricar → medir en red. El detalle de cada paso es la herramienta real.
    // `\n` en el detalle fuerza un salto de línea exacto (render con whitespace-pre-line).
    approach: [
      { label: "Estaciones meteorológicas", detail: "Caracterización del viento" },
      { label: "Diseño CAD", detail: "Fusion 360\n· Inventor · AutoCAD" },
      { label: "Simulaciones CFD", detail: "Optimización del diseño en aire" },
      { label: "Túnel de viento propio", detail: "En construcción\n· Santiago" },
      { label: "Manufactura avanzada", detail: "Impresión 3D\n· corte CNC" },
      { label: "Analizador de redes Clase A", detail: "Medición para netbilling" },
    ],
    gallery: [
      "/proyectos/galeria/turbina-galeria-1-v2.webp",
      "/proyectos/galeria/turbina-galeria-2-v2.webp",
      "/proyectos/galeria/turbina-galeria-3-v2.webp",
      "/proyectos/galeria/turbina-galeria-4-v2.webp",
      "/proyectos/galeria/turbina-galeria-5-v2.webp",
    ],
    // Métricas cualitativas honestas (sin cifras inventadas, ver que-es-enma.txt):
    // validación en 3 frentes, financiamiento ANID, diseño propio resiliente.
    metrics: [
      { figure: "3", label: "Frentes de validación", detail: "CFD · túnel de viento · prototipo físico" },
      { figure: "ANID", label: "Financiamiento", detail: "Fondo público competitivo de I+D+i" },
      { figure: "Propio", label: "Túnel de viento", detail: "Resiliente a vientos excesivos y turbulentos" },
    ],
  },
  {
    slug: "scouting-bombas-de-calor",
    domain: "Energía térmica",
    title: "Scouting de bombas de calor industriales",
    published: "2026-06-28",
    titleAccent: "bombas de calor",
    kicker: "Reporte para Colbún · vía OpenBeauchef",
    image: "/proyectos/bombas-calor-v2.webp",
    imageAlt: "Bomba de calor industrial de alta temperatura",
    cardFacts: [
      "Elaborado para Colbún SA",
      "Bombas de calor de alta temperatura (HTHP)",
      "Scouting tecnológico-comercial mundial",
    ],
    lead:
      "Un reporte tecnológico y de scouting de bombas de calor de alta temperatura, elaborado para Colbún: la tecnología clave para descarbonizar el calor industrial.",
    facts: [
      { label: "Cliente", value: "**Colbún SA**, vía OpenBeauchef (FCFM, **U. de Chile**)" },
      { label: "Tecnología", value: "Bombas de calor de **alta temperatura** (HTHP)" },
      { label: "Por qué importa", value: "Descarboniza el calor industrial si se alimenta con **electricidad renovable**" },
      { label: "Estado del arte", value: "**32 productos** mapeados (TRL 5+); la mitad ya en TRL 9" },
      { label: "Scouting comercial", value: "**12 productos** de Japón, Noruega, Alemania, China, R. Unido e Italia" },
      { label: "Rango de operación", value: "Suministro de **85 a 200 °C**; potencias de 30 kW a 30 MW" },
      { label: "Aplicaciones", value: "Industria **alimentaria, petroquímica y manufactura**: secado, destilación, pasteurización" },
    ],
    context:
      "Buena parte del calor que usa la industria todavía se produce quemando combustibles fósiles. Las bombas de calor de alta temperatura pueden reemplazar esa quema: toman calor de baja temperatura y lo elevan hasta el nivel que un proceso necesita, usando solo electricidad. Si esa electricidad es renovable, el proceso se descarboniza. En pocos años la tecnología pasó de entregar 80 °C a superar los 120 °C, abriendo aplicaciones que antes no eran posibles.",
    did:
      "Para Colbún elaboramos, a través de OpenBeauchef, un reporte tecnológico y comercial de la tecnología. Revisamos cómo funcionan y se clasifican estas bombas, dónde está la investigación y qué barreras quedan; cruzamos eso con la demanda térmica de la industria chilena para estimar su potencial de penetración; y rastreamos el mercado mundial para entregar fichas técnicas de proveedores con soluciones comercialmente maduras.",
    capabilities: ["Revisión tecnológica", "Análisis de mercado", "Vigilancia tecnológica", "Descarbonización", "Eficiencia térmica"],
    approach: [
      { label: "Revisión tecnológica", detail: "Funcionamiento\n· clasificaciones" },
      { label: "Madurez TRL", detail: "32 productos\n· estado del arte" },
      { label: "Demanda térmica nacional", detail: "Procesos y sectores\n· potencial en Chile" },
      { label: "Priorización", detail: "Por temperatura\n· de suministro" },
      { label: "Scouting mundial", detail: "Empresas y\n· canales de contacto" },
      { label: "Fichas técnicas", detail: "12 productos\n· casos de éxito" },
    ],
    metrics: [
      { figure: "32", label: "Productos mapeados", detail: "Tecnologías HTHP en TRL 5 o superior" },
      { figure: "200 °C", label: "Temperatura alcanzable", detail: "Suministro de hasta 200 °C, hasta 30 MW" },
      { figure: "6", label: "Países prospectados", detail: "Japón, Noruega, Alemania, China, R. Unido e Italia" },
    ],
  },
];

export function getProyecto(slug: string): Proyecto | undefined {
  return PROYECTOS.find((p) => p.slug === slug);
}

/** Proyecto anterior / siguiente (circular) para la navegación del detalle. */
export function getProyectoNav(slug: string): { prev: Proyecto; next: Proyecto } | null {
  const i = PROYECTOS.findIndex((p) => p.slug === slug);
  if (i === -1) return null;
  const len = PROYECTOS.length;
  return {
    prev: PROYECTOS[(i - 1 + len) % len],
    next: PROYECTOS[(i + 1) % len],
  };
}
