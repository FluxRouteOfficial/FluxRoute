import { PLATFORM_FEE_PERCENT, SOL_DECIMALS, USDC_DECIMALS } from './constants.js';

/**
 * Fee split for a single call payment.
 *
 * The consumer always pays the provider's listed price. The platform fee is
 * deducted from the provider's earnings (the consumer is never charged extra),
 * matching the tokenomics model in the project spec.
 */
export interface FeeSplit {
  /** Total amount paid by the consumer (== listed price). */
  gross: string;
  /** Amount the provider keeps after the platform fee. */
  providerNet: string;
  /** Platform fee retained by FluxRoute. */
  platformFee: string;
}

function decimalsFor(currency: 'sol' | 'usdc'): number {
  return currency === 'usdc' ? USDC_DECIMALS : SOL_DECIMALS;
}

/**
 * Round a number to a fixed number of decimals without floating-point drift,
 * returning a canonical decimal string (no trailing exponent notation).
 */
export function roundAmount(value: number, decimals: number): string {
  if (!Number.isFinite(value)) throw new Error('Amount must be a finite number');
  const factor = 10 ** decimals;
  const rounded = Math.round((value + Number.EPSILON) * factor) / factor;
  return rounded.toFixed(decimals);
}

/**
 * Compute the provider/platform split for a given gross price.
 *
 * @param grossAmount  Listed price as a decimal string (e.g. "0.001").
 * @param currency     'sol' or 'usdc' - controls rounding precision.
 * @param feePercent   Platform fee percentage (defaults to PLATFORM_FEE_PERCENT).
 */
export function computeFeeSplit(
  grossAmount: string,
  currency: 'sol' | 'usdc',
  feePercent: number = PLATFORM_FEE_PERCENT
): FeeSplit {
  const gross = Number(grossAmount);
  if (!Number.isFinite(gross) || gross < 0) {
    throw new Error(`Invalid gross amount: ${grossAmount}`);
  }
  if (feePercent < 0 || feePercent > 100) {
    throw new Error(`Invalid fee percent: ${feePercent}`);
  }

  const decimals = decimalsFor(currency);
  const platformFeeRaw = gross * (feePercent / 100);
  const platformFee = roundAmount(platformFeeRaw, decimals);
  const providerNet = roundAmount(gross - Number(platformFee), decimals);

  return {
    gross: roundAmount(gross, decimals),
    providerNet,
    platformFee,
  };
}
