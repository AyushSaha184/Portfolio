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
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.72,
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
      staggerChildren: 0.06,  // tighter stagger = feels snappier
      delayChildren: 0.04,
    },
  },
};

/* ═══════════════════════════════════════════
   STAGGER CHILD — individual grid item
   ═══════════════════════════════════════════ */
export const staggerChild: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: easing,
    },
  },
};

/* ═══════════════════════════════════════════
   HERO ANIMATE-IN — rise only (no blur)
   blur() on animating elements causes full
   raster repaint on every frame — avoid it.
   ═══════════════════════════════════════════ */
export const heroRise: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
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
    y: -12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: easing,
    },
  },
};
