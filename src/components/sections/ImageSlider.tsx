"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────────────────
// SLIDER de fotos — una a la vez. Dos modos:
//   · fit="cover"   → caja de aspecto fijo (aspectClass) que rellena y recorta
//                     (fotos homogéneas, p. ej. participaciones de Vinculación).
//   · fit="contain" → modo "hug": ALTO FIJO (heightClass). El "escenario" (marco
//                     invisible que sostiene las flechas) tiene el ANCHO de la foto
//                     más ancha —la posición horizontal— y NO se mueve; dentro, la
//                     caja con borde se ajusta a la proporción real de cada foto
//                     (borde pegado a la imagen). Así el slider no cambia de alto
//                     entre una 16:9 y una 9:16, y las flechas quedan siempre fijas.
// Compartido por Vinculación (acordeón) y el detalle de Proyectos (galería).
// Cada control detiene la propagación por si vive dentro de una fila clickeable.
// ─────────────────────────────────────────────────────────────────────────────
// Clases literales por acento (Tailwind no admite interpolar el token).
const ACCENTS = {
  ember: {
    arrowHover: "hover:bg-ember hover:text-cream",
    ring: "focus-visible:ring-ember/60",
    dotOn: "bg-ember",
  },
  terra: {
    arrowHover: "hover:bg-terra hover:text-cream",
    ring: "focus-visible:ring-terra/60",
    dotOn: "bg-terra",
  },
} as const;

