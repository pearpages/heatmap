import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  createDateString,
  getLastMonthPeriod,
  getLastYearPeriod,
  parseDateString,
} from './models';

afterEach(() => {
  vi.useRealTimers();
});

const freeze = (iso: string) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(iso));
};

describe('createDateString', () => {
  it('formats a local date as YYYY-MM-DD', () => {
    expect(createDateString(new Date(2024, 5, 12))).toBe('2024-06-12');
  });

  it('zero-pads month and day', () => {
    expect(createDateString(new Date(2024, 0, 5))).toBe('2024-01-05');
  });

  it('ignores the time of day', () => {
    expect(createDateString(new Date(2024, 5, 12, 23, 59))).toBe('2024-06-12');
  });
});

describe('parseDateString', () => {
  it('returns local midnight of that day', () => {
    const date = parseDateString('2024-06-12');

    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(5);
    expect(date.getDate()).toBe(12);
    expect(date.getHours()).toBe(0);
  });

  it('round-trips through createDateString', () => {
    expect(createDateString(parseDateString('2024-02-29'))).toBe('2024-02-29');
  });
});

describe('getLastYearPeriod', () => {
  it('spans one year back, starting the day after', () => {
    freeze('2024-06-12T09:30:00Z');
    const { start, end } = getLastYearPeriod();

    expect(createDateString(start)).toBe('2023-06-13');
    expect(createDateString(end)).toBe('2024-06-12');
  });

  it('clamps a leap day to the end of February the year before', () => {
    freeze('2024-02-29T09:00:00Z');
    const { start } = getLastYearPeriod();

    expect(createDateString(start)).toBe('2023-03-01');
  });

  it('normalises the end to midnight', () => {
    freeze('2024-06-12T23:59:00Z');
    const { end } = getLastYearPeriod();

    expect(end.getHours()).toBe(0);
    expect(end.getMinutes()).toBe(0);
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

  // Date rolls overflowing days forward: from Mar 31, "Feb 31" would normalise to
  // Mar 2 or 3 and the window would be under a month long. Clamping to the last day of
  // February makes the window Mar 1 - Mar 31, exactly one month.
  it('clamps to the end of a shorter previous month', () => {
    freeze('2024-03-31T09:00:00Z');
    const { start, end } = getLastMonthPeriod();

    expect(createDateString(start)).toBe('2024-03-01');
    expect(createDateString(end)).toBe('2024-03-31');
  });

  it('clamps from the 30th as well', () => {
    freeze('2024-03-30T09:00:00Z');
    const { start } = getLastMonthPeriod();

    expect(createDateString(start)).toBe('2024-03-01');
  });

  it('clamps to Feb 28 in a non-leap year', () => {
    freeze('2023-03-31T09:00:00Z');
    const { start } = getLastMonthPeriod();

    expect(createDateString(start)).toBe('2023-03-01');
  });
});
