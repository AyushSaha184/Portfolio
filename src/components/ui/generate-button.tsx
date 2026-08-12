"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface GenerateButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  hue?: number;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export const GenerateButton = forwardRef<
  HTMLButtonElement,
  GenerateButtonProps
>(({ children, hue = 210, className, href, target, rel, onClick, ...props }, ref) => {
  const content = (
    <span className="relative z-10 flex items-center justify-center font-medium text-xs sm:text-sm text-white/90 group-hover:text-white transition-colors tracking-tight">
      {children}
    </span>
  );

  const style = `
    .veng-gen-btn {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.45rem 1rem;
      border-radius: 9999px;
      background-color: #0c0e14;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow:
        inset 0px 1px 1px rgba(255, 255, 255, 0.15),
        0px 4px 12px rgba(0, 0, 0, 0.5);
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .veng-gen-btn::before {
      content: "";
      position: absolute;
      inset: -1px;
      border-radius: 9999px;
      padding: 1px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.05));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .veng-gen-btn:hover {
      transform: translateY(-1px);
      border-color: rgba(255, 255, 255, 0.35);
      box-shadow:
        inset 0px 1px 2px rgba(255, 255, 255, 0.3),
        0 6px 20px rgba(0, 229, 255, 0.15);
    }
    .veng-gen-btn:active {
      transform: translateY(0) scale(0.98);
    }
  `;

  if (href) {
    return (
      <>
        <style>{style}</style>
        <a
          href={href}
          target={target}
          rel={rel}
          className={cn("veng-gen-btn group select-none no-underline", className)}
        >
          {content}
        </a>
      </>
    );
  }

  return (
    <>
      <style>{style}</style>
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn("veng-gen-btn group select-none outline-none", className)}
        {...props}
      >
        {content}
      </button>
    </>
  );
});

GenerateButton.displayName = "GenerateButton";

export default GenerateButton;
