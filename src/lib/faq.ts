// ─────────────────────────────────────────────────────────────────────────────
// FAQ — espejo en TEXTO PLANO de las preguntas frecuentes del landing, usado para
// el FAQPage JSON-LD (citabilidad de Q&A por agentes de IA).
//
// ⚠ Mantener SINCRONIZADO con components/sections/FAQ.tsx: mismo contenido y orden,
// sin los enlaces (el schema sólo necesita el texto). Fuente: que-es-enma.txt.
// ─────────────────────────────────────────────────────────────────────────────

export const FAQ_SCHEMA: { question: string; answer: string }[] = [
  {
    question: "¿Qué hace exactamente Enma?",
    answer:
      "Diseñamos soluciones sustentables en energía y medio ambiente: consultoría y estudios energéticos, formulación y acompañamiento de proyectos, simulaciones CFD, ensayos en túnel de viento y cuantificación de huella de carbono. Cada solución se adapta al contexto donde funciona.",
  },
  {
    question: "¿Por qué desde Aysén y no desde Santiago?",
    answer:
      "Porque el territorio es parte de la solución. Operar en la Patagonia —con sus distancias, costos logísticos y energéticos— nos obliga a entender contextos que las consultoras instaladas en Santiago no logran adaptar. Esa pertenencia es nuestra ventaja, no un detalle.",
  },
  {
    question: "¿Implementan los proyectos o solo asesoran?",
    answer:
      "Nuestro foco es la consultoría, la formulación y el acompañamiento integral: desde la idea hasta la presentación del proyecto. Para la ejecución, operación y mantenimiento nos apoyamos en una red sólida de socios y colaboradores.",
  },
  {
    question: "¿Con quién trabajan: empresas, comunidades o sector público?",
    answer:
      "Con los tres. Nuestra lógica es principalmente B2B —mediana y gran empresa, industria del reciclaje— y mantenemos trabajo permanente con municipalidades y el Gobierno Regional. Detrás de cada proyecto, siempre hay personas.",
  },
  {
    question: "¿Qué es una simulación CFD y para qué la necesito?",
    answer:
      "Es una simulación fluidodinámica por computador: modelamos cómo se comporta un fluido —viento, agua— alrededor de turbinas, embarcaciones u otros sistemas, para optimizar su diseño antes de construirlo. Más rápido, más eficiente y más confiable.",
  },
  {
    question: "¿Cuánto cuesta y cómo empezamos?",
    answer:
      "Cada solución es a la medida, así que no publicamos precios. El primer paso es una conversación: cuéntanos qué necesitas resolver por correo o WhatsApp y agendamos una reunión para entender tu caso.",
  },
];
