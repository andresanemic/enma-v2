import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Proyectos from "@/components/sections/Proyectos";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Tres proyectos nacidos en Aysén que muestran cómo trabajamos: la turbina eólica de baja escala financiada por ANID, los estudios energéticos para el CIEP y la producción de biodiésel regional.",
};

export default function ProyectosPage() {
  return (
    <>
      <NavBar />
      <main>
        <Proyectos />
      </main>
      <Footer />
    </>
  );
}
