import { useState } from 'react';
import { ContributionHeatmap } from '@/ContributionHeatmap';
import { generateMockData } from '@/mocks/generateMockData';
import { getLastYearPeriod, type Theme } from '@/shared/models';
import { groupByWeeks } from '@/shared/groupByWeeks';
import './index.scss';
import { ControlGroups } from './ControlGroups';

const sampleData = generateMockData({ period: 'lastYear', isRealistic: true });
const period = getLastYearPeriod();

function ContributionHeatmapExample() {
  const [theme, setTheme] = useState<Theme>('');
  const [hasRealisticData, setHasRealisticData] = useState(false);

  const contribution = hasRealisticData
    ? sampleData
    : generateMockData({
        period,
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
            weeks: groupByWeeks(contribution),
            contribution,
            period,
          }}
        />
      </div>
    </>
  );
}

export { ContributionHeatmapExample };
