"use client";

/**
 * Fondo fotográfico de la sección Métricas (Opción A).
 * Foto real de Aysén con el campo de viento (WindField/CFD) y los grades por
 * encima. Decorativa (aria-hidden): el contenido semántico son los números.
 *
 * Imágenes responsive con `<picture>` art-directed (Lighthouse móvil, H7.6):
 * con `images.unoptimized` (export estático) next/image no genera srcset, así
 * que móvil descargaba el archivo de desktop (1040×1560 / 130 KiB). Servimos una
 * variante liviana en móvil (540×810 / ~32 KiB; el fondo va oscurecido y detrás
 * de los números, tolera compresión fuerte) y el archivo nítido en desktop.
 *
 * Carga premium con blur-up: el `blurDataURL` (≈150 B, generado de la propia foto)
 * se pinta al instante como fondo del contenedor y la imagen nítida cae encima →
 * sin pop-in al entrar en viewport. No lleva `priority` (bajo el pliegue, no es el LCP).
 *
 * `object-position` responsive: en móvil/tablet ~38% (franja de cordillera + luz
 * dorada del amanecer); en desktop (lg+) ~62% para encuadrar el PUEBLO del fondo
 * de la foto (las casas, la cabaña de techo rojo). Ajustable si se cambia la foto.
 */
const BLUR_DATA_URL =
  "data:image/webp;base64,UklGRoYAAABXRUJQVlA4IHoAAACQAwCdASoQABgAPwForE6rJaQiMAgBYCAJZQC7AAkRUXZo+3d8AK5mieo+hTC+M2CsUajI+RCDnq5aeOq+XV7Tbtb5xp4q5/feW2yyMhMC0fjpD4N4Yu95DX3bswrtqAu43ei8JyPItdRfxeE0N5J1ROpfZzOpu4AAAA==";

export default function MetricsBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${BLUR_DATA_URL})` }}
    >
      {/* <picture> art-directed: móvil baja un archivo liviano; desktop el nítido. */}
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet="/metrics/metrics-cerro-castillo-v3-m.webp"
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- next/image no hace art-direction en export estático */}
        <img
          src="/metrics/metrics-cerro-castillo-v3.webp"
          alt=""
          decoding="async"
          loading="lazy"
          // Recorte responsive: móvil/tablet muestra el cerro (~38%); desktop (lg+)
          // baja al pueblo del fondo de la foto (~62%).
          className="absolute inset-0 h-full w-full object-cover object-[center_38%] lg:object-[center_62%]"
          // Color vivo pero frío: la saturación vuelve casi entera (el frío lo da el
          // grade, no el lavado) → evita el duotono "deslavado". El drama lo aportan
          // la viñeta y el brillo de cumbre en Metrics.tsx.
          style={{ filter: "saturate(0.96) brightness(0.97)" }}
        />
      </picture>
    </div>
  );
}
