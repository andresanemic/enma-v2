"use client";

import Image from "next/image";

/**
 * Fondo fotográfico de la sección Métricas (Opción A).
 * Foto real de Aysén con el campo de viento (WindField/CFD) y los grades por
 * encima. Decorativa (aria-hidden): el contenido semántico son los números.
 *
 * Carga premium con blur-up: `placeholder="blur"` pinta al instante el
 * `blurDataURL` (≈150 B, generado de la propia foto con sharp) y la imagen
 * nítida se disuelve encima → sin pop-in al entrar en viewport. No lleva
 * `priority` (está bajo el pliegue; no es el LCP).
 *
 * `object-position` en ~38% favorece la franja de cordillera + luz dorada del
 * amanecer; ajustable si se cambia la foto.
 */
const IMAGE = {
  src: "/metrics/metrics-cerro-castillo-v1.webp",
  blurDataURL:
    "data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAACQAwCdASoQABgAPwForE6rJaQiMAgBYCAJZQC7AAkRUXZo+3d8AK5mieo+hTC+M2CsUajI+RCDnq5aeOq+XV7Tbtb5xp4q5/feW2yyMhMC0fjpD4N4Yu95DX3bswrtqAu43ei8JyPItdRfxeE0N5J1ROpfZzOpu4AAAA==",
} as const;

export default function MetricsBackdrop() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <Image
        src={IMAGE.src}
        alt=""
        fill
        placeholder="blur"
        blurDataURL={IMAGE.blurDataURL}
        sizes="100vw"
        className="object-cover"
        // Color vivo pero frío: la saturación vuelve casi entera (el frío lo da el
        // grade, no el lavado) → evita el duotono "deslavado". El drama lo aportan
        // la viñeta y el brillo de cumbre en Metrics.tsx.
        style={{ objectPosition: "center 38%", filter: "saturate(0.96) brightness(0.97)" }}
      />
    </div>
  );
}
