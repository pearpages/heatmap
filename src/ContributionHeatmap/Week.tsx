import type { ContributionData, Period } from './models';
import { formatTooltip } from './formatTooltip';

function Week({
  week,
  key,
  period,
}: {
  week: ContributionData[];
  key: string | number;
  period: Period;
}): React.ReactNode {
  return (
    <div key={key} className="contribution-heatmap__week">
      {week.map((contribution: ContributionData) => (
        <div
          key={contribution.date}
          className={`contribution-heatmap__day contribution-heatmap__day--level-${contribution.level}`}
          title={formatTooltip(contribution, period)}
          aria-label={formatTooltip(contribution, period)}
          role="button"
          tabIndex={0}
          data-count={contribution.count}
          data-date={contribution.date}
        ></div>
      ))}
    </div>
  );
}

export { Week };
