import type { Metadata } from "next";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return <PagePlaceholder eyebrow="Notas y difusión" title="Blog" phase="Fase E" />;
}
