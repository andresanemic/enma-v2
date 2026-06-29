// ─────────────────────────────────────────────────────────────────────────────
// BLOG — fuente de datos compartida (sección Blog del landing + mini-landing
// /blog + lectura /blog/[slug]). Única fuente de verdad de copy: que-es-enma.txt
// y los resúmenes derivados de los .docx de \blog (sin inventar datos).
//
// Las 3 notas son reales (título + resumen + autor). El cuerpo completo (`body`)
// se rellena en la Minifase 2 a partir de los .docx; hasta entonces puede faltar.
// ─────────────────────────────────────────────────────────────────────────────

/** Texto inline enriquecido. `string` es el atajo para texto sin formato. */
export type InlineSpan =
  | string
  | { text: string; bold?: true; italic?: true }
  | { text: string; href: string; external?: true };

export type RichText = InlineSpan[];

/** Bloque de cuerpo de un artículo. */
export type ArticleBlock =
  | { type: "p"; spans: RichText }
  | { type: "h2"; text: string };

export type Article = {
  slug: string;
  /** Pill superior (sección/dominio editorial). Outfit uppercase. */
  topic: string;
  title: string;
  /** Resumen — se usa en la franja del landing, como fallback de lead y como
   *  description SEO. Debe quedarse como texto plano (sin enlaces). */
  summary: string;
  /** Lead enriquecido al inicio de la nota. Si falta, se usa `summary`. */
  lead?: RichText;
  author: string;
  /** Etiqueta del autor — Outfit uppercase (lo "técnico" no va en mono). */
  role?: string;
  /** Fecha ISO (para <time> y metadata). */
  date: string;
  cover: string;
  coverAlt: string;
  /** Lado de la imagen en la franja editorial del landing/índice. */
  imageSide: "left" | "right";
  /** Cuerpo de lectura (Minifase 2). Si falta, la página de lectura usa fallback. */
  body?: ArticleBlock[];
};

