"use client";

import { Boxes, FileCode2, Terminal } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Reveal } from "@/components/ui/Reveal";
import { CodeWindow } from "@/components/CodeWindow";

const consumerCode = `import { FluxRouteMCP } from "@fluxroute/mcp";

const agent = new FluxRouteMCP({
  apiKey: process.env.FLUXROUTE_API_KEY,
  walletMode: "managed",
});

// Call any service - payment handled automatically
const result = await agent.call("openai-whisper", "/transcribe", {
  audio_url: "https://example.com/audio.mp3",
  language: "en",
});`;

const providerCode = `import { FluxRouteProvider } from "@fluxroute/provider-sdk";

const provider = new FluxRouteProvider({
  serviceId: "my-image-api",
  priceSol: 0.001,
  priceUsdc: 0.10,
});

// Wrap your existing endpoint
app.post("/generate",
  provider.requirePayment(),
  async (req, res) => {
    const image = await generateImage(req.body.prompt);
    res.json({ url: image.url });
  }
);`;

const highlights = [
  { icon: FileCode2, title: "TypeScript-first", text: "Fully typed SDKs with autocompletion for every service." },
  { icon: Terminal, title: "One-command CLI", text: "Scaffold, test, and publish services from your terminal." },
  { icon: Boxes, title: "Framework agnostic", text: "Drop into Express, Hono, Next.js, or any Node runtime." },
];

export function DeveloperExperience() {
  return (
    <section className="py-24 md:py-32" id="developers">
      <Container>
        <div className="grid min-w-0 gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <Reveal className="min-w-0">
            <SectionLabel className="mb-4">Developer experience</SectionLabel>
            <h2 className="text-heading-1 md:text-display text-ink">
              Built for developers who ship
            </h2>
            <p className="mt-5 max-w-xl text-body-lg text-dim">
              TypeScript-first SDKs, comprehensive docs, and a CLI that makes
              publishing and consuming services trivial - whether you build
              agents or sell APIs.
            </p>

            <ul className="mt-8 space-y-5">
              {highlights.map((h) => (
                <li key={h.title} className="flex gap-4">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-line bg-brand/10 text-brand">
                    <h.icon size={18} strokeWidth={1.75} />
                  </span>
                  <div>
                    <p className="text-body font-semibold text-ink">{h.title}</p>
                    <p className="text-body-sm text-dim">{h.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="min-w-0" delay={0.1}>
            <CodeWindow
              tabs={[
                { label: "agent.ts", filename: "agent.ts", code: consumerCode },
                { label: "server.ts", filename: "server.ts", code: providerCode },
              ]}
            />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
