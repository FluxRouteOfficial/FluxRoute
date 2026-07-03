"use client";

import { motion } from "framer-motion";
import { BarChart3, Code2, Globe, Shield, Wallet, Zap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { staggerContainer, staggerItem } from "@/lib/utils";

const features = [
  {
    icon: Zap,
    title: "Solana payment rail",
    description:
      "Negotiate SOL or USDC-SPL payment requirements and verify submitted transactions on-chain.",
  },
  {
    icon: Shield,
    title: "Validated API contracts",
    description:
      "Shared Zod schemas validate registry, payment, endpoint, and budget configuration inputs.",
  },
  {
    icon: Wallet,
    title: "Wallet-aware calls",
    description:
      "Payment records bind each call to a transaction signature, recipient, amount, and memo.",
  },
  {
    icon: Globe,
    title: "Service registry API",
    description:
      "Providers can register HTTP services with pricing, categories, endpoints, and wallet addresses.",
  },
  {
    icon: Code2,
    title: "Provider SDK",
    description:
      "TypeScript helpers generate x402-style payment requirements for provider applications.",
  },
  {
    icon: BarChart3,
    title: "Ledger records",
    description:
      "Successful executions write spend and earnings rows for downstream reporting.",
  },
];

export function Features() {
  return (
    <section className="py-24 md:py-32" id="features">
      <Container>
        <Reveal className="mb-14 max-w-2xl">
          <SectionLabel className="mb-4">Core features</SectionLabel>
          <h2 className="text-heading-1 md:text-display text-ink">
            Infrastructure that gets out of your way
          </h2>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.article
              key={feature.title}
              variants={staggerItem}
              className="group relative bg-panel p-7 transition-colors duration-300 hover:bg-panel-2"
            >
              <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-brand/10 text-brand transition-transform duration-300 group-hover:scale-105">
                <feature.icon size={20} strokeWidth={1.75} />
              </div>
              <h3 className="text-body font-semibold text-ink">{feature.title}</h3>
              <p className="mt-2 text-body-sm text-dim">{feature.description}</p>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-brand to-transparent transition-transform duration-300 group-hover:scale-x-100"
              />
            </motion.article>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
