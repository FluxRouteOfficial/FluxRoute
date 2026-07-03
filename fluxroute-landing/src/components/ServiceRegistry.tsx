"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  AudioLines,
  Binary,
  Code,
  Cpu,
  DollarSign,
  Image as ImageIcon,
  MessageSquare,
  Search,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { staggerContainer, staggerItem } from "@/lib/utils";

const categories = [
  { label: "Text", count: 0, icon: MessageSquare },
  { label: "Data", count: 0, icon: Binary },
  { label: "Finance", count: 0, icon: DollarSign },
  { label: "Search", count: 0, icon: Search },
  { label: "Compute", count: 0, icon: Cpu },
  { label: "Code", count: 0, icon: Code },
  { label: "Image", count: 0, icon: ImageIcon },
  { label: "Audio", count: 0, icon: AudioLines },
];

const sampleServices = [
  {
    name: "Audio transcription API",
    provider: "Example provider",
    description: "A provider-hosted endpoint exposed through x402 payment negotiation.",
    price: "0.001",
    endpoints: 4,
  },
  {
    name: "Image generation API",
    provider: "Example provider",
    description: "A metered image endpoint with transparent per-call pricing.",
    price: "0.005",
    endpoints: 2,
  },
  {
    name: "Data enrichment API",
    provider: "Example provider",
    description: "A JSON API that agents can call after payment verification.",
    price: "0.0001",
    endpoints: 12,
  },
];

const marquee = [
  "Text",
  "Image",
  "Data",
  "Finance",
  "Search",
  "Compute",
  "Code",
  "Audio",
];

export function ServiceRegistry() {
  return (
    <section className="bg-panel/40 py-24 md:py-32" id="services">
      <Container>
        <Reveal className="mb-12 max-w-2xl">
          <SectionLabel className="mb-4">Service registry</SectionLabel>
          <h2 className="text-heading-1 md:text-display text-ink">
            A registry for paid services. One endpoint.
          </h2>
          <p className="mt-5 text-body-lg text-dim">
            Browse, discover, and call services across every category, each
            priced transparently and settled on Solana.
          </p>
        </Reveal>

        {/* Category chips */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mb-10 flex flex-wrap gap-2"
        >
          {categories.map((cat) => (
            <motion.span
              key={cat.label}
              variants={staggerItem}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-body-sm text-dim transition-colors hover:border-brand/40 hover:text-ink"
            >
              <cat.icon size={14} className="text-brand" />
              {cat.label}
              <span className="text-caption text-faint">{cat.count}</span>
            </motion.span>
          ))}
        </motion.div>

        {/* Featured service cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {sampleServices.map((service, i) => (
            <Reveal key={service.name} delay={i * 0.07}>
              <article className="group h-full rounded-xl border border-line bg-panel p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-elevate">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-caption font-medium uppercase tracking-wider text-faint">
                    {service.provider}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-caption text-brand">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                      <span className="relative h-1.5 w-1.5 rounded-full bg-brand" />
                    </span>
                    Online
                  </span>
                </div>
                <h3 className="text-body font-semibold text-ink">{service.name}</h3>
                <p className="mt-1.5 text-body-sm text-dim">{service.description}</p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <span className="font-mono text-body-sm text-ink">
                    {service.price} SOL
                    <span className="text-faint"> / call</span>
                  </span>
                  <span className="text-caption text-faint">{service.endpoints} endpoints</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Provider marquee */}
        <div className="mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-10">
            {[...marquee, ...marquee].map((name, i) => (
              <span key={i} className="text-body-sm font-medium text-faint">
                {name}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-body-sm font-medium text-brand transition-colors hover:text-brand-strong"
          >
            Open dashboard
            <ArrowRight size={16} />
          </a>
        </div>
      </Container>
    </section>
  );
}
