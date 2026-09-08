import { describe, expect, it } from 'vitest';
import { formatTooltip } from './formatTooltip';
import type { ContributionData, Period } from './models';

const period: Period = {
  start: new Date('2024-01-01'),
  end: new Date('2024-12-31'),
};

const contribution = (date: string, count: number): ContributionData => ({
  date,
  count,
  level: 0,
});

describe('formatTooltip', () => {
  it('uses the singular for a single contribution', () => {
    expect(formatTooltip(contribution('2024-06-12', 1), period)).toBe(
      'Wed, Jun 12, 2024: 1 contribution',
    );
  });

  it('uses the plural for more than one', () => {
    expect(formatTooltip(contribution('2024-06-12', 2), period)).toBe(
      'Wed, Jun 12, 2024: 2 contributions',
    );
  });

  it('reports no contributions for a zero count', () => {
    expect(formatTooltip(contribution('2024-06-12', 0), period)).toBe(
      'Wed, Jun 12, 2024: No contributions',
    );
  });

  it('reports no contributions for a date outside the period', () => {
    expect(formatTooltip(contribution('2025-03-04', 9), period)).toBe(
      'Tue, Mar 4, 2025: No contributions',
    );
  });

  // isInRange uses strict > / < rather than >= / <=, so the period's own start and
  // end days are treated as out of range. Documented here as current behaviour.
  it('treats the period boundary days themselves as out of range', () => {
    expect(formatTooltip(contribution('2024-01-01', 5), period)).toContain(
      'No contributions',
    );
    expect(formatTooltip(contribution('2024-12-31', 5), period)).toContain(
      'No contributions',
    );
  });
});
