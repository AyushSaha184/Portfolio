"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { revealVariants } from "@/lib/animations";
import Icon from "@/components/ui/Icon";

const RESUME_PDF_URL =
  "https://github.com/AyushSaha184/Resume/releases/download/latestt/Resume.pdf";

export default function Resume() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const downloadRef = useRef<HTMLAnchorElement>(null);
  // Use a plain div wrapper for the IntersectionObserver — motion.section
  // does not reliably forward refs, causing the observer to never fire.
  const observerTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = observerTargetRef.current;
    if (!target) return;

    // Only fire the Google Docs request when the section is close to the viewport.
    // This prevents a heavy external resource (~2 MB) from loading on page mount.
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect(); // one-shot

        const cb = Date.now();
        if (iframeRef.current) {
          const baseSrc = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
            RESUME_PDF_URL
          )}`;
          iframeRef.current.src = `${baseSrc}&cb=${cb}`;
        }
        if (downloadRef.current) {
          downloadRef.current.href = `${RESUME_PDF_URL}?cb=${cb}`;
        }
      },
      { rootMargin: "300px" } // pre-load 300px before it enters view
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.section
      className="px-0 pb-32 pt-20"
      id="resume"
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "-8%" }}
    >
      {/* Plain div for IntersectionObserver — motion.section doesn't forward refs reliably */}
      <div ref={observerTargetRef} className="mx-auto w-full max-w-6xl px-6">
        <div className="section-shell overflow-hidden rounded-[28px] border border-[#82abff3d] bg-bg-panel p-7 shadow-[inset_0_0_0_1px_rgba(188,221,255,0.06),0_24px_56px_rgba(1,7,17,0.34)] max-[680px]:p-5">
          {/* Terminal-style header */}
          <div className="relative z-[1] mb-5 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57] shadow-[0_0_0_1px_rgba(0,0,0,0.18)]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-[0_0_0_1px_rgba(0,0,0,0.18)]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840] shadow-[0_0_0_1px_rgba(0,0,0,0.18)]" />
              <h2 className="ml-2 font-mono text-lg uppercase tracking-[0.14em] text-[#d6e6ff]">
                Resume
              </h2>
            </div>

            <a
              ref={downloadRef}
              href={RESUME_PDF_URL}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-2 rounded-full border border-[#ffc37a99] bg-[linear-gradient(110deg,#ff9f43,#ffc46f)] px-4 py-2 text-[0.82rem] font-bold uppercase tracking-[0.08em] text-[#1c1308] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(255,159,67,0.35)]"
            >
              <Icon id="fas fa-download" />
              Download PDF
            </a>
          </div>

          {/* Resume iframe */}
          <div className="relative z-[1] overflow-hidden rounded-2xl border border-[#82abff4d] bg-[#0a1528d9] p-2 shadow-[inset_0_0_0_1px_rgba(188,221,255,0.08)]">
            <iframe
              ref={iframeRef}
              src="about:blank"
              className="h-[1400px] w-full rounded-xl border-0 bg-[#08101f] max-[1200px]:h-[1200px] max-[980px]:h-[980px] max-[680px]:h-[760px]"
              title="Ayush Saha Resume"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
