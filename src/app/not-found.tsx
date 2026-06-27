import type { Metadata } from "next";
import NavBar from "@/components/layout/NavBar";
import NotFound from "@/components/sections/NotFound";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: true },
};

export default function NotFoundPage() {
  return (
    <>
      <NavBar />
      <main>
        <NotFound />
      </main>
    </>
  );
}
