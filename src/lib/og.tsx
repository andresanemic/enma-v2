import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Paleta cálida Enma + acento teal.
const BG = "#f8eddd";
const INK = "#1f2a26";
const TEAL = "#205358";
const TERRA = "#b12c00";

// Manrope estática (Fontsource CDN). Si la red falla en build, se omite la
// fuente y ImageResponse usa la default (el build NO se cae).
async function loadFont(
  weight: "400" | "700",
): Promise<{ name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" } | null> {
  try {
    const url = `https://cdn.jsdelivr.net/fontsource/fonts/manrope@latest/latin-${weight}-normal.ttf`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return {
      name: "Manrope",
      data: await res.arrayBuffer(),
      weight: weight === "700" ? 700 : 400,
      style: "normal",
    };
  } catch {
    return null;
  }
}

export async function renderOgImage(opts: { title: string; kicker?: string }) {
  const { title, kicker = "Enma" } = opts;
  const fonts = (await Promise.all([loadFont("700"), loadFont("400")])).filter(
    (f): f is NonNullable<typeof f> => f !== null,
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "72px 80px",
          fontFamily: "Manrope, sans-serif",
          color: INK,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 18,
              height: 56,
              background: TEAL,
              borderRadius: 4,
            }}
          />
          <span style={{ fontSize: 30, fontWeight: 700, letterSpacing: 1 }}>
            enma
          </span>
          <span
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: TERRA,
              textTransform: "uppercase",
              letterSpacing: 2,
              marginLeft: 8,
            }}
          >
            {kicker}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>

        <div style={{ display: "flex", fontSize: 26, fontWeight: 400, color: TEAL }}>
          Energía y manufactura sustentable · Región de Aysén, Patagonia
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
