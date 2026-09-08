import { describe, expect, it } from 'vitest';
import { getDayNames, getMonthNames } from './intl';

describe('getDayNames', () => {
  it('reproduces the exported English constants for the default locale', () => {
    // Existing consumers see no change: en-US derives exactly the dayNames array.
    expect(getDayNames('en-US')).toEqual([
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Thu',
      'Fri',
      'Sat',
    ]);
  });

  it('derives names from the locale', () => {
    expect(getDayNames('ca')).toEqual([
      'dg.',
      'dl.',
      'dt.',
      'dc.',
      'dj.',
      'dv.',
      'ds.',
    ]);
  });

  it('rotates to the given first day of the week', () => {
    const monday = getDayNames('en-US', 1);

    expect(monday[0]).toBe('Mon');
    expect(monday[6]).toBe('Sun');
  });

  it('wraps around for a mid-week start', () => {
    expect(getDayNames('en-US', 3)).toEqual([
      'Wed',
      'Thu',
      'Fri',
      'Sat',
      'Sun',
      'Mon',
      'Tue',
    ]);
  });
});

describe('getMonthNames', () => {
  it('reproduces the exported English constants for the default locale', () => {
    expect(getMonthNames('en-US')).toEqual([
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]);
  });

  it('derives names from the locale', () => {
    const months = getMonthNames('ca');

    expect(months[0]).toBe('gen.');
    expect(months[2]).toBe('març');
  });
});
