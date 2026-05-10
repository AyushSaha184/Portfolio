"use client";

import { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { revealVariants, staggerContainer } from "@/lib/animations";
import { skillCategories } from "@/data/skills";
import SkillCard from "@/components/ui/SkillCard";

export default function Skills() {
  const shellRef = useRef<HTMLDivElement>(null);

  const handleShellMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = shellRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      el.style.setProperty("--card-mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--card-my", `${e.clientY - rect.top}px`);
      el.style.setProperty("--card-glow", "1");
    },
    []
  );

  const handleShellMouseLeave = useCallback(() => {
    shellRef.current?.style.setProperty("--card-glow", "0");
  }, []);

  return (
    <motion.section
      className="px-0 pb-32 pt-20"
      id="skills"
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "-8%" }}
    >
      <div
        ref={shellRef}
        className="section-shell mx-auto w-full max-w-6xl overflow-hidden rounded-[28px] border border-white/5 bg-white/[0.02] p-9 backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.12)] max-[680px]:p-5"
        onMouseMove={handleShellMouseMove}
        onMouseLeave={handleShellMouseLeave}
      >
        <h2 className="relative z-[1] mb-12 font-mono text-[clamp(2rem,4.8vw,3.4rem)] font-semibold uppercase tracking-[0.06em]">
          Technical <span className="text-ember">Skills</span>
        </h2>

        <motion.div 
          className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skillCategories.map((cat) => (
            <SkillCard key={cat.title} category={cat} className="h-full" />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
