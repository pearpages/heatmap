import { createDateString, type ContributionData, type Week } from './models';

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

const getFirstSunday: (firstDate: Date) => Date = (firstDate) => {
  const startOfWeek = new Date(firstDate);
  startOfWeek.setDate(firstDate.getDate() - firstDate.getDay());
  return startOfWeek;
};

const getLastSaturday: (lastDate: Date) => Date = (lastDate) => {
  const endOfWeek = new Date(lastDate);
  endOfWeek.setDate(lastDate.getDate() + (6 - lastDate.getDay()));
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

const groupByWeeks: (contributions: ContributionData[]) => Week[] = (
  contributions,
) => {
  const weeks: Week[] = [];
  const contributionMap = createContributionMap(contributions);

  const firstDay = getFirstSunday(new Date(contributions[0].date));
  const lastDate = getLastSaturday(
    new Date(contributions[contributions.length - 1].date),
  );

  const currentDate = new Date(firstDay);
  while (currentDate <= lastDate) {
    weeks.push(createWeek(currentDate, contributionMap));
    currentDate.setDate(currentDate.getDate() + 7);
  }

  return weeks;
};

export { groupByWeeks };
