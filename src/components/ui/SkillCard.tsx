"use client";

import { motion } from "framer-motion";
import { staggerChild } from "@/lib/animations";
import { cn } from "@/lib/utils";
import type { SkillCategory } from "@/lib/types";

function getSkillIcon(skill: string) {
  const map: Record<string, string> = {
    Java: "fab fa-java text-orange-500",
    Python: "fab fa-python text-blue-500",
    C: "fas fa-code text-blue-600",
    PostgreSQL: "fas fa-database text-blue-400",
    MySQL: "fas fa-database text-orange-400",
    Redis: "fas fa-database text-red-500",
    Qdrant: "fas fa-database text-purple-500",
    Supabase: "fas fa-database text-green-500",
    Neon: "fas fa-database text-green-400",
    Git: "fab fa-git-alt text-orange-600",
    Docker: "fab fa-docker text-blue-500",
    FastAPI: "fas fa-bolt text-green-400",
    LangChain: "fas fa-link text-gray-300",
    LangGraph: "fas fa-project-diagram text-gray-300",
    LlamaIndex: "fas fa-book text-blue-300",
    FastMCP: "fas fa-server text-indigo-400",
    "Natural Language Processing": "fas fa-language text-blue-300",
    Transformers: "fas fa-robot text-purple-400",
    "Open Source LLMs": "fas fa-brain text-green-300",
    "Retrieval Augmented Generation": "fas fa-search text-orange-300",
    "AI Agents": "fas fa-microchip text-teal-400",
    "Model Context Protocol": "fas fa-network-wired text-indigo-300",
  };
  return map[skill] || "fas fa-check text-blue-400";
}

interface SkillCardProps {
  category: SkillCategory;
  className?: string;
}

const floatClass: Record<SkillCategory["floatSpeed"], string> = {
  slow: "animate-float-slow",
  medium: "animate-float-medium",
  fast: "animate-float-fast",
};

export default function SkillCard({ category, className }: SkillCardProps) {
  return (
    <motion.article
      variants={staggerChild}
      className={cn(
        "skill-category group relative overflow-hidden rounded-[18px] border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-[transform,border-color,box-shadow,background-color] duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] will-change-transform transform-gpu",
        floatClass[category.floatSpeed],
        className
      )}
    >
      <div className="mb-3 flex items-center gap-3">
        <i className={`${category.icon} text-ember`} />
        <h3 className="text-[1.08rem] text-[#f2f6ff]">{category.title}</h3>
      </div>
      <ul className="list-none">
        {category.skills.map((skill) => (
          <li
            key={skill}
            className="flex items-center gap-2.5 my-1.5 text-[0.95rem] text-[#cfdbef]"
          >
            <i className={`${getSkillIcon(skill)} w-4 text-center opacity-80`} />
            {skill}
          </li>
        ))}
      </ul>
    </motion.article>
  );
}
