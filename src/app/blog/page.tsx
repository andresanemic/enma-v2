import NavBar from "@/components/layout/NavBar";
import BlogIndex from "@/components/sections/BlogIndex";
import Footer from "@/components/layout/Footer";
import JsonLd from "@/components/seo/JsonLd";
import { pageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Columnas de los fundadores y notas del equipo de Enma sobre energía, manufactura sustentable y la vida en la Patagonia: por qué Aysén paga la energía más cara, por qué el territorio importa y qué hacemos en simple.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      <NavBar />
      <main>
        <BlogIndex />
      </main>
      <Footer />
    </>
  );
}
