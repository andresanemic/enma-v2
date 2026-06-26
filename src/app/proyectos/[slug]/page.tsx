import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ProyectoDetalle from "@/components/sections/ProyectoDetalle";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { PROYECTOS, getProyecto, getProyectoNav } from "@/lib/proyectos";

export function generateStaticParams() {
  return PROYECTOS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const proyecto = getProyecto(slug);
  if (!proyecto) return {};
  return pageMetadata({
    title: proyecto.title,
    description: proyecto.lead,
    path: `/proyectos/${slug}`,
  });
}

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proyecto = getProyecto(slug);
  const nav = getProyectoNav(slug);
  if (!proyecto || !nav) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Proyectos", path: "/proyectos" },
          { name: proyecto.title, path: `/proyectos/${slug}` },
        ])}
      />
      <NavBar />
      <main>
        <ProyectoDetalle proyecto={proyecto} nav={nav} />
      </main>
      <Footer />
    </>
  );
}
