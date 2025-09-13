import './index.scss';
import type { ContributionData, Period, Week as WeekType } from '../shared/models';
import { getMonthsForHeader } from './getMonthsForHeader';
import { formatTooltip } from '@/shared/formatTooltip';
import { dayNames } from '@/shared/models';
import { Legend } from '@/shared/Legend';
import { addExtraWeekIfNeeded } from './addExtraWeekIfNeeded';

interface ContributionHeatmapProps {
  data: { contribution: ContributionData[]; period: Period; weeks: WeekType[] };
  className?: string;
}

function ContributionHeatmap({
  data: { period, weeks },
  className = '',
}: ContributionHeatmapProps) {
  // Add extra week if needed to match header span
  const adjustedWeeks = addExtraWeekIfNeeded(weeks);
  const months = getMonthsForHeader({ weeks: adjustedWeeks, period });

  return (
    <div className={`contribution-heatmap ${className}`}>
      <table className="contribution-heatmap__table">
        <thead>
          <tr>
            <th className="contribution-heatmap__day-header"></th>
            {months.map((month, index) => (
              <th
                key={index}
                className="contribution-heatmap__month-header"
                colSpan={month.span}
              >
                {month.name}
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
              {adjustedWeeks.map((week, weekIndex) => {
                const contribution = week[dayIndex];
                return (
                  <td
                    key={weekIndex}
                    className={`contribution-heatmap__day contribution-heatmap__day--level-${contribution.level}`}
                    title={formatTooltip(contribution, period)}
                    aria-label={formatTooltip(contribution, period)}
                    role="button"
                    tabIndex={0}
                    data-count={contribution.count}
                    data-date={contribution.date}
                    style={{ 
                      '--animation-delay': `${(weekIndex * 7 + dayIndex) * 0.005}s` 
                    } as React.CSSProperties}
                  ></td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <Legend />
    </div>
  );
}

export { ContributionHeatmap };
