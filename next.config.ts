import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Oculta el indicador de Next.js Dev Tools (esquina inferior izquierda en dev).
  // Next sigue mostrando errores de compilación/runtime.
  devIndicators: false,
};

export default nextConfig;
