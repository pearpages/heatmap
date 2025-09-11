import type { ContributionData, Period } from './models';

function isInRange(date: Date, { start, end }: Period): boolean {
  const actualStartDate = new Date(start);
  const actualEndDate = new Date(end);
  const contributionDate = new Date(date);

  return contributionDate > actualStartDate && contributionDate < actualEndDate;
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

  if (
    !isInRange(new Date(contribution.date), { start, end }) ||
    contribution.count === 0
  ) {
    return `${formattedDate}: No contributions`;
  }

  return `${formattedDate}: ${contribution.count} contribution${contribution.count !== 1 ? 's' : ''}`;
};

export { formatTooltip };
