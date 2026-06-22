"use client";

// Aerogenerador (3 aspas) en line-art — coherente con el monograma "E".
// Es la FUENTE del campo de viento que fluye hacia la derecha de la sección.
//
// Las aspas giran vía CSS, pero la rotación se aplica a un ELEMENTO HTML (el div
// `.turbine-spin`), NO a un <g> interno del SVG: en iOS Safari las transformaciones
// de elementos internos del SVG corren en el hilo principal y se CONGELAN durante
// el scroll táctil (igual que el canvas del viento). Un transform sobre un elemento
// HTML va por el compositor (GPU) → sigue girando mientras se hace scroll con el
// dedo (mismo motivo por el que las nubes de la sección no se detienen).
// Se detiene con prefers-reduced-motion (regla global de globals.css).
//
// La escena se separa en 3 capas superpuestas para preservar el orden de pintado
// original (torre+arbusto detrás · aspas · góndola+buje delante):
//   1 · base estática (torre, arbusto, pasto)
//   2 · aspas (div que gira, centrado EXACTO en el buje)
//   3 · góndola + buje (delante de las aspas)

const VBW = 620;
const VBH = 900;
const L = 250; // largo de aspa
const CX = 205;
const CY = 300;
const BOTTOM = 900; // base de la torre (torre larga — crece hacia arriba, anclada abajo)

// Aspa apuntando hacia arriba desde el buje (0,0 local), con leve barrido (pitch).
const BLADE = `M0,0 C -10,-${L * 0.3} -6,-${L * 0.8} -1.5,-${L} C 3,-${L * 0.82} 8,-${L * 0.4} 0,0 Z`;

// Caja de las aspas: cuadrado de lado 2L centrado en el buje (CX,CY), expresado en
// % del contenedor (que conserva el aspect-ratio del viewBox) → el centro del div
// cae EXACTAMENTE sobre el buje, así `transform-origin:center` gira en torno a él.
const BLADE_BOX = {
  left: `${((CX - L) / VBW) * 100}%`,
  top: `${((CY - L) / VBH) * 100}%`,
  width: `${((2 * L) / VBW) * 100}%`,
  height: `${((2 * L) / VBH) * 100}%`,
};

export default function WindTurbine({ className = "" }: { className?: string }) {
  return (
    <div className={className} style={{ aspectRatio: `${VBW} / ${VBH}` }}>
      {/* ── Capa 1 · base estática: torre + arbusto + pasto ── */}
      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        aria-hidden="true"
        fill="none"
        className="absolute inset-0 h-full w-full"
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
      </svg>

      {/* ── Capa 2 · aspas — div que GIRA (compositor/GPU, sobrevive al scroll iOS).
          viewBox centrado en el buje (0,0 local) → el centro del div = el buje. ── */}
      <div className="turbine-spin absolute" style={BLADE_BOX}>
        <svg
          viewBox={`${-L} ${-L} ${2 * L} ${2 * L}`}
          aria-hidden="true"
          fill="none"
          className="h-full w-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          {[0, 120, 240].map((deg) => (
            <path
              key={deg}
              d={BLADE}
              transform={`rotate(${deg})`}
              fill="#dad5ca"
              stroke="rgba(40,40,40,0.16)"
              strokeWidth={1.2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </div>

      {/* ── Capa 3 · góndola + buje — delante de las aspas. Góndola a la IZQUIERDA del
          buje → el rotor mira a la derecha (genera el viento de la sección). ── */}
      <svg
        viewBox={`0 0 ${VBW} ${VBH}`}
        aria-hidden="true"
        fill="none"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMax meet"
      >
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
      </svg>
    </div>
  );
}
