import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy - FluxRoute",
  description:
    "How FluxRoute collects, uses, and protects data for the Solana-native AI microservice routing layer.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="June 2026">
      <p>
        This policy explains what information FluxRoute processes when you use the
        routing layer, dashboard, and provider tools. It is written to describe
        the data flows present in the software; deployments may configure
        additional processors, which should be disclosed separately.
      </p>

      <LegalSection heading="Information we process">
        <p>
          Account data: email address and a securely hashed password (bcrypt).
          Wallet data: public Solana addresses that receive payments.
        </p>
        <p>
          Usage data: per-call audit logs (service, endpoint, amount, transaction
          signature, latency, and status) used for billing, analytics, and abuse
          prevention.
        </p>
      </LegalSection>

      <LegalSection heading="How we use data">
        <p>
          To authenticate accounts, route and settle payments on Solana, store
          service configuration, produce ledger records, and operate and secure
          the service.
        </p>
      </LegalSection>

      <LegalSection id="security" heading="Security">
        <p>
          Passwords are hashed with bcrypt and never stored in plaintext.
          Authentication uses RS256-signed JWTs. Payment verification is performed
          against on-chain transaction data before a request is fulfilled.
        </p>
        <p>
          No system is perfectly secure. Report vulnerabilities to{" "}
          <a className="text-brand hover:text-brand-strong" href="mailto:security@fluxroute.io">
            security@fluxroute.io
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="Data retention">
        <p>
          Audit and ledger records are retained for as long as needed to provide
          billing history and to meet operational and legal requirements. You may
          request deletion of account data, subject to records we must keep.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about this policy? Email{" "}
          <a className="text-brand hover:text-brand-strong" href="mailto:hello@fluxroute.io">
            hello@fluxroute.io
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
