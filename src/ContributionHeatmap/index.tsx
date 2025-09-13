import './index.scss';
import type { ContributionData, Period, Week as WeekType } from '../shared/models';
import { getMonthsForHeader } from './getMonthsForHeader';
import { formatTooltip } from '@/shared/formatTooltip';
import { dayNames } from '@/shared/models';
import { Legend } from '@/shared/Legend';


interface ContributionHeatmapProps {
  data: { contribution: ContributionData[]; period: Period; weeks: WeekType[] };
  className?: string;
  isReverse?: boolean;
}

function ContributionHeatmap({
  data: { period, weeks },
  className = '',
  isReverse = false,
}: ContributionHeatmapProps) {
  // Add extra week if needed to match header span
  
  const months = getMonthsForHeader({ weeks, period });

  return (
    <div className={`contribution-heatmap ${className}`}>
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
                        <td
                          key={dayIndex}
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
                  {weeks.map((week, weekIndex) => {
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
          </>
        )}
      </table>
      <Legend />
    </div>
  );
}

export { ContributionHeatmap };
