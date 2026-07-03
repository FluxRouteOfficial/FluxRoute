const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fluxroute.io";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "FluxRoute",
      url: siteUrl,
      description:
        "A Solana-native AI microservice routing layer. Connect your agent once and pay per call in SOL or USDC-SPL.",
    },
    {
      "@type": "WebSite",
      name: "FluxRoute",
      url: siteUrl,
    },
  ],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
