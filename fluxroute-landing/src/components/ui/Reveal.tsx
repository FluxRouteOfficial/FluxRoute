"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Delay in seconds before the reveal begins. */
  delay?: number;
  /** Vertical travel distance in px. */
  y?: number;
  as?: "div" | "li" | "section" | "span";
};

/**
 * Scroll-triggered reveal. Animates once when ~15% of the element is visible.
 * Honours reduced-motion automatically via the global CSS reset.
 */
export function Reveal({ children, className, delay = 0, y = 20, as = "div" }: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}
