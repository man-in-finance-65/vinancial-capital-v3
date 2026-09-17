import { describe, expect, it } from 'vitest';
import { calculateAfford, calculateLease, calculateLoan, roundMoney } from './calculator';

describe('calculateLease', () => {
  it('matches the spec example to the cent', () => {
    const result = calculateLease({
      price: 100000,
      down: 15000,
      aprPercent: 7.5,
      termMonths: 48,
      advancePayments: 2,
      residual: 100000 * 0.2,
    });
    expect(roundMoney(result.payment)).toBeCloseTo(1671.43, 2);
  });

  it('ends the schedule with a buyout equal to the residual', () => {
    const residual = 100000 * 0.2;
    const result = calculateLease({
      price: 100000,
      down: 15000,
      aprPercent: 7.5,
      termMonths: 48,
      advancePayments: 2,
      residual,
    });
    const buyoutRow = result.schedule[result.schedule.length - 1];
    const beforeBuyout = result.schedule[result.schedule.length - 2];
    expect(buyoutRow.type).toBe('BUYOUT');
    expect(Math.abs(beforeBuyout.balance - residual)).toBeLessThan(0.01);
    expect(buyoutRow.balance).toBe(0);
  });

  it('does not produce NaN or Infinity when APR is 0', () => {
    const result = calculateLease({ price: 50000, down: 5000, aprPercent: 0, termMonths: 36, advancePayments: 0, residual: 5000 });
    expect(Number.isFinite(result.payment)).toBe(true);
    expect(Number.isFinite(result.totalInterest)).toBe(true);
    for (const row of result.schedule) {
      expect(Number.isFinite(row.balance)).toBe(true);
    }
  });
});

describe('calculateLoan', () => {
  it('matches the spec example to the cent', () => {
    const result = calculateLoan({ price: 25000, down: 0, aprPercent: 5.5, termMonths: 60 });
    expect(roundMoney(result.payment)).toBeCloseTo(477.53, 2);
  });

  it('does not produce NaN or Infinity when APR is 0', () => {
    const result = calculateLoan({ price: 25000, down: 0, aprPercent: 0, termMonths: 60 });
    expect(Number.isFinite(result.payment)).toBe(true);
    expect(result.payment).toBeCloseTo(25000 / 60, 5);
  });
});

describe('calculateAfford', () => {
  it('matches the spec example to the cent', () => {
    const result = calculateAfford({ payment: 1500, down: 0, aprPercent: 7.5, termMonths: 60 });
    expect(roundMoney(result.maxFinanced)).toBeCloseTo(74857.96, 2);
  });

  it('does not produce NaN or Infinity when APR is 0', () => {
    const result = calculateAfford({ payment: 1500, down: 0, aprPercent: 0, termMonths: 60 });
    expect(Number.isFinite(result.maxFinanced)).toBe(true);
    expect(result.maxFinanced).toBe(1500 * 60);
  });
});
