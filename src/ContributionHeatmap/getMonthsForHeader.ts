import { monthNames, type Period, type Week } from './models';

function getMonthsForHeader({
  weeks,
  period,
}: {
  weeks: Week[];
  period: Period;
}): {
  name: string;
  span: number;
}[] {
  const months: { name: string; span: number }[] = [];
  const { start, end } = period;
  let currentMonth = -1;
  let currentSpan = 0;

  weeks.forEach((week) => {
    if (week.length > 0) {
      // Find the first day in the week that falls within our actual data range
      let monthToUse = -1;
      const actualStartDate = new Date(start);
      const actualEndDate = new Date(end);

      for (const day of week) {
        const dayDate = new Date(day.date);
        if (dayDate >= actualStartDate && dayDate <= actualEndDate) {
          monthToUse = dayDate.getMonth();
          break;
        }
      }

      // If no day in the week is in our actual range, use the middle day (Wednesday)
      if (monthToUse === -1) {
        const middleDay = week[3]; // Wednesday (index 3)
        monthToUse = new Date(middleDay.date).getMonth();
      }

      if (monthToUse !== currentMonth) {
        if (currentMonth !== -1) {
          months.push({ name: monthNames[currentMonth], span: currentSpan });
        }
        currentMonth = monthToUse;
        currentSpan = 1;
      } else {
        currentSpan++;
      }
    }
  });

  if (currentMonth !== -1) {
    months.push({ name: monthNames[currentMonth], span: currentSpan });
  }

  return months;
}

export { getMonthsForHeader };
