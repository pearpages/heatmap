import type { ContributionData } from './models';

const isSummerMonth = (month: number) => {
  return month >= 5 && month <= 7;
};

export function createRealisticMockedCount(
  date: Date,
): ContributionData['count'] {
  // Create realistic patterns
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const month = date.getMonth();

  let baseCount = isWeekend ? 2 : 8;

  // Lower activity in summer months (June, July, August)
  if (isSummerMonth(month)) {
    baseCount = Math.max(0, baseCount - 3);
  }

  // Add some randomness
  const randomFactor = Math.random();
  let count = 0;

  if (randomFactor > 0.3) {
    count = Math.floor(Math.random() * baseCount);
  }

  // Occasional high activity days
  if (randomFactor > 0.95) {
    count += Math.floor(Math.random() * 10);
  }

  return count;
}
