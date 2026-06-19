"use client";

type Props = {
  src: string;
  poster?: string;
  className?: string;
};

/**
 * Fondo de video del Hero — loop nativo, muted, full-bleed.
 * Placeholder (TODO: reemplazar con material real de Enma — Patagonia / proceso / I+D).
 * Versión simple y robusta: sin captura de frames (menos puntos de fallo que el
 * boomerang anterior). El usuario sustituirá el `src` por su propio video.
 */
export default function HeroVideo({ src, poster, className }: Props) {
  return (
    <video
      className={className ?? "absolute inset-0 h-full w-full object-cover"}
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}
