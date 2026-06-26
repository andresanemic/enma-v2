// ─────────────────────────────────────────────────────────────────────────────
// BLOG — fuente de datos compartida (sección Blog del landing + mini-landing
// /blog + lectura /blog/[slug]). Única fuente de verdad de copy: que-es-enma.txt
// y los resúmenes derivados de los .docx de \blog (sin inventar datos).
//
// Las 3 notas son reales (título + resumen + autor). El cuerpo completo (`body`)
// se rellena en la Minifase 2 a partir de los .docx; hasta entonces puede faltar.
// ─────────────────────────────────────────────────────────────────────────────

/** Bloque de cuerpo de un artículo (se compone en la Minifase 2). */
export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string };

export type Article = {
  slug: string;
  /** Pill superior (sección/dominio editorial). Outfit uppercase. */
  topic: string;
  title: string;
  /** Resumen — se usa en la franja del landing y como lead al inicio de la nota. */
  summary: string;
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
    title: "En Aysén pagamos la energía más cara. Y tenemos cómo cambiarlo",
    summary:
      "Somos la región con menor densidad poblacional del país, lo cual encarece los proyectos energéticos y nos mantiene hoy día con una fuerte dependencia Diesel. Sin embargo, tenemos de todo al alcance para cambiarlo.",
    author: "Bruno Ortega",
    role: "Socio fundador",
    date: "2026-06-22",
    cover: "/blog/portada-aysen-v1.webp",
    coverAlt: "Parque eólico recortado contra una bruma dorada al atardecer",
    imageSide: "left",
    body: [
      { type: "p", text: `Vivir en la Región de Aysén significa pagar caro por algo tan básico como encender la luz o calefaccionar la casa. No es una percepción: es una realidad estructural. Estamos lejos, somos pocos y mover cualquier cosa hasta acá cuesta. Esa distancia se traduce, casi línea por línea, en el valor que personas y empresas pagamos por la energía, sea eléctrica o térmica.` },
      { type: "p", text: `El problema es que la energía cara no se queda en la boleta. Encarece todo lo demás. Una industria que consume mucha energía simplemente no es viable en la región. El ejemplo más claro es el reciclaje: hoy buena parte de los residuos que podríamos procesar acá terminan viajando al norte de Puerto Montt, porque localmente no existe la capacidad de hacerlo a un costo razonable. Perdemos la oportunidad, el empleo y el círculo virtuoso completo.` },
      { type: "h2", text: `Las renovables ya no son una promesa` },
      { type: "p", text: `Durante años se habló de energías renovables «no convencionales». Ese apellido ya sobra. Al año 2026 la energía eólica, solar, geotérmica e hidráulica son tecnologías probadas, con décadas de operación en el mundo. Lo digo desde la experiencia de haber trabajado en proyectos de cada una de ellas: sabemos qué funciona, qué tiene más riesgo y cómo evaluar ese riesgo antes de invertir un peso.` },
      { type: "p", text: `Para un hogar o una empresa de Aysén, esto se traduce en algo muy concreto: autogenerar parte de su energía y, cuando hay red disponible, inyectar el excedente para bajar la cuenta de luz mediante netbilling. No es ciencia ficción; es ingeniería aplicada al territorio.` },
      { type: "h2", text: `Una turbina pensada para el viento patagónico` },
      { type: "p", text: `En esa línea estamos desarrollando, con financiamiento de la Agencia Nacional de Investigación y Desarrollo (ANID), una turbina eólica de baja escala con un diseño resiliente a condiciones que aquí son la norma: vientos excesivos, ráfagas que pasan de la calma a la furia en segundos y turbulencia que cambia de dirección. Son máquinas de baja potencia pensadas para instalarse de a muchas, en granjas, ideales para campos, electrificación rural y también para la industria.` },
      { type: "p", text: `Bajar el costo energético no es un fin en sí mismo: es la llave que destraba productividad, empleo y calidad de vida en la región.` },
      { type: "h2", text: `Co-crear, no imponer` },
      { type: "p", text: `Si algo aprendimos operando en un contexto complejo es que las soluciones no se imponen desde un escritorio en Santiago: se construyen junto a quienes viven el problema. Existe una desconfianza histórica entre la sociedad civil y la industria, y la única forma de cerrarla es trabajando de manera asociativa, conversando y co-creando. No queremos posicionarnos como dominadores de mercado, sino como un socio con quien sentarse a resolver.` },
      { type: "p", text: `Aysén tiene viento, agua, sol y calor bajo la tierra. Le sobra energía. Lo que falta es la ingeniería que la transforme en algo aprovechable a un costo justo, hecha por gente que entiende el lugar. En eso estamos.` },
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
      { type: "p", text: `La mayoría de las empresas de ingeniería que ofrecen soluciones energéticas y ambientales para la Región de Aysén están instaladas en Santiago. No es un detalle menor. La realidad regional difiere por mucho de la del resto del país, y eso se nota apenas un proyecto se topa con la primera variable que nadie consideró: la logística.` },
      { type: "p", text: `Acá las distancias se miden en horas de viaje por tierra y mar. El costo del combustible y la dependencia energética no son notas al pie: son factores que, si no se abordan desde la primera línea de un proyecto, pueden matarlo. A eso se suma una idiosincrasia patagona que hay que entender para poder trabajar con la gente, no a pesar de ella.` },
      { type: "h2", text: `Pertenencia como ventaja competitiva` },
      { type: "p", text: `Entender todo esto —la logística, los costos, la cultura— es precisamente lo que nos diferencia. La pertenencia territorial no es una postal turística que ponemos en la presentación: es conocimiento operativo que se traduce en proyectos que sí funcionan, porque fueron pensados para el lugar donde se van a ejecutar. Y creo que esa misma capacidad nos va a dar ventaja el día que nos expandamos a otros mercados igualmente desafiantes.` },
      { type: "h2", text: `Lo que hacemos, en concreto` },
      { type: "p", text: `Trabajamos principalmente en consultoría, formulación y acompañamiento de proyectos para instrumentos públicos como CORFO, ANID y los Gobiernos Regionales, con foco energético o ambiental. A eso sumamos dos servicios que veo con enorme potencial: las simulaciones computacionales fluidodinámicas (CFD) para optimizar el diseño de sistemas que interactúan con fluidos, y la cuantificación de huella de carbono para empresas y municipalidades.` },
      { type: "p", text: `El valor de simular es tangible: con capacidad de cómputo podemos validar soluciones complejas de manera rápida y confiable, contrastando la teoría con modelos antes de gastar en terreno. Eso se traduce en eficiencia y, a la larga, en menores costos por el tiempo de ejecución.` },
      { type: "p", text: `No me gusta la palabra experto; prefiero especialista. Un socio tecnológico estratégico al que recurres porque sabe lo que hace y porque está donde tú estás.` },
      { type: "h2", text: `Descarbonizar también es emprender` },
      { type: "p", text: `Detrás de cada proyecto hay un problema mayor que estamos ayudando a resolver: la descarbonización, los costos energéticos y la generación de empleo a través del emprendimiento. En una región como la nuestra, esas tres cosas están entrelazadas. Cuando una solución energética hace viable una industria local, no solo bajan las emisiones: aparece trabajo, aparece arraigo.` },
      { type: "p", text: `Mi aspiración es simple y ambiciosa a la vez: que alguien conozca lo que hacemos y piense «no sabía que esto se hacía acá». Porque sí se hace, y se hace desde la Patagonia.` },
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
      { type: "p", text: `Enma es una empresa chilena nacida en la Región de Aysén que diseña soluciones sustentables con foco en energía y manufactura. Su nombre lo dice todo: viene de ENergía y MAnufactura. En una frase, ayudamos a personas, comunidades y empresas a resolver problemas de energía, reciclaje o calefacción con soluciones hechas a la medida.` },
      { type: "h2", text: `¿Qué problema resuelve?` },
      { type: "p", text: `En Aysén la energía es cara, porque la región está aislada y todo cuesta más caro de traer. Eso golpea a las familias en la boleta de la luz y vuelve difícil que muchas industrias funcionen. Enma trabaja, ante todo, para bajar ese costo energético, porque cuando la energía es más barata aumenta la productividad y aparecen nuevas oportunidades.` },
      { type: "h2", text: `¿Qué servicios ofrece?` },
      { type: "p", text: `Enma acompaña proyectos de principio a fin. Lo más importante es la consultoría y los estudios de soluciones energéticas, que abren la puerta a todo lo demás. También formula y acompaña proyectos para postular a fondos públicos (como CORFO o ANID), realiza simulaciones por computador para optimizar diseños (CFD), mide la huella de carbono de empresas y municipios, y ejecuta y mantiene proyectos junto a una red de socios. A eso suma charlas y difusión sobre energía y medioambiente.` },
      { type: "h2", text: `¿Para quién es?` },
      { type: "p", text: `Para empresas, municipalidades, comunidades y tomadores de decisión del mundo público y privado que necesiten resolver un problema energético o ambiental. Como cada solución es a la medida, el primer paso siempre es conversar para entender la necesidad.` },
      { type: "h2", text: `El proyecto que mejor nos representa` },
      { type: "p", text: `Enma está desarrollando, con apoyo de la ANID, una turbina eólica de baja escala diseñada para resistir el viento extremo y cambiante de la Patagonia. Son máquinas pequeñas pensadas para instalarse de a muchas, útiles para el campo, la electrificación rural y la industria, y capaces de ayudar a bajar la cuenta de luz.` },
      { type: "h2", text: `¿Cómo trabaja Enma?` },
      { type: "p", text: `Con una mezcla de cercanía y tecnología. Cercanía, porque cree en construir confianza y co-crear junto a las comunidades; y tecnología, porque usa herramientas de cómputo y manufactura avanzada para que las soluciones sean rápidas, eficientes y confiables. Si quieres explorar una idea o resolver un problema energético, el camino es simple: escribir y conversar.` },
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
