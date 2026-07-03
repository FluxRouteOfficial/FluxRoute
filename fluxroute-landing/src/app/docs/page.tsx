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
      <section className="border-b border-line bg-panel/40 pb-8 pt-24 md:pb-12 md:pt-28">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">Documentation</p>
          <h1 className="mt-4 max-w-3xl text-heading-1 text-ink md:text-display">Build paid AI microservice routes with FluxRoute.</h1>
          <p className="mt-4 max-w-2xl text-body text-dim md:mt-5 md:text-body-lg">
            Accurate implementation docs for the current FluxRoute API, MCP server, payment flow, provider SDK,
            dashboard behavior, and launch operations.
          </p>
        </Container>
      </section>
      <section className="py-6 md:py-14">
        <Container>
          <DocsClient />
        </Container>
      </section>
      <Footer />
    </>
  );
}
