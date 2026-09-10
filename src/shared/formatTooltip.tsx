import {
  createDateString,
  parseDateString,
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
  // parseDateString gives local midnight, so formatting in the local zone names the
  // right day. `new Date(string)` would parse as UTC midnight, which is the previous
  // day anywhere west of Greenwich.
  const formattedDate = parseDateString(contribution.date).toLocaleDateString(locale, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  if (!isInRange(contribution.date, { start, end }) || contribution.count === 0) {
    return `${formattedDate}: ${text.noContributions}`;
  }

  return `${formattedDate}: ${text.contributions(contribution.count)}`;
};

export { formatTooltip, isInRange };
export type { FormatTooltipOptions };
