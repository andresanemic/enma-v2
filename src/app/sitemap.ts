import type { MetadataRoute } from "next";
import { absoluteUrl, canonicalPath } from "@/lib/seo";
import { ARTICLES } from "@/lib/blog";
import { PROYECTOS } from "@/lib/proyectos";

// Necesario con `output: export` para emitir sitemap.xml como archivo estático.
export const dynamic = "force-static";

// URL canónica (con trailing slash) para alinear sitemap con el <link canonical>.
const loc = (path: string) => absoluteUrl(canonicalPath(path));

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: loc("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: loc("/nosotros"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: loc("/proyectos"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: loc("/vinculacion"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: loc("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: loc(`/blog/${a.slug}`),
    lastModified: new Date(a.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const proyectoRoutes: MetadataRoute.Sitemap = PROYECTOS.map((p) => ({
    url: loc(`/proyectos/${p.slug}`),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes, ...proyectoRoutes];
}
