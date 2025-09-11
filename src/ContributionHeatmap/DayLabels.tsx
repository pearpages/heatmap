import { dayNames } from './models';

function DayLabels(): React.ReactNode {
  return (
    <div className="contribution-heatmap__days">
      {dayNames.map((day) => (
        <div key={day} className="contribution-heatmap__day-label">
          {window.innerWidth > 768 ? day : day.charAt(0)}
        </div>
      ))}
    </div>
  );
}

export { DayLabels };
