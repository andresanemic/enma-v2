"use client";

import { useState, useEffect, useRef } from "react";

// Copy real, derivado de que-es-enma.txt — sin inventar datos.
// Orientado al tomador de decisiones (público/privado): qué hacen, por qué Aysén,
// alcance del servicio, con quién trabajan, una capacidad técnica que sorprende
// (CFD) y cómo empezar → contacto.
const FAQS = [
  {
    q: "¿Qué hace exactamente Enma?",
    a: "Diseñamos soluciones sustentables en energía y manufactura: consultoría y estudios energéticos, formulación y acompañamiento de proyectos, simulaciones CFD, ensayos en túnel de viento y cuantificación de huella de carbono. Cada solución se ajusta al territorio donde vive.",
  },
  {
    q: "¿Por qué desde Aysén y no desde Santiago?",
    a: "Porque el territorio es parte de la solución. Operar en la Patagonia —con sus distancias, costos logísticos y energéticos— nos obliga a entender contextos que las consultoras instaladas en Santiago no logran adaptar. Esa pertenencia es nuestra ventaja, no un detalle.",
  },
  {
    q: "¿Implementan los proyectos o solo asesoran?",
    a: "Nuestro foco es la consultoría, la formulación y el acompañamiento integral: desde la idea hasta la presentación del proyecto. Para la ejecución, operación y mantenimiento nos apoyamos en una red sólida de socios y colaboradores.",
  },
  {
    q: "¿Con quién trabajan: empresas, comunidades o sector público?",
    a: "Con los tres. Nuestra lógica es principalmente B2B —mediana y gran empresa, industria del reciclaje— y mantenemos trabajo permanente con municipalidades y el Gobierno Regional. Detrás de cada proyecto, siempre hay personas.",
  },
  {
    q: "¿Qué es una simulación CFD y para qué la necesito?",
    a: "Es una simulación fluidodinámica por computador: modelamos cómo se comporta un fluido —viento, agua— alrededor de turbinas, embarcaciones u otros sistemas, para optimizar su diseño antes de construirlo. Más rápido, más eficiente y más confiable.",
  },
  {
    q: "¿Cuánto cuesta y cómo empezamos?",
    a: "Cada solución es a la medida, así que no publicamos precios. El primer paso es una conversación: cuéntanos qué necesitas resolver por correo o WhatsApp y agendamos una reunión para entender tu caso.",
  },
];

export default function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  // Acordeón de apertura única (como la referencia). null = todo cerrado.
  const [open, setOpen] = useState<number | null>(null);

  // Reveal robusto: IntersectionObserver + fallback que SOLO revela si la
  // sección está realmente en viewport (mismo patrón probado de About/CTA).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    const t = window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) setShown(true);
    }, 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  const reveal = () =>
    `transition-all duration-[850ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
      shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
    }`;
  const delay = (i: number) => ({ transitionDelay: `${i * 90}ms` });

  return (
    <section
      ref={ref}
      id="faq"
      data-nav="light"
      className="relative w-full px-6 py-20 sm:px-10 sm:py-28 md:px-14 md:py-32"
      style={{
        background:
          "linear-gradient(180deg, #f8eddd 0%, #fbf3e7 46%, #f7e9d4 100%)",
      }}
    >
      <div className="mx-auto max-w-[1180px]">
        {/* ── Encabezado ── */}
        <div className="mb-12 md:mb-16">
          <h2
            className={`${reveal()} max-w-[16ch] font-display font-light text-ink`}
            style={{
              ...delay(0),
              fontSize: "clamp(1.9rem, 4vw, 3.2rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.03em",
            }}
          >
            Lo que suelen <span className="font-medium text-ember">preguntarnos</span>.
          </h2>
        </div>

        {/* ── Lista / acordeón ── */}
        <ul className="border-b border-ink/12">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className={reveal()} style={delay(2 + i)}>
                <div className="group relative border-t border-ink/12">
                  {/* Línea-acento que recorre el borde superior:
                      cálida (ember) en hover, teal de marca cuando está abierta */}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 top-0 h-px transition-all duration-500 ease-out ${
                      isOpen ? "w-full bg-teal" : "w-0 bg-ember group-hover:w-full"
                    }`}
                  />

                  {/* Fila — pregunta + toggle */}
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-trigger-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-6 pl-0 pr-1 text-left outline-none transition-[padding] duration-300 ease-out focus-visible:pl-3 group-hover:pl-3 sm:py-7"
                  >
                    <span
                      className={`font-display font-light leading-tight transition-colors duration-300 ${
                        isOpen ? "text-teal" : "text-ink group-hover:text-ember"
                      }`}
                      style={{
                        fontSize: "clamp(1.15rem, 2.4vw, 1.75rem)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {item.q}
                    </span>

                    {/* Toggle — firma: relleno cálido que sube + textura de huella */}
                    <span
                      aria-hidden="true"
                      className={`relative grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full ring-1 ring-inset transition-colors duration-300 ${
                        isOpen
                          ? "ring-transparent"
                          : "bg-ink/[0.05] ring-ink/15 group-hover:ring-ember/40"
                      }`}
                    >
                      {/* Relleno que sube como savia/energía:
                          brasa cálida en hover, teal→verde de marca al abrir */}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isOpen
                            ? "translate-y-0 bg-[linear-gradient(to_top,#205358,#3e7c6c)]"
                            : "translate-y-full bg-[linear-gradient(to_top,#b12c00,#f1541c)] group-hover:translate-y-0"
                        }`}
                      />
                      {/* Textura de huella / curvas de nivel */}
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-0 mix-blend-soft-light transition-opacity duration-500 ${
                          isOpen ? "opacity-70" : "opacity-0 group-hover:opacity-70"
                        }`}
                        style={{
                          backgroundImage:
                            "repeating-radial-gradient(circle at 50% 135%, rgba(248,237,221,0.6) 0 1px, transparent 1px 9px)",
                        }}
                      />
                      {/* Glifo +/− — la barra vertical colapsa al abrir */}
                      <span className="relative z-10 block h-4 w-4">
                        <span
                          className={`absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 rounded-full transition-colors duration-300 ${
                            isOpen ? "bg-cream" : "bg-ink group-hover:bg-cream"
                          }`}
                        />
                        <span
                          className={`absolute left-1/2 top-0 h-4 w-[1.5px] -translate-x-1/2 rounded-full transition-all duration-300 ${
                            isOpen
                              ? "scale-y-0 bg-cream"
                              : "scale-y-100 bg-ink group-hover:bg-cream"
                          }`}
                        />
                      </span>
                    </span>
                  </button>

                  {/* Panel de respuesta — expansión grid 0fr→1fr (sin medir DOM) */}
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <p
                        className={`max-w-[62ch] border-l-2 border-teal/35 pb-7 pl-5 pr-12 font-body text-sm leading-relaxed text-ink/60 transition-opacity duration-500 sm:text-base ${
                          isOpen ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
