"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface LoadingState {
  text: string;
}

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={cn("w-5 h-5", className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

const CheckFilledIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-5 h-5", className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export interface MultiStepLoaderProps {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
  onComplete?: () => void;
}

export const MultiStepLoader: React.FC<MultiStepLoaderProps> = ({
  loadingStates,
  loading = true,
  duration = 700,
  loop = false,
  onComplete,
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => {
      setCurrentState((prevState) => {
        if (prevState < loadingStates.length - 1) {
          return prevState + 1;
        } else {
          if (loop) return 0;
          if (onComplete) onComplete();
          return prevState;
        }
      });
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, duration, loop, loadingStates.length, onComplete]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full fixed inset-0 z-[200] flex items-center justify-center bg-[#030406]/95 backdrop-blur-2xl"
        >
          <div className="h-96 relative flex flex-col justify-start max-w-xl mx-auto px-6">
            {loadingStates.map((loadingState, index) => {
              const distance = Math.abs(index - currentState);
              const opacity = Math.max(1 - distance * 0.35, 0);

              return (
                <motion.div
                  key={index}
                  className="text-left flex items-center gap-3 py-3"
                  initial={{ opacity: 0, y: -(index * 40) }}
                  animate={{ opacity: opacity, y: (currentState - index) * 40 }}
                  transition={{ duration: 0.4 }}
                >
                  <div>
                    {index > currentState && (
                      <CheckIcon className="text-white/30" />
                    )}
                    {index === currentState && (
                      <CheckFilledIcon className="text-white animate-pulse" />
                    )}
                    {index < currentState && (
                      <CheckFilledIcon className="text-white/70" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-base sm:text-lg font-medium transition-colors",
                      index === currentState
                        ? "text-white font-bold tracking-tight"
                        : "text-white/40"
                    )}
                  >
                    {loadingState.text}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MultiStepLoader;
