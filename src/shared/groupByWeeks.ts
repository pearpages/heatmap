import {
  createDateString,
  parseDateString,
  type ContributionData,
  type Week,
} from '@/shared/models';

const createEmpyContribution = (date: string): ContributionData => ({
  date,
  count: 0,
  level: 0,
});

const createContributionMap = (
  contributions: ContributionData[],
): Map<string, ContributionData> => {
  const contributionMap = new Map<string, ContributionData>();
  contributions.forEach((contribution) => {
    contributionMap.set(contribution.date, contribution);
  });
  return contributionMap;
};

// Days from weekStartsOn back to the given date's weekday, e.g. with a Monday start
// (1) a Sunday (0) is six days into the week, not minus one.
const daysIntoWeek = (date: Date, weekStartsOn: number): number =>
  (date.getDay() - weekStartsOn + 7) % 7;

const getFirstDayOfWeek = (firstDate: Date, weekStartsOn: number): Date => {
  const startOfWeek = new Date(firstDate);
  startOfWeek.setDate(firstDate.getDate() - daysIntoWeek(firstDate, weekStartsOn));
  return startOfWeek;
};

const getLastDayOfWeek = (lastDate: Date, weekStartsOn: number): Date => {
  const endOfWeek = new Date(lastDate);
  endOfWeek.setDate(lastDate.getDate() + (6 - daysIntoWeek(lastDate, weekStartsOn)));
  return endOfWeek;
};

const createWeek = (
  startDate: Date,
  contributionMap: Map<string, ContributionData>,
): Week => {
  const week: ContributionData[] = [];
  const currentDate = new Date(startDate);
  for (let day = 0; day < 7; day++) {
    const dateString = createDateString(currentDate);
    const contribution = contributionMap.get(dateString);

    if (contribution) {
      week.push(contribution);
    } else {
      week.push(createEmpyContribution(dateString));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return week as Week;
};

interface GroupByWeeksOptions {
  // 0 = Sunday (the default, and the US/GitHub convention), 1 = Monday, and so on.
  weekStartsOn?: number;
}

const groupByWeeks = (
  contributions: ContributionData[],
  { weekStartsOn = 0 }: GroupByWeeksOptions = {},
): Week[] => {
  const weeks: Week[] = [];
  const contributionMap = createContributionMap(contributions);

  const firstDay = getFirstDayOfWeek(parseDateString(contributions[0].date), weekStartsOn);
  const lastDate = getLastDayOfWeek(
    parseDateString(contributions[contributions.length - 1].date),
    weekStartsOn,
  );

  const currentDate = new Date(firstDay);
  while (currentDate <= lastDate) {
    weeks.push(createWeek(currentDate, contributionMap));
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weeks;
};

export { groupByWeeks };
export type { GroupByWeeksOptions };
