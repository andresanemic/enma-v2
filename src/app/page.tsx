export default function Home() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <p className="eyebrow text-terra/70">Aysén · 45°S · Patagonia</p>

      <h1 className="mt-6 max-w-4xl font-display text-5xl font-light leading-[0.95] tracking-[-0.035em] text-ink sm:text-7xl">
        Energía y manufactura
        <span className="block font-semibold text-ember">sustentable</span>
      </h1>

      <p className="mt-7 max-w-md font-body text-base font-light leading-relaxed text-ink/70">
        Setup base listo. Tipografías, paleta cálida y GSAP configurados. La
        landing se construye en las siguientes fases.
      </p>

      <div className="mt-9 flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full bg-ember" />
        <span className="h-2.5 w-2.5 rounded-full bg-orange" />
        <span className="h-2.5 w-2.5 rounded-full bg-sand" />
        <span className="h-2.5 w-2.5 rounded-full bg-teal" />
      </div>
    </main>
  );
}
