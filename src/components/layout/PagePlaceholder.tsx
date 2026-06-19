import Link from "next/link";
import NavBar from "@/components/layout/NavBar";

type Props = {
  eyebrow: string;
  title: string;
  phase: string;
};

/**
 * Placeholder de página interna — mantiene los Golden Paths de navegación
 * (sin 404) mientras la sección real se construye en su fase correspondiente.
 */
export default function PagePlaceholder({ eyebrow, title, phase }: Props) {
  return (
    <>
      <NavBar />
      <main className="flex min-h-[100svh] flex-col justify-center px-6 pt-28 sm:px-10 md:px-14">
        <p className="eyebrow text-terra/70">{eyebrow}</p>
        <h1
          className="mt-5 max-w-[16ch] font-display font-light text-ink"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 1.04, letterSpacing: "-0.035em" }}
        >
          {title}
        </h1>
        <p className="mt-6 max-w-md font-body text-base font-light leading-relaxed text-ink/60">
          Esta página se construye en la {phase}. La navegación ya está activa.
        </p>
        <div className="mt-9">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-body text-sm font-medium text-ember transition-colors hover:text-terra"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Volver al inicio
          </Link>
        </div>
      </main>
    </>
  );
}
