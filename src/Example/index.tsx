import { useState } from 'react';
import { ContributionHeatmap } from '@pearpages/heatmap/ContributionHeatmap';
import { generateMockData } from '@pearpages/heatmap/ContributionHeatmap/generateMockData';
import { getLastYearPeriod, type Theme } from '@pearpages/heatmap/ContributionHeatmap/models';
import { groupByWeeks } from '@pearpages/heatmap/ContributionHeatmap/groupByWeeks';
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
