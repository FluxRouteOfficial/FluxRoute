import { db } from './client.js';
import { users, services, serviceEndpoints } from './schema/index.js';

// A valid base58 Solana address used as the demo provider's payout wallet.
// (Wrapped-SOL mint address - well-formed base58, safe as placeholder.)
const DEMO_PROVIDER_WALLET = 'So11111111111111111111111111111111111111112';

// Category values MUST match the createServiceSchema enum (lowercase).
const seedServices = [
  { serviceId: 'img-resize', name: 'Image Resizer', category: 'image', description: 'Resize images on the fly', baseUrl: 'https://api.imgtools.io', priceSol: '0.001', priceUsdc: '0.05' },
  { serviceId: 'img-caption', name: 'Image Captioner', category: 'image', description: 'Generate captions for images using AI', baseUrl: 'https://api.captionai.io', priceSol: '0.005', priceUsdc: '0.25' },
  { serviceId: 'text-summarize', name: 'Text Summarizer', category: 'text', description: 'Summarize long text into key points', baseUrl: 'https://api.summarize.ai', priceSol: '0.002', priceUsdc: '0.10' },
  { serviceId: 'text-translate', name: 'Universal Translator', category: 'text', description: 'Translate text between 100+ languages', baseUrl: 'https://api.translate.sol', priceSol: '0.003', priceUsdc: '0.15' },
  { serviceId: 'data-enrich', name: 'Data Enrichment', category: 'data', description: 'Enrich company and contact data', baseUrl: 'https://api.enrichdata.io', priceSol: '0.01', priceUsdc: '0.50' },
  { serviceId: 'data-scrape', name: 'Web Scraper', category: 'data', description: 'Extract structured data from web pages', baseUrl: 'https://api.scrapecloud.io', priceSol: '0.008', priceUsdc: '0.40' },
  { serviceId: 'compute-ffmpeg', name: 'Video Transcoder', category: 'compute', description: 'Transcode video files in the cloud', baseUrl: 'https://api.transcode.sol', priceSol: '0.05', priceUsdc: '2.50' },
  { serviceId: 'compute-render', name: '3D Renderer', category: 'compute', description: 'Render 3D scenes on GPU clusters', baseUrl: 'https://api.render3d.io', priceSol: '0.1', priceUsdc: '5.00' },
  { serviceId: 'finance-price', name: 'Token Price Feed', category: 'finance', description: 'Real-time token prices across DEXs', baseUrl: 'https://api.pricefeed.sol', priceSol: '0.0005', priceUsdc: '0.025' },
  { serviceId: 'finance-risk', name: 'Risk Scorer', category: 'finance', description: 'On-chain wallet risk scoring', baseUrl: 'https://api.riskscore.io', priceSol: '0.02', priceUsdc: '1.00' },
];

async function main() {
  console.log('Seeding database...');

  const [provider] = await db.insert(users).values({
    email: 'provider@fluxroute.dev',
    walletMode: 'managed',
    walletAddress: DEMO_PROVIDER_WALLET,
    displayName: 'FluxRoute Demo Provider',
    isProvider: true,
  }).returning();

  for (const svc of seedServices) {
    const [inserted] = await db.insert(services).values({
      providerId: provider.id,
      providerWallet: DEMO_PROVIDER_WALLET,
      ...svc,
    }).returning();

    await db.insert(serviceEndpoints).values({
      serviceId: inserted.id,
      path: '/v1/execute',
      method: 'POST',
      description: `Execute ${svc.name}`,
      paramsSchema: { type: 'object', properties: { input: { type: 'string' } } },
    });
  }

  console.log(`Seeded ${seedServices.length} services.`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
