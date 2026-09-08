import { describe, expect, it } from 'vitest';
import { groupByWeeks } from './groupByWeeks';
import type { ContributionData } from './models';

const day = (date: string, count = 0): ContributionData => ({
  date,
  count,
  level: count === 0 ? 0 : 1,
});

describe('groupByWeeks', () => {
  it('returns weeks of exactly seven days', () => {
    // 2024-01-03 is a Wednesday, 2024-01-18 a Thursday.
    const weeks = groupByWeeks([day('2024-01-03', 1), day('2024-01-18', 4)]);

    expect(weeks.length).toBeGreaterThan(0);
    weeks.forEach((week) => expect(week).toHaveLength(7));
  });

  it('pads out to the enclosing Sunday and Saturday', () => {
    const weeks = groupByWeeks([day('2024-01-03', 1), day('2024-01-18', 4)]);

    const first = weeks[0][0];
    const last = weeks[weeks.length - 1][6];

    expect(first.date).toBe('2023-12-31'); // Sunday before Jan 3
    expect(last.date).toBe('2024-01-20'); // Saturday after Jan 18
  });

  it('fills days missing from the input at level 0', () => {
    const weeks = groupByWeeks([day('2024-01-03', 1), day('2024-01-18', 4)]);
    const flat = weeks.flat();

    const untouched = flat.find((d) => d.date === '2024-01-04');
    expect(untouched).toEqual({ date: '2024-01-04', count: 0, level: 0 });
  });

  it('places contributions on their correct weekday', () => {
    const weeks = groupByWeeks([day('2024-01-03', 7)]);
    const flat = weeks.flat();
    const wednesday = flat.find((d) => d.date === '2024-01-03');

    expect(wednesday?.count).toBe(7);
    // Sunday-first, so Wednesday sits at index 3.
    expect(flat.indexOf(wednesday!) % 7).toBe(3);
  });

  it('emits a single week when the input is one full Sunday-to-Saturday span', () => {
    const weeks = groupByWeeks([day('2024-01-07', 1), day('2024-01-13', 2)]);

    expect(weeks).toHaveLength(1);
    expect(weeks[0][0].date).toBe('2024-01-07');
    expect(weeks[0][6].date).toBe('2024-01-13');
  });
});
