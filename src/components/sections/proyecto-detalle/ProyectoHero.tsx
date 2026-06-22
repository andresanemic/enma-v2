"use client";
import type { Proyecto } from "@/lib/proyectos";
export default function ProyectoHero({ proyecto }: { proyecto: Proyecto }) {
  return (
    <section data-nav="light" style={{ background: "#F3DDBC", minHeight: "60vh" }}>
      {proyecto.title}
    </section>
  );
}
