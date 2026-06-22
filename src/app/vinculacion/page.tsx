import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Vinculacion from "@/components/sections/Vinculacion";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Vinculación",
  description:
    "La presencia pública de Enma: charlas de eficiencia energética y cambio climático, presencia en medios y entrevistas en radio y televisión local, y difusión de estudios en la Región de Aysén.",
};

export default function VinculacionPage() {
  return (
    <>
      <NavBar />
      <main>
        <Vinculacion />
      </main>
      <Footer />
    </>
  );
}
