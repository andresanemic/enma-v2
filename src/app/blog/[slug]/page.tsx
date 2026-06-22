import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import BlogArticle from "@/components/sections/BlogArticle";
import { ARTICLES, getArticle, getArticleNav } from "@/lib/blog";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.summary,
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  const nav = getArticleNav(slug);
  if (!article || !nav) notFound();

  return (
    <>
      <NavBar />
      <main>
        <BlogArticle article={article} nav={nav} />
      </main>
      <Footer />
    </>
  );
}
