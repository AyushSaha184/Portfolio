"use client";

import { useEffect, useRef, useCallback } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkle: number;
  drift: number;
}

const STAR_COUNT = 140;

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);

  const seedStars = useCallback(() => {
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.45 + 0.3,
        alpha: Math.random() * 0.65 + 0.2,
        twinkle: Math.random() * 0.025 + 0.004,
        drift: (Math.random() - 0.5) * 0.15,
      });
    }
    starsRef.current = stars;
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    resizeCanvas();
    seedStars();

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const star of starsRef.current) {
        star.alpha += (Math.random() - 0.5) * star.twinkle;
        star.alpha = Math.max(0.1, Math.min(0.95, star.alpha));
        star.y += star.drift;

        if (star.y < -2) {
          star.y = window.innerHeight + 2;
        } else if (star.y > window.innerHeight + 2) {
          star.y = -2;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(220, 229, 236, ${star.alpha})`;
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const handleResize = () => {
      resizeCanvas();
      seedStars();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [resizeCanvas, seedStars]);

  return <canvas id="starfield" ref={canvasRef} aria-hidden="true" />;
}
