"use client";
import type { Proyecto } from "@/lib/proyectos";
export default function ProyectoNav({
  prev,
  next,
}: {
  prev: Proyecto;
  next: Proyecto;
}) {
  return (
    <section data-nav="light" style={{ background: "#F8EDDD" }}>
      {prev.title} | {next.title}
    </section>
  );
}
