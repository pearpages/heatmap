type Theme = '' | 'ocean' | 'sunset' | 'purple';

interface ContributionData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

type Week = [
  ContributionData,
  ContributionData,
  ContributionData,
  ContributionData,
  ContributionData,
  ContributionData,
  ContributionData,
];

type Period = { start: Date; end: Date };

// The strings Intl cannot derive from a locale. Day and month names are not here:
// those come from the locale itself, via src/shared/intl.ts.
interface HeatmapLabels {
  less?: string;
  more?: string;
  level?: (level: number) => string;
  noContributions?: string;
  contributions?: (count: number) => string;
}

const defaultLabels: Required<HeatmapLabels> = {
  less: 'Less',
  more: 'More',
  level: (level) => `Level ${level}`,
  noContributions: 'No contributions',
  contributions: (count) => `${count} contribution${count !== 1 ? 's' : ''}`,
};

const DEFAULT_LOCALE = 'en-US';

const monthNames = [
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
] as const;
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

// Local midnight, `months` whole months away, with the day-of-month clamped to the
// target month's length: Date would otherwise roll Feb 31 forward into March.
function shiftMonthsClamped(date: Date, months: number): Date {
  const year = date.getFullYear();
  const month = date.getMonth() + months;
  const daysInTarget = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(date.getDate(), daysInTarget));
}

const startOfToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

// Both helpers span back to the day after the same date one unit ago, so today is
// the last day and the window is exactly one year / one month long.
function getLastYearPeriod(): Period {
  const end = startOfToday();
  const start = shiftMonthsClamped(end, -12);
  start.setDate(start.getDate() + 1);
  return { start, end };
}

function getLastMonthPeriod(): Period {
  const end = startOfToday();
  const start = shiftMonthsClamped(end, -1);
  start.setDate(start.getDate() + 1);
  return { start, end };
}

// The library reads every Date as a calendar day in the local time zone, and these two
// are the only conversions between Date and the YYYY-MM-DD strings the data carries.
// Neither goes through toISOString() or `new Date(string)`: both of those are UTC, and
// mixing them with local Dates shifts the first and last day of a period by one
// anywhere outside Greenwich.
const pad = (n: number): string => String(n).padStart(2, '0');

const createDateString = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const parseDateString = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export type { ContributionData, Week, Period, Theme, HeatmapLabels };
export {
  monthNames,
  dayNames,
  defaultLabels,
  DEFAULT_LOCALE,
  createDateString,
  parseDateString,
  getLastYearPeriod,
  getLastMonthPeriod,
};
