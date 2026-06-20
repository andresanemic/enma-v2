"use client";

// Aerogenerador (3 aspas) en line-art — coherente con el monograma "E".
// Es la FUENTE del campo de viento que fluye hacia la derecha de la sección.
// Las aspas giran vía CSS (.turbine-spin, GPU-composited); se detienen con
// prefers-reduced-motion (regla global de globals.css).

const L = 250; // largo de aspa
const CX = 205;
const CY = 300;
const BOTTOM = 900; // base de la torre (torre larga — crece hacia arriba, anclada abajo)

// Aspa apuntando hacia arriba desde el buje (0,0 local), con leve barrido (pitch).
const BLADE = `M0,0 C -10,-${L * 0.3} -6,-${L * 0.8} -1.5,-${L} C 3,-${L * 0.82} 8,-${L * 0.4} 0,0 Z`;

export default function WindTurbine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 620 900"
      aria-hidden="true"
      fill="none"
      className={className}
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Torre — tapereada */}
      <path
        d={`M${CX - 3.5},${CY} L${CX - 8},${BOTTOM} L${CX + 8},${BOTTOM} L${CX + 3.5},${CY} Z`}
        fill="#dad5ca"
        stroke="rgba(40,40,40,0.18)"
        strokeWidth={1.2}
        strokeLinejoin="round"
      />

      {/* Un arbusto + pasto en la base — el molino "nace" del terreno (no flota) */}
      <ellipse cx={CX} cy={BOTTOM + 2} rx={50} ry={21} fill="#173830" />
      <g stroke="#2c5a4f" strokeOpacity={0.8} strokeWidth={3} fill="none" strokeLinecap="round">
        {[CX - 66, CX - 38, CX - 14, CX + 8, CX + 32, CX + 60, CX + 90].map((gx, i) => (
          <path
            key={i}
            d={`M${gx},${BOTTOM} q -7,-26 -11,-46 M${gx},${BOTTOM} q -1,-32 1,-54 M${gx},${BOTTOM} q 7,-24 13,-44`}
          />
        ))}
      </g>

      {/* Aspas — grupo que gira alrededor del buje */}
      <g className="turbine-spin">
        {/* círculo invisible para centrar el bbox EXACTO en el buje */}
        <circle cx={CX} cy={CY} r={L} fill="none" stroke="none" />
        {[0, 120, 240].map((deg) => (
          <path
            key={deg}
            d={BLADE}
            transform={`translate(${CX} ${CY}) rotate(${deg})`}
            fill="#dad5ca"
            stroke="rgba(40,40,40,0.16)"
            strokeWidth={1.2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* Góndola + buje — góndola a la IZQUIERDA del buje → el rotor mira a la
          derecha (genera el viento que fluye hacia la derecha de la sección) */}
      <g>
        <rect
          x={CX - 32}
          y={CY - 9}
          width={38}
          height={18}
          rx={9}
          fill="#dad5ca"
          stroke="rgba(40,40,40,0.2)"
          strokeWidth={1.2}
        />
        {/* Detalle naranja: anillo + buje (el "núcleo de energía") */}
        <circle cx={CX} cy={CY} r={13} fill="none" stroke="#fea94f" strokeWidth={1.6} />
        <circle cx={CX} cy={CY} r={7} fill="#fea94f" />
      </g>
    </svg>
  );
}
