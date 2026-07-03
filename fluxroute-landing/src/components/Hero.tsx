"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { CodeWindow } from "@/components/CodeWindow";
import { RoutingDiagram } from "@/components/decor/RoutingDiagram";
import { GridBackdrop } from "@/components/decor/Backdrops";
import { staggerContainer, staggerItem } from "@/lib/utils";

const mcpConfig = `{
  "mcpServers": {
    "FluxRoute": {
      "command": "npx",
      "args": ["-y", "@fluxroute/mcp"],
      "env": {
        "FLUXROUTE_API_KEY": "fr_live_..."
      }
    }
  }
}`;

const productNotes = ["MCP gateway", "x402 negotiation", "SOL and USDC-SPL", "Provider proxy"];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 md:pt-40">
      <GridBackdrop />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          {/* Copy column */}
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">
            <motion.div variants={staggerItem}>
              <Badge dot className="mb-6">
                Solana-native infrastructure
              </Badge>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              className="text-display md:text-display-xl text-ink"
            >
              One connection.
              <br />
              <span className="text-brand-sweep">Every service.</span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="mt-6 max-w-xl text-body-lg text-dim"
            >
              Route AI agents to paid microservices through a single
              MCP endpoint. Pay per call in SOL or USDC-SPL - no API-key sprawl,
              no billing fragmentation.
            </motion.p>

            <motion.div variants={staggerItem} className="mt-8 flex flex-wrap gap-3">
              <Button href="#get-started" variant="brand" size="lg">
                Start building
                <ArrowRight size={18} />
              </Button>
              <Button href="#how-it-works" variant="secondary" size="lg">
                <BookOpen size={17} />
                How it works
              </Button>
            </motion.div>

            <motion.div variants={staggerItem} className="mt-12">
              <p className="text-caption uppercase tracking-[0.14em] text-faint">
                Implemented product surface
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
                {productNotes.map((name) => (
                  <span
                    key={name}
                    className="text-body-sm font-medium text-faint transition-colors hover:text-dim"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Visual column */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              <CodeWindow
                tabs={[
                  { label: "mcp_config.json", filename: "mcp_config.json", code: mcpConfig },
                ]}
              />
              <div className="absolute -bottom-3 -right-3 rounded-full border border-line bg-panel px-3 py-1.5 text-caption font-medium text-brand shadow-elevate">
                Minimal MCP config
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-line bg-panel/60 p-5 backdrop-blur">
              <RoutingDiagram className="max-w-[460px]" />
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Fade base into the next section */}
      <div className="pointer-events-none h-24 md:h-28" />
    </section>
  );
}
