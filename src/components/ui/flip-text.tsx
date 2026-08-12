"use client";

import React, { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FlipTextProps {
  className?: string;
  textClassName?: string;
  words?: string[];
  children?: string;
  duration?: number;
  interval?: number;
}

export function FlipText({
  className,
  textClassName,
  words = ["BUILDING AI-DRIVEN PRODUCTS", "RAG & AGENTIC AI SYSTEMS", "AUTONOMOUS MULTI-AGENT PIPELINES", "PRODUCTION-READY SERVICES"],
  children,
  duration = 0.6,
  interval = 3500,
}: FlipTextProps) {
  const [index, setIndex] = useState(0);

  const wordList = useMemo(() => {
    if (children) return [children];
    return words;
  }, [children, words]);

  useEffect(() => {
    if (wordList.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % wordList.length);
    }, interval);
    return () => clearInterval(timer);
  }, [wordList.length, interval]);

  const currentText = wordList[index] || "";
  const wordTokens = useMemo(() => currentText.split(" "), [currentText]);

  let globalCharIndex = 0;

  return (
    <div className={cn("flex flex-col items-start justify-start w-full h-[160px] sm:h-[190px] md:h-[210px] shrink-0 overflow-hidden", className)}>
      <style>{`
        @keyframes flipCharIn {
          0% {
            transform: rotateX(90deg) translateY(20px);
            opacity: 0;
            filter: blur(6px);
          }
          100% {
            transform: rotateX(0deg) translateY(0);
            opacity: 1;
            filter: blur(0);
          }
        }
        .flip-char-item {
          display: inline-block;
          backface-visibility: hidden;
          animation: flipCharIn var(--flip-duration, 0.6s) cubic-bezier(0.2, 0.65, 0.3, 0.9) forwards;
          animation-delay: var(--flip-delay, 0s);
        }
      `}</style>
      <div className="relative flex flex-wrap items-start justify-start gap-x-[0.3em] gap-y-2 w-full" style={{ perspective: "1000px" }}>
        <h1 key={currentText} className={cn("text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight flex flex-wrap gap-x-[0.35em] gap-y-2", textClassName)}>
          {wordTokens.map((word, wIdx) => {
            const wordChars = word.split("");
            return (
              <span key={`word-${wIdx}`} className="inline-block whitespace-nowrap">
                {wordChars.map((char, cIdx) => {
                  const charDelay = globalCharIndex * 0.035;
                  globalCharIndex++;
                  return (
                    <span
                      key={`${word}-${cIdx}`}
                      className="flip-char-item"
                      style={{
                        "--flip-duration": `${duration}s`,
                        "--flip-delay": `${charDelay}s`,
                        transformStyle: "preserve-3d",
                      } as React.CSSProperties}
                    >
                      {char}
                    </span>
                  );
                })}
              </span>
            );
          })}
        </h1>
      </div>
    </div>
  );
}

export default FlipText;
