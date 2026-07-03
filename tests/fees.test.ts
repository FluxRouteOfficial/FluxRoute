import { describe, it, expect } from 'vitest';
import { computeFeeSplit, roundAmount } from '@fluxroute/shared';

describe('roundAmount', () => {
  it('rounds SOL to 9 decimals', () => {
    expect(roundAmount(0.0010000004, 9)).toBe('0.001000000');
    expect(roundAmount(1, 9)).toBe('1.000000000');
  });

  it('rounds USDC to 6 decimals', () => {
    expect(roundAmount(0.1, 6)).toBe('0.100000');
    expect(roundAmount(2.5, 6)).toBe('2.500000');
  });

  it('throws on non-finite input', () => {
    expect(() => roundAmount(Number.NaN, 9)).toThrow();
    expect(() => roundAmount(Infinity, 6)).toThrow();
  });
});

describe('computeFeeSplit', () => {
  it('takes a 2% platform fee from the provider on SOL', () => {
    const split = computeFeeSplit('0.001', 'sol');
    expect(split.gross).toBe('0.001000000');
    expect(split.platformFee).toBe('0.000020000');
    expect(split.providerNet).toBe('0.000980000');
  });

  it('conserves value: providerNet + platformFee == gross', () => {
    const split = computeFeeSplit('2.50', 'usdc');
    const sum = Number(split.providerNet) + Number(split.platformFee);
    expect(sum).toBeCloseTo(Number(split.gross), 6);
    expect(split.platformFee).toBe('0.050000');
    expect(split.providerNet).toBe('2.450000');
  });

  it('honours a custom fee percent', () => {
    const split = computeFeeSplit('1', 'sol', 10);
    expect(split.platformFee).toBe('0.100000000');
    expect(split.providerNet).toBe('0.900000000');
  });

  it('handles a zero price', () => {
    const split = computeFeeSplit('0', 'sol');
    expect(split.gross).toBe('0.000000000');
    expect(split.platformFee).toBe('0.000000000');
    expect(split.providerNet).toBe('0.000000000');
  });

  it('rejects invalid amounts and fee percents', () => {
    expect(() => computeFeeSplit('-1', 'sol')).toThrow();
    expect(() => computeFeeSplit('abc', 'sol')).toThrow();
    expect(() => computeFeeSplit('1', 'sol', 150)).toThrow();
  });
});
