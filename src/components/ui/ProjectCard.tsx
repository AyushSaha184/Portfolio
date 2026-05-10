"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { staggerChild } from "@/lib/animations";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [stars, setStars] = useState<number | null>(null);
  const [forks, setForks] = useState<number | null>(null);

  // Fetch GitHub Stats
  useEffect(() => {
    if (!project.githubUrl) return;

    // Extract owner and repo from github url
    // Example: https://github.com/AyushSaha184/IntelliDocs
    const match = project.githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (match) {
      const owner = match[1];
      const repo = match[2];

      const headers: HeadersInit = {};
      if (process.env.NEXT_PUBLIC_GITHUB_TOKEN) {
        headers["Authorization"] = `token ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`;
      }

      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers })
        .then((res) => {
          if (!res.ok) {
            // Silently handle rate limits/errors without breaking
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (data) {
            setStars(data.stargazers_count);
            setForks(data.forks_count);
          }
        })
        .catch((err) => {
          // Keep it quiet to avoid console spam on rate limits
          console.debug("Could not fetch github stats", err);
        });
    }
  }, [project.githubUrl]);

  return (
    <motion.article
      variants={staggerChild}
      className="project-card animate-float-slow group relative flex w-full max-w-4xl flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-md transition-[transform,border-color,box-shadow,background-color] duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] md:flex-row md:min-h-[340px] transform-gpu will-change-transform"
    >
      {/* Image Area */}
      <div className="relative h-[220px] w-full shrink-0 border-b border-[#82abff20] bg-black/40 md:h-auto md:w-[45%] md:border-b-0 md:border-r">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={`${project.title} preview`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(45deg,#0a101b,#141e30)]">
            {/* Sleek placeholder with subtle grid/glow */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#82abff0a_1px,transparent_1px),linear-gradient(to_bottom,#82abff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(141,237,255,0.05)_0%,transparent_60%)]" />
            <i className="fas fa-image text-4xl text-[#82abff30]" />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
        <div>
          {/* Header: tag + stats */}
          <div className="project-header mb-4 flex flex-wrap items-center justify-between gap-3">
            <span className="project-tag inline-flex items-center rounded-full border border-[#ffd08c]/30 bg-[#ffd08c]/10 px-3 py-1 text-[0.75rem] font-bold uppercase tracking-[0.09em] text-[#ffd08c]">
              {project.tag}
            </span>

            <div className="flex items-center gap-3 text-[0.8rem] text-ink-dim">
              {stars !== null && (
                <span className="flex items-center gap-1.5" title="GitHub Stars">
                  <i className="fas fa-star text-[#ffd08c]" />
                  {stars}
                </span>
              )}
              {forks !== null && (
                <span className="flex items-center gap-1.5" title="GitHub Forks">
                  <i className="fas fa-code-branch text-[#8dedff]" />
                  {forks}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-mono text-[clamp(1.35rem,2.5vw,1.75rem)] font-semibold tracking-[0.06em] text-[#f1f6ff]">
            {project.title} <span className="text-ember">{project.titleAccent}</span>
          </h3>

          {/* Description */}
          <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-dim md:text-[1rem]">
            {project.description}
          </p>

          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-[#82abff20] bg-[#82abff08] px-2.5 py-1 text-[0.8rem] text-ink-dim transition-colors hover:border-[#8dedff50] hover:text-[#d9e9ff]"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Links */}
        <div className="project-links mt-6 flex items-center gap-3 md:mt-8">
          {project.demoUrl && !project.disabled && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${project.title} ${project.titleAccent} live demo`}
              className="inline-flex h-[38px] items-center justify-center gap-2 rounded-[12px] border border-[#82abff4d] bg-[#0c1626c7] px-4 text-[0.92rem] font-medium text-[#d9e9ff] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8dedff9e] hover:bg-[#46d7ff24]"
            >
              <i className="fas fa-external-link-alt" />
              <span>Live Demo</span>
            </a>
          )}
          {project.disabled && (
            <span
              className="project-link-disabled inline-flex h-[38px] items-center justify-center gap-2 rounded-[12px] border border-[#82abff20] bg-black/20 px-4 text-[0.92rem] font-medium text-ink-dim opacity-50"
              aria-disabled="true"
              aria-label="Project demo unavailable"
            >
              <i className="fas fa-external-link-alt" />
              <span>Offline</span>
            </span>
          )}
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${project.title} ${project.titleAccent} GitHub repository`}
            className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-[12px] border border-[#82abff4d] bg-[#0c1626c7] text-[1.1rem] text-[#d9e9ff] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8dedff9e] hover:bg-[#46d7ff24]"
          >
            <i className="fab fa-github" />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
