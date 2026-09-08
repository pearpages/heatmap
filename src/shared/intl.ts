// Day and month names derived from a locale, so the component ships no translations.
//
// timeZone is pinned to UTC throughout: the reference dates below are built with
// Date.UTC, and formatting them in a local zone would shift them across a day boundary
// in negative offsets and hand back the wrong name.

// 7 Jan 2024 is a Sunday, so this week runs Sunday -> Saturday.
const REFERENCE_WEEK_START = Date.UTC(2024, 0, 7);
const DAYS_IN_WEEK = 7;

function getDayNames(locale: string, weekStartsOn: number = 0): string[] {
  const format = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    timeZone: 'UTC',
  });

  return Array.from({ length: DAYS_IN_WEEK }, (_, index) => {
    const dayOfWeek = (weekStartsOn + index) % DAYS_IN_WEEK;
    return format.format(new Date(REFERENCE_WEEK_START + dayOfWeek * 86400000));
  });
}

function getMonthNames(locale: string): string[] {
  const format = new Intl.DateTimeFormat(locale, {
    month: 'short',
    timeZone: 'UTC',
  });

  // The 15th avoids any month-length edge case.
  return Array.from({ length: 12 }, (_, month) =>
    format.format(new Date(Date.UTC(2024, month, 15))),
  );
}

export { getDayNames, getMonthNames };
