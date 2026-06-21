import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import Nosotros from "@/components/sections/Nosotros";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Somos Enma: dos ingenieros mecánicos que fundaron en Aysén una empresa de energía y manufactura sustentable. Nuestro origen, territorio, diferenciadores, misión, valores y equipo.",
};

export default function NosotrosPage() {
  return (
    <>
      <NavBar />
      <main>
        <Nosotros />
      </main>
      <Footer />
    </>
  );
}
