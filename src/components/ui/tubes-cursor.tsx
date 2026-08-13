"use client";

import React, { useEffect, useRef } from 'react';

export function TubesCursorBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const appRef = useRef<any>(null);

  const randomColors = (count: number) => {
    return new Array(count)
      .fill(0)
      .map(() => "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
  };

  useEffect(() => {
    let timerId: any = null;
    let isDisposed = false;
    let observer: IntersectionObserver | null = null;

    const initCursor = async () => {
      if (typeof window === 'undefined' || !canvasRef.current) return;

      const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // On low-end / reduced motion, we skip heavy WebGL tube rendering completely
      if (reducedMotion) return;

      try {
        // Dynamic ESM import from jsDelivr CDN
        const cdnUrl = 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js';
        const dynamicImport = new Function('url', 'return import(url)');
        const module = await dynamicImport(cdnUrl);
        const TubesCursor = module.default;

        if (canvasRef.current && !isDisposed) {
          const app = TubesCursor(canvasRef.current, {
            tubes: {
              colors: ["#00E5FF", "#7B2CBF", "#3A86EF"],
              lights: {
                intensity: isMobile ? 100 : 200,
                colors: ["#00E5FF", "#B721FF", "#FF007A", "#11CDEF"]
              }
            }
          });
          appRef.current = app;

          // CAP DEVICE PIXEL RATIO to 1.5 max for huge GPU performance gains on mobile/high-DPI screens
          if (app && app.renderer && typeof app.renderer.setPixelRatio === 'function') {
            app.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
          }
        }
      } catch (err) {
        console.error("Failed to load TubesCursor module:", err);
      }
    };

    // Delay slightly to ensure container bounds are ready
    timerId = setTimeout(initCursor, 150);

    const handleGlobalClick = () => {
      if (appRef.current && appRef.current.tubes) {
        try {
          const newTubeColors = randomColors(3);
          const newLightColors = randomColors(4);
          appRef.current.tubes.setColors(newTubeColors);
          appRef.current.tubes.setLightsColors(newLightColors);
        } catch (err) {
          console.warn("Could not randomize tube colors:", err);
        }
      }
    };

    // Pause WebGL rendering loop when document is hidden (inactive tab)
    const handleVisibilityChange = () => {
      if (!appRef.current) return;
      if (document.hidden) {
        if (typeof appRef.current.pause === 'function') appRef.current.pause();
      } else {
        if (typeof appRef.current.play === 'function') appRef.current.play();
      }
    };

    // Pause WebGL rendering loop when canvas is scrolled out of viewport
    if ('IntersectionObserver' in window && canvasRef.current) {
      observer = new IntersectionObserver(([entry]) => {
        if (!appRef.current) return;
        if (entry.isIntersecting) {
          if (typeof appRef.current.play === 'function') appRef.current.play();
        } else {
          if (typeof appRef.current.pause === 'function') appRef.current.pause();
        }
      }, { threshold: 0.05 });
      observer.observe(canvasRef.current);
    }

    window.addEventListener('click', handleGlobalClick);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isDisposed = true;
      if (timerId) clearTimeout(timerId);
      if (observer) observer.disconnect();
      window.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (appRef.current && typeof appRef.current.dispose === 'function') {
        try {
          appRef.current.dispose();
        } catch (e) {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden bg-[#030406]"
      title="Click background to randomize Tubes Cursor colors"
    >
      {/* 3D Tubes Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 w-full h-full pointer-events-none opacity-90"
      />
    </div>
  );
}

export default TubesCursorBackground;
