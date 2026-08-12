"use client";

import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FlipFadeTextProps {
  words?: string[];
  text?: string;
  interval?: number;
  className?: string;
  textClassName?: string;
  letterDuration?: number;
  staggerDelay?: number;
  exitStaggerDelay?: number;
}

const defaultWords = ["LOADING", "COMPUTING", "SEARCHING", "RETRIEVING", "ASSEMBLING"];

const Letter = memo(function Letter({
  char,
  letterDuration,
}: {
  char: string;
  letterDuration: number;
}) {
  return (
    <motion.span
      style={{ transformStyle: "preserve-3d", display: "inline-block" }}
      variants={{
        initial: {
          rotateX: 90,
          y: 24,
          opacity: 0,
          filter: "blur(8px)",
        },
        animate: {
          rotateX: 0,
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          transition: {
            duration: letterDuration,
            ease: [0.2, 0.65, 0.3, 0.9],
          },
        },
        exit: {
          rotateX: -90,
          y: -24,
          opacity: 0,
          filter: "blur(8px)",
          transition: {
            duration: letterDuration * 0.67,
            ease: "easeIn",
          },
        },
      }}
      className="inline-block"
    >
      {char}
    </motion.span>
  );
});

// Memoized Word component grouped by space-delimited words to prevent half-word wrapping
const Word = memo(function Word({
  text,
  staggerDelay,
  exitStaggerDelay,
  letterDuration,
  textClassName,
}: {
  text: string;
  staggerDelay: number;
  exitStaggerDelay: number;
  letterDuration: number;
  textClassName?: string;
}) {
  const wordTokens = useMemo(() => text.split(" "), [text]);

  return (
    <motion.div
      className={cn(
        "flex flex-wrap items-center justify-center gap-x-[0.35em] gap-y-2 font-bold tracking-tight text-white",
        textClassName
      )}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        initial: { opacity: 1 },
        animate: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
          },
        },
        exit: {
          opacity: 1,
          transition: {
            staggerChildren: exitStaggerDelay,
          },
        },
      }}
    >
      {wordTokens.map((word, wIdx) => {
        const letters = word.split("");
        return (
          <span key={`w-${wIdx}`} className="inline-block whitespace-nowrap">
            {letters.map((char, i) => (
              <Letter
                key={`${word}-${char}-${i}`}
                char={char}
                letterDuration={letterDuration}
              />
            ))}
          </span>
        );
      })}
    </motion.div>
  );
});

export function FlipFadeText({
  words,
  text,
  interval = 3000,
  className,
  textClassName,
  letterDuration = 0.5,
  staggerDelay = 0.05,
  exitStaggerDelay = 0.03,
}: FlipFadeTextProps) {
  const wordList = useMemo(() => {
    if (words && words.length > 0) return words;
    if (text) return [text];
    return defaultWords;
  }, [words, text]);

  const [index, setIndex] = useState(0);

  const updateIndex = useCallback(() => {
    if (wordList.length <= 1) return;
    setIndex((prev) => (prev + 1) % wordList.length);
  }, [wordList.length]);

  useEffect(() => {
    if (wordList.length <= 1) return;
    const timer = setInterval(updateIndex, interval);
    return () => clearInterval(timer);
  }, [updateIndex, interval, wordList.length]);

  const currentWord = useMemo(() => wordList[index] || "", [wordList, index]);

  return (
    <div className={cn("inline-flex items-center justify-center max-w-full", className)}>
      <div
        className="relative inline-flex items-center justify-center max-w-full"
        style={{ perspective: "1000px" }}
      >
        <AnimatePresence mode="wait">
          <Word
            key={currentWord}
            text={currentWord}
            staggerDelay={staggerDelay}
            exitStaggerDelay={exitStaggerDelay}
            letterDuration={letterDuration}
            textClassName={textClassName}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

export default FlipFadeText;
