"use client";

// Cordillera patagónica para la sección Metrics, según la visión de la diseñadora
// (moodboard: "Huellas · Patrones silvestres · Texturas naturales · Equilibrio
// empresa/medioambiente"): siluetas onduladas (no planas), bosque de coníferas
// CON tronco, pasto y flores en primer plano, y el motivo de raíz/huella
// ramificada (las venas/ríos del moodboard, coherente con el monograma "E").

const HILL_FAR =
  "M0,320 L0,170 C140,150 240,118 380,140 C520,162 650,98 830,130 C990,158 1130,110 1290,142 C1360,156 1410,152 1440,148 L1440,320 Z";
const HILL_MID =
  "M0,320 L0,212 C170,192 310,150 480,184 C650,218 770,162 950,194 C1130,226 1270,180 1440,208 L1440,320 Z";
const HILL_NEAR =
  "M0,320 L0,252 C190,234 350,206 550,240 C750,274 910,226 1130,254 C1290,274 1385,258 1440,264 L1440,320 Z";

// Conífera con tronco (3 niveles de follaje + tronco).
function Tree({ x, base, h, color }: { x: number; base: number; h: number; color: string }) {
  const trunkH = Math.max(7, h * 0.18);
  const tw = Math.max(1.5, h * 0.045); // medio ancho del tronco
  const fb = base - trunkH; // base del follaje
  const fh = h - trunkH; // alto del follaje
  const w = fh * 0.46;
  const d =
    `M${x - w},${fb} L${x},${fb - fh * 0.42} L${x + w},${fb} Z ` +
    `M${x - w * 0.8},${fb - fh * 0.27} L${x},${fb - fh * 0.7} L${x + w * 0.8},${fb - fh * 0.27} Z ` +
    `M${x - w * 0.56},${fb - fh * 0.54} L${x},${fb - fh} L${x + w * 0.56},${fb - fh * 0.54} Z`;
  return (
    <g>
      <rect x={x - tw} y={fb - 1.5} width={tw * 2} height={trunkH + 2} fill="#3a281b" rx={tw * 0.5} />
      <path d={d} fill={color} />
    </g>
  );
}

const TREES_BACK = [
  { x: 70, h: 34 }, { x: 210, h: 40 }, { x: 400, h: 30 }, { x: 575, h: 38 },
  { x: 720, h: 32 }, { x: 900, h: 42 }, { x: 1050, h: 34 }, { x: 1230, h: 40 }, { x: 1360, h: 32 },
];
const TREES_FRONT = [
  { x: 95, h: 64 }, { x: 175, h: 48 }, { x: 255, h: 80 }, { x: 340, h: 54 }, { x: 440, h: 70 },
  { x: 535, h: 46 }, { x: 650, h: 84 }, { x: 745, h: 58 }, { x: 845, h: 50 }, { x: 975, h: 76 },
  { x: 1075, h: 52 }, { x: 1185, h: 82 }, { x: 1285, h: 56 }, { x: 1375, h: 68 }, { x: 1430, h: 48 },
];

// Pasto — denso, 5 briznas por tufo, altura variada según x.
const GRASS = Array.from({ length: 30 }, (_, i) => 24 + i * 48);
function grass(x: number) {
  const k = 1 + ((x % 7) / 7) * 0.5; // pequeña variación de altura
  return (
    `M${x},319 q -4,${-10 * k} -7,${-17 * k} ` +
    `M${x},319 q -1,${-12 * k} 0,${-20 * k} ` +
    `M${x},319 q 2,${-11 * k} 4,${-18 * k} ` +
    `M${x},319 q 4,${-9 * k} 8,${-15 * k} ` +
    `M${x},319 q 6,${-7 * k} 11,${-12 * k}`
  );
}

const FLOWERS = [
  { x: 150, c: "#fea94f" }, { x: 320, c: "#f7dfba" }, { x: 560, c: "#f1541c" },
  { x: 800, c: "#fea94f" }, { x: 1040, c: "#f7dfba" }, { x: 1280, c: "#fea94f" },
];
const PETALS = [0, 1, 2, 3, 4].map((i) => {
  const a = (i / 5) * Math.PI * 2 - Math.PI / 2;
  return { dx: Math.cos(a) * 3.6, dy: Math.sin(a) * 3.6 };
});

// Motivo "huella/raíz" ramificado (patrón silvestre del moodboard).
function vein(x: number, s: number, up: number) {
  return (
    `M${x},320 C${x + 18 * s},${300 - up * 0.2} ${x + 10 * s},${276 - up * 0.4} ${x + 34 * s},${250 - up} ` +
    `M${x + 22 * s},${286 - up * 0.4} C${x + 40 * s},${282 - up * 0.4} ${x + 54 * s},${270 - up * 0.5} ${x + 74 * s},${264 - up * 0.6} ` +
    `M${x + 17 * s},${298 - up * 0.25} C${x},${294 - up * 0.25} ${x - 16 * s},${286 - up * 0.3} ${x - 32 * s},${283 - up * 0.3} ` +
    `M${x + 30 * s},${262 - up * 0.85} C${x + 38 * s},${250 - up} ${x + 36 * s},${238 - up * 1.1} ${x + 48 * s},${228 - up * 1.2}`
  );
}
const VEINS = [
  { x: 110, s: 1, up: 8 }, { x: 360, s: -1, up: 14 }, { x: 600, s: 1, up: 6 },
  { x: 850, s: -1, up: 16 }, { x: 1080, s: 1, up: 10 }, { x: 1320, s: -1, up: 12 },
];

export default function Ridge({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true" className={className}>
      {/* Cerros */}
      <path d={HILL_FAR} fill="#356057" fillOpacity={0.42} />
      <path d={HILL_MID} fill="#26514a" fillOpacity={0.72} />

      {/* Bosque de fondo (más claro y bajo → profundidad) */}
      {TREES_BACK.map((t) => (
        <Tree key={`b-${t.x}`} x={t.x} base={250} h={t.h} color="#1d4239" />
      ))}

      {/* Cerro cercano */}
      <path d={HILL_NEAR} fill="#173830" />

      {/* Huellas / raíces ramificadas (patrón silvestre) */}
      <g stroke="#5a9486" strokeOpacity={0.24} strokeWidth={1.3} fill="none" strokeLinecap="round">
        {VEINS.map((v, i) => (
          <path key={`v-${i}`} d={vein(v.x, v.s, v.up)} />
        ))}
      </g>

      {/* Bosque de primer plano (oscuro) */}
      {TREES_FRONT.map((t) => (
        <Tree key={`f-${t.x}`} x={t.x} base={308} h={t.h} color="#122b26" />
      ))}

      {/* Pasto */}
      <g stroke="#2c5a4f" strokeOpacity={0.55} strokeWidth={1.2} fill="none" strokeLinecap="round">
        {GRASS.map((x) => (
          <path key={`g-${x}`} d={grass(x)} />
        ))}
      </g>

      {/* Flores cálidas */}
      {FLOWERS.map((fl) => (
        <g key={`fl-${fl.x}`}>
          <path d={`M${fl.x},318 q -1,-10 0,-18`} stroke="#2c5a4f" strokeWidth={1.4} fill="none" strokeLinecap="round" />
          {PETALS.map((p, i) => (
            <circle key={i} cx={fl.x + p.dx} cy={300 + p.dy} r={2.2} fill={fl.c} />
          ))}
          <circle cx={fl.x} cy={300} r={1.8} fill="#b12c00" />
        </g>
      ))}
    </svg>
  );
}
