import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";
import FieldCursor from "@/components/cursor/FieldCursor";
import "./globals.css";

// Manrope — títulos y subtítulos
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Outfit — cuerpo de texto
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://enmachile.com"),
  title: {
    default: "Enma — Energía y manufactura sustentable desde la Patagonia",
    template: "%s · Enma",
  },
  description:
    "Empresa chilena de base científico-tecnológica en energía y manufactura sustentable. Consultoría, simulaciones CFD y proyectos de energías renovables desde la Región de Aysén.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${outfit.variable}`}
    >
      <body>
        {children}
        <FieldCursor />
      </body>
    </html>
  );
}
