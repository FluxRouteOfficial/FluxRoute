"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { staggerContainer, staggerItem } from "@/lib/utils";

const problems = [
  {
    before: "Separate API key, billing, and integration for each service",
    after: "One MCP-facing route into registered services",
  },
  {
    before: "Generic payment middleware not designed around Solana assets",
    after: "Solana-native settlement in SOL or USDC-SPL",
  },
  {
    before: "APIs scattered across docs with no unified registry",
    after: "Registry API with pricing and discovery",
  },
  {
    before: "Manual payment flows, credit cards, pre-funding",
    after: "Per-call Solana payment verification",
  },
  {
    before: "No spending controls - agents can overspend freely",
    after: "Budget configuration API for account-level controls",
  },
];

export function Problem() {
  return (
    <section className="py-24 md:py-32" id="problem">
      <Container className="max-w-5xl">
        <Reveal className="mb-14 max-w-2xl">
          <SectionLabel className="mb-4">The problem</SectionLabel>
          <h2 className="text-heading-1 md:text-display text-ink">
            AI agents need paid APIs.
            <br />
            The current way is broken.
          </h2>
          <p className="mt-5 text-body-lg text-dim">
            Every service demands separate keys, billing, and docs. Your agents
            burn cycles on plumbing instead of solving problems.
          </p>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="overflow-hidden rounded-2xl border border-line bg-panel"
        >
          {/* Column headers */}
          <div className="grid grid-cols-1 border-b border-line bg-panel-2/60 text-caption font-medium uppercase tracking-wider md:grid-cols-2">
            <div className="flex items-center gap-2 px-6 py-3 text-faint">
              <X size={14} /> Without FluxRoute
            </div>
            <div className="flex items-center gap-2 border-t border-line px-6 py-3 text-brand md:border-l md:border-t-0">
              <Check size={14} /> With FluxRoute
            </div>
          </div>

          {problems.map((p, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              className="grid grid-cols-1 border-b border-line last:border-b-0 md:grid-cols-2"
            >
              <div className="flex items-start gap-3 px-6 py-5">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-panel-2 text-faint">
                  <X size={12} />
                </span>
                <p className="text-body-sm text-faint line-through decoration-line-strong/70">
                  {p.before}
                </p>
              </div>
              <div className="flex items-start gap-3 border-t border-line px-6 py-5 md:border-l md:border-t-0">
                <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand/15 text-brand">
                  <Check size={12} />
                </span>
                <p className="text-body-sm font-medium text-ink">{p.after}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
