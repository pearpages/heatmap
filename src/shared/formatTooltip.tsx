import { createDateString, type ContributionData, type Period } from '@/shared/models';

// Compares whole days, in the same YYYY-MM-DD form the contributions carry.
// Period boundaries are Date objects that keep a time of day, so comparing them
// directly against a date-only value put the first and last day of the period
// out of range. ISO date strings also sort correctly, so > and < still work.
function isInRange(date: string, { start, end }: Period): boolean {
  return date >= createDateString(start) && date <= createDateString(end);
}

const formatTooltip = (
  contribution: ContributionData,
  { start, end }: Period,
): string => {
  const date = new Date(contribution.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (!isInRange(contribution.date, { start, end }) || contribution.count === 0) {
    return `${formattedDate}: No contributions`;
  }

  return `${formattedDate}: ${contribution.count} contribution${contribution.count !== 1 ? 's' : ''}`;
};

export { formatTooltip, isInRange };
