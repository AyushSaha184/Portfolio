"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Resume from "@/components/sections/Resume";

/* Heavy canvas component — skip SSR */
const Starfield = dynamic(() => import("@/components/ui/Starfield"), {
  ssr: false,
});

const SmoothScrollProvider = dynamic(
  () => import("@/components/providers/SmoothScrollProvider"),
  { ssr: false }
);

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
