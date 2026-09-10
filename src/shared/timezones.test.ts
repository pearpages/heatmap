import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { groupByWeeks } from './groupByWeeks';
import { formatTooltip, isInRange } from './formatTooltip';
import { createDateString, parseDateString, type Period } from './models';
import { getMonthsForHeader } from '@/ContributionHeatmap/getMonthsForHeader';
import { generateMockData } from '@/mocks';

// vitest.config.ts pins TZ=UTC for determinism, which also hides every offset bug.
// Node re-reads process.env.TZ at runtime, so this file runs the same end-to-end
// scenario in zones on both sides of Greenwich. Before the fix it failed in all
// three non-UTC zones, each in a different way.
const zones = ['UTC', 'Europe/Madrid', 'America/New_York', 'Pacific/Auckland'];

describe.each(zones)('calendar days in %s', (zone) => {
  const originalTZ = process.env.TZ;

  beforeEach(() => {
    process.env.TZ = zone;
  });

  afterEach(() => {
    process.env.TZ = originalTZ;
  });

  // Sun 9 Aug 2026 to Sun 6 Sep 2026, built the way a caller would: local constructors.
  const build = () => {
    const period: Period = { start: new Date(2026, 7, 9), end: new Date(2026, 8, 6) };
    const contribution = generateMockData({ period, isRealistic: false });
    const weeks = groupByWeeks(contribution);
    return { period, contribution, weeks };
  };

  it('stringifies the period boundaries as the days they were built from', () => {
    const { period } = build();

    expect(createDateString(period.start)).toBe('2026-08-09');
    expect(createDateString(period.end)).toBe('2026-09-06');
  });

  it('generates one entry per day of the period', () => {
    const { contribution } = build();

    expect(contribution[0].date).toBe('2026-08-09');
    expect(contribution[contribution.length - 1].date).toBe('2026-09-06');
    expect(contribution).toHaveLength(29);
  });

  it('starts the grid on the Sunday the period starts on, with no extra padding week', () => {
    const { weeks } = build();

    expect(weeks[0][0].date).toBe('2026-08-09');
    expect(weeks).toHaveLength(5);
    weeks.forEach((week) => expect(week).toHaveLength(7));
  });

  it('keeps the week start on Sunday when read back off the data', () => {
    const { weeks } = build();

    expect(parseDateString(weeks[0][0].date).getDay()).toBe(0);
  });

  it('assigns the month headers to the right months', () => {
    const { weeks, period } = build();
    const months = getMonthsForHeader({ weeks, period });

    expect(months.map((m) => m.name)).toEqual(['Aug', 'Sep']);
    expect(months.reduce((sum, m) => sum + m.span, 0)).toBe(weeks.length);
  });

  it('keeps the first and last day in range and the padding out', () => {
    const { period } = build();

    expect(isInRange('2026-08-09', period)).toBe(true);
    expect(isInRange('2026-09-06', period)).toBe(true);
    expect(isInRange('2026-08-08', period)).toBe(false);
    expect(isInRange('2026-09-07', period)).toBe(false);
  });

  it('names the tooltip day correctly', () => {
    const { period } = build();
    const tooltip = formatTooltip({ date: '2026-09-01', count: 3, level: 2 }, period);

    expect(tooltip).toContain('Tue');
    expect(tooltip).toContain('Sep 1');
  });
});
