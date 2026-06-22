import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { PROYECTOS, getProyecto, getProyectoNav } from "@/lib/proyectos";
import ProyectoHero from "@/components/sections/proyecto-detalle/ProyectoHero";
import ProyectoFicha from "@/components/sections/proyecto-detalle/ProyectoFicha";
import ProyectoCuerpo from "@/components/sections/proyecto-detalle/ProyectoCuerpo";
import ProyectoNav from "@/components/sections/proyecto-detalle/ProyectoNav";

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
  return {
    title: proyecto.title,
    description: proyecto.lead,
  };
}

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proyecto = getProyecto(slug);
  if (!proyecto) notFound();

  const nav = getProyectoNav(slug)!;

  return (
    <>
      <NavBar />
      <main>
        <ProyectoHero proyecto={proyecto} />
        <ProyectoFicha facts={proyecto.facts} />
        <ProyectoCuerpo
          context={proyecto.context}
          did={proyecto.did}
          capabilities={proyecto.capabilities}
        />
        <ProyectoNav prev={nav.prev} next={nav.next} />
      </main>
      <Footer />
    </>
  );
}
