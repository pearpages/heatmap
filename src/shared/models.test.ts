import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createDateString,
  getLastMonthPeriod,
  getLastYearPeriod,
} from './models';

afterEach(() => {
  vi.useRealTimers();
});

const freeze = (iso: string) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(iso));
};

describe('createDateString', () => {
  it('formats a date as YYYY-MM-DD', () => {
    expect(createDateString(new Date('2024-06-12T00:00:00Z'))).toBe('2024-06-12');
  });
});

describe('getLastYearPeriod', () => {
  it('spans one year back, starting the day after', () => {
    freeze('2024-06-12T09:30:00Z');
    const { start, end } = getLastYearPeriod();

    expect(createDateString(start)).toBe('2023-06-13');
    expect(createDateString(end)).toBe('2024-06-12');
  });
});

describe('getLastMonthPeriod', () => {
  it('spans one month back, starting the day after', () => {
    freeze('2024-06-12T09:30:00Z');
    const { start, end } = getLastMonthPeriod();

    expect(createDateString(start)).toBe('2024-05-13');
    expect(createDateString(end)).toBe('2024-06-12');
  });

  it('normalises the end to midnight', () => {
    freeze('2024-06-12T23:59:00Z');
    const { end } = getLastMonthPeriod();

    expect(end.getHours()).toBe(0);
    expect(end.getMinutes()).toBe(0);
  });

  // Date rolls overflowing days forward: from Mar 31 the start is computed as
  // Feb 32, which in a leap year normalises to Mar 3 -- so the "last month" window
  // is short and does not reach back into February at all.
  it('rolls forward when the previous month is shorter', () => {
    freeze('2024-03-31T09:00:00Z');
    const { start, end } = getLastMonthPeriod();

    expect(createDateString(start)).toBe('2024-03-03');
    expect(createDateString(end)).toBe('2024-03-31');
  });
});
