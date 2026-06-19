import type { Metadata } from "next";
import PagePlaceholder from "@/components/layout/PagePlaceholder";

export const metadata: Metadata = { title: "Proyectos" };

export default function ProyectosPage() {
  return <PagePlaceholder eyebrow="Casos de ingeniería" title="Proyectos" phase="Fase D" />;
}
