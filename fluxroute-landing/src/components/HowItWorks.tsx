"use client";

import { motion } from "framer-motion";
import { Plug, Send, Coins, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { staggerContainer, staggerItem } from "@/lib/utils";

const steps = [
  {
    icon: Plug,
    number: "01",
    title: "Connect",
    description:
      "Add FluxRoute to your agent's MCP config. One JSON entry - five lines.",
  },
  {
    icon: Send,
    number: "02",
    title: "Call",
    description:
      "Your agent discovers and calls any registered service through one unified interface.",
  },
  {
    icon: Coins,
    number: "03",
    title: "Pay",
    description:
      "The x402 protocol settles payment automatically in SOL or USDC-SPL, on-chain in ~400ms.",
  },
  {
    icon: CheckCircle2,
    number: "04",
    title: "Receive",
    description:
      "Payment verified on-chain, request fulfilled, response returned. Your agent continues.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-panel/40 py-24 md:py-32" id="how-it-works">
      <Container>
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <SectionLabel className="mb-4 justify-center">How it works</SectionLabel>
          <h2 className="text-heading-1 md:text-display text-ink">
            Four steps. Zero config management.
          </h2>
        </Reveal>

        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative grid gap-6 md:grid-cols-4"
        >
          {/* connecting rail */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-line-strong to-transparent md:block"
          />

          {steps.map((step) => (
            <motion.li key={step.number} variants={staggerItem} className="relative">
              <div className="relative mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-panel text-brand shadow-elevate">
                <step.icon size={22} strokeWidth={1.75} />
                <span className="absolute -right-1.5 -top-1.5 rounded-full bg-ink px-1.5 py-0.5 font-mono text-[0.625rem] font-medium text-canvas">
                  {step.number}
                </span>
              </div>
              <h3 className="text-heading-3 font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-body-sm text-dim">{step.description}</p>
            </motion.li>
          ))}
        </motion.ol>
      </Container>
    </section>
  );
}
