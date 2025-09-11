function Header({ contributions }: { contributions: number }): React.ReactNode {
  return (
    <div className="contribution-heatmap__header">
      <h3 className="contribution-heatmap__title">Activity Overview</h3>
      <p className="contribution-heatmap__subtitle">
        {contributions} "healthy" days in the last year
      </p>
    </div>
  );
}

export { Header };
