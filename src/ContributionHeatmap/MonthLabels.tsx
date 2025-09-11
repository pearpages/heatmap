function MonthLabels({
  months,
}: {
  months: { name: string; span: number }[];
}): React.ReactNode {
  return (
    <div className="contribution-heatmap__months">
      {months.map((month, index) => {
        const weekWidth = `calc((var(--day-size) + var(--day-gap)) * ${month.span} - var(--day-gap))`;
        return (
          <div
            key={index}
            className="contribution-heatmap__month"
            style={{
              width: weekWidth,
              flexBasis: weekWidth,
            }}
          >
            {month.name}
          </div>
        );
      })}
    </div>
  );
}

export { MonthLabels };
