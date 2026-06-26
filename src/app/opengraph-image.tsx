import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { DEFAULT_DESCRIPTION } from "@/lib/seo";

export const alt = DEFAULT_DESCRIPTION;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return renderOgImage({
    title: "Energía y manufactura sustentable desde la Patagonia",
    kicker: "Enma",
  });
}
