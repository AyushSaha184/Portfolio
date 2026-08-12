"use client";

import React, { useId } from "react";
import { cn } from "@/lib/utils";

export interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  rx?: number | string;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className,
  size = 240,
  duration = 8,
  borderWidth = 1.5,
  colorFrom = "#ffffff",
  colorTo = "rgba(255, 255, 255, 0)",
  delay = 0,
  rx = 26,
}) => {
  const id = useId();
  const gradientId = `beam-grad-${id.replace(/:/g, "")}`;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden z-10",
        className
      )}
    >
      <svg className="absolute inset-0 w-full h-full rounded-[inherit] pointer-events-none overflow-visible">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="1" />
            <stop offset="50%" stopColor={colorFrom} stopOpacity="0.5" />
            <stop offset="100%" stopColor={colorTo} stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx={rx}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={borderWidth}
          strokeDasharray={`${size} 1440`}
          style={{
            animation: `border-beam-dash ${duration}s linear infinite`,
            animationDelay: `-${delay}s`,
            filter: "drop-shadow(0 0 5px rgba(255, 255, 255, 0.9))",
          }}
        />
      </svg>
    </div>
  );
};

export default BorderBeam;
