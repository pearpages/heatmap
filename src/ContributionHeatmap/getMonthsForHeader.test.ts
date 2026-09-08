import { describe, expect, it } from 'vitest';
import { getMonthsForHeader } from './getMonthsForHeader';
import { groupByWeeks } from '@/shared/groupByWeeks';
import { createDateString, type ContributionData, type Period } from '@/shared/models';

const range = (from: string, to: string): ContributionData[] => {
  const out: ContributionData[] = [];
  for (const d = new Date(from); d <= new Date(to); d.setDate(d.getDate() + 1)) {
    out.push({ date: createDateString(d), count: 0, level: 0 });
  }
  return out;
};

const build = (from: string, to: string) => {
  const period: Period = { start: new Date(from), end: new Date(to) };
  const weeks = groupByWeeks(range(from, to));
  return { period, weeks, months: getMonthsForHeader({ weeks, period }) };
};

describe('getMonthsForHeader', () => {
  it('emits one entry per month in order', () => {
    const { months } = build('2024-01-01', '2024-03-31');

    expect(months.map((m) => m.name)).toEqual(['Jan', 'Feb', 'Mar']);
  });

  it('spans cover every week exactly once', () => {
    const { months, weeks } = build('2024-01-01', '2024-03-31');
    const total = months.reduce((sum, m) => sum + m.span, 0);

    expect(total).toBe(weeks.length);
  });

  it('start indices follow on from the previous span', () => {
    const { months } = build('2024-01-01', '2024-03-31');

    months.reduce((expectedStart, month) => {
      expect(month.start).toBe(expectedStart);
      return expectedStart + month.span;
    }, 0);
  });

  it('assigns a week to the month of its first in-range day', () => {
    // Jan 28 - Feb 3 is one week; it starts in January, so it counts as January
    // and February never gets a header of its own.
    const { months } = build('2024-01-01', '2024-02-03');

    expect(months).toEqual([{ name: 'Jan', span: 5, start: 0 }]);
  });

  it('widens a trailing single-week month to two for visual balance', () => {
    // The final week (Feb 4-10) is the only February week, so its span is bumped.
    const { months, weeks } = build('2024-01-01', '2024-02-05');
    const last = months[months.length - 1];

    expect(last.name).toBe('Feb');
    expect(last.span).toBe(2);
    // The bump deliberately overshoots the real week count.
    expect(months.reduce((s, m) => s + m.span, 0)).toBe(weeks.length + 1);
  });

  it('returns nothing for an empty week list', () => {
    const period: Period = { start: new Date('2024-01-01'), end: new Date('2024-01-31') };

    expect(getMonthsForHeader({ weeks: [], period })).toEqual([]);
  });
});
