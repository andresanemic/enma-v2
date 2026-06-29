"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/**
 * Fondo del Hero — imagen HD con Ken Burns lento (reemplaza el <video> placeholder).
 * Decorativo (aria-hidden): el contenido semántico del Hero es el H1, no la foto.
 *
 * Carga premium (sin corte duro): cada imagen lleva su `blurDataURL` inline (≈100 B,
 * generado de la propia foto con sharp). `placeholder="blur"` lo pinta al instante —sin
 * red— y la foto nítida se disuelve encima. Así desaparece el flash del fallback café:
 * el primer frame ya son los colores reales de la foto, no un bloque plano.
 *
 * Arquitectura lista para varias imágenes al azar:
 *  · SSR/primer paint → índice 0 (estable, sin hydration mismatch).
 *  · En montaje → índice aleatorio (con 1 imagen es no-op).
 * Sumar imágenes = agregar entradas a HERO_IMAGES (con su blurDataURL); cero cambios de lógica.
 */
const HERO_IMAGES = [
  {
    src: "/hero/hero-aysen-v3.webp",
    blurDataURL:
      "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAwAgCdASoQAAsAA4BaJQBdgCB0ssrO8wRmgAD+8hGFkT7TlL4SSD34iZFpvQcp564F+BYxbrM9+vF9j/uHZwJ/mplXJxSgvyknk1YI4k56nYAA",
  },
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
          placeholder="blur"
          blurDataURL={active.blurDataURL}
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
    </div>
  );
}
