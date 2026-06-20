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
        fill="rgba(248,237,221,0.10)"
        stroke="rgba(248,237,221,0.32)"
        strokeWidth={1.3}
        strokeLinejoin="round"
      />

      {/* Aspas — grupo que gira alrededor del buje */}
      <g className="turbine-spin">
        {/* círculo invisible para centrar el bbox EXACTO en el buje */}
        <circle cx={CX} cy={CY} r={L} fill="none" stroke="none" />
        {[0, 120, 240].map((deg) => (
          <path
            key={deg}
            d={BLADE}
            transform={`translate(${CX} ${CY}) rotate(${deg})`}
            fill="rgba(254,169,79,0.10)"
            stroke="rgba(248,237,221,0.5)"
            strokeWidth={1.5}
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
          fill="rgba(21,10,5,0.55)"
          stroke="rgba(248,237,221,0.4)"
          strokeWidth={1.2}
        />
        <circle cx={CX} cy={CY} r={13} fill="none" stroke="rgba(254,169,79,0.5)" strokeWidth={1.3} />
        <circle cx={CX} cy={CY} r={7} fill="#fea94f" />
      </g>
    </svg>
  );
}
