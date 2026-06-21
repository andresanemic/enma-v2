import IntroVeil from "@/components/layout/IntroVeil";
import NavBar from "@/components/layout/NavBar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Metrics from "@/components/sections/Metrics";
import Proyecto from "@/components/sections/Proyecto";
import Equipo from "@/components/sections/Equipo";
import Blog from "@/components/sections/Blog";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <IntroVeil />
      <NavBar />
      <main>
        <Hero />
        {/* About + Services comparten un ÚNICO degradado continuo (como el bloque
            CTA+Footer): el contenedor lleva el fondo y ambas secciones van
            transparentes → el degradado fluye constante entre ellas, sin costura. */}
        <div style={{ background: "linear-gradient(180deg, #f8eddd 0%, #fbf3e7 50%, #f7e9d4 100%)" }}>
          <About />
          <Services />
        </div>
        <Metrics />
        {/* Trío terracota: Proyecto (claro) → Equipo (#B12C00 pleno) → Blog (claro). */}
        <Proyecto />
        <Equipo />
        <Blog />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
