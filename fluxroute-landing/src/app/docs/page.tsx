import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";
import { DocsClient } from "@/components/docs/DocsClient";

export const metadata: Metadata = {
  title: "FluxRoute Docs - MCP Routing for Solana Payments",
  description:
    "FluxRoute documentation for MCP setup, service registry, SOL and USDC-SPL payment flow, provider SDK, API routes, and production operations.",
  alternates: { canonical: "/docs" },
  openGraph: {
    title: "FluxRoute Docs",
    description:
      "Technical documentation for the Solana-native MCP routing layer for paid AI microservices.",
    url: "https://fluxroute.xyz/docs",
    type: "article",
  },
};

export default function DocsPage() {
  return (
    <>
      <Header />
      <section className="border-b border-line bg-panel/40 pb-12 pt-28">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">Documentation</p>
          <h1 className="mt-4 max-w-3xl text-display text-ink">Build paid AI microservice routes with FluxRoute.</h1>
          <p className="mt-5 max-w-2xl text-body-lg text-dim">
            Accurate implementation docs for the current FluxRoute API, MCP server, payment flow, provider SDK,
            dashboard behavior, and launch operations.
          </p>
        </Container>
      </section>
      <section className="py-10 md:py-14">
        <Container>
          <DocsClient />
        </Container>
      </section>
      <Footer />
    </>
  );
}
