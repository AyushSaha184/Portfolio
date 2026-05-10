"use client";

import { motion } from "framer-motion";
import { heroRise } from "@/lib/animations";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

export default function Hero() {
  return (
    <section
      className="hero relative min-h-screen overflow-hidden px-0 pb-28 pt-44 max-[680px]:min-h-[88vh] max-[680px]:pb-20 max-[680px]:pt-32"
      id="home"
    >
      {/* Parallax glow blob — driven by SmoothScrollProvider */}
      <div className="hero-glow" aria-hidden="true" />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-6 text-center">
        {/* Heading */}
        <motion.h1
          className="max-w-[940px] text-balance font-mono text-[clamp(2rem,7.8vw,4.8rem)] font-semibold leading-[1.04] tracking-[0.015em] text-ink drop-shadow-[0_0_28px_rgba(92,188,255,0.2)]"
          variants={heroRise}
          initial="hidden"
          animate="visible"
          custom={0.08}
        >
          Building the next generation of AI-driven products
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          className="mt-7 max-w-[780px] text-pretty text-[clamp(1rem,1.52vw,1.16rem)] text-ink-dim max-[680px]:text-[0.98rem]"
          variants={heroRise}
          initial="hidden"
          animate="visible"
          custom={0.17}
        >
          Fourth-year Computer Science student at Siliguri Institute of
          Technology, West Bengal. Specializing in RAG and Agentic AI Projects.
          Strong focus on performance and building reliable, production-ready
          services.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="hero-cta mt-9 flex items-center gap-3 max-[680px]:w-full max-[680px]:max-w-[260px] max-[680px]:flex-col max-[680px]:items-stretch"
          variants={heroRise}
          initial="hidden"
          animate="visible"
          custom={0.28}
        >
          <a
            href="#recent-work"
            className="btn-primary group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[0.94rem] font-bold tracking-[0.03em] text-[#1c1308] no-underline transition-all duration-300 max-[680px]:justify-center"
          >
            View Projects{" "}
            <i className="fas fa-arrow-right transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
