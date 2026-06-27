import type { Metadata } from "next";
import type { Article } from "@/lib/blog";

// ── Datos de marca (fuente: docs/que-es-enma.txt + Footer) ──────────────────
export const SITE_URL = "https://enmachile.com";
export const SITE_NAME = "Enma";
export const LEGAL_NAME = "Enma SPA";
export const DEFAULT_TITLE =
  "Enma — Energía y manufactura sustentable desde la Patagonia";
export const DEFAULT_DESCRIPTION =
  "Empresa chilena de base científico-tecnológica en energía y manufactura sustentable. Consultoría, simulaciones CFD y proyectos de energías renovables desde la Región de Aysén.";

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

export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).toString();
}

// ── Metadata por página (consistencia OG/twitter/canonical) ─────────────────
export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const { title, description, path, type = "website" } = opts;
  const url = absoluteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "es_CL",
      siteName: SITE_NAME,
      url,
      title,
      description,
    },
    twitter: { card: "summary_large_image", title, description },
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
