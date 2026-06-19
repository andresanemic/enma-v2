import NavBar from "@/components/layout/NavBar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";

export default function Home() {
  return (
    <>
      <NavBar />
      <main>
        <Hero />
        <About />
      </main>
    </>
  );
}
