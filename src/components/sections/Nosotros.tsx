"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

// ── Contenido real (1ª persona) — fuente: que-es-enma.txt + entrevistas ──

// TODO: reemplazar por fotografía propia de Enma (territorio Aysén / proceso).
// Placeholder Unsplash (fiordos/bosque patagónico) — distinto al de About.
const IMG_TERRITORIO =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80&auto=format&fit=crop";

type Diferenciador = { lead: string; accent: string; support: string };
const DIFERENCIADORES: Diferenciador[] = [
  {
    lead: "Pertenencia",
    accent: "territorial",
    support:
      "Nacimos en el territorio. El desafío logístico de la Patagonia mata a quien no lo considera desde el primer día.",
  },
  {
    lead: "Soluciones",
    accent: "a la medida",
    support:
      "Adaptamos cada solución a tu contexto, acompañándote de la idea a la ejecución.",
  },
  {
    lead: "Visión estratégica",
    accent: "+ cómputo",
    support:
      "Simulamos y validamos con CFD y túnel de viento antes de construir: más rápido, eficiente y confiable.",
  },
  {
    lead: "Asociatividad",
    accent: "y co-creación",
    support:
      "Co-creamos contigo. Queremos ser el aliado con el que conversar, no un dominador de mercado.",
  },
];

type Valor = { word: string; gloss: string };
const VALORES: Valor[] = [
  { word: "Honestidad", gloss: "Decimos lo que sabemos y lo que todavía no." },
  { word: "Transparencia", gloss: "Cuentas claras y procesos a la vista." },
  { word: "Templanza", gloss: "Cabeza fría para decidir en terreno difícil." },
  { word: "Disciplina", gloss: "Método y rigor, de la simulación a la obra." },
];

type Cofounder = { name: string; role: string; photo: string; alt: string; bio: string };
const COFOUNDERS: Cofounder[] = [
  {
    name: "Bruno Ortega Leiva",
    role: "Gerente de proyecto",
    photo: "/equipo/bruno-ortega-v2.webp",
    alt: "Bruno Ortega, co-fundador de Enma",
    bio: "Ingeniero civil mecánico. Diez años en energías renovables e innovación, donde lidero proyectos de hidrógeno verde y geotermia con mirada territorial y sostenible. Sumo experiencia en IoT, sensorización y automatización.",
  },
  {
    name: "Patricio Campos Cisternas",
    role: "Personal científico-tecnológico",
    photo: "/equipo/patricio-campos.webp",
    alt: "Patricio Campos, co-fundador de Enma",
    bio: "Ingeniero civil mecánico. Diez años en energías renovables, I+D+i y cambio climático, donde lidero proyectos de generación limpia, eficiencia energética y desarrollo tecnológico.",
  },
];

// Helper — palabras de un titular como spans (rise sin clip → seguro al hacer
// wrap, lore/animation). Cada palabra lleva data-attr para animar en stagger.
function words(text: string, attr: string, accentFrom?: number) {
  return text.split(" ").map((w, i) => (
    <span
      key={i}
      data-anim={attr}
      className={`mr-[0.26em] inline-block ${
        accentFrom !== undefined && i >= accentFrom ? "font-medium text-terra" : ""
      }`}
      style={{ opacity: 0, transform: "translateY(0.6em)" }}
    >
      {w}
    </span>
  ));
}

// ── Índice de capítulos (1–7) — marcas verticales mínimas al borde derecho.
// Mapea cada entrada a su <section data-chapter>. ──
const INDEX = [
  { id: "origen", n: "01", label: "Origen" },
  { id: "territorio", n: "02", label: "Territorio" },
  { id: "valores", n: "03", label: "Valores" },
  { id: "problema", n: "04", label: "El problema" },
  { id: "proposito", n: "05", label: "Misión & Visión" },
  { id: "distintos", n: "06", label: "Qué nos distingue" },
  { id: "equipo", n: "07", label: "El equipo" },
];

