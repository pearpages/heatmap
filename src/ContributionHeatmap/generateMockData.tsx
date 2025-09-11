import { createDateString, type ContributionData, type Period } from './models';
import { createRealisticMockedCount } from './createRealisticMockedCount';
import { getLevel } from './getLevel';

const getRandomCount = () => Math.floor(Math.random() * 15);

function getRange(period: Period | 'lastYear') {
  if (period !== 'lastYear') {
    return period;
  }
  const end = new Date(); // Today
  const start = new Date();
  start.setFullYear(start.getFullYear() - 1); // One year ago
  return { start, end };
}

function generateMockData({
  period,
  isRealistic,
}: {
  period: Period | 'lastYear';
  isRealistic: boolean;
}): ContributionData[] {
  const data: ContributionData[] = [];
  const { start, end } = getRange(period);

  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    const count = isRealistic
      ? createRealisticMockedCount(date)
      : getRandomCount();
    data.push({
      date: createDateString(date),
      count,
      level: getLevel(count),
    });
  }

  return data;
}

export { generateMockData };
