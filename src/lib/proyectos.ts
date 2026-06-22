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
  /** Pill superior de la card (dominio). Outfit uppercase. */
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
};

export const PROYECTOS: Proyecto[] = [
  {
    slug: "turbina-eolica-baja-escala",
    domain: "Eólica",
    title: "Turbina eólica de baja escala",
    titleAccent: "eólica",
    kicker: "Diseño propio · financiado por ANID",
    image: "/proyecto/turbina.jpg",
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
    approach: [
      { label: "Simulaciones CFD", detail: "Optimización del diseño en aire" },
      { label: "Túnel de viento propio", detail: "En construcción · Santiago" },
      { label: "Diseño CAD", detail: "Fusion 360 · Inventor · AutoCAD" },
      { label: "Manufactura avanzada", detail: "Impresión 3D · corte CNC" },
      { label: "Estaciones meteorológicas", detail: "Caracterización del viento" },
      { label: "Analizador de redes Clase A", detail: "Medición para netbilling" },
    ],
  },
  {
    slug: "estudios-energeticos-ciep",
    domain: "Hídrica",
    title: "Estudios energéticos para el CIEP",
    kicker: "Consultoría · sistemas aislados de Aysén",
    image: "/proyectos/ciep.jpg",
    imageAlt: "Río de montaña en la Patagonia, potencial para microcentrales hidráulicas",
    cardFacts: [
      "Microcentrales hidráulicas con netbilling",
      "Prefactibilidad solar y eólica",
      "Foco en sistemas aislados",
    ],
    lead:
      "Estudios energéticos que lideramos para el CIEP: el potencial hidráulico de Aysén y la prefactibilidad de soluciones solares y eólicas para sistemas aislados.",
    facts: [
      { label: "Cliente", value: "CIEP — Centro de Investigación en Ecosistemas de la Patagonia" },
      { label: "Línea 1", value: "Potencial de microcentrales hidráulicas para Aysén con netbilling" },
      { label: "Línea 2", value: "Prefactibilidad de plantas solares y eólicas para sistemas aislados" },
      { label: "Enfoque", value: "Autogeneración renovable adaptada a la realidad regional" },
    ],
    context:
      "Aysén es una región aislada, de grandes distancias y baja densidad poblacional, donde la energía —eléctrica y térmica— cuesta especialmente caro. Para muchas comunidades y sistemas aislados, la autogeneración renovable no es una opción más: es la diferencia entre que un proyecto sea viable o no.",
    did:
      "Lideramos para el CIEP estudios del potencial de microcentrales hidráulicas para Aysén mediante netbilling, y de prefactibilidad de plantas solares y eólicas para sistemas aislados de la región. Pusimos nuestra capacidad de cómputo y nuestro conocimiento del territorio al servicio de decisiones de inversión informadas.",
    capabilities: ["Consultoría energética", "Simulación de microrredes (Homer Pro)", "Prefactibilidad", "Conocimiento del territorio"],
  },
  {
    slug: "biodiesel-regional",
    domain: "Manufactura",
    title: "Producción de biodiésel regional",
    kicker: "Manufactura sustentable",
    image: "/proyectos/biodiesel.jpg",
    imageAlt: "Campo de raps en flor, cultivo asociado a la producción de biodiésel",
    cardFacts: [
      "Combustible renovable producido en la región",
      "Línea de manufactura avanzada",
      "Menos dependencia del combustible",
    ],
    lead:
      "Un proyecto de producción de biodiésel a escala regional, dentro de nuestra línea de manufactura avanzada y mitigación ambiental.",
    facts: [
      { label: "Línea", value: "Manufactura avanzada y mitigación ambiental" },
      { label: "Objetivo", value: "Producción de biodiésel a escala regional" },
      { label: "Por qué importa", value: "El alto costo del combustible y la dependencia energética son críticos en Aysén" },
    ],
    context:
      "En Aysén el costo del combustible y la dependencia energética son factores que, si no se abordan desde el inicio, suelen ser fatales para un proyecto o un emprendimiento. Un biodiésel producido en la propia región apunta justo a ese problema.",
    did:
      "Es uno de los proyectos que buscamos destacar dentro de nuestra línea de upcycling, manufactura avanzada y mitigación ambiental.",
    capabilities: ["Manufactura avanzada", "Mitigación ambiental", "Cuantificación de emisiones"],
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
