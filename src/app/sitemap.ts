import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { ARTICLES } from "@/lib/blog";
import { PROYECTOS } from "@/lib/proyectos";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/nosotros"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
    { url: absoluteUrl("/proyectos"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/vinculacion"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const articleRoutes: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: absoluteUrl(`/blog/${a.slug}`),
    lastModified: new Date(a.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const proyectoRoutes: MetadataRoute.Sitemap = PROYECTOS.map((p) => ({
    url: absoluteUrl(`/proyectos/${p.slug}`),
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...articleRoutes, ...proyectoRoutes];
}
