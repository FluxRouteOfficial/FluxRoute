import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "brand";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-md whitespace-nowrap " +
  "transition-all duration-200 ease-smooth select-none " +
  "focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none " +
  "active:scale-[0.98]";

const variants: Record<Variant, string> = {
  // Primary = high-contrast ink button (adapts per theme)
  primary:
    "bg-ink text-canvas hover:opacity-90 shadow-elevate",
  // Brand = verdigris accent for the single most important action
  brand:
    "bg-brand text-brand-contrast hover:bg-brand-strong shadow-glow",
  secondary:
    "border border-line-strong text-ink bg-panel/60 hover:bg-panel hover:border-ink/30",
  ghost: "text-dim hover:text-ink hover:bg-panel-2",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-body-sm",
  md: "h-11 px-5 text-body-sm",
  lg: "h-12 px-6 text-body",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant = "primary", size = "md", className, children, ...rest }, ref) {
    const classes = cn(base, variants[variant], sizes[size], className);

    if ("href" in rest && rest.href !== undefined) {
      const { href, ...anchorRest } = rest as ButtonAsLink;
      return (
        <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes} {...anchorRest}>
          {children}
        </a>
      );
    }

    const { type, ...buttonRest } = rest as ButtonAsButton;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type ?? "button"}
        className={classes}
        {...buttonRest}
      >
        {children}
      </button>
    );
  }
);