export default function ImageSlider({
  images,
  title,
  active = true,
  reduceMotion,
  fit = "cover",
  aspectClass = "aspect-[3/2]",
  heightClass = "h-[clamp(300px,54vh,600px)]",
  sizes = "(min-width: 768px) 55vw, 90vw",
  showCounter = true,
  accent = "ember",
}: {
  images: string[];
  title: string;
  /** Si el slider vive en un panel colapsable, gobierna el tabindex de los controles. */
  active?: boolean;
  reduceMotion: boolean;
  fit?: "cover" | "contain";
  /** Aspecto de la caja fija en modo cover (p. ej. "aspect-[3/2]"). */
  aspectClass?: string;
  /** Alto fijo de la caja en modo hug/contain (el ancho lo da cada foto). */
  heightClass?: string;
  sizes?: string;
  /** Contador "n / total" en la esquina. */
  showCounter?: boolean;
  /** Color de acento de los controles (flechas + puntos). */
  accent?: "ember" | "terra";
}) {
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(new Set());
  // Proporción real (w/h) de cada foto, medida al cargar — el modo hug la usa para
  // ajustar el ancho de la caja a la imagen activa manteniendo el alto fijo.
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const stop = (e: { stopPropagation: () => void }) => e.stopPropagation();
  const go = (n: number) => setIdx((n + images.length) % images.length);
  const many = images.length > 1;
  // Color de acento de los controles (flechas hover + puntos). Tailwind necesita
  // clases literales, así que se mapean (no interpolar el token en la clase).
  const A = ACCENTS[accent];
  const hug = fit === "contain";
  // Proporción de la foto activa (la caja con borde) y la más ancha (el escenario
  // que sostiene las flechas, fijo en la posición horizontal). Fallback 4/3.
  const curRatio = ratios[idx] ?? 4 / 3;
  const maxRatio = Math.max(4 / 3, ...Object.values(ratios));

  const onImgLoad = (i: number, t: HTMLImageElement) => {
    if (t.naturalWidth && t.naturalHeight) {
      setRatios((prev) =>
        prev[i] ? prev : { ...prev, [i]: t.naturalWidth / t.naturalHeight }
      );
    }
    setLoaded((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
  };

  // Modo COVER (Vinculación): imágenes apiladas que rellenan la caja 3:2 fija.
  const coverImages = images.map((src, i) => (
    <Image
      key={src}
      src={src}
      alt={`${title} — imagen ${i + 1} de ${images.length}`}
      fill
      sizes={sizes}
      onLoad={(e) => onImgLoad(i, e.currentTarget)}
      className="object-cover"
      style={{
        opacity: i === idx && loaded.has(i) ? 1 : 0,
        transition: reduceMotion ? "none" : "opacity 500ms ease-out",
      }}
    />
  ));

  // Modo HUG (galería): cada foto en su PROPIO marco, dimensionado a su proporción
  // real (alto fijo del escenario, ancho según ratio). Solo se cruzan por opacidad,
  // así ninguna se re-encaja al cambiar la activa → sin "flash"/zoom en ningún sentido.
  const hugImages = images.map((src, i) => (
    <div
      key={src}
      className="absolute inset-y-0 left-1/2 max-w-full -translate-x-1/2 overflow-hidden rounded-xl ring-1 ring-ink/15"
      style={{
        aspectRatio: String(ratios[i] ?? 4 / 3),
        opacity: i === idx && loaded.has(i) ? 1 : 0,
        transition: reduceMotion ? "none" : "opacity 500ms ease-out",
        pointerEvents: i === idx ? "auto" : "none",
      }}
    >
      <Image
        src={src}
        alt={`${title} — imagen ${i + 1} de ${images.length}`}
        fill
        sizes={sizes}
        onLoad={(e) => onImgLoad(i, e.currentTarget)}
        className="object-cover"
      />
    </div>
  ));

  const controls = many && (
    <>
      {/* Flechas — viven en el escenario (posición horizontal fija) */}
      <button
        type="button"
        aria-label="Foto anterior"
        tabIndex={active ? 0 : -1}
        onClick={(e) => {
          stop(e);
          go(idx - 1);
        }}
        onKeyDown={stop}
        className={`absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-ink shadow-[0_8px_20px_-10px_rgba(26,26,26,0.7)] backdrop-blur-sm transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 ${A.arrowHover} ${A.ring}`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Foto siguiente"
        tabIndex={active ? 0 : -1}
        onClick={(e) => {
          stop(e);
          go(idx + 1);
        }}
        onKeyDown={stop}
        className={`absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-cream/85 text-ink shadow-[0_8px_20px_-10px_rgba(26,26,26,0.7)] backdrop-blur-sm transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 ${A.arrowHover} ${A.ring}`}
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Contador */}
      {showCounter && (
        <span className="absolute bottom-3 right-3 z-10 rounded-full bg-ink/55 px-2.5 py-1 font-body text-xs font-medium tabular-nums text-cream backdrop-blur-sm">
          {idx + 1} / {images.length}
        </span>
      )}
    </>
  );

  return (
    <div className="w-full">
      {/* Escenario: marco que fija la posición de las flechas. En hug es invisible
          y tiene el ancho de la foto más ancha; en cover es la propia caja. */}
      <div
        className={
          hug
            ? // Móvil: el escenario usa la proporción de la foto activa (las flechas
              // abrazan la imagen). Desktop (md+): usa la foto más ancha, así las
              // flechas quedan fijas en la posición horizontal y no se mueven.
              `relative mx-auto overflow-hidden ${heightClass} max-w-full [aspect-ratio:var(--cur)] md:[aspect-ratio:var(--max)]`
            : `relative ${aspectClass} w-full overflow-hidden rounded-xl bg-ink/5 ring-1 ring-ink/10`
        }
        style={
          hug
            ? ({ "--cur": String(curRatio), "--max": String(maxRatio) } as unknown as CSSProperties)
            : undefined
        }
      >
        {hug ? hugImages : coverImages}
        {controls}
      </div>

      {/* Puntos */}
      {many && (
        <div className="mt-3 flex items-center justify-center gap-2.5">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir a la foto ${i + 1}`}
              aria-current={i === idx}
              tabIndex={active ? 0 : -1}
              onClick={(e) => {
                stop(e);
                setIdx(i);
              }}
              onKeyDown={stop}
              className={`h-2.5 rounded-full transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 ${A.ring} ${
                i === idx ? `w-6 ${A.dotOn}` : "w-2.5 bg-ink/25 hover:bg-ink/45"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
