import type { Metadata } from "next";
import type { Article } from "@/lib/blog";
import type { Proyecto } from "@/lib/proyectos";

// ── Datos de marca (fuente: docs/que-es-enma.txt + Footer) ──────────────────
export const SITE_URL = "https://enmachile.com";
export const SITE_NAME = "Enma";
export const LEGAL_NAME = "Enma SPA";
export const DEFAULT_TITLE =
  "Enma — Energía y medio ambiente desde la Patagonia";
export const DEFAULT_DESCRIPTION =
  "Empresa chilena de base científico-tecnológica en energía y medio ambiente. Consultoría, simulaciones CFD y proyectos de energías renovables desde la Región de Aysén.";

export const CONTACT_EMAIL = "contacto@enmachile.com";
export const WHATSAPP_NUMBER = "56993377935";
export const WHATSAPP_DISPLAY = "+56 9 9337 7935";
export const TELEPHONE = "+56993377935";
export const WHATSAPP_MESSAGE =
  "Hola Enma! Vengo desde su sitio web y me gustaría conversar sobre un proyecto.";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  WHATSAPP_MESSAGE,
)}`;

export const LOCALITY = "Coyhaique";
export const REGION = "Región de Aysén";
export const COUNTRY = "CL";
export const FOUNDERS = ["Bruno Ortega", "Patricio Campos"];
export const FOUNDING_DATE = "2022";
export const LOGO_PATH = "/logos/logo-verde.webp";

// OG por defecto del sitio (la imagen branded de `app/opengraph-image.tsx`,
// exportada como archivo `/opengraph-image`). Se usa en las páginas que NO tienen
// su propio `opengraph-image.tsx` de segmento (índices internos): sin esto, Next
// NO cascada la OG raíz a los segmentos hijos y quedan sin og:image.
export const DEFAULT_OG_IMAGE = "/opengraph-image";

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

// Forma canónica de un path: termina en "/" (salvo la raíz), para que canonical,
// OG y sitemap apunten a la misma URL que sirve cPanel con `trailingSlash`.
export function canonicalPath(path: string): string {
  return path === "/" ? "/" : path.replace(/\/?$/, "/");
}

// ── Metadata por página (consistencia OG/twitter/canonical) ─────────────────
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  /** Imagen OG. Por defecto la OG branded del sitio. Pasar `null` en rutas que
   *  tienen su propio `opengraph-image.tsx` de segmento (detalle de blog/proyecto)
   *  para no pisar su OG dinámica por slug. */
  ogImage?: string | null;
}): Metadata {
  const { title, description, path, type = "website" } = opts;
  // El sitio se sirve con `trailingSlash` (export estático en cPanel): el
  // canonical y la URL OG deben terminar en "/" para calzar con la URL real.
  const normalizedPath = canonicalPath(path);
  const url = absoluteUrl(normalizedPath);
  const ogPath = opts.ogImage === undefined ? DEFAULT_OG_IMAGE : opts.ogImage;
  const images = ogPath
    ? [{ url: absoluteUrl(ogPath), width: 1200, height: 630, alt: title }]
    : undefined;
  return {
    title,
    description,
    alternates: { canonical: normalizedPath },
    openGraph: {
      type,
      locale: "es_CL",
      siteName: SITE_NAME,
      url,
      title,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images } : {}),
    },
  };
}

// ── Builders JSON-LD (datos propios y controlados) ──────────────────────────
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    legalName: LEGAL_NAME,
    url: SITE_URL,
    logo: absoluteUrl(LOGO_PATH),
    email: CONTACT_EMAIL,
    telephone: TELEPHONE,
    foundingDate: FOUNDING_DATE,
    founder: FOUNDERS.map((name) => ({ "@type": "Person", name })),
    areaServed: { "@type": "AdministrativeArea", name: REGION },
    address: {
      "@type": "PostalAddress",
      addressLocality: LOCALITY,
      addressRegion: REGION,
      addressCountry: COUNTRY,
    },
    description: DEFAULT_DESCRIPTION,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "es-CL",
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function articleJsonLd(article: Article) {
  const url = absoluteUrl(`/blog/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    image: absoluteUrl(article.cover),
    datePublished: article.date,
    dateModified: article.date,
    articleSection: article.topic,
    inLanguage: "es-CL",
    author: { "@type": "Person", name: article.author },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl(LOGO_PATH) },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

// Article sobre una página de proyecto (/proyectos/[slug]). El audit GEO premia
// Article/BlogPosting con headline + datePublished en las páginas de contenido;
// los proyectos son reseñas editoriales del equipo, así que el tipo es defendible.
export function proyectoJsonLd(p: Proyecto) {
  const url = absoluteUrl(canonicalPath(`/proyectos/${p.slug}`));
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.lead,
    image: absoluteUrl(p.image),
    datePublished: p.published,
    dateModified: p.published,
    articleSection: p.domain,
    inLanguage: "es-CL",
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: absoluteUrl(LOGO_PATH) },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

// FAQPage sobre las preguntas frecuentes del landing. Mejora fuerte de citación
// de Q&A por agentes de IA. El contenido (texto plano) vive en lib/faq.ts.
export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-CL",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
