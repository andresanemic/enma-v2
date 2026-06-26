"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Fondo del Hero — imagen HD con Ken Burns lento (reemplaza el <video> placeholder).
 * Decorativo (aria-hidden): el contenido semántico del Hero es el H1, no la foto.
 *
 * Arquitectura lista para varias imágenes al azar:
 *  · SSR/primer paint → índice 0 (estable, sin hydration mismatch).
 *  · En montaje → índice aleatorio (con 1 imagen es no-op).
 * Sumar imágenes = agregar entradas a HERO_IMAGES; cero cambios de lógica.
 */
const HERO_IMAGES = [
  { src: "/hero/hero-aysen-v1.webp" },
] as const;

export default function HeroBackdrop() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (HERO_IMAGES.length > 1) {
      setIndex(Math.floor(Math.random() * HERO_IMAGES.length));
    }
  }, []);

  const active = HERO_IMAGES[index];

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <div className="hero-kenburns absolute inset-0">
        <Image
          src={active.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
