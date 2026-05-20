"use client";

import { motion } from "framer-motion";
import { socials } from "@/data/socials";
import { revealVariants } from "@/lib/animations";
import Icon from "@/components/ui/Icon";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 px-0 pb-7 pt-14" id="contact">
      <motion.div
        className="mx-auto grid w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-6 max-[980px]:grid-cols-1 max-[980px]:text-center"
        variants={revealVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-8%" }}
      >
        {/* Name */}
        <a
          href="#home"
          className="font-mono text-[1.42rem] font-semibold uppercase tracking-[0.08em] text-ink no-underline"
        >
          Ayush<span className="text-ember"> Saha</span>
        </a>

        {/* Tagline */}
        <p className="mx-auto max-w-[460px] text-center text-ink-dim">
          Building RAG systems and multi-agent products with production rigor.
        </p>

        {/* Social icons */}
        <div className="flex gap-2 max-[980px]:justify-center">
          {socials.map((social) => (
            <a
              key={social.platform}
              href={social.url}
              target={social.platform === "email" ? undefined : "_blank"}
              rel={
                social.platform === "email"
                  ? undefined
                  : "noopener noreferrer"
              }
              aria-label={social.label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-[11px] border border-[#82abff4d] bg-[#0c1626c2] text-[#dae9ff] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8dedff99] hover:bg-[#46d7ff21]"
            >
              <Icon id={social.icon} />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Copyright */}
      <div className="mx-auto mt-4 flex w-full max-w-6xl justify-between border-t border-[#82abff3d] px-6 pb-4 pt-4 text-[0.89rem] text-[#ccdcf6bd] max-[980px]:flex-col max-[980px]:items-center max-[980px]:gap-2">
        <p>&copy; {year} Ayush Saha. All rights reserved.</p>
      </div>
    </footer>
  );
}
