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

    const initCursor = async () => {
      if (typeof window === 'undefined' || !canvasRef.current) return;

      try {
        // Dynamic ESM import from jsDelivr CDN using new Function to avoid Vite SSR bundling issues
        const cdnUrl = 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js';
        const dynamicImport = new Function('url', 'return import(url)');
        const module = await dynamicImport(cdnUrl);
        const TubesCursor = module.default;

        if (canvasRef.current && !isDisposed) {
          const app = TubesCursor(canvasRef.current, {
            tubes: {
              colors: ["#00E5FF", "#7B2CBF", "#3A86EF"],
              lights: {
                intensity: 200,
                colors: ["#00E5FF", "#B721FF", "#FF007A", "#11CDEF"]
              }
            }
          });
          appRef.current = app;
        }
      } catch (err) {
        console.error("Failed to load TubesCursor module:", err);
      }
    };

    // Delay slightly to ensure canvas parent container bounds are ready
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

    window.addEventListener('click', handleGlobalClick);

    return () => {
      isDisposed = true;
      if (timerId) clearTimeout(timerId);
      window.removeEventListener('click', handleGlobalClick);
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

