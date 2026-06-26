import type { Metadata } from "next";
import { pageMetadata, DEFAULT_TITLE, DEFAULT_DESCRIPTION } from "@/lib/seo";
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

export const metadata: Metadata = {
  ...pageMetadata({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: "/",
  }),
  // La Home usa el title por defecto, sin la plantilla "· Enma" (quedaría
  // "Enma — … · Enma").
  title: DEFAULT_TITLE,
};

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
        {/* Trío sobre degradado claro continuo anclado en crema (#f8eddd, inicio de
            FAQ) que sube calentándose apenas: Proyecto (#eac395→#eecea1) → Equipo
            (#eecea1→#f3ddbc) → Blog (#f3ddbc→#f8eddd). Acentos alternados cálido/
            frío: Proyecto terra → Equipo teal (hilo "E") → Blog terra. */}
        <Proyecto />
        <Equipo />
        <Blog />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