// Índice flotante: ticks al borde derecho que marcan el capítulo activo y saltan
// a él al hacer click. Sin panel ni fondo. Solo desktop (lg+). El color se adapta
// al tono de la sección que cruza el centro del viewport (igual criterio que el
// NavBar: data-nav). Oculto en la apertura y sobre el footer (active === null).
function SectionIndex() {
  const [active, setActive] = useState<string | null>(null);
  const [tone, setTone] = useState<"light" | "dark">("light");

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const centerY = window.innerHeight / 2;
      let act: string | null = null;
      for (const it of INDEX) {
        const el = document.querySelector<HTMLElement>(`[data-chapter="${it.id}"]`);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= centerY && r.bottom > centerY) {
          act = it.id;
          break;
        }
      }
      let mode = "light";
      for (const el of document.querySelectorAll<HTMLElement>("[data-nav]")) {
        const r = el.getBoundingClientRect();
        if (r.top <= centerY && r.bottom > centerY) {
          mode = el.getAttribute("data-nav") || "light";
          break;
        }
      }
      setActive(act);
      setTone(mode === "dark" ? "dark" : "light");
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = (id: string) => {
    const el = document.querySelector<HTMLElement>(`[data-chapter="${id}"]`);
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const y = el.getBoundingClientRect().top + window.scrollY - 96; // deja aire bajo el navbar
    window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  };

  const shown = active !== null;

  return (
    <nav
      aria-label="Índice de secciones"
      className={`fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 transition-opacity duration-500 lg:flex ${
        shown ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {INDEX.map((it) => {
        const on = active === it.id;
        return (
          <button
            key={it.id}
            type="button"
            onClick={() => go(it.id)}
            aria-current={on ? "true" : undefined}
            aria-label={`Ir a ${it.n} ${it.label}`}
            className="group flex items-center gap-3 outline-none"
          >
            <span className="flex items-baseline gap-1.5 whitespace-nowrap font-body text-[13px] font-medium tracking-wide">
              <span
                className={`tabular-nums transition-opacity duration-300 ${
                  on ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                } ${tone === "dark" ? "text-orange" : "text-terra"}`}
              >
                {it.n}
              </span>
              <span
                className={`-translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${
                  tone === "dark" ? "text-cream/85" : "text-ink/70"
                }`}
              >
                {it.label}
              </span>
            </span>
            <span
              className={`block rounded-full transition-all duration-300 ${
                on
                  ? `w-9 ${tone === "dark" ? "bg-orange" : "bg-terra"}`
                  : `w-5 group-hover:w-7 ${
                      tone === "dark" ? "bg-cream/40 group-hover:bg-cream/70" : "bg-ink/25 group-hover:bg-ink/50"
                    }`
              }`}
              style={{ height: on ? 2 : 1 }}
            />
          </button>
        );
      })}
    </nav>
  );
}

export default function Nosotros() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Orden del equipo: SSR determinista (Bruno izquierda) y el cliente lo
  // re-aleatoriza tras montar —mientras las cards siguen ocultas (sin reveal)—
  // así no hay hydration mismatch ni salto visible. Patrón del Equipo del landing.
  const [teamOrder, setTeamOrder] = useState<[number, number]>([0, 1]);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    setTeamOrder(Math.random() < 0.5 ? [0, 1] : [1, 0]);
  }, []);

  // ── Reveals de contenido por capítulo (IO + fallback gateado por visibilidad,
  // selectores SCOPED al capítulo — lore/animation). Cada capítulo, su efecto. ──
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const chapters = Array.from(root.querySelectorAll<HTMLElement>("[data-chapter]"));
    const q = <T extends Element>(s: string, ctx: ParentNode) =>
      Array.from(ctx.querySelectorAll<T>(s));

    if (reduce) {
      chapters.forEach((c) => {
        q("[data-anim]", c).forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
        q("[data-clip]", c).forEach((e) => gsap.set(e, { clipPath: "inset(0 0% 0 0)", opacity: 1 }));
        q("[data-rise]", c).forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
        q("[data-pop]", c).forEach((e) => gsap.set(e, { opacity: 1, scale: 1 }));
      });
      return;
    }

    const played = new WeakSet<HTMLElement>();
    const play = (c: HTMLElement) => {
      if (played.has(c)) return;
      played.add(c);
      const id = c.dataset.chapter;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      switch (id) {
        case "apertura": {
          tl.fromTo(q("[data-anim='title']", c), { opacity: 0, y: 18, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.9 }, 0);
          tl.fromTo(q("[data-rise]", c), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.3);
          break;
        }
        case "origen": {
          tl.fromTo(q("[data-rise]", c), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 0);
          tl.fromTo(q("[data-clip]", c), { clipPath: "inset(0 100% 0 0)", opacity: 1 }, { clipPath: "inset(0 0% 0 0)", duration: 0.95, ease: "power3.inOut" }, 0.2);
          break;
        }
        case "territorio": {
          tl.fromTo(q("[data-clip]", c), { clipPath: "inset(0 100% 0 0)", opacity: 1 }, { clipPath: "inset(0 0% 0 0)", duration: 0.85, stagger: 0.14, ease: "power2.inOut" }, 0);
          tl.fromTo(q("[data-rise]", c), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 }, 0.3);
          break;
        }
        case "problema": {
          tl.fromTo(q("[data-anim='tesis']", c), { opacity: 0, y: "0.6em" }, { opacity: 1, y: "0em", duration: 0.7, stagger: 0.06 }, 0);
          tl.fromTo(q("[data-rise]", c), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.75 }, 0.55);
          break;
        }
        case "distintos": {
          tl.fromTo(q("[data-rise]", c), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, 0);
          tl.fromTo(q("[data-item]", c), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.15);
          break;
        }
        case "proposito": {
          tl.fromTo(q("[data-rise]", c), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.14 }, 0);
          break;
        }
        case "valores": {
          tl.fromTo(q("[data-rise]", c), { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6 }, 0);
          tl.fromTo(q("[data-pop]", c), { opacity: 0, scale: 0.92, y: 12 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }, 0.15);
          break;
        }
        case "equipo": {
          tl.fromTo(q("[data-rise]", c), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, 0);
          tl.fromTo(q("[data-clip]", c), { clipPath: "inset(0 0 100% 0)", opacity: 1 }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, stagger: 0.16, ease: "power3.inOut" }, 0.2);
          break;
        }
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            play(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    chapters.forEach((c) => io.observe(c));

    // Fallback: revelar SOLO capítulos realmente en viewport (lore/animation).
    const t = window.setTimeout(() => {
      chapters.forEach((c) => {
        const r = c.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) play(c);
      });
    }, 2600);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div ref={rootRef} className="w-full">
      <SectionIndex />

      {/* ════════ RUN A — bitácora clara: apertura → origen → territorio → problema
          Gradiente cálido continuo anclado en crema, sube apenas hacia arena. ════════ */}
      <div
        className="w-full"
        style={{ background: "linear-gradient(180deg, #f8eddd 0%, #f7e9d4 30%, #f3ddbc 62%, #eecea1 100%)" }}
      >
        <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 md:px-14">
          <div>
            {/* ── 00 · Apertura ── */}
            <section
              data-chapter="apertura"
              data-nav="light"
              className="flex min-h-[88svh] flex-col justify-center pb-10 pt-24 sm:pt-32"
            >
              <h1
                data-anim="title"
                className="m-0 max-w-[16ch] font-display font-light text-ink"
                style={{ opacity: 0, fontSize: "clamp(2.5rem, 7vw, 5.5rem)", lineHeight: 1.02, letterSpacing: "-0.035em" }}
              >
                Somos <span className="font-medium text-ember">Enma</span>.
              </h1>
              <p
                data-rise
                className="mt-7 max-w-[40ch] font-body text-lg font-light leading-relaxed text-ink/70 sm:text-xl"
                style={{ opacity: 0 }}
              >
                Energía y manufactura sustentable, diseñadas desde la Patagonia.
                Hechas a la medida de un territorio difícil.
              </p>
              <p
                data-rise
                className="mt-9 font-body text-sm uppercase tracking-[0.22em] text-ink/45"
                style={{ opacity: 0 }}
              >
                <span className="text-terra">EN</span>ergía · <span className="text-terra">MA</span>nufactura
              </p>
            </section>

            {/* ── 01 · Origen ── */}
            <section data-chapter="origen" data-nav="light" className="grid items-center gap-10 py-10 md:grid-cols-2 md:gap-16 md:py-14">
              <div className="order-2 md:order-1">
                <p data-rise className="font-body text-sm uppercase tracking-[0.22em] text-terra/80" style={{ opacity: 0 }}>
                  01 · Origen
                </p>
                <h2
                  data-rise
                  className="mt-4 max-w-[20ch] font-display font-light text-ink"
                  style={{ opacity: 0, fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
                >
                  Nos fuimos a Aysén a resolver, de raíz, el problema de la energía.
                </h2>
                <p data-rise className="mt-6 max-w-[48ch] font-body text-base font-light leading-relaxed text-ink/70 sm:text-lg" style={{ opacity: 0 }}>
                  Nos conocimos en el colegio, en Santiago, y los dos terminamos siendo
                  ingenieros mecánicos. En vez de quedarnos donde todo era más fácil,
                  nos fuimos a vivir a la Región de Aysén.
                </p>
                <p data-rise className="mt-4 max-w-[48ch] font-body text-base font-light leading-relaxed text-ink/70 sm:text-lg" style={{ opacity: 0 }}>
                  Entre 2022 y 2023 fundamos Enma en Puerto Cisnes, al alero de dos
                  proyectos: el upcycling de residuos salmoneros que diseñó Patricio y
                  la calefacción geotérmica que supervisó Bruno. Ese cruce —energía y
                  residuos, resueltos con ingeniería a la medida en un territorio
                  difícil— es nuestro ADN.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <div data-clip className="group overflow-hidden rounded-3xl bg-sand" style={{ clipPath: "inset(0 100% 0 0)" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={IMG_TERRITORIO}
                    alt="Paisaje de la Región de Aysén, Patagonia chilena"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                    style={{ aspectRatio: "4 / 5" }}
                  />
                </div>
              </div>
            </section>

            {/* ── 02 · Territorio ── */}
            <section data-chapter="territorio" data-nav="light" className="relative py-10 md:py-14">
              {/* Textura — curvas de nivel finísimas (huella del territorio) */}
              <svg aria-hidden="true" className="pointer-events-none absolute -right-20 top-1/2 hidden h-[360px] w-[560px] -translate-y-1/2 text-ink/[0.06] lg:block" viewBox="0 0 600 400" fill="none">
                {[0, 26, 52, 78, 104, 130].map((o) => (
                  <path key={o} d={`M-20 ${300 - o} C 150 ${360 - o}, 320 ${200 - o}, 470 ${300 - o} S 760 ${380 - o}, 920 ${260 - o}`} stroke="currentColor" strokeWidth="1.5" />
                ))}
              </svg>
              <p data-rise className="font-body text-sm uppercase tracking-[0.22em] text-terra/80" style={{ opacity: 0 }}>
                02 · Territorio
              </p>
              <h2 className="mt-4 max-w-[24ch] font-display font-light text-ink" style={{ fontSize: "clamp(1.9rem, 4vw, 3.2rem)", lineHeight: 1.08, letterSpacing: "-0.03em" }}>
                <span data-clip className="block" style={{ clipPath: "inset(0 100% 0 0)" }}>
                  Operar en Aysén
                </span>
                <span data-clip className="block font-medium text-ember" style={{ clipPath: "inset(0 100% 0 0)" }}>
                  es nuestra ventaja.
                </span>
              </h2>
              <p data-rise className="mt-6 max-w-[58ch] font-body text-base font-light leading-relaxed text-ink/70 sm:text-lg" style={{ opacity: 0 }}>
                Una región aislada, de grandes distancias y logística cara, donde
                personas y empresas pagan un valor altísimo por la energía. Las
                empresas de ingeniería de este tipo suelen estar en Santiago y no
                logran entender esa realidad. Nosotros la entendemos completamente.
              </p>
            </section>

            {/* ── 03 · Valores ── */}
            <section data-chapter="valores" data-nav="light" className="py-10 md:py-14">
              <p data-rise className="font-body text-sm uppercase tracking-[0.22em] text-terra/80" style={{ opacity: 0 }}>
                03 · Valores
              </p>
              <h2 data-rise className="mt-4 max-w-[20ch] font-display font-light text-ink" style={{ opacity: 0, fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                Principios que sostienen cómo trabajamos.
              </h2>
              {/* Ficha técnica — el MISMO panel de "lámina de cotas" del detalle de
                  proyectos (hairlines, marca de registro, barra de cota), para que la
                  página hable con el resto del sitio. Cada valor = término; su glosa =
                  descripción. Celdas que encienden en hover. */}
              <dl className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[20px] bg-ink/12 shadow-[0_24px_60px_-40px_rgba(26,26,26,0.55)] ring-1 ring-ink/12 sm:grid-cols-2">
                {VALORES.map((v) => (
                  <div
                    key={v.word}
                    data-pop
                    style={{ opacity: 0 }}
                    className="group relative bg-cream/75 px-6 py-7 transition-colors duration-300 hover:bg-sand/80 sm:px-8 sm:py-8"
                  >
                    {/* Marca de registro (cruz de cotas) — gira y se enciende en hover */}
                    <svg
                      viewBox="0 0 12 12"
                      aria-hidden="true"
                      className="absolute right-5 top-5 h-3 w-3 text-ink/25 transition-all duration-300 group-hover:rotate-90 group-hover:text-ember"
                      fill="none"
                    >
                      <path d="M6 0.5v11M0.5 6h11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                    </svg>
                    {/* Término (el valor) — con la barra de cota que crece en hover */}
                    <dt className="flex items-baseline gap-3 pr-8">
                      <span className="mt-1 h-4 w-[3px] shrink-0 self-start rounded-full bg-terra transition-all duration-300 group-hover:h-5 group-hover:bg-ember" />
                      <span
                        className="font-display font-medium leading-snug text-ink transition-colors duration-200 group-hover:text-terra"
                        style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)", letterSpacing: "-0.02em" }}
                      >
                        {v.word}
                      </span>
                    </dt>
                    {/* Descripción (la glosa) */}
                    <dd className="mt-3 max-w-[38ch] pl-[15px] font-body text-base font-light leading-relaxed text-ink/65 transition-colors duration-300 group-hover:text-ink/80">
                      {v.gloss}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* ── 04 · El problema ── */}
            <section data-chapter="problema" data-nav="light" className="relative py-12 md:pt-16 md:pb-10">
              {/* Ilustración de las torres (dibujo original, transparente) como
                  textura del capítulo. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 top-1/2 hidden w-[650px] -translate-y-1/2 lg:block"
              >
                <Image
                  src="/illustrations/torres-electricas.png"
                  alt=""
                  width={1761}
                  height={893}
                  className="h-auto w-full opacity-20"
                />
              </div>
              <p data-rise className="relative font-body text-sm uppercase tracking-[0.22em] text-terra/80" style={{ opacity: 0 }}>
                04 · El problema que resolvemos
              </p>
              <h2
                aria-label="Bajamos el costo de la energía en la Patagonia."
                className="relative mt-5 max-w-[16ch] font-display font-light text-ink"
                style={{ fontSize: "clamp(2.2rem, 6vw, 4.4rem)", lineHeight: 1.04, letterSpacing: "-0.035em" }}
              >
                <span aria-hidden="true">{words("Bajamos el costo de la energía en la Patagonia.", "tesis", 7)}</span>
              </h2>
              <p data-rise className="relative mt-7 max-w-[56ch] font-body text-base font-light leading-relaxed text-ink/70 sm:text-lg" style={{ opacity: 0 }}>
                Al reducir ese costo aumenta la productividad, se abre la puerta a
                tecnologizar la industria y se vuelve viable lo que hoy no lo es —como
                reciclar en la región en vez de enviar todo al norte de Puerto Montt.
                En el fondo: descarbonización, menores costos y más empleo local.
              </p>
            </section>

            {/* ── 05 · Misión & Visión ── */}
            <section data-chapter="proposito" data-nav="light" className="py-12 md:pt-10 md:pb-16">
              <p data-rise className="font-body text-sm uppercase tracking-[0.22em] text-terra/80" style={{ opacity: 0 }}>
                05 · Misión &amp; Visión
              </p>
              <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
                <div data-rise style={{ opacity: 0 }}>
                  <h3 className="font-display text-xl font-medium text-ink sm:text-2xl">Misión</h3>
                  <p className="mt-4 max-w-[46ch] font-body text-base font-light leading-relaxed text-ink/70 sm:text-lg">
                    Diseñar y desarrollar soluciones sustentables en energía y
                    manufactura para personas, comunidades y empresas, resolviendo
                    problemas reales de un territorio complejo y reduciendo los costos
                    energéticos y el impacto ambiental.
                  </p>
                </div>
                <div data-rise style={{ opacity: 0 }}>
                  <h3 className="font-display text-xl font-medium text-ink sm:text-2xl">Visión</h3>
                  <p className="mt-4 max-w-[46ch] font-body text-base font-light leading-relaxed text-ink/70 sm:text-lg">
                    A 5 y 10 años, aportar a la competitividad de Aysén y a la calidad
                    de vida de su gente: ver implementados proyectos que mejoren la
                    suficiencia eléctrica, mitiguen la contaminación ambiental y
                    reduzcan los desechos.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ════════ 06 · QUÉ NOS DISTINGUE — ancla oscura cálida (el "núcleo")
          Único respiro oscuro de la página: la huella se sumerge. ════════ */}
      <section
        data-chapter="distintos"
        data-nav="dark"
        className="relative w-full overflow-hidden py-14 text-cream sm:py-20 md:py-28"
        style={{ background: "linear-gradient(180deg, #1d100a 0%, #2a1206 55%, #3a1206 100%)" }}
      >
        {/* Glow brasa — energía cálida sobre base oscura (núcleo geotérmico) */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(70% 50% at 50% 0%, rgba(241,84,28,0.18) 0%, transparent 62%)" }} />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-10 md:px-14">
          <div>
          <p data-rise className="font-body text-sm uppercase tracking-[0.22em] text-orange/80" style={{ opacity: 0 }}>
            06 · Qué nos distingue
          </p>
          <h2 data-rise className="mt-4 max-w-[22ch] font-display font-light text-cream/90" style={{ opacity: 0, fontSize: "clamp(1.9rem, 4vw, 3.2rem)", lineHeight: 1.08, letterSpacing: "-0.03em" }}>
            Las fortalezas que nos definen.
          </h2>

          <div className="mt-14 flex flex-col gap-px md:mt-20">
            {DIFERENCIADORES.map((d, i) => (
              <div
                key={i}
                data-item
                style={{ opacity: 0 }}
                className="group grid grid-cols-1 items-baseline gap-x-10 gap-y-3 border-t border-cream/12 py-8 transition-[padding] duration-300 ease-out hover:pl-3 md:grid-cols-[1fr_minmax(0,42ch)] md:py-10"
              >
                <h3
                  className="m-0 font-display font-semibold leading-[0.98]"
                  style={{ fontSize: "clamp(1.9rem, 5vw, 4rem)", letterSpacing: "-0.03em" }}
                >
                  <span className="text-cream/85 transition-colors duration-300 group-hover:text-cream">{d.lead}</span>{" "}
                  <span className="text-orange transition-colors duration-300 group-hover:text-ember">{d.accent}</span>
                </h3>
                <p className="font-body text-base font-light leading-relaxed text-cream/65 transition-colors duration-300 group-hover:text-cream/85 sm:text-lg">
                  {d.support}
                </p>
              </div>
            ))}
            <span className="block border-t border-cream/12" aria-hidden="true" />
          </div>
          </div>
        </div>
      </section>

      {/* ════════ RUN B — resurface a la luz: propósito → valores → equipo ════════ */}
      <div
        className="w-full"
        style={{ background: "linear-gradient(180deg, #f8eddd 0%, #f3ddbc 100%)" }}
      >
        <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 md:px-14">
          <div>
            {/* ── 07 · Equipo ── */}
            <section data-chapter="equipo" data-nav="light" className="py-10 pb-14 md:py-14 md:pb-20">
              <p data-rise className="font-body text-sm uppercase tracking-[0.22em] text-teal/80" style={{ opacity: 0 }}>
                07 · El equipo
              </p>
              <h2 data-rise className="mt-4 max-w-[18ch] font-display font-light text-ink" style={{ opacity: 0, fontSize: "clamp(1.9rem, 4vw, 3.2rem)", lineHeight: 1.06, letterSpacing: "-0.03em" }}>
                Dos socios, <span className="font-medium text-teal">un propósito</span>.
              </h2>
              <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
                {teamOrder.map((idx) => {
                  const cf = COFOUNDERS[idx];
                  return (
                  <article key={cf.name} className="flex flex-col items-start gap-6 sm:flex-row sm:gap-8">
                    <div data-clip className="group relative aspect-[4/5] w-[200px] shrink-0 overflow-hidden rounded-[20px] ring-1 ring-ink/15 sm:w-[240px]" style={{ clipPath: "inset(0 0 100% 0)" }}>
                      <Image src={cf.photo} alt={cf.alt} fill sizes="(min-width:768px) 240px, 60vw" className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]" />
                    </div>
                    <div className="min-w-0">
                      <h3 data-rise className="m-0 font-display font-light leading-tight text-ink" style={{ opacity: 0, fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)", letterSpacing: "-0.02em" }}>
                        {cf.name}
                      </h3>
                      <p data-rise className="mt-1.5 font-body text-[11px] uppercase tracking-[0.2em] text-ink/55" style={{ opacity: 0 }}>
                        {cf.role}
                      </p>
                      <p data-rise className="mt-4 max-w-[42ch] font-body text-base font-light leading-relaxed text-ink/70" style={{ opacity: 0 }}>
                        {cf.bio}
                      </p>
                    </div>
                  </article>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
