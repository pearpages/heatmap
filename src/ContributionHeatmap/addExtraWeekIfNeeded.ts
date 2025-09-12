import { createDateString, type ContributionData, type Week } from './models';

const createEmptyContribution = (date: string): ContributionData => ({
  date,
  count: 0,
  level: 0,
});

const createEmptyWeek = (startDate: Date): Week => {
  const week: ContributionData[] = [];
  const currentDate = new Date(startDate);
  
  for (let day = 0; day < 7; day++) {
    const dateString = createDateString(currentDate);
    week.push(createEmptyContribution(dateString));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return week as Week;
};

/**
 * Adds an extra empty week if the last month only has one week
 * to match the header span and improve visual balance
 */
export function addExtraWeekIfNeeded(weeks: Week[]): Week[] {
  if (weeks.length === 0) return weeks;

  // Simple approach: always add an extra week at the end for better balance
  // This ensures the table has an extra column to match the header span
  const lastWeek = weeks[weeks.length - 1];
  const lastDate = new Date(lastWeek[6].date); // Saturday of last week
  const nextWeekStart = new Date(lastDate);
  nextWeekStart.setDate(lastDate.getDate() + 1); // Next Sunday
  
  const extraWeek = createEmptyWeek(nextWeekStart);
  return [...weeks, extraWeek];
}