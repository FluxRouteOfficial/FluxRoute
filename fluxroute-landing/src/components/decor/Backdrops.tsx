import { cn } from "@/lib/utils";

/**
 * Full-bleed engineering grid + brand mesh glow, faded at the edges.
 * Decorative only — communicates the "infrastructure / routing fabric" theme.
 */
export function GridBackdrop({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 bg-grid mask-radial-fade" />
      <div className="absolute inset-0 mesh-brand mask-radial-fade" />
    </div>
  );
}

/** A soft brand glow blob; position via className. */
export function Glow({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-full bg-brand/20 blur-[100px]",
        className
      )}
    />
  );
}

/** Hairline divider with a centered brand node — used between sections. */
export function SectionDivider() {
  return (
    <div aria-hidden className="section-container section-padding">
      <div className="relative flex items-center justify-center">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-line-strong to-transparent" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-brand/60 ring-4 ring-canvas" />
      </div>
    </div>
  );
}
