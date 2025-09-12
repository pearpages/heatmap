import './index.scss';
import type { ContributionData, Period, Week as WeekType } from './models';
import { getMonthsForHeader } from './getMonthsForHeader';
import { Legend } from './Legend';
import { Header } from './Header';
import { formatTooltip } from './formatTooltip';
import { dayNames } from './models';
import { addExtraWeekIfNeeded } from './addExtraWeekIfNeeded';

interface ContributionHeatmapProps {
  data: { contribution: ContributionData[]; period: Period; weeks: WeekType[] };
  className?: string;
}

function ContributionHeatmap({
  data: { contribution, period, weeks },
  className = '',
}: ContributionHeatmapProps) {
  // Add extra week if needed to match header span
  const adjustedWeeks = addExtraWeekIfNeeded(weeks);
  const months = getMonthsForHeader({ weeks: adjustedWeeks, period });

  return (
    <div className={`contribution-heatmap ${className}`}>
      <Header contributions={contribution.filter((d) => d.count > 0).length} />

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
                {window.innerWidth > 768 ? dayName : dayName.charAt(0)}
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
