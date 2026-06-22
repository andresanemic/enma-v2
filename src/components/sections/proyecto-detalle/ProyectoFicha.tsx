"use client";
import type { ProyectoFact } from "@/lib/proyectos";
export default function ProyectoFicha({ facts }: { facts: ProyectoFact[] }) {
  return (
    <section data-nav="light" style={{ background: "#EECEA1" }}>
      {facts.length} facts
    </section>
  );
}
