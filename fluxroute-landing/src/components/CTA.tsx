"use client";

import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { LogoMark } from "@/components/Logo";

export function CTA() {
  return (
    <section className="py-24 md:py-32" id="get-started">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-panel px-6 py-16 text-center md:px-12 md:py-20">
            {/* decorative layers */}
            <div aria-hidden className="absolute inset-0 bg-grid mask-radial-fade opacity-70" />
            <div aria-hidden className="absolute inset-0 mesh-brand mask-radial-fade" />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[36rem] -translate-x-1/2 rounded-full bg-brand/20 blur-[100px]"
            />

            <div className="relative">
              <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-panel shadow-elevate">
                <LogoMark className="h-8 w-8" />
              </div>
              <h2 className="mx-auto max-w-2xl text-heading-1 md:text-display text-ink">
                Start routing in minutes
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-body-lg text-dim">
                Connect an agent to the API, register provider services, and verify Solana payments per call.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Button href="https://dashboard.fluxroute.xyz/dashboard/settings" variant="brand" size="lg">
                  Open dashboard
                  <ArrowRight size={18} />
                </Button>
                <Button href="/docs" variant="secondary" size="lg">
                  Read documentation
                </Button>
              </div>
              <p className="mt-6 text-body-sm text-faint">
                Free to start. Pay only when your agents make calls.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
