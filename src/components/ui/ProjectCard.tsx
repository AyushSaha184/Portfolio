"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { staggerChild } from "@/lib/animations";
import Icon from "@/components/ui/Icon";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const starsElRef = useRef<HTMLSpanElement>(null);
  const forksElRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // Prevents getBoundingClientRect from running more than once per 16ms frame
  const rafPending = useRef(false);

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
          if (!res.ok) return null;
          return res.json();
        })
        .then((data) => {
          if (data) {
            // Update DOM directly — no re-render needed
            if (starsElRef.current) {
              starsElRef.current.textContent = String(data.stargazers_count);
              starsElRef.current.closest(".gh-stat")?.classList.remove("hidden");
            }
            if (forksElRef.current) {
              forksElRef.current.textContent = String(data.forks_count);
              forksElRef.current.closest(".gh-stat")?.classList.remove("hidden");
            }
          }
        })
        .catch((err) => {
          console.debug("Could not fetch github stats", err);
        });
    }
  }, [project.githubUrl]);

  // RAF-throttled tilt: captures clientX/Y synchronously (safe on synthetic event),
  // then defers the getBoundingClientRect read to the next animation frame.
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (rafPending.current) return;
    rafPending.current = true;
    const clientX = e.clientX;
    const clientY = e.clientY;
    requestAnimationFrame(() => {
      rafPending.current = false;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const rotateX = ((rect.height / 2 - (clientY - rect.top)) / (rect.height / 2)) * 7;
      const rotateY = (((clientX - rect.left) - rect.width / 2) / (rect.width / 2)) * 7;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
      card.style.transition = "transform 0.12s cubic-bezier(0.25,1,0.5,1)";
    });
  };

  const handleMouseLeave = () => {
    rafPending.current = false;
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    card.style.transition = "transform 0.45s cubic-bezier(0.25,1,0.5,1)";
  };

  return (
    <motion.div
      variants={staggerChild}
      className="w-full max-w-4xl transform-gpu"
    >
      <article
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="project-card group relative flex w-full flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/5 backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] md:flex-row md:min-h-[340px] transform-gpu will-change-transform"
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
              <Icon id="fas fa-image" className="text-4xl text-[#82abff30]" />
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
                {/* Stats populated via direct DOM ref — no re-render */}
                <span className="gh-stat hidden flex items-center gap-1.5" title="GitHub Stars">
                  <Icon id="fas fa-star" className="text-[#ffd08c]" />
                  <span ref={starsElRef} />
                </span>
                <span className="gh-stat hidden flex items-center gap-1.5" title="GitHub Forks">
                  <Icon id="fas fa-code-branch" className="text-[#8dedff]" />
                  <span ref={forksElRef} />
                </span>
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
                <Icon id="fas fa-external-link-alt" />
                <span>Live Demo</span>
              </a>
            )}
            {project.disabled && (
              <span
                className="project-link-disabled inline-flex h-[38px] items-center justify-center gap-2 rounded-[12px] border border-[#82abff20] bg-black/20 px-4 text-[0.92rem] font-medium text-ink-dim opacity-50"
                aria-disabled="true"
                aria-label="Project demo unavailable"
              >
                <Icon id="fas fa-external-link-alt" />
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
              <Icon id="fab fa-github" />
            </a>
          </div>
        </div>
      </article>
    </motion.div>
  );
}
