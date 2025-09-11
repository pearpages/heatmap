import './index.scss';
import type { ContributionData, Period, Week as WeekType } from './models';
import { getMonthsForHeader } from './getMonthsForHeader';
import { MonthLabels } from './MonthLabels';
import { DayLabels } from './DayLabels';
import { Legend } from './Legend';
import { Header } from './Header';
import { Week } from './Week';

interface ContributionHeatmapProps {
  data: { contribution: ContributionData[]; period: Period; weeks: WeekType[] };
  className?: string;
}

function ContributionHeatmap({
  data: { contribution, period, weeks },
  className = '',
}: ContributionHeatmapProps) {
  return (
    <div className={`contribution-heatmap ${className}`}>
      <Header contributions={contribution.filter((d) => d.count > 0).length} />

      <div className="contribution-heatmap__container">
        <MonthLabels
          months={getMonthsForHeader({
            weeks,
            period,
          })}
        />
        <DayLabels />

        <div className="contribution-heatmap__grid">
          {weeks.map((week, weekIndex) => (
            <Week week={week} key={weekIndex} period={period} />
          ))}
        </div>
      </div>

      <Legend />
    </div>
  );
}

export { ContributionHeatmap };
