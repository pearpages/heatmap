import { useState } from 'react';
import { ContributionHeatmap } from '@/ContributionHeatmap';
import { generateMockData } from '@/mocks';
import { getLastMonthPeriod, getLastYearPeriod, type Theme } from '@/shared/models';
import { groupByWeeks } from '@/shared/groupByWeeks';
import './index.scss';
import { ControlGroups } from './ControlGroups';

const lastYearPeriod = getLastYearPeriod();
const lastMonthPeriod = getLastMonthPeriod();

function ContributionHeatmapExample() {
  const [theme, setTheme] = useState<Theme>('');
  const [hasRealisticData, setHasRealisticData] = useState(false);

  const lastYearContribution = hasRealisticData
    ? generateMockData({ period: lastYearPeriod, isRealistic: true })
    : generateMockData({
        period: lastYearPeriod,
        isRealistic: false,
      });

  const lastMonthContribution = hasRealisticData
    ? generateMockData({ period: lastMonthPeriod, isRealistic: true })
    : generateMockData({
        period: lastMonthPeriod,
        isRealistic: false,
      });

  return (
    <>
      <div className="example__controls">
        <ControlGroups
          actions={{ theme, setTheme, hasRealisticData, setHasRealisticData }}
        />
      </div>

      <div className="example__heatmap">
        <ContributionHeatmap
          className={theme ? `contribution-heatmap--${theme}` : ''}
          data={{
            weeks: groupByWeeks(lastYearContribution),
            contribution: lastYearContribution,
            period: lastYearPeriod,
          }}
        />
      </div>

       <div className="example__heatmap">
        <ContributionHeatmap
          isReverse
          className={theme ? `contribution-heatmap--${theme}` : ''}
          data={{
            weeks: groupByWeeks(lastMonthContribution),
            contribution: lastMonthContribution,
            period: lastMonthPeriod,
          }}
        />
      </div>
    </>
      
  );
}

export { ContributionHeatmapExample };
