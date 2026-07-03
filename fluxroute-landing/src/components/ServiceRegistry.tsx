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

        <Reveal>
          <div className="rounded-xl border border-dashed border-line bg-panel p-6 text-center md:p-8">
            <p className="text-body font-semibold text-ink">No public provider services are listed yet.</p>
            <p className="mx-auto mt-2 max-w-2xl text-body-sm text-dim">
              The production registry is connected to the live API. New provider services will appear here after
              authenticated providers publish real endpoints through the dashboard or API.
            </p>
          </div>
        </Reveal>

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
            href="https://dashboard.fluxroute.xyz/dashboard"
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
