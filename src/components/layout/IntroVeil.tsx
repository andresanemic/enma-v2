"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// Velo de entrada del home: un color sólido cálido-oscuro (el tono más oscuro del
// Hero) que se renderiza desde el SSR para cubrir el PRIMER frame → evita el flash
// del gradiente desnudo del Hero antes de que carguen video y cascada. Hace
// fade-out rápido al montar y se retira. Respeta prefers-reduced-motion.
// pointer-events:none → nunca atrapa la interacción mientras se desvanece.
export default function IntroVeil() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const done = () => {
      el.style.display = "none";
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el, { autoAlpha: 0, onComplete: done });
      return;
    }
    gsap.to(el, {
      autoAlpha: 0,
      duration: 0.5,
      ease: "power2.out",
      delay: 0.2,
      onComplete: done,
    });
  });

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ background: "#15110e" }}
    />
  );
}
