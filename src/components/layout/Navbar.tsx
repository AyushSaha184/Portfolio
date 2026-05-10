"use client";

import { useState, useCallback } from "react";
import { socials } from "@/data/socials";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#recent-work" },
  { label: "Resume", href: "#resume" },
  { label: "Contact Me", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
  }, []);

  return (
    <header className="navbar" id="navbar">
      <div className="mx-auto grid min-h-[82px] w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6 max-[980px]:flex max-[980px]:min-h-[78px] max-[980px]:justify-between">
        {/* Logo */}
        <a
          href="#home"
          className="justify-self-start font-mono text-[1.42rem] font-semibold uppercase tracking-[0.08em] text-ink no-underline"
        >
          Port<span className="text-ember">folio</span>
        </a>

        {/* Nav Links */}
        <nav
          className={`nav-links justify-self-center max-[980px]:fixed max-[980px]:left-0 max-[980px]:top-[77px] max-[980px]:z-30 max-[980px]:w-full max-[980px]:flex-col max-[980px]:gap-5 max-[980px]:border-b max-[980px]:border-white/10 max-[980px]:bg-[#080b0dfa] max-[980px]:p-6 ${
            menuOpen
              ? "active max-[980px]:translate-y-0"
              : "max-[980px]:-translate-y-[130%]"
          }`}
          id="nav-links"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="nav-item relative text-[0.82rem] font-bold uppercase tracking-[0.16em] text-ink-dim transition-colors duration-200 hover:text-ink"
              onClick={closeMenu}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right side: socials + hamburger */}
        <div className="flex items-center gap-3 justify-self-end">
          <div
            className="nav-socials flex gap-2 max-[980px]:hidden"
            aria-label="Social links"
          >
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
                className="inline-flex h-[33px] w-[33px] items-center justify-center rounded-xl border border-[#82abff57] bg-[#0c1727c2] text-[0.86rem] text-[#d7e7ff] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8dedffb3] hover:bg-[#46d7ff2e] hover:text-[#f4fdff] hover:shadow-[0_0_0_2px_rgba(70,215,255,0.16)]"
              >
                <i className={social.icon} />
              </a>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className={`hamburger hidden cursor-pointer border-0 bg-transparent max-[980px]:inline-block ${
              menuOpen ? "active" : ""
            }`}
            id="hamburger"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </div>
    </header>
  );
}
