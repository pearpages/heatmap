import { isInRange } from '@/shared/formatTooltip';
import {
  monthNames as defaultMonthNames,
  parseDateString,
  type Period,
  type Week,
} from '@/shared/models';

function getMonthsForHeader({
  weeks,
  period,
  monthNames = defaultMonthNames,
}: {
  weeks: Week[];
  period: Period;
  // Locale-derived; falls back to the exported English constants.
  monthNames?: readonly string[];
}): {
  name: string;
  span: number;
  start: number;
}[] {
  const months: { name: string; span: number; start: number }[] = [];
  let currentMonth = -1;
  let currentSpan = 0;

  weeks.forEach((week, weekIndex) => {
    if (week.length > 0) {
      // Find the first day in the week that falls within our actual data range
      let monthToUse = -1;

      for (const day of week) {
        if (isInRange(day.date, period)) {
          monthToUse = parseDateString(day.date).getMonth();
          break;
        }
      }

      // If no day in the week is in our actual range, use the middle of the week
      // (index 3 - which weekday that is depends on weekStartsOn)
      if (monthToUse === -1) {
        const middleDay = week[3];
        monthToUse = parseDateString(middleDay.date).getMonth();
      }

      if (monthToUse !== currentMonth) {
        if (currentMonth !== -1) {
          months.push({ name: monthNames[currentMonth], span: currentSpan, start: weekIndex - currentSpan });
        }
        currentMonth = monthToUse;
        currentSpan = 1;
      } else {
        currentSpan++;
      }
    }
  });

  if (currentMonth !== -1) {
    months.push({ name: monthNames[currentMonth], span: currentSpan, start: weeks.length - currentSpan });
  }

  return months;
}

export { getMonthsForHeader };
