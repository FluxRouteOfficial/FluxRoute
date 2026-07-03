"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "Developers", href: "#developers" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "#pricing" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-all duration-300 ease-smooth",
          scrolled
            ? "border-b border-line bg-canvas/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <Container>
          <div className="flex h-16 items-center justify-between">
            <a href="/" aria-label="FluxRoute home" className="rounded-md">
              <Logo />
            </a>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-body-sm text-dim transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-2 md:flex">
              <ThemeToggle />
              <Button href="/docs" variant="ghost" size="sm">
                Docs
              </Button>
              <Button href="https://dashboard.fluxroute.xyz/dashboard/settings" variant="brand" size="sm">
                Open Dashboard
              </Button>
            </div>

            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle />
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-line text-dim"
                aria-label="Toggle menu"
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </Container>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-line bg-canvas/95 backdrop-blur-xl md:hidden"
          >
            <Container>
              <nav className="flex flex-col gap-1 py-4" aria-label="Mobile">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2.5 text-body text-dim transition-colors hover:bg-panel-2 hover:text-ink"
                  >
                    {link.label}
                  </a>
                ))}
                <Button href="#get-started" variant="brand" size="md" className="mt-2 w-full">
                  Open Dashboard
                </Button>
              </nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
