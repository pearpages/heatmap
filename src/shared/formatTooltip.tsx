import {
  createDateString,
  defaultLabels,
  DEFAULT_LOCALE,
  type ContributionData,
  type HeatmapLabels,
  type Period,
} from '@/shared/models';

// Compares whole days, in the same YYYY-MM-DD form the contributions carry.
// Period boundaries are Date objects that keep a time of day, so comparing them
// directly against a date-only value put the first and last day of the period
// out of range. ISO date strings also sort correctly, so > and < still work.
function isInRange(date: string, { start, end }: Period): boolean {
  return date >= createDateString(start) && date <= createDateString(end);
}

interface FormatTooltipOptions {
  locale?: string;
  labels?: HeatmapLabels;
}

const formatTooltip = (
  contribution: ContributionData,
  { start, end }: Period,
  { locale = DEFAULT_LOCALE, labels }: FormatTooltipOptions = {},
): string => {
  const text = { ...defaultLabels, ...labels };
  const date = new Date(contribution.date);
  // UTC: contribution.date is a date-only string, which parses as UTC midnight.
  // Formatting it in a local zone would name the previous day in negative offsets.
  const formattedDate = date.toLocaleDateString(locale, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });

  if (!isInRange(contribution.date, { start, end }) || contribution.count === 0) {
    return `${formattedDate}: ${text.noContributions}`;
  }

  return `${formattedDate}: ${text.contributions(contribution.count)}`;
};

export { formatTooltip, isInRange };
export type { FormatTooltipOptions };
