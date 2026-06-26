import NavBar from "@/components/layout/NavBar";
import Proyectos from "@/components/sections/Proyectos";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Proyectos",
  description:
    "El proyecto que más queremos mostrar: una turbina eólica de baja escala financiada por ANID, diseñada para resistir los vientos extremos y turbulentos de la Patagonia. Así trabajamos en Enma.",
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
