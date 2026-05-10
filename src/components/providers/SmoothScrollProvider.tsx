"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const rafId = requestAnimationFrame(raf);

    /* Propagate Lenis scroll to navbar scroll-state */
    const navbar = document.querySelector("#navbar");
    const heroGlow = document.querySelector<HTMLElement>(".hero-glow");

    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      navbar?.classList.toggle("is-scrolled", scroll > 16);

      if (heroGlow) {
        const yOffset = Math.min(90, scroll * 0.14);
        heroGlow.style.setProperty(
          "--hero-glow-offset-y",
          `${yOffset}px`
        );
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}
