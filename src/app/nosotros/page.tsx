import NavBar from "@/components/layout/NavBar";
import Nosotros from "@/components/sections/Nosotros";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Nosotros",
  description:
    "Somos Enma: dos ingenieros mecánicos que fundaron en Aysén una empresa de energía y medio ambiente. Nuestro origen, territorio, diferenciadores, misión, valores y equipo.",
  path: "/nosotros",
});

export default function NosotrosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Nosotros", path: "/nosotros" },
        ])}
      />
      <NavBar />
      <main>
        <Nosotros />
      </main>
      <Footer />
    </>
  );
}
