import type { ReactNode } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Container } from "@/components/ui/Container";

/**
 * Shared shell for legal / policy pages: consistent header, footer, and a
 * constrained, readable prose column.
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-32 md:pt-40">
        <Container>
          <div className="mx-auto max-w-prose pb-24">
            <p className="font-mono text-body-sm uppercase tracking-[0.18em] text-brand">
              Legal
            </p>
            <h1 className="mt-3 text-heading-1 font-semibold tracking-tight text-ink">
              {title}
            </h1>
            <p className="mt-2 text-body-sm text-faint">Last updated {updated}</p>
            <div className="legal-prose mt-10 space-y-8 text-body text-dim">
              {children}
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({
  id,
  heading,
  children,
}: {
  id?: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-heading-3 font-semibold text-ink">{heading}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}
