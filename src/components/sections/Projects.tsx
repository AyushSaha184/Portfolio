"use client";

import { motion } from "framer-motion";
import { revealVariants, staggerContainer } from "@/lib/animations";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ui/ProjectCard";

export default function Projects() {
  return (
    <motion.section
      className="px-0 pb-36 pt-20"
      id="recent-work"
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "-8%" }}
    >
      <div
        className="section-shell mx-auto w-full max-w-6xl overflow-hidden rounded-[28px] border border-[#82abff3d] bg-bg-panel p-9 shadow-[inset_0_0_0_1px_rgba(188,221,255,0.06),0_28px_62px_rgba(1,7,17,0.38)] max-[680px]:p-5"
      >
        <h2 className="relative z-[1] mb-7 font-mono text-[clamp(2rem,4.8vw,3.4rem)] font-semibold uppercase tracking-[0.06em]">
          Featured <span className="text-ember">Projects</span>
        </h2>

        <motion.div
          className="bento-stagger flex flex-col items-center gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1, margin: "-5%" }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.githubUrl} project={project} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
