"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";

/* Heavy canvas + scroll provider — skip SSR */
const Starfield = dynamic(() => import("@/components/ui/Starfield"), {
  ssr: false,
});

const SmoothScrollProvider = dynamic(
  () => import("@/components/providers/SmoothScrollProvider"),
  { ssr: false }
);

/* Below-the-fold sections — lazy-load to keep initial JS bundle lean.
   `loading: () => null` prevents a flash since they'll be in-viewport on scroll */
const Skills = dynamic(() => import("@/components/sections/Skills"), {
  ssr: false,
  loading: () => <div className="px-0 pb-32 pt-20" aria-hidden="true" />,
});

const Projects = dynamic(() => import("@/components/sections/Projects"), {
  ssr: false,
  loading: () => <div className="px-0 pb-36 pt-20" aria-hidden="true" />,
});

const Resume = dynamic(() => import("@/components/sections/Resume"), {
  ssr: false,
  loading: () => <div className="px-0 pb-32 pt-20" aria-hidden="true" />,
});

export default function Home() {
  return (
    <SmoothScrollProvider>
      <Starfield />
      <div className="noise" aria-hidden="true" />
      <Navbar />

      <main>
        <Hero />
        <Skills />
        <Projects />
        <Resume />
      </main>

      <Footer />
    </SmoothScrollProvider>
  );
}
