import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service - FluxRoute",
  description:
    "The terms governing use of FluxRoute, the Solana-native AI microservice routing layer.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="June 2026">
      <p>
        These terms govern your use of FluxRoute. By connecting an agent, wallet,
        or provider service, you agree to them. If you are using FluxRoute on
        behalf of an organization, you agree on its behalf.
      </p>

      <LegalSection heading="The service">
        <p>
          FluxRoute routes AI-agent requests to registered microservices and
          settles per-call payments on Solana in SOL or USDC-SPL. Consumers pay
          the provider&apos;s listed price; a platform fee is deducted from
          provider earnings.
        </p>
      </LegalSection>

      <LegalSection heading="Accounts and wallets">
        <p>
          You are responsible for safeguarding your credentials, API keys, and
          wallets. In bring-your-own-wallet mode you retain custody of funds and
          authorize each payment. Managed-wallet balances are spent according to
          the budget controls you configure.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>
          Do not use FluxRoute to break the law, infringe rights, disrupt the
          network, or list services that are fraudulent or harmful. Providers are
          responsible for the legality and accuracy of the services they list.
        </p>
      </LegalSection>

      <LegalSection heading="Payments and fees">
        <p>
          On-chain transactions are irreversible. Network fees are set by Solana,
          not FluxRoute. The platform fee in effect at the time of a call is shown
          in the pricing section and applied to provider settlement.
        </p>
      </LegalSection>

      <LegalSection heading="Disclaimer and liability">
        <p>
          The service is provided &quot;as is&quot; without warranties of any
          kind. To the maximum extent permitted by law, FluxRoute is not liable for
          indirect or consequential damages, or for losses arising from on-chain
          transactions or third-party provider services.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about these terms? Email{" "}
          <a className="text-brand hover:text-brand-strong" href="mailto:hello@fluxroute.xyz">
            hello@fluxroute.xyz
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
