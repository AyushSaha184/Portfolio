"use client";

import React, { memo, forwardRef, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export interface LiquidMetalProps {
  colorBack?: string;
  colorTint?: string;
  speed?: number;
  repetition?: number;
  distortion?: number;
  scale?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * WebGL Liquid Metal Shader component with Pure White Metallic Sheen & IntersectionObserver RAF Pausing
 */
export const LiquidMetal = memo(function LiquidMetal({
  colorBack = "#333333",
  colorTint = "#ffffff",
  speed = 0.6,
  repetition = 4,
  distortion = 0.2,
  scale = 1,
  className,
  style,
}: LiquidMetalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // WebGL Canvas Shader for Pure White Chrome Liquid Metal
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    let animationFrameId = 0;
    let isVisible = true;
    let observer: IntersectionObserver | null = null;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_position + 1.0) * 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_speed;
      uniform float u_distortion;
      uniform float u_repetition;

      void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        float t = u_time * u_speed;
        
        vec2 p = st * u_repetition;
        for(int n=1; n<4; n++) {
          float i = float(n);
          p += vec2(
            sin(t - p.x + p.y * i * 0.7) + cos(t * 0.4 + p.y),
            cos(t + p.y + p.x * i * 0.7) + sin(t * 0.4 + p.x)
          ) * u_distortion;
        }

        float v = sin(p.x + p.y) * 0.5 + 0.5;
        vec3 silverMetal = mix(vec3(0.2, 0.2, 0.24), vec3(0.85, 0.88, 0.92), v);
        vec3 pureWhiteHighlights = mix(silverMetal, vec3(1.0, 1.0, 1.0), pow(v, 3.5));
        vec3 whiteLiquidSheen = mix(pureWhiteHighlights, vec3(1.0, 1.0, 1.0), sin(st.x * 4.0 + t) * 0.3 + 0.2);

        gl_FragColor = vec4(whiteLiquidSheen, 1.0);
      }
    `;

    function createShader(gl: WebGLRenderingContext, type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const resLocation = gl.getUniformLocation(program, "u_resolution");
    const speedLocation = gl.getUniformLocation(program, "u_speed");
    const distLocation = gl.getUniformLocation(program, "u_distortion");
    const repLocation = gl.getUniformLocation(program, "u_repetition");

    const render = (time: number) => {
      if (!canvas || !gl || !isVisible) {
        animationFrameId = 0;
        return;
      }
      canvas.width = canvas.clientWidth || 300;
      canvas.height = canvas.clientHeight || 100;
      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.useProgram(program);

      gl.enableVertexAttribArray(positionLocation);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      gl.uniform1f(timeLocation, time * 0.001);
      gl.uniform2f(resLocation, canvas.width, canvas.height);
      gl.uniform1f(speedLocation, speed);
      gl.uniform1f(distLocation, distortion);
      gl.uniform1f(repLocation, repetition);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    // Pause WebGL rendering loop when button is scrolled out of view or tab is hidden
    if ('IntersectionObserver' in window && canvas) {
      observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        }
      }, { threshold: 0.05 });
      observer.observe(canvas);
    }

    const handleVisibility = () => {
      if (document.hidden) {
        isVisible = false;
      } else {
        isVisible = true;
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(render);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (observer) observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [speed, distortion, repetition]);

  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", className)} style={style}>
      <canvas ref={canvasRef} className="w-full h-full block object-cover" />
    </div>
  );
});

LiquidMetal.displayName = "LiquidMetal";

export interface LiquidMetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  borderWidth?: number;
  metalConfig?: Omit<LiquidMetalProps, "className" | "style">;
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
}

export const LiquidMetalButton = forwardRef<
  HTMLButtonElement,
  LiquidMetalButtonProps
>(
  (
    {
      children,
      borderWidth = 2,
      metalConfig,
      size = "md",
      className,
      disabled,
      href,
      target,
      rel,
      onClick,
      ...props
    },
    ref
  ) => {
    const sizeStyles = {
      sm: "py-2 px-4 text-xs font-semibold",
      md: "py-2.5 px-6 text-xs sm:text-sm font-semibold",
      lg: "py-3 px-7 text-sm font-semibold",
    };

    const content = (
      <div
        className="relative rounded-full overflow-hidden shadow-[0_10px_30px_-8px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover:shadow-[0_15px_40px_-4px_rgba(255,255,255,0.5)] group-hover:scale-[1.02] isolate"
        style={{ padding: borderWidth, transform: "translateZ(0)" }}
      >
        {/* Liquid Metal Shader Border Layer with Pure White Sheen */}
        <LiquidMetal
          colorBack={metalConfig?.colorBack ?? "#222530"}
          colorTint={metalConfig?.colorTint ?? "#ffffff"}
          speed={metalConfig?.speed ?? 0.6}
          repetition={metalConfig?.repetition ?? 4}
          distortion={metalConfig?.distortion ?? 0.2}
          scale={metalConfig?.scale ?? 1}
          className="absolute inset-0 z-0 rounded-full mix-blend-screen"
        />

        {/* Inner Button Body */}
        <div
          className={cn(
            "relative z-10 rounded-full flex items-center justify-center tracking-tight text-white",
            "bg-[#090b10] border border-white/15",
            "transition-colors duration-300",
            "group-hover:bg-[#121620] group-hover:border-white/30",
            sizeStyles[size]
          )}
          style={{ transform: "translateZ(0)" }}
        >
          <span className="relative z-10 font-semibold tracking-tight text-white group-hover:text-white transition-colors whitespace-nowrap">
            {children}
          </span>
        </div>
      </div>
    );

    if (href) {
      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={cn(
            "relative group inline-block cursor-pointer border-none bg-transparent p-0 outline-none transition-transform active:scale-[0.98]",
            className
          )}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled}
        onClick={onClick}
        className={cn(
          "relative group cursor-pointer border-none bg-transparent p-0 outline-none transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          className
        )}
        {...props}
      >
        {content}
      </button>
    );
  }
);

LiquidMetalButton.displayName = "LiquidMetalButton";

export default LiquidMetalButton;
