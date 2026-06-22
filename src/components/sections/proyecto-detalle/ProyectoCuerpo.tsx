"use client";
export default function ProyectoCuerpo({
  context,
  did,
  capabilities,
}: {
  context: string;
  did: string;
  capabilities: string[];
}) {
  return (
    <section data-nav="light" style={{ background: "#F3DDBC" }}>
      {context}
    </section>
  );
}
