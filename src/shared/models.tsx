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

function getLastYearPeriod(): Period {
  const start = new Date(
    new Date().setFullYear(
      new Date().getFullYear() - 1,
      new Date().getMonth(),
      new Date().getDate() + 1,
    ),
  );
  const end = new Date();
  return { start, end };
}

const createDateString = (date: Date): string =>
  date.toISOString().split('T')[0];

export type { ContributionData, Week, Period, Theme };
export { monthNames, dayNames, createDateString, getLastYearPeriod };
