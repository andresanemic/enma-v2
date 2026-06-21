import NavBar from "@/components/layout/NavBar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Metrics from "@/components/sections/Metrics";
import FAQ from "@/components/sections/FAQ";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <About />
        <Services />
        <Metrics />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
