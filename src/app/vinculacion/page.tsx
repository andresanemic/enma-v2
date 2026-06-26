import NavBar from "@/components/layout/NavBar";
import Vinculacion from "@/components/sections/Vinculacion";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Vinculación",
  description:
    "La presencia pública de Enma: charlas de eficiencia energética y cambio climático, presencia en medios y entrevistas en radio y televisión local, y difusión de estudios en la Región de Aysén.",
  path: "/vinculacion",
});

export default function VinculacionPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Vinculación", path: "/vinculacion" },
        ])}
      />
      <NavBar />
      <main>
        <Vinculacion />
      </main>
      <Footer />
    </>
  );
}
