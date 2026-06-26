import { renderOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { PROYECTOS, getProyecto } from "@/lib/proyectos";

export function generateStaticParams() {
  return PROYECTOS.map((p) => ({ slug: p.slug }));
}

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Proyecto de Enma";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const proyecto = getProyecto(slug);
  return renderOgImage({
    title: proyecto?.title ?? "Proyectos de Enma",
    kicker: "Proyecto",
  });
}
