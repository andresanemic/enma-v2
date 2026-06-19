import type { Metadata } from "next";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Nosotros" };

export default function NosotrosPage() {
  return <PagePlaceholder eyebrow="Quiénes somos" title="Nosotros" phase="Fase D" />;
}
