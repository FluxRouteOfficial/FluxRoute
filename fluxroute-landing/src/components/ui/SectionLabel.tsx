import { cn } from "@/lib/utils";

type SectionLabelProps = {
  children: React.ReactNode;
  className?: string;
};

/** Section eyebrow: short accent-coloured label with a leading tick mark. */
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-body-sm font-medium uppercase tracking-[0.14em] text-brand",
        className
      )}
    >
      <span aria-hidden className="h-px w-6 bg-brand/60" />
      {children}
    </span>
  );
}
