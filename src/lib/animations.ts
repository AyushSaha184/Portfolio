import type { Variants } from "framer-motion";

/* ═══════════════════════════════════════════
   SHARED EASING
   Matches the original --easing cubic-bezier
   ═══════════════════════════════════════════ */
export const easing = [0.2, 0.7, 0, 1] as const;

/* ═══════════════════════════════════════════
   REVEAL — scroll-triggered slide-up + fade
   ═══════════════════════════════════════════ */
export const revealVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.78,
      ease: easing,
    },
  },
};

/* ═══════════════════════════════════════════
   STAGGER CONTAINER — bento grid children
   ═══════════════════════════════════════════ */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

/* ═══════════════════════════════════════════
   STAGGER CHILD — individual grid item
   ═══════════════════════════════════════════ */
export const staggerChild: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: easing,
    },
  },
};

/* ═══════════════════════════════════════════
   HERO ANIMATE-IN — blur + rise
   ═══════════════════════════════════════════ */
export const heroRise: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.95,
    filter: "blur(6px)",
  },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.9,
      ease: easing,
      delay,
    },
  }),
};

/* ═══════════════════════════════════════════
   NAV DROP-IN
   ═══════════════════════════════════════════ */
export const navDropIn: Variants = {
  hidden: {
    opacity: 0,
    y: -14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.74,
      ease: easing,
    },
  },
};
