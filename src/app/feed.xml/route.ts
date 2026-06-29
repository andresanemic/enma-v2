import { ARTICLES } from "@/lib/blog";
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_DESCRIPTION,
  absoluteUrl,
  canonicalPath,
} from "@/lib/seo";

// Feed RSS 2.0 del blog. `force-static` lo emite como archivo `out/feed.xml` en el
// export estático (cPanel). Referenciado en <head> vía `alternates.types` (layout).
export const dynamic = "force-static";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const self = absoluteUrl("/feed.xml");
  const lastBuild = new Date().toUTCString();

  const items = ARTICLES.map((a) => {
    const url = absoluteUrl(canonicalPath(`/blog/${a.slug}`));
    return `    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <category>${esc(a.topic)}</category>
      <dc:creator>${esc(a.author)}</dc:creator>
      <pubDate>${new Date(`${a.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(a.summary)}</description>
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(SITE_NAME)} — Blog</title>
    <link>${absoluteUrl("/blog/")}</link>
    <atom:link href="${self}" rel="self" type="application/rss+xml" />
    <description>${esc(DEFAULT_DESCRIPTION)}</description>
    <language>es-CL</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <generator>${SITE_URL}</generator>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
