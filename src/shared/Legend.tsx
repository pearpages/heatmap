import { defaultLabels, type HeatmapLabels } from '@/shared/models';

function Legend({ labels }: { labels?: HeatmapLabels }): React.ReactNode {
  const text = { ...defaultLabels, ...labels };

  return (
    <div className="contribution-heatmap__legend">
      <span className="contribution-heatmap__legend-text">{text.less}</span>
      {[0, 1, 2, 3, 4].map((level) => (
        <div
          key={level}
          className={`contribution-heatmap__legend-item contribution-heatmap__legend-item--level-${level}`}
          title={text.level(level)}
        ></div>
      ))}
      <span className="contribution-heatmap__legend-text">{text.more}</span>
    </div>
  );
}

export { Legend };
