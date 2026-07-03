import type { Variants } from "framer-motion";

type ClassValue = string | number | null | false | undefined;

/**
 * Minimal class combiner — no external dependency.
 * Filters falsy values and collapses whitespace.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

/** Shared scroll-reveal variants (respects the project's motion language). */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Staggered container for lists of revealing children. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};