export const ARTICLES: Article[] = [
  {
    slug: "energia-mas-cara-aysen",
    topic: "Energía",
    title: "En Aysén pagamos la energía más cara, y tenemos cómo cambiarlo",
    summary:
      "Somos la región con menor densidad poblacional del país, lo cual encarece los proyectos energéticos y nos mantiene hoy día con una fuerte dependencia Diesel. Sin embargo, tenemos de todo al alcance para cambiarlo.",
    author: "Bruno Ortega",
    role: "Socio fundador",
    date: "2026-06-22",
    cover: "/blog/portada-aysen-v1.webp",
    coverAlt: "Parque eólico recortado contra una bruma dorada al atardecer",
    imageSide: "left",
    body: [
      { type: "p", spans: [
        `Vivir en la Región de Aysén significa pagar caro por algo tan básico como encender la luz o calefaccionar la casa. No es una percepción: `,
        { text: `es una realidad estructural`, href: `https://radio45sur.cl/2024/06/27/la-luz-mas-cara-de-chile-aumento-en-aysen-llegaria-al-50-acumulado-en-enero-de-2025/`, external: true },
        `. Estamos lejos, somos pocos y mover cualquier cosa hasta acá cuesta. Esa distancia se traduce, casi línea por línea, en el valor que personas y empresas pagamos por la energía, sea eléctrica o térmica.`,
      ] },
      { type: "p", spans: [`El problema es que la energía cara no se queda en la boleta. Encarece todo lo demás. Una industria que consume mucha energía simplemente no es viable en la región.`] },
      { type: "p", spans: [`El ejemplo más claro es el reciclaje: hoy buena parte de los residuos que podríamos procesar acá terminan viajando al norte de Puerto Montt, porque localmente no existe la capacidad de hacerlo a un costo razonable. Perdemos la oportunidad, el empleo y el círculo virtuoso completo.`] },
      { type: "h2", text: `Las renovables ya no son una promesa` },
      { type: "p", spans: [
        `Durante años se habló de energías renovables «no convencionales». Ese apellido ya sobra. Al año 2026 la `,
        { text: `energía eólica, solar, geotérmica e hidráulica`, bold: true },
        ` son tecnologías probadas, con décadas de operación en el mundo. Lo digo desde la experiencia de haber trabajado en proyectos de cada una de ellas: sabemos qué funciona, qué tiene más riesgo y cómo evaluar ese riesgo antes de invertir un peso.`,
      ] },
      { type: "p", spans: [
        `Para un hogar o una empresa de Aysén, esto se traduce en algo muy concreto: autogenerar parte de su energía y, cuando hay red disponible, inyectar el excedente para bajar la cuenta de luz mediante `,
        { text: `netbilling`, href: `https://www.cge.cl/productos-y-servicios/generacion-distribuida-netbilling/`, external: true },
        `. No es ciencia ficción; es ingeniería aplicada al territorio.`,
      ] },
      { type: "h2", text: `Una turbina pensada para el viento patagónico` },
      { type: "p", spans: [
        `En esa línea estamos desarrollando, con financiamiento de la Agencia Nacional de Investigación y Desarrollo (ANID), una `,
        { text: `turbina eólica de baja escala`, href: `/proyectos/turbina-eolica-baja-escala` },
        ` con un diseño resiliente a condiciones que aquí son la norma: vientos excesivos, ráfagas que pasan de la calma a la furia en segundos y turbulencia que cambia de dirección.`,
      ] },
      { type: "p", spans: [`Son máquinas de baja potencia pensadas para instalarse de a muchas, en granjas, ideales para campos, electrificación rural y también para la industria.`] },
      { type: "p", spans: [`Bajar el costo energético no es un fin en sí mismo: es la llave que destraba productividad, empleo y calidad de vida en la región.`] },
      { type: "h2", text: `Co-crear, no imponer` },
      { type: "p", spans: [`Si algo aprendimos operando en un contexto complejo es que las soluciones no se imponen desde un escritorio en Santiago: se construyen junto a quienes viven el problema.`] },
      { type: "p", spans: [`Existe una desconfianza histórica entre la sociedad civil y la industria, y la única forma de cerrarla es trabajando de manera asociativa, conversando y co-creando. No queremos posicionarnos como dominadores de mercado, sino como un socio con quien sentarse a resolver.`] },
      { type: "p", spans: [
        `Aysén tiene viento, agua, sol y calor bajo la tierra. Le sobra energía. Lo que falta es la ingeniería que la transforme en algo aprovechable a un costo justo, hecha por `,
        { text: `gente que entiende el lugar`, href: `/nosotros` },
        `. En eso estamos.`,
      ] },
    ],
  },
  {
    slug: "patagonia-se-resuelve-desde-la-patagonia",
    topic: "Territorio",
    title: "La Patagonia se resuelve desde la Patagonia",
    summary:
      "Porque los desafíos regionales no se resuelven sin entender las particularidades logísticas, climáticas y culturales del territorio.",
    author: "Patricio Campos",
    role: "Socio fundador",
    date: "2026-06-22",
    cover: "/blog/portada-patagonia-v1.webp",
    coverAlt: "Lago turquesa, montañas nevadas y vegetación otoñal de la Patagonia",
    imageSide: "right",
    body: [
      { type: "p", spans: [`La mayoría de las empresas de ingeniería que ofrecen soluciones energéticas y ambientales para la Región de Aysén están instaladas en Santiago. No es un detalle menor. La realidad regional difiere por mucho de la del resto del país, y eso se nota apenas un proyecto se topa con la primera variable que nadie consideró: la logística.`] },
      { type: "p", spans: [
        `Acá las distancias se miden en horas de viaje por tierra y mar. El costo del combustible y `,
        { text: `la dependencia energética`, href: `/blog/energia-mas-cara-aysen` },
        ` no son notas al pie: son factores que, si no se abordan desde la primera línea de un proyecto, pueden matarlo. A eso se suma una idiosincrasia patagona que hay que entender para poder trabajar con la gente, no a pesar de ella.`,
      ] },
      { type: "h2", text: `Pertenencia como ventaja competitiva` },
      { type: "p", spans: [`Entender todo esto —la logística, los costos, la cultura— es precisamente lo que nos diferencia. La pertenencia territorial no es una postal turística que ponemos en la presentación: es conocimiento operativo que se traduce en proyectos que sí funcionan, porque fueron pensados para el lugar donde se van a ejecutar.`] },
      { type: "p", spans: [`Y creo que esa misma capacidad nos va a dar ventaja el día que nos expandamos a otros mercados igualmente desafiantes.`] },
      { type: "h2", text: `Lo que hacemos, en concreto` },
      { type: "p", spans: [
        `Trabajamos principalmente en consultoría, formulación y `,
        { text: `acompañamiento de proyectos`, href: `/proyectos` },
        ` para instrumentos públicos como CORFO, ANID y los Gobiernos Regionales, con foco energético o ambiental.`,
      ] },
      { type: "p", spans: [
        `A eso sumamos dos servicios que veo con enorme potencial: las `,
        { text: `simulaciones computacionales fluidodinámicas (CFD)`, href: `https://www.ansys.com/simulation-topics/what-is-computational-fluid-dynamics`, external: true },
        ` para optimizar el diseño de sistemas que interactúan con fluidos, y la `,
        { text: `cuantificación de huella de carbono`, href: `https://mma.gob.cl/cambio-climatico/cc-02-7-huella-de-carbono/`, external: true },
        ` para empresas y municipalidades.`,
      ] },
      { type: "p", spans: [`El valor de simular es tangible: con capacidad de cómputo podemos validar soluciones complejas de manera rápida y confiable, contrastando la teoría con modelos antes de gastar en terreno. Eso se traduce en eficiencia y, a la larga, en menores costos por el tiempo de ejecución.`] },
      { type: "p", spans: [
        `No me gusta la palabra experto; prefiero `,
        { text: `especialista`, italic: true },
        `. Un socio tecnológico estratégico al que recurres porque sabe lo que hace y porque está donde tú estás.`,
      ] },
      { type: "h2", text: `Descarbonizar también es emprender` },
      { type: "p", spans: [`Detrás de cada proyecto hay un problema mayor que estamos ayudando a resolver: la descarbonización, los costos energéticos y la generación de empleo a través del emprendimiento. En una región como la nuestra, esas tres cosas están entrelazadas. Cuando una solución energética hace viable una industria local, no solo bajan las emisiones: aparece trabajo, aparece arraigo.`] },
      { type: "p", spans: [`Mi aspiración es simple y ambiciosa a la vez: que alguien conozca lo que hacemos y piense «no sabía que esto se hacía acá». Porque sí se hace, y se hace desde la Patagonia.`] },
    ],
  },
  {
    slug: "enma-explicado-en-facil",
    topic: "Enma",
    title: "Enma explicado en fácil: energía y tecnología hechas en la Patagonia",
    summary:
      "Qué somos, qué hacemos y a quién ayudamos, contado en simple: energía y tecnología hechas en la Patagonia para bajar costos y abrir oportunidades.",
    author: "Equipo Enma",
    date: "2026-06-22",
    cover: "/blog/portada-enma-v1.webp",
    coverAlt: "Impresora 3D junto a piezas de turbina prototipadas y herramientas",
    imageSide: "left",
    body: [
      { type: "p", spans: [`Enma es una empresa chilena nacida en la Región de Aysén que diseña soluciones sustentables con foco en energía y medio ambiente. Su nombre lo dice todo: viene de ENergía y Medio Ambiente. En una frase, ayudamos a personas, comunidades y empresas a resolver problemas de energía, reciclaje o calefacción con soluciones hechas a la medida.`] },
      { type: "h2", text: `¿Qué problema resuelve?` },
      { type: "p", spans: [
        `En Aysén la energía es cara, porque la región está aislada y todo cuesta más caro de traer. Eso golpea a las familias en la boleta de la luz y vuelve difícil que muchas industrias funcionen. Enma trabaja, ante todo, para `,
        { text: `bajar ese costo energético`, bold: true },
        `, porque cuando la energía es más barata aumenta la productividad y aparecen nuevas oportunidades.`,
      ] },
      { type: "h2", text: `¿Qué servicios ofrece?` },
      { type: "p", spans: [`Enma acompaña proyectos de principio a fin. Lo más importante es la consultoría y los estudios de soluciones energéticas, que abren la puerta a todo lo demás.`] },
      { type: "p", spans: [
        `También formula y acompaña proyectos para postular a fondos públicos (como `,
        { text: `CORFO`, href: `https://www.corfo.cl`, external: true },
        ` o `,
        { text: `ANID`, href: `https://anid.cl`, external: true },
        `), realiza simulaciones por computador para optimizar diseños (CFD), mide la huella de carbono de empresas y municipios, y ejecuta y mantiene proyectos junto a una red de socios. A eso suma `,
        { text: `charlas y difusión`, href: `/vinculacion` },
        ` sobre energía y medioambiente.`,
      ] },
      { type: "h2", text: `¿Para quién es?` },
      { type: "p", spans: [`Para empresas, municipalidades, comunidades y tomadores de decisión del mundo público y privado que necesiten resolver un problema energético o ambiental. Como cada solución es a la medida, el primer paso siempre es conversar para entender la necesidad.`] },
      { type: "h2", text: `El proyecto que mejor nos representa` },
      { type: "p", spans: [
        `Enma está desarrollando, con apoyo de la ANID, una `,
        { text: `turbina eólica de baja escala`, href: `/proyectos/turbina-eolica-baja-escala` },
        ` diseñada para resistir el viento extremo y cambiante de la Patagonia. Son máquinas pequeñas pensadas para instalarse de a muchas, útiles para el campo, la electrificación rural y la industria, y capaces de ayudar a bajar la cuenta de luz.`,
      ] },
      { type: "h2", text: `¿Cómo trabaja Enma?` },
      { type: "p", spans: [`Con una mezcla de cercanía y tecnología. Cercanía, porque cree en construir confianza y co-crear junto a las comunidades; y tecnología, porque usa herramientas de cómputo y manufactura avanzada para que las soluciones sean rápidas, eficientes y confiables. Si quieres explorar una idea o resolver un problema energético, el camino es simple: escribir y conversar.`] },
    ],
  },
];

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "2026-06-22" → "22 de junio de 2026". Construido sin `Date` para evitar
 *  desfases de zona horaria entre SSR y cliente (lore/routing). */
export function formatArticleDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Nota anterior / siguiente (circular) para la navegación de la lectura. */
export function getArticleNav(slug: string): { prev: Article; next: Article } | null {
  const i = ARTICLES.findIndex((a) => a.slug === slug);
  if (i === -1) return null;
  const len = ARTICLES.length;
  return {
    prev: ARTICLES[(i - 1 + len) % len],
    next: ARTICLES[(i + 1) % len],
  };
}
