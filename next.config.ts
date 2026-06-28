import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Export estático para subida manual a cPanel/Namecheap (Fase H8) ──────────
  // Genera `out/` con HTML por ruta. `trailingSlash` deja cada ruta como
  // carpeta/index.html → Apache la sirve nativamente (DirectoryIndex), sin
  // .htaccess ni MultiViews. `unoptimized` es obligatorio para que next/image
  // (Hero) y las OG de next/og salgan en el build estático.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },

  // Oculta el indicador de Next.js Dev Tools (esquina inferior izquierda en dev).
  // Next sigue mostrando errores de compilación/runtime.
  devIndicators: false,
};

export default nextConfig;
