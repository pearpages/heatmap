function Legend(): React.ReactNode {
  return (
    <div className="contribution-heatmap__legend">
      <span className="contribution-heatmap__legend-text">Less</span>
      {[0, 1, 2, 3, 4].map((level) => (
        <div
          key={level}
          className={`contribution-heatmap__legend-item contribution-heatmap__legend-item--level-${level}`}
          title={`Level ${level}`}
        ></div>
      ))}
      <span className="contribution-heatmap__legend-text">More</span>
    </div>
  );
}

export { Legend };
