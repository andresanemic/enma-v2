// ─────────────────────────────────────────────────────────────────────────────
// PROYECTOS — fuente de datos compartida (mini-landing /proyectos + detalle
// /proyectos/[slug]). Única fuente de verdad: que-es-enma.txt.
//
// ⚠ Honestidad de datos: solo la turbina (ANID) tiene información rica documentada.
// Los estudios CIEP y el biodiésel están descritos en una o dos líneas en
// que-es-enma.txt → su detalle lleva únicamente lo confirmado.
// NO inventar cifras, fechas, alcances ni clientes.
// ─────────────────────────────────────────────────────────────────────────────

export type ProyectoFact = { label: string; value: string };

export type Proyecto = {
  slug: string;
  /** Dominio del proyecto. Ya NO se renderiza como pill (H5): se conserva solo
   *  como eyebrow del prev/next cuando haya varios proyectos. Outfit uppercase. */
  domain: string;
  title: string;
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
};

export const PROYECTOS: Proyecto[] = [
  {
    slug: "turbina-eolica-baja-escala",
    domain: "Eólica",
    title: "Turbina eólica de baja escala",
    titleAccent: "eólica",
    kicker: "Diseño propio · financiado por ANID",
    image: "/proyectos/turbina-v1.webp",
    imageAlt: "Turbina eólica de baja escala en un paisaje abierto de la Patagonia",
    cardFacts: [
      "Financiada por ANID",
      "Resiliente a vientos extremos",
      "Validada con túnel de viento y CFD",
    ],
    lead:
      "Una turbina de diseño propio, financiada por ANID, pensada para los vientos más difíciles de la Patagonia.",
    facts: [
      { label: "Financiamiento", value: "Agencia Nacional de Investigación y Desarrollo (ANID)" },
      { label: "Escala", value: "Baja escala — pensada para granjas de muchas unidades" },
      { label: "Diseñada para", value: "Vientos excesivos, ráfagas súbitas y alta turbulencia" },
      { label: "Aplicación", value: "Campo, casas, electrificación rural e industria — netbilling" },
      { label: "Modelado CFD", value: "Simulamos el comportamiento aerodinámico en aire antes de fabricar." },
      { label: "Túnel de viento", value: "Validación física con un túnel propio, en construcción en Santiago." },
      { label: "Prototipo físico", value: "Construido y ensayado, no solo simulado." },
    ],
    context:
      "Buena parte de Aysén tiene un viento difícil: en un mismo minuto puede pasar de una brisa baja a una ráfaga muy energética, y cambiar de dirección de golpe. Es un régimen que destruye a las máquinas pensadas para vientos estables. Quisimos una turbina que no solo tolerara esas condiciones, sino que naciera diseñada para ellas.",
    did:
      "Desarrollamos un diseño propio, resiliente a condiciones no convencionales de viento, y lo validamos de principio a fin, del modelo digital al prototipo físico. «Baja escala» significa que cada máquina es de baja potencia, pero pensada para instalarse en granjas de muchas unidades; para clientes conectados a la red, permite inyectar energía mediante netbilling y bajar la cuenta de luz.",
    capabilities: ["Simulaciones CFD", "Túnel de viento", "Diseño CAD", "Manufactura avanzada", "Prototipado 3D / CNC"],
    // Orden de proceso (secuencia): medir viento → diseñar → simular → validar
    // → fabricar → medir en red. El detalle de cada paso es la herramienta real.
    approach: [
      { label: "Estaciones meteorológicas", detail: "Caracterización del viento" },
      { label: "Diseño CAD", detail: "Fusion 360 · Inventor · AutoCAD" },
      { label: "Simulaciones CFD", detail: "Optimización del diseño en aire" },
      { label: "Túnel de viento propio", detail: "En construcción · Santiago" },
      { label: "Manufactura avanzada", detail: "Impresión 3D · corte CNC" },
      { label: "Analizador de redes Clase A", detail: "Medición para netbilling" },
    ],
    gallery: [
      "/proyectos/galeria/turbina-galeria-1-v1.webp",
      "/proyectos/galeria/turbina-galeria-2-v1.webp",
      "/proyectos/galeria/turbina-galeria-3-v1.webp",
      "/proyectos/galeria/turbina-galeria-4-v1.webp",
      "/proyectos/galeria/turbina-galeria-5-v1.webp",
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
