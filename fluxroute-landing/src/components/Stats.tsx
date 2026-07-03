"use client";

import { Container } from "@/components/ui/Container";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Reveal } from "@/components/ui/Reveal";

type Stat = {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

const stats: Stat[] = [
  { value: 2, label: "Supported payment assets" },
  { value: 4, label: "Core API modules" },
  { value: 2, suffix: "%", label: "Provider platform fee" },
  { value: 5, label: "Minute payment window" },
];

export function Stats() {
  return (
    <section className="border-y border-line bg-panel/40">
      <Container>
        <div className="grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x">
          {stats.map((stat, i) => (
            <Reveal
              key={stat.label}
              delay={i * 0.08}
              className="px-2 py-10 text-center md:px-6"
            >
              <p className="text-heading-2 font-semibold tracking-tight text-ink md:text-heading-1">
                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals ?? 0}
                />
              </p>
              <p className="mt-1.5 text-body-sm text-faint">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
