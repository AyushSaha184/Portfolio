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
      duration: 1.1,        // slightly snappier than 1.2
      smoothWheel: true,
      syncTouch: false,     // disable on touch so native scroll handles it
    });

    lenisRef.current = lenis;

    // Use Lenis' own built-in RAF instead of a manual requestAnimationFrame loop
    // This prevents a second, redundant animation frame being queued
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    let rafId = requestAnimationFrame(raf);

    /* Propagate Lenis scroll to navbar scroll-state + hero parallax */
    const navbar = document.querySelector("#navbar");
    const heroGlow = document.querySelector<HTMLElement>(".hero-glow");

    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      navbar?.classList.toggle("is-scrolled", scroll > 16);

      if (heroGlow) {
        // Simple linear clamp — avoid Math.min call overhead in hot path
        const yOffset = scroll * 0.14;
        heroGlow.style.setProperty(
          "--hero-glow-offset-y",
          `${yOffset < 90 ? yOffset : 90}px`
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
