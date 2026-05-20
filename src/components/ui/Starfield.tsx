"use client";

import { useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  twinkleDir: number;
  drift: number;
}

// Reduced count is fine — the background grid + noise overlay fills in the visual density
const STAR_COUNT = 110;

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const visibleRef = useRef<boolean>(true);

  const seedStars = useCallback((w: number, h: number) => {
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 1.4 + 0.25,
        alpha: Math.random() * 0.6 + 0.15,
        twinkleSpeed: Math.random() * 0.018 + 0.003,
        twinkleDir: Math.random() < 0.5 ? 1 : -1,
        drift: (Math.random() - 0.5) * 0.12,
      });
    }
    starsRef.current = stars;
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { w: 0, h: 0 };

    const ratio = Math.min(window.devicePixelRatio || 1, 2); // cap at 2× to save GPU memory
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.floor(w * ratio);
    canvas.height = Math.floor(h * ratio);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    return { w, h };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const { w, h } = resizeCanvas();
    seedStars(w, h);

    // Pause animation when tab is hidden (saves battery & CPU)
    const onVisibilityChange = () => {
      visibleRef.current = !document.hidden;
      if (!document.hidden && rafRef.current === 0) {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const draw = () => {
      if (!visibleRef.current) {
        rafRef.current = 0;
        return;
      }

      const cw = window.innerWidth;
      const ch = window.innerHeight;

      ctx.clearRect(0, 0, cw, ch);

      // fillStyle is constant — set once outside the loop to avoid 110 canvas
      // state changes per frame (≈6,600 redundant assignments per second at 60fps).
      ctx.fillStyle = "#dce5ec";
      const stars = starsRef.current;
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Smooth twinkle — reverse direction at bounds instead of random jumps
        star.alpha += star.twinkleSpeed * star.twinkleDir;
        if (star.alpha >= 0.85) { star.alpha = 0.85; star.twinkleDir = -1; }
        else if (star.alpha <= 0.08) { star.alpha = 0.08; star.twinkleDir = 1; }

        star.y += star.drift;
        if (star.y < -2) star.y = ch + 2;
        else if (star.y > ch + 2) star.y = -2;

        ctx.globalAlpha = star.alpha;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 6.2832); // 6.2832 ≈ Math.PI * 2
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    // Debounce resize to avoid thrashing during window drag
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const { w: nw, h: nh } = resizeCanvas();
        seedStars(nw, nh);
      }, 150);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [resizeCanvas, seedStars]);

  return <canvas id="starfield" ref={canvasRef} aria-hidden="true" />;
}
