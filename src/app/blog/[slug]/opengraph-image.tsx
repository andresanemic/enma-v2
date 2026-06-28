import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { ARTICLES, getArticle } from "@/lib/blog";

// Necesario con `output: export` para prerenderizar la OG como imagen estática.
export const dynamic = "force-static";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Artículo del blog de Enma";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  return renderOgImage({
    title: article?.title ?? "Blog de Enma",
    kicker: article?.topic ?? "Blog",
  });
}
