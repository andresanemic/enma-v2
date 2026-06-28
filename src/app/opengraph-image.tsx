import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { DEFAULT_DESCRIPTION } from "@/lib/seo";

// Necesario con `output: export` para prerenderizar la OG como imagen estática.
export const dynamic = "force-static";

export const alt = DEFAULT_DESCRIPTION;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    title: "Energía y medio ambiente desde la Patagonia",
    kicker: "Enma",
  });
}
