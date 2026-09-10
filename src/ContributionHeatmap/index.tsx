import './index.scss';
import type {
  ContributionData,
  HeatmapLabels,
  Period,
  Week as WeekType,
} from '../shared/models';
import { getMonthsForHeader } from './getMonthsForHeader';
import { formatTooltip, isInRange } from '@/shared/formatTooltip';
import { DEFAULT_LOCALE, parseDateString } from '@/shared/models';
import { getDayNames, getMonthNames } from '@/shared/intl';
import { Legend } from '@/shared/Legend';


interface DayCellProps {
  contribution: ContributionData;
  period: Period;
  locale: string;
  labels?: HeatmapLabels;
  // Position in the grid, used to stagger the load animation.
  delayIndex: number;
}

// groupByWeeks pads every week out to Sun-Sat, so the first and last week carry days
// that fall outside the period. They keep their slot - the columns depend on seven
// cells per row - but render no square and stay out of the a11y tree.
function DayCell({ contribution, period, locale, labels, delayIndex }: DayCellProps) {
  const inRange = isInRange(contribution.date, period);
  const tooltip = formatTooltip(contribution, period, { locale, labels });

  return (
    <td
      className={[
        'contribution-heatmap__day',
        `contribution-heatmap__day--level-${contribution.level}`,
        inRange ? '' : 'contribution-heatmap__day--outside',
      ]
        .filter(Boolean)
        .join(' ')}
      title={inRange ? tooltip : undefined}
      aria-label={inRange ? tooltip : undefined}
      role={inRange ? 'button' : undefined}
      tabIndex={inRange ? 0 : undefined}
      data-count={contribution.count}
      data-date={contribution.date}
      style={{ '--animation-delay': `${delayIndex * 0.005}s` } as React.CSSProperties}
    ></td>
  );
}

interface ContributionHeatmapProps {
  data: { contribution: ContributionData[]; period: Period; weeks: WeekType[] };
  className?: string;
  isReverse?: boolean;
  // Drives day names, month names and the tooltip date through Intl.
  locale?: string;
  // The handful of strings Intl cannot derive.
  labels?: HeatmapLabels;
}

function ContributionHeatmap({
  data: { period, weeks },
  className = '',
  isReverse = false,
  locale = DEFAULT_LOCALE,
  labels,
}: ContributionHeatmapProps) {
  // Read the week start off the data rather than taking a prop: groupByWeeks already
  // decided it, and a prop could disagree with the weeks it was handed.
  const weekStartsOn = weeks.length ? parseDateString(weeks[0][0].date).getDay() : 0;
  const dayNames = getDayNames(locale, weekStartsOn);
  const months = getMonthsForHeader({ weeks, period, monthNames: getMonthNames(locale) });

  return (
    <div
      className={`contribution-heatmap${isReverse ? ' contribution-heatmap--reverse' : ''} ${className}`}
    >
      {/* Only the grid scrolls; the padding and the legend stay put. */}
      <div className="contribution-heatmap__scroll">
        <table className="contribution-heatmap__table">
          {isReverse ? (
            <>
              <thead>
                <tr>
                  <th className="contribution-heatmap__month-header"></th>
                  {dayNames.map((dayName, dayIndex) => (
                    <th key={dayIndex} className="contribution-heatmap__day-header">
                      {dayName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {weeks.map((week, weekIndex) => {
                  // Find month info for this week
                  const month = months.find(m => weekIndex === m.start);
                  const showMonthLabel = !!month;
                  return (
                    <tr key={weekIndex}>
                      {showMonthLabel && (
                        <td
                          className="contribution-heatmap__month-label"
                          rowSpan={month.span}
                        >
                          {month.name}
                        </td>
                      )}
                      {week.map((contribution, dayIndex) => (
                        <DayCell
                          key={dayIndex}
                          contribution={contribution}
                          period={period}
                          locale={locale}
                          labels={labels}
                          delayIndex={weekIndex * 7 + dayIndex}
                        />
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </>
          ) : (
            <>
              <thead>
                <tr>
                  <th className="contribution-heatmap__day-header"></th>
                  {months.map((month, index) => (
                    <th
                      key={index}
                      className={`contribution-heatmap__month-header${
                        index === months.length - 1
                          ? ' contribution-heatmap__month-header--last'
                          : ''
                      }`}
                      colSpan={month.span}
                    >
                      <span className="contribution-heatmap__month-header-text">
                        {month.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dayNames.map((dayName, dayIndex) => (
                  <tr key={dayIndex}>
                    <td className="contribution-heatmap__day-label">
                      {dayName}
                    </td>
                    {weeks.map((week, weekIndex) => {
                      const contribution = week[dayIndex];
                      return (
                        <DayCell
                          key={weekIndex}
                          contribution={contribution}
                          period={period}
                          locale={locale}
                          labels={labels}
                          delayIndex={weekIndex * 7 + dayIndex}
                        />
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
      <Legend labels={labels} />
    </div>
  );
}

export { ContributionHeatmap };
