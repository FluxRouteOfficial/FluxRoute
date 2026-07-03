export async function handleListTools() {
  return {
    tools: [
      {
        name: 'FLUXROUTE_list_services',
        description: 'List available services on FluxRoute with optional category filter',
        inputSchema: {
          type: 'object' as const,
          properties: {
            category: { type: 'string', description: 'Filter: image, text, data, compute, finance, audio, search, code' },
            search: { type: 'string', description: 'Search query' },
          },
        },
      },
      {
        name: 'FLUXROUTE_call',
        description:
          'Call a FluxRoute-registered microservice via the x402 flow. First call without tx_signature to get payment instructions (recipient, amount, memo=call_id). After paying on Solana with that memo, call again with call_id and tx_signature to execute.',
        inputSchema: {
          type: 'object' as const,
          properties: {
            service_id: { type: 'string', description: 'The service ID to call' },
            endpoint: { type: 'string', description: 'Endpoint path (e.g. /transcribe)' },
            params: { type: 'object', description: 'Request parameters' },
            currency: { type: 'string', description: "Payment currency: 'sol' or 'usdc'", enum: ['sol', 'usdc'] },
            call_id: { type: 'string', description: 'Call id from the negotiation step (phase 2)' },
            tx_signature: { type: 'string', description: 'Solana transaction signature proving payment (phase 2)' },
          },
          required: ['service_id', 'endpoint'],
        },
      },
      {
        name: 'FLUXROUTE_budget',
        description: 'Check current spending budget and remaining balance',
        inputSchema: { type: 'object' as const, properties: {} },
      },
    ],
  };
}
