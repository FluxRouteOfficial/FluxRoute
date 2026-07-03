import { apiRequest } from '../api-client.js';

/**
 * FluxRoute MCP tool dispatcher.
 *
 * `FLUXROUTE_call` implements the two-phase x402 flow:
 *   1. Without `tx_signature`: negotiate a price and return the on-chain
 *      payment instructions (recipient, amount, memo = callId). The agent's
 *      wallet layer pays on Solana using that memo.
 *   2. With `tx_signature` (+ the `call_id` from phase 1): execute the call -
 *      FluxRoute verifies the payment on-chain, proxies to the provider, and
 *      returns the response.
 */
export async function handleCallTool(request: { params: { name: string; arguments?: Record<string, unknown> } }) {
  const { name, arguments: args = {} } = request.params;

  switch (name) {
    case 'FLUXROUTE_list_services': {
      const params = new URLSearchParams();
      if (args.category) params.set('category', String(args.category));
      if (args.search) params.set('search', String(args.search));
      const res = await apiRequest(`/api/services?${params}`);
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    }

    case 'FLUXROUTE_call': {
      const {
        service_id,
        endpoint,
        params,
        currency = 'sol',
        call_id,
        tx_signature,
      } = args as {
        service_id: string;
        endpoint: string;
        params?: Record<string, unknown>;
        currency?: 'sol' | 'usdc';
        call_id?: string;
        tx_signature?: string;
      };

      // Phase 2 - payment already made on-chain; execute the call.
      if (tx_signature && call_id) {
        const execRes = await apiRequest('/api/payments/execute', {
          method: 'POST',
          body: JSON.stringify({ callId: call_id, txSignature: tx_signature, endpoint, params }),
        });
        if (!execRes.success) {
          return { content: [{ type: 'text', text: `Call failed: ${execRes.error}` }], isError: true };
        }
        return { content: [{ type: 'text', text: JSON.stringify(execRes.data, null, 2) }] };
      }

      // Phase 1 - negotiate payment requirements (HTTP 402).
      const negotiate = await apiRequest('/api/payments/negotiate', {
        method: 'POST',
        body: JSON.stringify({ serviceId: service_id, endpoint, currency }),
      });
      if (!negotiate.success) {
        return { content: [{ type: 'text', text: `Negotiation failed: ${negotiate.error}` }], isError: true };
      }
      return {
        content: [
          {
            type: 'text',
            text:
              'Payment required. Pay the amount below on Solana using `memo` as the transaction memo, ' +
              'then call `FLUXROUTE_call` again with `call_id` and `tx_signature`.\n\n' +
              JSON.stringify(negotiate.data, null, 2),
          },
        ],
      };
    }

    case 'FLUXROUTE_budget': {
      const res = await apiRequest('/api/wallet/budget');
      return { content: [{ type: 'text', text: JSON.stringify(res.data, null, 2) }] };
    }

    default:
      return { content: [{ type: 'text', text: `Unknown tool: ${name}` }], isError: true };
  }
}
