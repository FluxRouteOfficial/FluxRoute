"use client";

import { ServerCog, Wallet } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";

const fees = [
  {
    label: "Consumer fee",
    value: "0%",
    detail: "You pay the service price - nothing extra.",
  },
  {
    label: "Platform fee",
    value: "2%",
    detail: "Deducted from provider earnings only.",
  },
  {
    label: "Network fee",
    value: "Network",
    detail: "Standard Solana transaction costs paid by the caller.",
    mono: true,
  },
];

const modes = [
  {
    icon: ServerCog,
    title: "Provider settlement",
    text: "Providers receive payment to the wallet configured on each registered service.",
  },
  {
    icon: Wallet,
    title: "Caller wallet",
    text: "Callers submit their own Solana transaction and pass the signature back for verification.",
  },
];

export function Pricing() {
  return (
    <section className="bg-panel/40 py-24 md:py-32" id="pricing">
      <Container className="max-w-5xl">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <SectionLabel className="mb-4 justify-center">Pricing</SectionLabel>
          <h2 className="text-heading-1 md:text-display text-ink">
            Pay only for what you use
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-body-lg text-dim">
            No subscriptions. No minimum commitments. Per-call micropayments
            settled on Solana.
          </p>
        </Reveal>

        <Reveal>
          <div className="grid overflow-hidden rounded-2xl border border-line bg-panel md:grid-cols-3 md:divide-x md:divide-line">
            {fees.map((fee) => (
              <div key={fee.label} className="p-8 text-center">
                <p className="text-body-sm font-medium text-faint">{fee.label}</p>
                <p
                  className={`mt-3 text-heading-1 font-semibold text-ink ${fee.mono ? "font-mono text-heading-2" : ""}`}
                >
                  {fee.value}
                </p>
                <p className="mx-auto mt-2 max-w-[14rem] text-body-sm text-dim">{fee.detail}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {modes.map((mode, i) => (
            <Reveal key={mode.title} delay={i * 0.08}>
              <div className="flex h-full gap-4 rounded-xl border border-line bg-panel p-6">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg border border-line bg-brand/10 text-brand">
                  <mode.icon size={20} strokeWidth={1.75} />
                </span>
                <div>
                  <h3 className="text-body font-semibold text-ink">{mode.title}</h3>
                  <p className="mt-1 text-body-sm text-dim">{mode.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
