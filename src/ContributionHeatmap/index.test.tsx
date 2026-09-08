import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContributionHeatmap } from './index';
import { groupByWeeks } from '@/shared/groupByWeeks';
import { createDateString, type ContributionData, type Period } from '@/shared/models';

const period: Period = {
  start: new Date('2024-01-01'),
  end: new Date('2024-02-29'),
};

const contribution: ContributionData[] = (() => {
  const out: ContributionData[] = [];
  for (
    const d = new Date('2024-01-01');
    d <= new Date('2024-02-29');
    d.setDate(d.getDate() + 1)
  ) {
    out.push({ date: createDateString(d), count: 0, level: 0 });
  }
  return out;
})();

contribution[10] = { ...contribution[10], count: 7, level: 3 };

const data = { contribution, period, weeks: groupByWeeks(contribution) };

const cells = (container: HTMLElement) =>
  container.querySelectorAll('.contribution-heatmap__day');

describe('ContributionHeatmap', () => {
  it('renders one row per weekday by default', () => {
    const { container } = render(<ContributionHeatmap data={data} />);

    expect(container.querySelectorAll('tbody tr')).toHaveLength(7);
    expect(screen.getByText('Sun')).toBeDefined();
    expect(screen.getByText('Sat')).toBeDefined();
  });

  it('renders one row per week when reversed', () => {
    const { container } = render(<ContributionHeatmap isReverse data={data} />);

    expect(container.querySelectorAll('tbody tr')).toHaveLength(data.weeks.length);
  });

  it('renders a cell for every day in every week', () => {
    const { container } = render(<ContributionHeatmap data={data} />);

    expect(cells(container)).toHaveLength(data.weeks.length * 7);
  });

  it('carries the count, date and level onto each cell', () => {
    const { container } = render(<ContributionHeatmap data={data} />);
    const target = container.querySelector('[data-date="2024-01-11"]');

    expect(target?.getAttribute('data-count')).toBe('7');
    expect(target?.className).toContain('contribution-heatmap__day--level-3');
  });

  it('labels cells for assistive technology', () => {
    const { container } = render(<ContributionHeatmap data={data} />);
    const target = container.querySelector('[data-date="2024-01-11"]');

    expect(target?.getAttribute('aria-label')).toBe('Thu, Jan 11, 2024: 7 contributions');
    expect(target?.getAttribute('role')).toBe('button');
  });

  it('appends the theme class to the root', () => {
    const { container } = render(
      <ContributionHeatmap className="contribution-heatmap--ocean" data={data} />,
    );

    expect(container.querySelector('.contribution-heatmap--ocean')).not.toBeNull();
  });

  it('renders the legend', () => {
    const { container } = render(<ContributionHeatmap data={data} />);

    expect(screen.getByText('Less')).toBeDefined();
    expect(screen.getByText('More')).toBeDefined();
    expect(
      container.querySelectorAll('.contribution-heatmap__legend-item'),
    ).toHaveLength(5);
  });
});
