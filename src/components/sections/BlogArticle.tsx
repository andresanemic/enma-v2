"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { formatArticleDate, type Article, type RichText } from "@/lib/blog";
import PrevNextCard from "./PrevNext";

// ─────────────────────────────────────────────────────────────────────────────
// BLOG — lectura (/blog/[slug]). Página enfocada 100% en leer: muy limpia, una
// sola columna de medida cómoda. Estructura: Hero (topic + título + portada
// centrada) → byline (autor · fecha) → lead → cuerpo → prev/next (PrevNextCard,
// el mismo de Proyectos). Acentos teal/verde sobre fondo cálido, como el índice.
// Motion en 2 tiers: portada con clip-wipe (showcase) + familia de fade-up.
// ─────────────────────────────────────────────────────────────────────────────

type NavPair = { prev: Article; next: Article };

export default function BlogArticle({ article, nav }: { article: Article; nav: NavPair }) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Fallback de cuerpo si aún no hay `body` (no debería ocurrir: las 3 notas lo tienen).
  const body = article.body ?? [{ type: "p" as const, spans: [article.summary] }];

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const q = <T extends Element>(s: string, ctx: ParentNode) =>
      Array.from(ctx.querySelectorAll<T>(s));

    if (reduce) {
      blocks.forEach((b) => {
        q("[data-fade]", b).forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
        q("[data-panel]", b).forEach((e) => gsap.set(e, { clipPath: "inset(0% 0 0 0 round 20px)" }));
        q("[data-card]", b).forEach((e) => gsap.set(e, { opacity: 1, y: 0 }));
      });
      return;
    }

    const played = new WeakSet<HTMLElement>();
    const play = (b: HTMLElement) => {
      if (played.has(b)) return;
      played.add(b);
      const id = b.dataset.reveal;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      switch (id) {
        case "hero": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.1 }, 0);
          tl.fromTo(
            q("[data-panel]", b),
            { clipPath: "inset(100% 0 0 0 round 20px)" },
            { clipPath: "inset(0% 0 0 0 round 20px)", duration: 0.95, ease: "power3.inOut" },
            0.2
          );
          break;
        }
        case "body": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 }, 0);
          break;
        }
        case "next": {
          tl.fromTo(q("[data-fade]", b), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7 }, 0);
          tl.fromTo(q("[data-card]", b), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.09 }, 0.12);
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
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    blocks.forEach((b) => io.observe(b));

    const t = window.setTimeout(() => {
      blocks.forEach((b) => {
        const r = b.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) play(b);
      });
    }, 2600);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, []);

  const renderSpans = (spans: RichText) =>
    spans.map((s, i) => {
      if (typeof s === "string") return <span key={i}>{s}</span>;
      if ("href" in s) {
        const ext = s.external;
        return (
          <a
            key={i}
            href={s.href}
            {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="font-medium text-teal underline decoration-teal/40 underline-offset-4 transition-colors duration-200 hover:decoration-teal"
          >
            {s.text}
            {ext && <span aria-hidden="true" className="ml-0.5 text-[0.85em]">↗</span>}
          </a>
        );
      }
      let cls = "";
      if (s.bold) cls += " font-semibold text-ink";
      if (s.italic) cls += " italic";
      return (
        <span key={i} className={cls.trim() || undefined}>
          {s.text}
        </span>
      );
    });

  return (
    <div ref={rootRef} className="w-full">
      {/* ════════ 1 · HERO — título + portada centrada + byline ════════ */}
      <section
        data-reveal="hero"
        data-nav="light"
        className="relative w-full overflow-hidden"
        style={{ background: "linear-gradient(180deg, #f8eddd 0%, #f7e6cf 100%)" }}
      >
        <div className="mx-auto max-w-[860px] px-6 pt-32 text-center sm:px-10 sm:pt-40 md:px-14">
          {/* Volver al índice */}
          <Link
            data-fade
            href="/blog"
            className="group mb-9 inline-flex items-center gap-2 font-body text-sm font-medium uppercase tracking-[0.14em] text-ink/55 transition-colors duration-200 hover:text-teal"
            style={{ opacity: 0 }}
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-x-1" fill="none" aria-hidden="true">
              <path d="M17 10H4M9 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Todas las notas
          </Link>

          {/* Topic — label limpio (sin pill, sin eyebrow numerado) */}
          <p data-fade className="mb-5 font-body text-xs font-semibold uppercase tracking-[0.18em] text-teal" style={{ opacity: 0 }}>
            {article.topic}
          </p>

          <h1
            data-fade
            className="m-0 mx-auto max-w-[20ch] font-display font-light text-ink"
            style={{ opacity: 0, fontSize: "clamp(2.1rem, 5.2vw, 3.8rem)", lineHeight: 1.05, letterSpacing: "-0.035em" }}
          >
            {article.title}
          </h1>

          {/* Byline — autor · rol · fecha */}
          <div data-fade className="mt-7 flex flex-wrap items-center justify-center gap-x-3 gap-y-1" style={{ opacity: 0 }}>
            <span className="font-body text-base font-medium text-ink">Por {article.author}</span>
            {article.role && (
              <span className="font-body text-[11px] uppercase tracking-[0.18em] text-ink/50">{article.role}</span>
            )}
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-ink/30" />
            <time dateTime={article.date} className="font-body text-sm font-light text-ink/55">
              {formatArticleDate(article.date)}
            </time>
          </div>
        </div>

        {/* Portada — clip-wipe (showcase), velo cálido, anclada al borde inferior */}
        <div className="mx-auto mt-12 max-w-[1040px] px-6 pb-12 sm:px-10 md:px-14 md:pb-16">
          <div
            data-panel
            className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] ring-1 ring-ink/12 shadow-[0_30px_70px_-44px_rgba(26,26,26,0.55)]"
            style={{ clipPath: "inset(100% 0 0 0 round 20px)" }}
          >
            <Image
              src={article.cover}
              alt={article.coverAlt}
              fill
              priority
              sizes="(min-width: 1040px) 992px, 92vw"
              className="object-cover object-center"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(150deg, rgba(177,44,0,0.26) 0%, rgba(219,135,70,0.12) 55%, rgba(241,84,28,0.22) 100%)",
                mixBlendMode: "multiply",
              }}
            />
          </div>
        </div>
      </section>

      {/* ════════ 2 · CUERPO — una columna de lectura cómoda ════════ */}
      <section
        data-nav="light"
        className="relative w-full"
        style={{ background: "linear-gradient(180deg, #f7e6cf 0%, #f8eddd 14%, #f8eddd 100%)" }}
      >
        <div data-reveal="body" className="mx-auto max-w-[72ch] px-6 pb-20 pt-12 sm:px-8 md:pb-24 md:pt-16">
          {/* Lead — bajada al inicio de la nota */}
          <p data-fade className="m-0 font-body text-2xl font-light leading-relaxed text-ink/75 sm:text-3xl" style={{ opacity: 0 }}>
            {article.summary}
          </p>

          {/* Regla de apertura (acento teal) */}
          <span data-fade aria-hidden="true" className="mt-9 block h-px w-16 bg-teal/50" style={{ opacity: 0 }} />

          {/* Cuerpo */}
          <div className="mt-9">
            {body.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <div key={i} data-fade className="mt-12 first:mt-0" style={{ opacity: 0 }}>
                    <span aria-hidden="true" className="mb-3 block h-px w-10 bg-teal/60" />
                    <h2 className="m-0 font-display font-medium text-ink" style={{ fontSize: "clamp(1.5rem, 2.8vw, 2.05rem)", lineHeight: 1.18, letterSpacing: "-0.02em" }}>
                      {block.text}
                    </h2>
                  </div>
                );
              }
              if (block.type === "quote") {
                return (
                  <figure key={i} data-fade className="mt-11 mb-2 border-l-4 border-teal pl-6 sm:pl-8" style={{ opacity: 0 }}>
                    <blockquote className="m-0 font-display font-light italic text-ink/85" style={{ fontSize: "clamp(1.5rem, 3vw, 2.1rem)", lineHeight: 1.3, letterSpacing: "-0.015em" }}>
                      {block.text}
                    </blockquote>
                    {block.cite && (
                      <figcaption className="mt-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-teal">
                        {block.cite}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              if (block.type === "fact") {
                return (
                  <div key={i} data-fade className="my-10 rounded-2xl bg-[#f3ddbc] px-7 py-6 ring-1 ring-ink/8" style={{ opacity: 0 }}>
                    <p className="m-0 font-display font-medium text-teal" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.2rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
                      {block.value}
                    </p>
                    <p className="mt-2 font-body text-xs font-semibold uppercase tracking-[0.16em] text-ink/55">
                      {block.label}
                    </p>
                  </div>
                );
              }
              return (
                <p key={i} data-fade className="mt-6 font-body text-xl font-light text-ink/80 first:mt-0" style={{ opacity: 0, lineHeight: 1.8 }}>
                  {renderSpans(block.spans)}
                </p>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ 3 · MÁS NOTAS — prev / next (PrevNextCard, acento verde) ════════ */}
      <section
        data-reveal="next"
        data-nav="light"
        className="relative w-full"
        style={{ background: "linear-gradient(180deg, #f8eddd 0%, #f3ddbc 100%)" }}
      >
        <div className="mx-auto max-w-[1180px] px-6 pb-20 pt-4 sm:px-10 md:px-14 md:pb-24">
          <h2 data-fade className="m-0 font-body text-xs font-semibold uppercase tracking-[0.2em] text-ink/55" style={{ opacity: 0 }}>
            Más notas
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            <PrevNextCard
              item={{ href: `/blog/${nav.prev.slug}`, image: nav.prev.cover, imageAlt: nav.prev.coverAlt, eyebrow: nav.prev.topic, title: nav.prev.title }}
              dir="prev"
              accentHover="group-hover:text-green"
              ariaNoun="Nota"
            />
            <PrevNextCard
              item={{ href: `/blog/${nav.next.slug}`, image: nav.next.cover, imageAlt: nav.next.coverAlt, eyebrow: nav.next.topic, title: nav.next.title }}
              dir="next"
              accentHover="group-hover:text-green"
              ariaNoun="Nota"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
