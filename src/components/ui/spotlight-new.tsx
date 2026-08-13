"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface SpotlightNewProps {
  gradientFirst?: string;
  gradientSecond?: string;
  gradientThird?: string;
  translateY?: number;
  width?: number;
  height?: number;
  smallWidth?: number;
  duration?: number;
  xOffset?: number;
  className?: string;
}

export const SpotlightNew: React.FC<SpotlightNewProps> = ({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .12) 0%, hsla(210, 100%, 55%, .03) 50%, hsla(210, 100%, 45%, 0) 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .08) 0%, hsla(210, 100%, 55%, .02) 80%, transparent 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .05) 0%, hsla(210, 100%, 45%, .02) 80%, transparent 100%)",
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  className,
}) => {
  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden bg-transparent transform-gpu will-change-transform",
        className
      )}
      style={{ contain: "strict" }}
    >
      <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-full max-w-7xl h-full transform-gpu">
        {/* Left Conical Spotlight Beam */}
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(-38deg)`,
          }}
          className="absolute -left-52 top-0 flex h-[1400px] w-[600px] flex-col items-center justify-center opacity-80"
        >
          <div
            style={{ background: gradientFirst }}
            className="w-full h-full rounded-full filter blur-[90px]"
          />
        </div>

        {/* Right Conical Spotlight Beam */}
        <div
          style={{
            transform: `translateY(${translateY}px) rotate(38deg)`,
          }}
          className="absolute -right-52 top-0 flex h-[1400px] w-[600px] flex-col items-center justify-center opacity-80"
        >
          <div
            style={{ background: gradientFirst }}
            className="w-full h-full rounded-full filter blur-[90px]"
          />
        </div>

        {/* Center Ambient Spotlight Blur */}
        <div
          className="absolute left-1/2 top-[-180px] -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-50 filter blur-[150px]"
          style={{ background: gradientSecond }}
        />

        {/* Bottom Ambient Glow */}
        <div
          className="absolute left-1/2 bottom-[-200px] -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-30 filter blur-[130px]"
          style={{ background: gradientThird }}
        />
      </div>
    </div>
  );
};

export default SpotlightNew;
