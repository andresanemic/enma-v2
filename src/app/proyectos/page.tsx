import NavBar from "@/components/layout/NavBar";
import Proyectos from "@/components/sections/Proyectos";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Proyectos",
  description:
    "Proyectos de Enma en energía y manufactura, nacidos en Aysén: una turbina eólica de baja escala (ANID), un taller de upcycling de residuos salmoneros (Corfo) y un scouting de bombas de calor industriales para Colbún.",
  path: "/proyectos",
});

export default function ProyectosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Proyectos", path: "/proyectos" },
        ])}
      />
      <NavBar />
      <main>
        <Proyectos />
      </main>
      <Footer />
    </>
  );
}
