import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import BlogIndex from "@/components/sections/BlogIndex";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Columnas de los fundadores y notas del equipo de Enma sobre energía, manufactura sustentable y la vida en la Patagonia: por qué Aysén paga la energía más cara, por qué el territorio importa y qué hacemos en simple.",
};

export default function BlogPage() {
  return (
    <>
      <NavBar />
      <main>
        <BlogIndex />
      </main>
      <Footer />
    </>
  );
}
